import type { BusyBlock } from "@/lib/google-calendar";

/**
 * Turning a calendar into something Casey can say out loud.
 *
 * Two jobs. First, work out whether Dave is free RIGHT NOW, because the whole
 * point of the close is "he's actually around — want him to call you?" Second,
 * produce a small number of real openings, today first, in words a person can
 * repeat back without reading a date off a screen.
 *
 * Every string Casey speaks is generated here rather than by her. She is very
 * good at conversation and reliably bad at arithmetic on dates, so she is never
 * asked to do any.
 */

export const ZONE = "America/New_York";
export const SLOT_MINUTES = 15;

/** Ordinary bookable hours, in Dave's local time. */
const DAY_START_HOUR = 9;
const DAY_END_HOUR = 18;
/** Days Dave will take a booked call. 0 = Sunday. */
const BOOKABLE_DAYS = new Set([1, 2, 3, 4, 5, 6]);

/** A "right now" call is allowed in a wider window than a booked one. */
const LIVE_START_HOUR = 8;
const LIVE_END_HOUR = 20;
/** Never offer "now" closer than this — he needs a moment to pick up. */
const LIVE_LEAD_MINUTES = 5;
/** ...and never further away than this, or it isn't "now" any more. */
const LIVE_HORIZON_MINUTES = 20;
/** A booked slot always needs some runway. */
const BOOKED_LEAD_MINUTES = 30;
/**
 * Offering "nine, quarter past nine, half past nine" is three versions of the
 * same answer. Spread the options out so they feel like a real choice.
 */
const SPACING_MINUTES = 90;
/** Two on any one day, so the third option is always a different day. */
const MAX_PER_DAY = 2;

const WEEKDAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

type ZonedParts = {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  weekday: number;
};

const partFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  weekday: "short",
  hour12: false,
});

const WEEKDAY_INDEX: Record<string, number> = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
};

function partsInZone(instant: Date): ZonedParts {
  const found: Record<string, string> = {};
  for (const part of partFormatter.formatToParts(instant)) {
    found[part.type] = part.value;
  }
  // Intl renders midnight as hour 24 in some runtimes.
  const hour = Number(found.hour) % 24;
  return {
    year: Number(found.year),
    month: Number(found.month),
    day: Number(found.day),
    hour,
    minute: Number(found.minute),
    weekday: WEEKDAY_INDEX[found.weekday ?? "Sun"] ?? 0,
  };
}

/**
 * How far the zone is from UTC, in milliseconds, at a given instant.
 *
 * Both sides are truncated to the minute because that is the resolution the
 * formatted parts give us. Every real-world zone offset is a whole number of
 * minutes, so nothing is lost.
 */
function zoneOffsetMs(instant: Date): number {
  const p = partsInZone(instant);
  const asIfUtc = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, 0);
  const truncated = Math.floor(instant.getTime() / 60_000) * 60_000;
  return asIfUtc - truncated;
}

/** Build the instant at which the wall clock in ZONE reads the given time. */
function zonedToInstant(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
): Date {
  const naive = Date.UTC(year, month - 1, day, hour, minute, 0);
  const firstGuess = new Date(naive - zoneOffsetMs(new Date(naive)));
  // One correction pass handles the two hours a year when the offset changes.
  const corrected = new Date(naive - zoneOffsetMs(firstGuess));
  return corrected;
}

function isoWithZoneOffset(instant: Date): string {
  const offsetMs = zoneOffsetMs(instant);
  const sign = offsetMs < 0 ? "-" : "+";
  const abs = Math.abs(offsetMs);
  const hh = String(Math.floor(abs / 3_600_000)).padStart(2, "0");
  const mm = String(Math.floor((abs % 3_600_000) / 60_000)).padStart(2, "0");
  const p = partsInZone(instant);
  const date = `${p.year}-${String(p.month).padStart(2, "0")}-${String(p.day).padStart(2, "0")}`;
  const time = `${String(p.hour).padStart(2, "0")}:${String(p.minute).padStart(2, "0")}:00`;
  return `${date}T${time}${sign}${hh}:${mm}`;
}

function clockPhrase(p: ZonedParts): string {
  const hour12 = p.hour % 12 === 0 ? 12 : p.hour % 12;
  const suffix = p.hour < 12 ? "in the morning" : p.hour < 17 ? "in the afternoon" : "in the evening";
  if (p.minute === 0) {
    return `${hour12} ${suffix}`;
  }
  if (p.minute === 15) {
    return `quarter past ${hour12} ${suffix}`;
  }
  if (p.minute === 30) {
    return `half past ${hour12} ${suffix}`;
  }
  if (p.minute === 45) {
    return `quarter to ${hour12 === 12 ? 1 : hour12 + 1} ${suffix}`;
  }
  return `${hour12}:${String(p.minute).padStart(2, "0")} ${suffix}`;
}

function dayPhrase(slot: ZonedParts, today: ZonedParts): string {
  if (slot.year === today.year && slot.month === today.month && slot.day === today.day) {
    return "today";
  }
  const tomorrow = partsInZone(
    new Date(zonedToInstant(today.year, today.month, today.day, 12, 0).getTime() + 86_400_000),
  );
  if (
    slot.year === tomorrow.year &&
    slot.month === tomorrow.month &&
    slot.day === tomorrow.day
  ) {
    return "tomorrow";
  }
  return WEEKDAY_NAMES[slot.weekday] ?? "later this week";
}

function overlapsBusy(startMs: number, endMs: number, busy: BusyBlock[]): boolean {
  for (const block of busy) {
    const blockStart = Date.parse(block.start);
    const blockEnd = Date.parse(block.end);
    if (Number.isNaN(blockStart) || Number.isNaN(blockEnd)) {
      continue;
    }
    if (startMs < blockEnd && endMs > blockStart) {
      return true;
    }
  }
  return false;
}

export type Slot = {
  /** Opaque handle Casey passes straight back when booking. */
  id: string;
  /** What she says out loud: "tomorrow at half past nine in the morning". */
  spoken: string;
  startIso: string;
  endIso: string;
};

export type LiveOption = {
  available: boolean;
  /** Spoken form, e.g. "in about ten minutes". */
  spoken?: string;
  startIso?: string;
  endIso?: string;
};

/** Is Dave free to take a call essentially straight away? */
export function liveOption(now: Date, busy: BusyBlock[]): LiveOption {
  if (process.env.CASEY_LIVE_CALLS === "off") {
    return { available: false };
  }

  const here = partsInZone(now);
  if (here.hour < LIVE_START_HOUR || here.hour >= LIVE_END_HOUR) {
    return { available: false };
  }

  const startMs = now.getTime() + LIVE_LEAD_MINUTES * 60_000;
  const endMs = startMs + SLOT_MINUTES * 60_000;
  const horizonMs = now.getTime() + LIVE_HORIZON_MINUTES * 60_000;

  if (overlapsBusy(startMs, horizonMs, busy)) {
    return { available: false };
  }

  const start = new Date(startMs);
  return {
    available: true,
    spoken: `in about ${LIVE_LEAD_MINUTES} minutes`,
    startIso: isoWithZoneOffset(start),
    endIso: isoWithZoneOffset(new Date(endMs)),
  };
}

/**
 * The next few genuinely open slots, soonest first.
 *
 * Deliberately capped small. Casey offers two; a third exists only so she has
 * something to fall back on if both are refused.
 */
export function openSlots(
  now: Date,
  busy: BusyBlock[],
  wanted = 3,
): Slot[] {
  const today = partsInZone(now);
  const earliestMs = now.getTime() + BOOKED_LEAD_MINUTES * 60_000;
  const found: Slot[] = [];
  let lastAcceptedMs = -Infinity;

  for (let dayOffset = 0; dayOffset < 14 && found.length < wanted; dayOffset += 1) {
    let takenToday = 0;
    const noonOnDay = new Date(
      zonedToInstant(today.year, today.month, today.day, 12, 0).getTime() +
        dayOffset * 86_400_000,
    );
    const day = partsInZone(noonOnDay);
    if (!BOOKABLE_DAYS.has(day.weekday)) {
      continue;
    }

    for (
      let hour = DAY_START_HOUR;
      hour < DAY_END_HOUR && found.length < wanted && takenToday < MAX_PER_DAY;
      hour += 1
    ) {
      for (
        let minute = 0;
        minute < 60 && found.length < wanted && takenToday < MAX_PER_DAY;
        minute += SLOT_MINUTES
      ) {
        const start = zonedToInstant(day.year, day.month, day.day, hour, minute);
        const startMs = start.getTime();
        const endMs = startMs + SLOT_MINUTES * 60_000;

        if (startMs < earliestMs) {
          continue;
        }
        if (startMs - lastAcceptedMs < SPACING_MINUTES * 60_000) {
          continue;
        }
        if (overlapsBusy(startMs, endMs, busy)) {
          continue;
        }

        lastAcceptedMs = startMs;
        takenToday += 1;
        const slotParts = partsInZone(start);
        found.push({
          id: isoWithZoneOffset(start),
          spoken: `${dayPhrase(slotParts, today)} at ${clockPhrase(slotParts)}`,
          startIso: isoWithZoneOffset(start),
          endIso: isoWithZoneOffset(new Date(endMs)),
        });
      }
    }
  }

  return found;
}

/**
 * Say an arbitrary instant the way Casey would: "today at half past two in the
 * afternoon", "tomorrow at 9 in the morning", "Thursday at quarter past 11 in
 * the morning". Used when confirming a booking back to someone.
 */
export function spokenForInstant(instant: Date, now = new Date()): string {
  const parts = partsInZone(instant);
  return `${dayPhrase(parts, partsInZone(now))} at ${clockPhrase(parts)}`;
}

/** How far ahead we need to ask Google about. */
export function searchWindow(now: Date): { fromIso: string; toIso: string } {
  return {
    fromIso: new Date(now.getTime() - 60_000).toISOString(),
    toIso: new Date(now.getTime() + 15 * 86_400_000).toISOString(),
  };
}

export { partsInZone, zonedToInstant, isoWithZoneOffset, clockPhrase };
