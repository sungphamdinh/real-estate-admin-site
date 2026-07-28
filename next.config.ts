import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ protocol: "http", hostname: "139.59.232.15" }],
  },
  turbopack: {
    root: path.join(__dirname),
  },
};

export default nextConfig;
