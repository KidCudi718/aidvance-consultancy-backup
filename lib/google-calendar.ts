import { createSign } from "node:crypto";

/**
 * Minimal Google Calendar access for Casey.
 *
 * Deliberately dependency-free. A service account signs its own JWT, swaps it
 * for an access token, and talks to two Calendar endpoints: freeBusy (to see
 * when Dave is actually busy) and events.insert (to put the meeting on his
 * calendar). That is the entire surface we need.
 *
 * The service account is NOT a Workspace user. It has no calendar of its own —
 * it can only touch calendars that have been explicitly shared with its email
 * address. That sharing step is the whole security model, and it is why this
 * works on a personal Gmail account with nothing bought.
 *
 * One consequence worth knowing: a service account without domain-wide
 * delegation cannot send Google's own invitation emails. We never ask it to.
 * Every email a human receives is sent by us, from our own domain.
 */

const TOKEN_URL = "https://oauth2.googleapis.com/token";
const CALENDAR_API = "https://www.googleapis.com/calendar/v3";
const SCOPE = "https://www.googleapis.com/auth/calendar";

type ServiceAccount = {
  client_email: string;
  private_key: string;
};

export type BusyBlock = { start: string; end: string };

export type NewEvent = {
  summary: string;
  description: string;
  startIso: string;
  endIso: string;
  timeZone: string;
};

function base64url(input: Buffer | string): string {
  return Buffer.from(input)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function serviceAccount(): ServiceAccount {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!raw) {
    throw new Error("GOOGLE_SERVICE_ACCOUNT_JSON is not set");
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("GOOGLE_SERVICE_ACCOUNT_JSON is not valid JSON");
  }

  const account = parsed as Partial<ServiceAccount>;
  if (!account.client_email || !account.private_key) {
    throw new Error("Service account JSON is missing client_email or private_key");
  }

  return {
    client_email: account.client_email,
    // Pasted-through-a-web-form keys often arrive with literal \n sequences.
    private_key: account.private_key.replace(/\\n/g, "\n"),
  };
}

let cached: { token: string; expiresAtMs: number } | null = null;

async function accessToken(): Promise<string> {
  const now = Date.now();
  if (cached && cached.expiresAtMs > now + 60_000) {
    return cached.token;
  }

  const account = serviceAccount();
  const issuedAt = Math.floor(now / 1000);
  const expiresAt = issuedAt + 3600;

  const header = base64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claims = base64url(
    JSON.stringify({
      iss: account.client_email,
      scope: SCOPE,
      aud: TOKEN_URL,
      iat: issuedAt,
      exp: expiresAt,
    }),
  );

  const signer = createSign("RSA-SHA256");
  signer.update(`${header}.${claims}`);
  const signature = base64url(signer.sign(account.private_key));
  const assertion = `${header}.${claims}.${signature}`;

  const response = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Google token exchange failed (${response.status}): ${detail}`);
  }

  const payload = (await response.json()) as {
    access_token?: string;
    expires_in?: number;
  };

  if (!payload.access_token) {
    throw new Error("Google token exchange returned no access_token");
  }

  cached = {
    token: payload.access_token,
    expiresAtMs: now + (payload.expires_in ?? 3600) * 1000,
  };

  return cached.token;
}

export function calendarId(): string {
  return process.env.DAVE_CALENDAR_ID?.trim() || "primary";
}

/** Everything Dave is already committed to between two instants. */
export async function busyBlocks(
  fromIso: string,
  toIso: string,
): Promise<BusyBlock[]> {
  const token = await accessToken();

  const response = await fetch(`${CALENDAR_API}/freeBusy`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      timeMin: fromIso,
      timeMax: toIso,
      items: [{ id: calendarId() }],
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`freeBusy failed (${response.status}): ${detail}`);
  }

  const payload = (await response.json()) as {
    calendars?: Record<string, { busy?: BusyBlock[]; errors?: unknown }>;
  };

  const entry = payload.calendars?.[calendarId()];
  if (entry?.errors) {
    throw new Error(
      `freeBusy rejected the calendar: ${JSON.stringify(entry.errors)}`,
    );
  }

  return entry?.busy ?? [];
}

/**
 * Put the meeting on the calendar.
 *
 * No attendees, on purpose — see the note at the top of this file. The guest's
 * details live in the description, which is what Dave sees when the reminder
 * fires on his phone.
 */
export async function createEvent(event: NewEvent): Promise<{ id: string; link: string }> {
  const token = await accessToken();

  const response = await fetch(
    `${CALENDAR_API}/calendars/${encodeURIComponent(calendarId())}/events?sendUpdates=none`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        summary: event.summary,
        description: event.description,
        start: { dateTime: event.startIso, timeZone: event.timeZone },
        end: { dateTime: event.endIso, timeZone: event.timeZone },
        reminders: {
          useDefault: false,
          overrides: [{ method: "popup", minutes: 2 }],
        },
      }),
    },
  );

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`events.insert failed (${response.status}): ${detail}`);
  }

  const payload = (await response.json()) as { id?: string; htmlLink?: string };
  return { id: payload.id ?? "", link: payload.htmlLink ?? "" };
}
