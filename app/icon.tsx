import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#f3f0e8",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg width="20" height="21" viewBox="0 0 96 100">
          <path
            fill="#111110"
            d="M0 100 L42 0 H54 L96 100 H80.6 L48 14.2 L15.4 100 Z"
          />
        </svg>
      </div>
    ),
    { ...size },
  );
}
