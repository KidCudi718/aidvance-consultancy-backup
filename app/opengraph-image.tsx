import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const alt = `${site.name} — geometric wordmark`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const wordmark = [
  "M0 100 L42 0 H54 L96 100 H80.6 L48 14.2 L15.4 100 Z",
  "M114 0 H130 V100 H114 Z",
  "M148 0 H192 C228.5 0 252 22 252 50 C252 78 228.5 100 192 100 H148 V0 Z M164 14.5 V85.5 H190 C214.5 85.5 234 71.5 234 50 C234 28.5 214.5 14.5 190 14.5 H164 Z",
  "M270 0 H285.4 L318 85.8 L350.6 0 H366 L318 100 Z",
  "M384 100 L426 0 H438 L480 100 H464.6 L432 14.2 L399.4 100 Z",
  "M498 0 H514 V79 L576 0 H596 V100 H580 V21 L518 100 H498 Z",
  "M614 0 H684 V14.8 H640 C616 14.8 602 30.5 602 50 C602 69.5 616 85.2 640 85.2 H684 V100 H614 C581 100 564 78 564 50 C564 22 581 0 614 0 Z",
  "M702 0 H760 V14.8 H718 V42.6 H752 V57.4 H718 V85.2 H760 V100 H702 Z",
] as const;

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#f3f0e8",
          color: "#111110",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          <svg width="420" height="56" viewBox="0 0 760 100">
            <g fill="#111110" fillRule="evenodd">
              {wordmark.map((d) => (
                <path key={d} d={d} />
              ))}
            </g>
          </svg>
          <div
            style={{
              display: "flex",
              fontSize: 14,
              letterSpacing: "0.46em",
              textTransform: "uppercase",
              fontWeight: 500,
            }}
          >
            Consultancy
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 22,
          }}
        >
          <div
            style={{
              display: "flex",
              width: 56,
              height: 2,
              background: "#8f3d1b",
            }}
          />
          <div
            style={{
              display: "flex",
              fontSize: 54,
              lineHeight: 1.08,
              letterSpacing: "-0.03em",
              maxWidth: 920,
            }}
          >
            A written decision before anyone sells you a stack.
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 22,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#6a655c",
            }}
          >
            AI Opportunity Assessment · $999 · {site.domain}
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
