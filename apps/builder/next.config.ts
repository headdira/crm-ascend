import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@crm-ascend/validation"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "media.base44.com",
        pathname: "/**",
      },
    ],
  },
  env: {
    NEXT_PUBLIC_PROVISIONER_URL: process.env.PROVISIONER_URL ?? "http://localhost:4010",
  },
};

export default nextConfig;
