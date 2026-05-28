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
    NEXT_PUBLIC_PROVISIONER_URL:
      process.env.PROVISIONER_URL ??
      process.env.NEXT_PUBLIC_PROVISIONER_URL ??
      (process.env.VERCEL_ENV === "production"
        ? "https://ascend-nuvemshop-provisioner-api.vercel.app"
        : "http://localhost:4010"),
    NEXT_PUBLIC_CRM_URL:
      process.env.CRM_URL ??
      process.env.NEXT_PUBLIC_CRM_URL ??
      (process.env.VERCEL_ENV === "production"
        ? "https://crm-ascend-2c1l.vercel.app"
        : "http://localhost:3001"),
  },
};

export default nextConfig;
