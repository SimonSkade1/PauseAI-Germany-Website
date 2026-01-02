import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
    ],
  },
};

export default nextConfig;
