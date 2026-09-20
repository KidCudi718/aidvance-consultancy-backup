"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import {
  emptyVerdict,
  framingLine,
  otherVerdict,
  padN,
  pickerRows,
  verdictCopy,
  verdictOrder,
  type PickerKey,
} from "@/lib/verdict";

type Picked = Partial<Record<PickerKey, boolean>>;

export function StartJourney() {
  const [picked, setPicked] = useState<Picked>({});
  const [otherText, setOtherText] = useState("");
  const [otherDraft, setOtherDraft] = useState("");
  const firstTick = useRef(true);
  const verdictRef = useRef<HTMLElement>(null);
  const otherFieldRef = useRef<HTMLInputElement>(null);
  const otherFieldId = useId();
  const otherPicked = Boolean(picked.other);

  useEffect(() => {
    if (otherPicked) {
      otherFieldRef.current?.focus();
    }
  }, [otherPicked]);

  const scrollVerdictIfNeeded = useCallback(() => {
    if (!firstTick.current) {
      return;
    }
    firstTick.current = false;
    if (typeof window === "undefined") {
      return;
    }
    if (!window.matchMedia("(max-width: 879px)").matches) {
      return;
    }
    verdictRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const toggle = (key: PickerKey) => {
    setPicked((current) => ({ ...current, [key]: !current[key] }));
    scrollVerdictIfNeeded();
  };

  const selectedKeys = verdictOrder.filter((key) => picked[key]);
  const count = selectedKeys.length + (otherPicked ? 1 : 0);
  const other = otherPicked ? otherVerdict(otherText) : null;

  return (
    <>
      <section className="hero hero--split" aria-label="Introduction">
        <div className="hero__hook">
          <p className="kicker">Aidvance Consultancy · New York</p>
          <h1 className="display">
            <span className="hero-beat">Feel like your competitors are ahead of you on AI?</span>
            <span className="hero-beat hero-beat--late">
              <strong>They&apos;re not.</strong>
            </span>
          </h1>
          <p className="lede lede--narrow">
            Most of them pay twenty dollars a month for something nobody has
            opened since March. You&apos;re one honest afternoon from being
            ahead of them.
          </p>
          <div className="actions">
            <a className="btn btn--solid" href="#start">
              Find your one thing →
            </a>
            <Link className="text-link" href="/library/what-ai-actually-costs/">
              Or see what it costs
            </Link>
          </div>
        </div>

        <div className="picker hp2" id="start">
          <p className="kicker">Start here</p>
          <h2 className="display display--sm">What&apos;s eating your week?</h2>
          <p className="picker__hint">
            Pick everything that applies. Most weeks have more than one.
          </p>
          <div className="picker__rows" role="group" aria-label="What's eating your week">
            {pickerRows.map((row) => {
              const pressed = Boolean(picked[row.key]);
              return (
                <button
                  key={row.key}
                  type="button"
                  className="tile"
                  data-v={row.key}
                  aria-pressed={pressed}
                  onClick={() => toggle(row.key)}
                >
                  <span className="tile__n">{row.n}</span>
                  <span className="tile__label">{row.label}</span>
                  <span className="tile__mark" aria-hidden="true">
                    {pressed ? "✓" : ""}
                  </span>
                </button>
              );
            })}
          </div>
          <div id="otherbox" className="otherbox" hidden={!otherPicked}>
            <label className="visually-hidden" htmlFor={otherFieldId}>
              In your own words — what takes the most time?
            </label>
            <input
              id={otherFieldId}
              ref={otherFieldRef}
              className="otherbox__field"
              type="text"
              value={otherDraft}
              placeholder="In your own words — what takes the most time?"
              onChange={(event) => setOtherDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  setOtherText(otherDraft);
                }
              }}
            />
            <button
              id="othergo"
              className="btn btn--solid"
              type="button"
              onClick={() => setOtherText(otherDraft)}
            >
              Tell me about it
            </button>
          </div>
          <p className="trust-chips">
            <span>Free</span>
            <span>No newsletter</span>
            <span>Nothing here is sponsored</span>
            <span>Written for owner-operators</span>
          </p>
        </div>
      </section>

      <section
        id="verdict"
        ref={verdictRef}
        className="verdict-band"
        aria-live="polite"
      >
        <div className="shell">
          {count === 0 ? (
            <div className="memo memo--ink">
              <div className="memo__rule">
                <span>Aidvance Consultancy</span>
                <span>Live verdict</span>
              </div>
              <p className="stub">{emptyVerdict}</p>
            </div>
          ) : (
            <>
              <p className="vhead">{framingLine(count)}</p>
              <ol className="vlist">
                {selectedKeys.map((key, index) => {
                  const row = verdictCopy[key];
                  return (
                    <li key={key}>
                      <b>{padN(index)}</b>
                      <div>
                        <p dangerouslySetInnerHTML={{ __html: row.html }} />
                        <Link className="tlink" href={row.href}>
                          Read: {row.title} →
                        </Link>
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
                        <a className="tlink" href={other.href}>
                          {other.label}
                        </a>
                      ) : null}
                    </div>
                  </li>
                ) : null}
              </ol>
              {count >= 2 ? (
                <div className="vcta">
                  <Link className="btn btn--invert" href="/assessment/">
                    Have someone map all of this for me →
                  </Link>
                </div>
              ) : null}
            </>
          )}
        </div>
      </section>
    </>
  );
}
