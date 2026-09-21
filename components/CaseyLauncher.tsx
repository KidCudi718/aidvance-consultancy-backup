"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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

function isCasey(source: string): boolean {
  const s = source.toLowerCase();
  return s === "ai" || s === "agent" || s === "assistant" || s === "casey";
}

export function CaseyLauncher({
  onCategory,
}: {
  /** Fires when Casey lands on one of the nine categories. */
  onCategory: (key: PickerKey) => void;
}) {
  const [live, setLive] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [mode, setMode] = useState<"listening" | "speaking">("listening");
  const [turns, setTurns] = useState<Turn[]>([]);
  const [blocked, setBlocked] = useState<CaseyBlockReason | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [seconds, setSeconds] = useState(0);

  const conversationRef = useRef<Conversation | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const reportedRef = useRef(false);

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
    setLive(false);
    setConnecting(false);
    setSeconds(0);
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
    setConnecting(true);
    reportedRef.current = false;
    setTurns([]);

    let micStream: MediaStream;
    try {
      micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch {
      setConnecting(false);
      setBlocked("mic-denied");
      return;
    }
    streamRef.current = micStream;
    setStream(micStream);

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
      setConnecting(false);
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
      setConnecting(false);
      setLive(true);
    } catch {
      micStream.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      setStream(null);
      setConnecting(false);
      setBlocked("unavailable");
    }
  }, [teardown]);

  const speaking = live && mode === "speaking";
  // `connecting` has to be tested first. It was tested after `live`, and
  // `live` is false for the whole time we are connecting — so "thinking" could
  // never be reached and pressing Talk left the waveform sitting in idle.
  const waveState: WaveState = connecting
    ? "thinking"
    : !live
      ? "idle"
      : mode === "speaking"
        ? "speaking"
        : "listening";

  const recent = turns.slice(-2);
  const clock = `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;

  return (
    <div className={styles.casey}>
      {/* Connecting gets a status line of its own. Pressing Talk and waiting
          for the microphone prompt used to change nothing above the button. */}
      {live || connecting ? (
        <p className={styles.status}>
          <span>
            {connecting
              ? "Connecting — allow the microphone"
              : speaking
                ? "Casey is talking"
                : "Listening"}
          </span>
          <span>{connecting ? "" : clock}</span>
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
              End conversation
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
              disabled={connecting}
            >
              <span className={styles.dot} aria-hidden="true" />
              {connecting ? "Connecting…" : "Talk to Casey"}
            </button>
          </div>
          <p className={styles.lead}>
            Tell her what your week looks like. She&apos;ll tell you straight
            where AI helps, and where it doesn&apos;t.
          </p>
          {/* The disclosure lives here rather than in her opening line: the
              visitor reads it before pressing, so she can open like a person
              instead of a compliance notice. She never denies it if asked. */}
          <p className={styles.hint}>
            Casey is an AI assistant. Press once and talk normally.
          </p>
          {blocked ? (
            <p className={styles.note} role="status">
              {CASEY_BLOCK_COPY[blocked]}
            </p>
          ) : null}
        </>
      )}
    </div>
  );
}
