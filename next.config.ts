import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
    // 跳过图片优化，直接使用原始URL（解决VPN/代理导致的私有IP问题）
    unoptimized: true,
  },
};

export default nextConfig;
