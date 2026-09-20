import Image from "next/image";

type LogoSize = "nav" | "hero" | "footer";

const SIZE: Record<LogoSize, { width: number; height: number }> = {
  nav: { width: 177, height: 59 },
  footer: { width: 177, height: 59 },
  hero: { width: 590, height: 198 },
};

type LogoProps = {
  invert?: boolean;
  size?: LogoSize;
  priority?: boolean;
};

export function Logo({ invert = false, size = "nav", priority = false }: LogoProps) {
  const dim = SIZE[size];

  return (
    <Image
      src="/brand/logo.webp"
      alt="Aidvance Consultancy"
      width={dim.width}
      height={dim.height}
      className={invert ? "brand-logo brand-logo--invert" : "brand-logo"}
      priority={priority}
    />
  );
}
