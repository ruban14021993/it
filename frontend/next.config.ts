import type { NextConfig } from "next";

const internalApiUrl = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/uploads/**",
      },
      {
        protocol: "http",
        hostname: "backend",
        port: "8000",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "*.infinitymindtech.com",
        pathname: "/**",
      },
    ],
  },
  // Allow cross-origin requests to backend in dev
  async rewrites() {
    return [
      {
        source: "/uploads/:path*",
        destination: `${internalApiUrl}/uploads/:path*`,
      },
      {
        source: "/api/v1/:path*",
        destination: `${internalApiUrl}/api/v1/:path*`,
      }
    ];
  },
};

export default nextConfig;
