"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MutableRefObject,
} from "react";
import { Waveform, type WaveState } from "./Waveform";
import {
  CASEY_BLOCK_COPY,
  CASEY_MAX_SESSION_SECONDS,
  CASEY_WRAP_UP_SECONDS,
  resolveCategory,
  type CaseyBlockReason,
} from "@/lib/casey";
import type { PickerKey } from "@/lib/verdict";
import styles from "./Casey.module.css";

type Turn = { source: string; text: string };

type Conversation = {
  endSession: () => Promise<void>;
  sendContextualUpdate?: (text: string) => void;
};

/**
 * Every visible state the panel can be in. The brief's table is the contract:
 * each one has to be obvious within about a tenth of a second of the change,
 * and no two may look alike.
 *
 * `requesting_mic` is separate from `connecting` on purpose. They feel like
 * one step to whoever built it and like two to whoever is waiting: the first
 * is the browser asking permission, the second is us reaching the server. If
 * they share a label, a visitor staring at a permission dialog is told we are
 * "connecting", which is not what is happening.
 */
type Phase =
  | "idle"
  | "requesting_mic"
  | "connecting"
  | "live"
  | "done"
  | "blocked";

function isCasey(source: string): boolean {
  const s = source.toLowerCase();
  return s === "ai" || s === "agent" || s === "assistant" || s === "casey";
}

export function CaseyLauncher({
  onCategory,
  contextLabels = [],
  startRef,
  onNeedList,
}: {
  /** Fires when Casey lands on one of the nine categories. */
  onCategory: (key: PickerKey) => void;
  /** What the visitor already ticked, handed to her so she does not re-ask. */
  contextLabels?: string[];
  /** Filled with a function the parent can call to open her from elsewhere. */
  startRef?: MutableRefObject<(() => void) | null>;
  /** Send someone to the list when the microphone is not an option. */
  onNeedList?: () => void;
}) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [mode, setMode] = useState<"listening" | "speaking">("listening");
  const [turns, setTurns] = useState<Turn[]>([]);
  const [blocked, setBlocked] = useState<CaseyBlockReason | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [seconds, setSeconds] = useState(0);

  const conversationRef = useRef<Conversation | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const reportedRef = useRef(false);
  // Did a real conversation happen? Decides whether ending lands on "done"
  // (with a wrap and a way back in) or quietly back on "idle".
  const hadSessionRef = useRef(false);
  // Read at the moment a session opens, not during render, so starting a call
  // never depends on which render last wrote this.
  const contextRef = useRef<string[]>(contextLabels);
  useEffect(() => {
    contextRef.current = contextLabels;
  }, [contextLabels]);

  const live = phase === "live";
  const busy = phase === "requesting_mic" || phase === "connecting";

  const teardown = useCallback(async () => {
    const conversation = conversationRef.current;
    conversationRef.current = null;
    try {
      await conversation?.endSession();
    } catch {
      /* the session is going away regardless */
    }
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setStream(null);
    setSeconds(0);
    setPhase(hadSessionRef.current ? "done" : "idle");
  }, []);

  useEffect(() => {
    return () => {
      void teardown();
    };
  }, [teardown]);

  // Session clock. She gets a full minute of warning so she can finish the
  // thought she is on and still close properly. Being cut off mid-
  // recommendation wastes the entire conversation.
  useEffect(() => {
    if (!live) {
      return;
    }
    const id = window.setInterval(() => {
      setSeconds((value) => {
        const next = value + 1;
        if (next === CASEY_WRAP_UP_SECONDS) {
          conversationRef.current?.sendContextualUpdate?.(
            "About a minute left. Finish the thought you're on, then close: give them the honest read, hand over the guide, and ask for the fifteen minutes or the email.",
          );
        }
        if (next >= CASEY_MAX_SESSION_SECONDS) {
          void teardown();
        }
        return next;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [live, teardown]);

  // Watch what Casey has actually said and feed the verdict band.
  useEffect(() => {
    if (reportedRef.current) {
      return;
    }
    const hers = turns.filter((turn) => isCasey(turn.source)).map((t) => t.text);
    const key = resolveCategory(hers);
    if (key) {
      reportedRef.current = true;
      onCategory(key);
    }
  }, [turns, onCategory]);

  const start = useCallback(async () => {
    setBlocked(null);
    reportedRef.current = false;
    setTurns([]);
    setPhase("requesting_mic");

    let micStream: MediaStream;
    try {
      micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch {
      setPhase("blocked");
      setBlocked("mic-denied");
      return;
    }
    streamRef.current = micStream;
    setStream(micStream);
    setPhase("connecting");

    let credentials: { transportToken: string; transportUrl: string };
    try {
      const res = await fetch("/api/voice/session", { method: "POST" });
      if (res.status === 429) {
        throw new Error("busy");
      }
      if (!res.ok) {
        throw new Error("unavailable");
      }
      credentials = await res.json();
    } catch (error) {
      micStream.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      setStream(null);
      setPhase("blocked");
      setBlocked(
        error instanceof Error && error.message === "busy" ? "busy" : "unavailable",
      );
      return;
    }

    try {
      const { VoiceConversation } = await import("@spekoai/client");
      const conversation = await VoiceConversation.create({
        transportToken: credentials.transportToken,
        transportUrl: credentials.transportUrl,
        onModeChange: (next: "listening" | "speaking") => setMode(next),
        // onTranscript delivers the full reconciled transcript on every update.
        // Do not append from onMessage, segments re-deliver cumulatively.
        onTranscript: (messages: readonly Turn[]) => setTurns([...messages]),
        onDisconnect: () => {
          void teardown();
        },
        onError: () => {
          setBlocked("unavailable");
          void teardown();
        },
      });
      conversationRef.current = conversation as unknown as Conversation;
      hadSessionRef.current = true;
      setPhase("live");

      // She is told what they already ticked, so the conversation starts where
      // the page left off instead of asking them the same question twice.
      const picked = contextRef.current;
      if (picked.length > 0) {
        conversation.sendContextualUpdate?.(
          `Before this call they ticked the following on the page: ${picked.join("; ")}. Do not ask them to list their problems again — acknowledge these, pick the one worth digging into, and go from there.`,
        );
      }
    } catch {
      micStream.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      setStream(null);
      setPhase("blocked");
      setBlocked("unavailable");
    }
  }, [teardown]);

  // Opened from the verdict band further down the page. The parent holds a
  // handle and calls it from a click, rather than us watching a prop and
  // starting a microphone session from inside an effect.
  const phaseRef = useRef<Phase>(phase);
  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  useEffect(() => {
    if (!startRef) {
      return;
    }
    startRef.current = () => {
      const now = phaseRef.current;
      if (now === "idle" || now === "done" || now === "blocked") {
        void start();
      }
    };
    return () => {
      startRef.current = null;
    };
  }, [startRef, start]);

  const speaking = live && mode === "speaking";

  const waveState: WaveState =
    phase === "connecting"
      ? "thinking"
      : phase === "live"
        ? speaking
          ? "speaking"
          : "listening"
        : "idle";

  // One line, one meaning, never two states sharing a string.
  const statusLine =
    phase === "requesting_mic"
      ? "Allow the microphone"
      : phase === "connecting"
        ? "One second"
        : phase === "live"
          ? speaking
            ? "Casey is talking"
            : "Listening"
          : null;

  const recent = turns.slice(-2);
  const clock = `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;

  return (
    <div className={styles.casey} data-phase={phase}>
      {statusLine ? (
        <p className={styles.status}>
          {/* Keyed so the text crossfades rather than snapping between states. */}
          <span key={statusLine} className={styles.statusText}>
            {statusLine}
          </span>
          <span>{live ? clock : ""}</span>
        </p>
      ) : null}

      <Waveform state={waveState} stream={stream} />

      {live ? (
        <>
          {recent.length > 0 ? (
            <ul className={styles.turns}>
              {recent.map((turn, index) => (
                <li key={`${index}-${turn.text.slice(0, 12)}`}>
                  <span className={styles.who}>
                    {isCasey(turn.source) ? "Casey" : "You"}
                  </span>
                  <p
                    className={
                      index === recent.length - 1
                        ? styles.said
                        : `${styles.said} ${styles.saidPrev}`
                    }
                  >
                    {turn.text}
                  </p>
                </li>
              ))}
            </ul>
          ) : null}
          <div className={styles.controls}>
            <button
              type="button"
              className={styles.stopBtn}
              onClick={() => void teardown()}
            >
              I&apos;m done
            </button>
          </div>
        </>
      ) : phase === "done" ? (
        <>
          <p className={styles.lead}>
            That&apos;s it. Your read is on the page below — and if you want
            fifteen minutes with Dave, just ask her.
          </p>
          <div className={styles.controls}>
            <button
              type="button"
              className={styles.talkBtn}
              onClick={() => void start()}
            >
              <span className={styles.dot} aria-hidden="true" />
              Talk again
            </button>
          </div>
        </>
      ) : (
        <>
          {/* The button sits directly under the waveform, where the eye lands
              first. Everything explanatory goes below it and stays short: the
              old panel spent five lines describing a button nobody had a
              reason to read about yet. */}
          <div className={styles.controls}>
            <button
              type="button"
              className={styles.talkBtn}
              onClick={() => void start()}
              disabled={busy}
            >
              <span className={styles.dot} aria-hidden="true" />
              {phase === "requesting_mic"
                ? "Allow microphone…"
                : phase === "connecting"
                  ? "Connecting…"
                  : "Talk to Casey"}
            </button>
          </div>

          {/* A blocked microphone is a dead end unless we hand over a route
              that does not need one. This is a callout with real buttons, not
              a grey sentence somebody has to notice. */}
          {blocked ? (
            <div className={styles.callout} role="alert">
              <p className={styles.calloutText}>{CASEY_BLOCK_COPY[blocked]}</p>
              <div className={styles.controls}>
                <button
                  type="button"
                  className={styles.calloutPrimary}
                  onClick={() => onNeedList?.()}
                >
                  Use the list instead
                </button>
                <button
                  type="button"
                  className={styles.stopBtn}
                  onClick={() => void start()}
                >
                  Try again
                </button>
              </div>
            </div>
          ) : (
            <>
              <p className={styles.lead}>
                Tell her what your week looks like. She&apos;ll tell you
                straight where AI helps, and where it doesn&apos;t.
              </p>
              {/* The disclosure lives here rather than in her opening line: the
                  visitor reads it before pressing, so she can open like a person
                  instead of a compliance notice. She never denies it if asked. */}
              <p className={styles.hint}>
                Casey is an AI assistant. Press once and talk normally.
              </p>
            </>
          )}
        </>
      )}
    </div>
  );
}
