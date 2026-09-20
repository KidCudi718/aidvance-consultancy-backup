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
  /** Fires when Casey lands on one of the six categories. */
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

  // Session clock: wind her up, then hard stop.
  useEffect(() => {
    if (!live) {
      return;
    }
    const id = window.setInterval(() => {
      setSeconds((value) => {
        const next = value + 1;
        if (next === CASEY_WRAP_UP_SECONDS) {
          conversationRef.current?.sendContextualUpdate?.(
            "You have about fifteen seconds left. Close now: hand over the guide and ask for the meeting or the email.",
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
        // Do not append from onMessage — segments re-deliver cumulatively.
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
  const waveState: WaveState = !live
    ? "idle"
    : connecting
      ? "thinking"
      : mode === "speaking"
        ? "speaking"
        : "listening";

  const recent = turns.slice(-2);
  const clock = `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;

  return (
    <div className={styles.casey}>
      {live ? (
        <p className={styles.status}>
          <span>{speaking ? "Casey is talking" : "Listening"}</span>
          <span>{clock}</span>
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
          <p className={styles.note}>
            Two minutes with Casey and she&apos;ll tell you straight which bit of
            your week is worth fixing first — including when the answer isn&apos;t
            AI at all.
          </p>
          <div className={styles.controls}>
            <button
              type="button"
              className={styles.talkBtn}
              onClick={() => void start()}
              disabled={connecting}
            >
              <span className={styles.dot} aria-hidden="true" />
              {connecting ? "Connecting…" : "Start talking"}
            </button>
          </div>
          {/* The disclosure lives here rather than in her opening line: the
              visitor reads it before pressing, so she can open like a person
              instead of a compliance notice. She never denies it if asked. */}
          <p className={styles.hint}>
            Press once — no need to hold it. Talk normally; she&apos;ll wait
            until you&apos;re finished. Casey is an AI assistant.
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
