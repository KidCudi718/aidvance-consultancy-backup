import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  agentRules: false,
  trailingSlash: true,
  async redirects() {
    return [
      {
        source: "/resources",
        destination: "/library/",
        permanent: true,
      },
      {
        source: "/resources/:slug",
        destination: "/library/",
        permanent: true,
      },
      {
        source: "/start",
        destination: "/#start",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
