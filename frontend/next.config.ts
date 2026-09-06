import type { NextConfig } from "next";

const BACKEND_ORIGIN =
  process.env.BACKEND_URL?.replace("/api", "") ?? "http://localhost:4000";

const nextConfig: NextConfig = {
  // 開発時に左下へ表示される Next.js のインジケーターを非表示にする
  devIndicators: false,
  experimental: {
    serverActions: {
      bodySizeLimit: "5mb",
    },
  },
  async rewrites() {
    return [
      {
        source: "/uploads/:path*",
        destination: `${BACKEND_ORIGIN}/uploads/:path*`,
      },
    ];
  },
};

export default nextConfig;
