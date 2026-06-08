import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/kampagne", destination: "/nicht-nur-dein-job", permanent: false },
      { source: "/contactlawmakers", destination: "/mailtool", permanent: true },
    ];
  },
  env: {
    NEXT_PUBLIC_JOBLOSS_FALLBACK: process.env.NEXT_PUBLIC_JOBLOSS_FALLBACK ?? "128648",
    JOBLOSS_API_URL: process.env.JOBLOSS_API_URL ?? "https://jobloss.ai/api/reports",
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pauseai.info",
        pathname: "/_app/immutable/assets/**",
      },
      {
        protocol: "https",
        hostname: "superintelligence-statement.org",
      },
      {
        protocol: "https",
        hostname: "www.safe.ai",
      },
      {
        protocol: "https",
        hostname: "cdn.prod.website-files.com",
      },
      {
        protocol: "https",
        hostname: "imgproxy.fourthwall.com",
      },
    ],
  },
};

export default nextConfig;
