"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { CaseyLauncher } from "@/components/CaseyLauncher";
import {
  framingLine,
  otherVerdict,
  padN,
  pickerRows,
  verdictCopy,
  verdictOrder,
  type PickerKey,
} from "@/lib/verdict";
import styles from "@/components/Problems.module.css";

type Picked = Partial<Record<PickerKey, boolean>>;

export function StartJourney() {
  const [picked, setPicked] = useState<Picked>({});
  const [otherText, setOtherText] = useState("");
  const firstTick = useRef(true);
  const verdictRef = useRef<HTMLElement>(null);
  const otherFieldRef = useRef<HTMLInputElement>(null);
  const otherFieldId = useId();
  const otherPicked = Boolean(picked.other);
  // Casey can land on "something else" mid-conversation. Stealing focus into a
  // text field while someone is talking is hostile, so only the tap path focuses.
  const focusOtherOnOpen = useRef(true);

  useEffect(() => {
    if (otherPicked && focusOtherOnOpen.current) {
      otherFieldRef.current?.focus();
    }
  }, [otherPicked]);

  // The verdict band was always here. It just sat below the fold on desktop,
  // so ticking a square looked like it did nothing — the payoff was real and
  // off-screen. Now the first tick brings it into view at any width.
  const scrollVerdictIfNeeded = useCallback(() => {
    if (!firstTick.current) {
      return;
    }
    firstTick.current = false;
    if (typeof window === "undefined") {
      return;
    }
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Let the band mount before we try to scroll to it.
    window.requestAnimationFrame(() => {
      verdictRef.current?.scrollIntoView({
        behavior: reduced ? "auto" : "smooth",
        block: "start",
      });
    });
  }, []);

  const toggle = (key: PickerKey) => {
    focusOtherOnOpen.current = true;
    setPicked((current) => ({ ...current, [key]: !current[key] }));
    scrollVerdictIfNeeded();
  };

  // Casey resolved a category out loud. Same verdict band, same copy, the only
  // difference is that nobody had to tap anything.
  const handleCaseyCategory = useCallback(
    (key: PickerKey) => {
      focusOtherOnOpen.current = false;
      setPicked((current) =>
        current[key] ? current : { ...current, [key]: true },
      );
      scrollVerdictIfNeeded();
    },
    [scrollVerdictIfNeeded],
  );

  const selectedKeys = verdictOrder.filter((key) => picked[key]);
  const count = selectedKeys.length + (otherPicked ? 1 : 0);
  const other = otherPicked ? otherVerdict(otherText) : null;

  return (
    <>
      {/*
        The hero is one exchange and nothing more. A provocation on the left,
        the person who can answer it on the right. Everything that used to
        compete with Casey for this space now lives below, at full width.
      */}
      <section className="hero hero--split" aria-label="Introduction">
        <div className="hero__hook">
          <p className="kicker">Aidvance Consultancy · New York</p>
          <h1 className="display">
            <span className="hero-beat">Feel like your competitors are ahead of you on AI?</span>
            <span className="hero-beat hero-beat--late">
              <strong>They&apos;re not.</strong>
            </span>
          </h1>
          {/*
            This jumps to Casey. It is not the mic. Two controls reading
            "Talk to Casey" and doing different things taught visitors the
            page was lying about one of them.
          */}
          <div className="actions">
            <a className="btn btn--solid" href="#start">
              Start the 2-minute chat →
            </a>
          </div>
        </div>

        <div className="picker hp2" id="start">
          <p className="kicker">Casey · 2 minutes</p>
          <CaseyLauncher onCategory={handleCaseyCategory} />
        </div>
      </section>

      {/*
        The list is the page, not a fallback. Nine squares a visitor can read
        in ten seconds and recognise three of.
      */}
      <section className={styles.section} id="problems">
        <div className="shell">
          <h2 className="display display--md">What&apos;s eating your week?</h2>
          {/*
            Feedback where the hand is. Scrolling to the band is the payoff,
            but the count changes under the heading the instant a square is
            ticked, so the page answers before the scroll starts.
          */}
          <p className={styles.hint} aria-live="polite">
            {count === 0 ? (
              "Pick everything that applies. Most weeks have more than one."
            ) : (
              <>
                <span className={styles.tally}>{count}</span> picked. Your read
                is below.
              </>
            )}
          </p>
        </div>
        <div
          className={styles.grid}
          role="group"
          aria-label="What's eating your week"
        >
          {pickerRows.map((row) => {
            const pressed = Boolean(picked[row.key]);
            return (
              <button
                key={row.key}
                type="button"
                className={styles.tile}
                data-v={row.key}
                aria-pressed={pressed}
                onClick={() => toggle(row.key)}
              >
                <span className={styles.n}>{row.n}</span>
                <span className={styles.label}>{row.label}</span>
                <span className={styles.mark} aria-hidden="true">
                  {pressed ? "✓" : ""}
                </span>
              </button>
            );
          })}
        </div>

        {otherPicked ? (
          <div className={`shell ${styles.other}`}>
            <div id="otherbox" className="otherbox">
              <label className="visually-hidden" htmlFor={otherFieldId}>
                In your own words, what takes the most time?
              </label>
              <input
                id={otherFieldId}
                ref={otherFieldRef}
                className="otherbox__field"
                type="text"
                value={otherText}
                placeholder="In your own words, what takes the most time?"
                onChange={(event) => setOtherText(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                  }
                }}
              />
              <button
                id="othergo"
                className="btn btn--solid"
                type="button"
                onClick={() => {
                  otherFieldRef.current?.blur();
                }}
              >
                Tell me about it
              </button>
            </div>
          </div>
        ) : null}
      </section>

      {/*
        Nothing here until they have told us something. An empty band asking
        the question a third time was the old page's worst habit.
      */}
      {count > 0 ? (
        <section
          id="verdict"
          ref={verdictRef}
          className="verdict-band"
          aria-live="polite"
        >
          <div className="shell">
            <p className="vhead">{framingLine(count)}</p>
            <ol className="vlist">
              {selectedKeys.map((key, index) => {
                const row = verdictCopy[key];
                return (
                  <li key={key}>
                    <b>{padN(index)}</b>
                    <div>
                      <p dangerouslySetInnerHTML={{ __html: row.html }} />
                      {row.href && row.title ? (
                        <Link className="tlink" href={row.href}>
                          Read: {row.title} →
                        </Link>
                      ) : null}
                    </div>
                  </li>
                );
              })}
              {other ? (
                <li>
                  <b>{padN(selectedKeys.length)}</b>
                  <div>
                    <p dangerouslySetInnerHTML={{ __html: other.html }} />
                    {other.href && other.label ? (
                      <Link className="tlink" href={other.href}>
                        {other.label}
                      </Link>
                    ) : null}
                  </div>
                </li>
              ) : null}
            </ol>
            <div className="vcta">
              <a className="btn btn--invert" href="#start">
                Tell Casey and she&apos;ll take it from here →
              </a>
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
