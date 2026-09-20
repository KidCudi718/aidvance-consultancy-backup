import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { site } from "@/lib/site";

export const alt = `${site.name} wordmark`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const logo = await readFile(join(process.cwd(), "public/brand/logo.png"));
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#ffffff",
          color: "#000000",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
        }}
      >
        <img src={logoSrc} width={590} height={198} alt="" />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 18,
          }}
        >
          <div
            style={{
              display: "flex",
              width: 56,
              height: 2,
              background: "#000000",
            }}
          />
          <div
            style={{
              display: "flex",
              fontSize: 48,
              lineHeight: 1.08,
              letterSpacing: "-0.03em",
              maxWidth: 920,
            }}
          >
            Feel like your competitors are ahead of you on AI? They're not.
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 20,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
            }}
          >
            {site.offer.name} · {site.domain}
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
