import type { NextConfig } from "next";

const PROVISIONER_PROD = "https://ascend-nuvemshop-provisioner-api.vercel.app";
const CRM_PROD = "https://crm-ascend-2c1l.vercel.app";

function pickPublicUrl(
  primary: string | undefined,
  fallback: string | undefined,
  prod: string,
  local: string,
) {
  const raw = (primary ?? fallback ?? "").trim();
  if (process.env.VERCEL) {
    if (raw.startsWith("https://") && !/^https?:\/\/(localhost|127\.0\.0\.1)/i.test(raw)) {
      return raw;
    }
    return prod;
  }
  if (raw) return raw;
  return process.env.VERCEL_ENV === "production" ? prod : local;
}

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
    NEXT_PUBLIC_PROVISIONER_URL: pickPublicUrl(
      process.env.PROVISIONER_URL,
      process.env.NEXT_PUBLIC_PROVISIONER_URL,
      PROVISIONER_PROD,
      "http://localhost:4010",
    ),
    NEXT_PUBLIC_CRM_URL: pickPublicUrl(
      process.env.CRM_URL,
      process.env.NEXT_PUBLIC_CRM_URL,
      CRM_PROD,
      "http://localhost:3001",
    ),
  },
};

export default nextConfig;
