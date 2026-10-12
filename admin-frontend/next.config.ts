import type { NextConfig } from "next";

/** Local default; on Vercel set BACKEND_URL to your Railway API origin (no /api suffix). */
const BACKEND_URL = process.env.BACKEND_URL || "http://127.0.0.1:8080";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${BACKEND_URL}/api/:path*`
      }
    ];
  }
};

export default nextConfig;
