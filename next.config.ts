import type { NextConfig } from "next";

const apiUrl = process.env.NEXT_PUBLIC_API_URL?.trim();
const apiOrigin = apiUrl ? new URL(apiUrl).origin : null;

const nextConfig: NextConfig = {
  images: {
    remotePatterns: apiOrigin ? [new URL(`${apiOrigin}/storage/**`)] : [],
  },
};

export default nextConfig;
