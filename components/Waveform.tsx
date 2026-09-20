"use client";

import { useEffect, useRef } from "react";
import styles from "./Casey.module.css";

export type WaveState = "idle" | "listening" | "speaking" | "thinking";

const BAR_COUNT = 44;

/**
 * Casey has no face. This is the only thing of hers anyone ever sees, so it has
 * to be honest: when it says she is hearing you, she is hearing you.
 *
 * - `listening` is driven off the visitor's real microphone input.
 * - `speaking` is driven off her real output audio when we can reach the
 *   element the transport attaches to the page; if we cannot, it falls back to
 *   a speech-shaped envelope rather than pretending to be silent.
 * - `idle` is a flat line. Nothing is listening and it should look like it.
 * - `thinking` is slow and shallow — without it a pause reads as a crash.
 */
export function Waveform({
  state,
  stream,
}: {
  state: WaveState;
  /** The visitor's mic stream, while we hold one. */
  stream: MediaStream | null;
}) {
  const barsRef = useRef<HTMLSpanElement[]>([]);
  const frameRef = useRef<number | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const micAnalyserRef = useRef<AnalyserNode | null>(null);
  const outAnalyserRef = useRef<AnalyserNode | null>(null);
  const stateRef = useRef<WaveState>(state);

  stateRef.current = state;

  const setBar = (index: number, scale: number) => {
    const bar = barsRef.current[index];
    if (bar) {
      bar.style.transform = `scaleY(${Math.max(0.05, Math.min(1, scale))})`;
    }
  };

  // Visitor's microphone -> analyser.
  useEffect(() => {
    if (!stream) {
      micAnalyserRef.current = null;
      return;
    }

    let cancelled = false;
    let source: MediaStreamAudioSourceNode | null = null;

    try {
      const Ctor =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;
      if (!Ctor) {
        return;
      }
      const ctx = ctxRef.current ?? new Ctor();
      ctxRef.current = ctx;

      const analyser = ctx.createAnalyser();
      analyser.fftSize = 128;
      analyser.smoothingTimeConstant = 0.8;
      source = ctx.createMediaStreamSource(stream);
      source.connect(analyser);
      if (!cancelled) {
        micAnalyserRef.current = analyser;
      }
    } catch {
      micAnalyserRef.current = null;
    }

    return () => {
      cancelled = true;
      try {
        source?.disconnect();
      } catch {
        /* already torn down */
      }
      micAnalyserRef.current = null;
    };
  }, [stream]);

  // Her voice comes back through an audio element the transport attaches to the
  // page. If we can find one, tap it; if not, the envelope below covers us.
  useEffect(() => {
    if (state !== "speaking" || outAnalyserRef.current) {
      return;
    }

    const ctx = ctxRef.current;
    if (!ctx) {
      return;
    }

    const el = Array.from(document.querySelectorAll("audio")).find(
      (candidate) => !candidate.paused && candidate.srcObject !== null,
    );
    if (!el) {
      return;
    }

    try {
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 128;
      analyser.smoothingTimeConstant = 0.8;
      const source = ctx.createMediaElementSource(el);
      source.connect(analyser);
      source.connect(ctx.destination);
      outAnalyserRef.current = analyser;
    } catch {
      // An element can only be tapped once; the envelope carries it instead.
      outAnalyserRef.current = null;
    }
  }, [state]);

  useEffect(() => {
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      for (let i = 0; i < BAR_COUNT; i += 1) {
        setBar(i, stateRef.current === "idle" ? 0.05 : 0.5);
      }
      return;
    }

    const micBins = new Uint8Array(64);
    const outBins = new Uint8Array(64);
    const started = performance.now();

    const tick = () => {
      const now = performance.now();
      const elapsed = (now - started) / 1000;
      const current = stateRef.current;

      if (current === "idle") {
        for (let i = 0; i < BAR_COUNT; i += 1) {
          setBar(i, 0.05);
        }
      } else if (current === "thinking") {
        for (let i = 0; i < BAR_COUNT; i += 1) {
          const wobble = Math.sin(elapsed * 1.6 + i * 0.35);
          setBar(i, 0.12 + wobble * 0.05 + 0.06);
        }
      } else {
        const analyser =
          current === "listening"
            ? micAnalyserRef.current
            : outAnalyserRef.current;

        if (analyser) {
          const bins = current === "listening" ? micBins : outBins;
          analyser.getByteFrequencyData(bins);
          for (let i = 0; i < BAR_COUNT; i += 1) {
            const bin = bins[Math.floor((i / BAR_COUNT) * bins.length)] ?? 0;
            setBar(i, 0.08 + (bin / 255) * 0.92);
          }
        } else {
          // Speech-shaped envelope: syllable-rate amplitude with a centre bias,
          // used only when the real stream is not reachable.
          for (let i = 0; i < BAR_COUNT; i += 1) {
            const centre = 1 - Math.abs(i / (BAR_COUNT - 1) - 0.5) * 1.4;
            const syllable = Math.sin(elapsed * 9 + i * 0.5);
            const breath = Math.sin(elapsed * 2.1 + i * 0.12);
            const amp = 0.45 + syllable * 0.3 + breath * 0.2;
            setBar(i, Math.max(0.1, amp * Math.max(0.35, centre)));
          }
        }
      }

      frameRef.current = requestAnimationFrame(tick);
    };

    frameRef.current = requestAnimationFrame(tick);

    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    };
  }, []);

  // Release the audio context when the component goes away.
  useEffect(() => {
    return () => {
      const ctx = ctxRef.current;
      ctxRef.current = null;
      micAnalyserRef.current = null;
      outAnalyserRef.current = null;
      if (ctx && ctx.state !== "closed") {
        void ctx.close().catch(() => {
          /* nothing useful to do */
        });
      }
    };
  }, []);

  return (
    <div className={styles.wave} data-state={state} aria-hidden="true">
      {Array.from({ length: BAR_COUNT }, (_, i) => (
        <span
          key={i}
          ref={(node) => {
            if (node) {
              barsRef.current[i] = node;
            }
          }}
        />
      ))}
    </div>
  );
}
