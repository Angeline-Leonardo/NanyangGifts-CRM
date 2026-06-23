import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  cacheComponents: true,
    turbopack: {
    // Points to the exact directory where this config file sits
    root: path.join(__dirname),
  },
};

export default nextConfig;
