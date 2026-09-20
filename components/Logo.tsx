type LogoProps = {
  invert?: boolean;
  compact?: boolean;
};

const WORDMARK_PATHS = [
  "M0 100 L42 0 H54 L96 100 H80.6 L48 14.2 L15.4 100 Z",
  "M114 0 H130 V100 H114 Z",
  "M148 0 H192 C228.5 0 252 22 252 50 C252 78 228.5 100 192 100 H148 V0 Z M164 14.5 V85.5 H190 C214.5 85.5 234 71.5 234 50 C234 28.5 214.5 14.5 190 14.5 H164 Z",
  "M270 0 H285.4 L318 85.8 L350.6 0 H366 L318 100 Z",
  "M384 100 L426 0 H438 L480 100 H464.6 L432 14.2 L399.4 100 Z",
  "M498 0 H514 V79 L576 0 H596 V100 H580 V21 L518 100 H498 Z",
  "M614 0 H684 V14.8 H640 C616 14.8 602 30.5 602 50 C602 69.5 616 85.2 640 85.2 H684 V100 H614 C581 100 564 78 564 50 C564 22 581 0 614 0 Z",
  "M702 0 H760 V14.8 H718 V42.6 H752 V57.4 H718 V85.2 H760 V100 H702 Z",
] as const;

export function Logo({ invert = false, compact = false }: LogoProps) {
  const fill = invert ? "#f3f0e8" : "#111110";

  return (
    <svg
      className={compact ? "logo logo--compact" : "logo"}
      viewBox="0 0 760 168"
      role="img"
      aria-label="Aidvance Consultancy"
    >
      <g fill={fill} fillRule="evenodd">
        {WORDMARK_PATHS.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>
      <text
        x="0"
        y="148"
        fill={fill}
        fontSize="13"
        fontWeight="500"
        letterSpacing="19.15"
        fontFamily="var(--font-sans), 'IBM Plex Sans', sans-serif"
      >
        CONSULTANCY
      </text>
    </svg>
  );
}

export function LogoMark({ invert = false }: { invert?: boolean }) {
  const fill = invert ? "#f3f0e8" : "#111110";

  return (
    <svg
      className="logo-mark"
      viewBox="0 0 96 100"
      role="img"
      aria-hidden="true"
    >
      <path fill={fill} d="M0 100 L42 0 H54 L96 100 H80.6 L48 14.2 L15.4 100 Z" />
    </svg>
  );
}
