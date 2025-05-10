import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  transpilePackages: ['@react-pdf/renderer'],
  experimental: {
    esmExternals: 'loose'
  }
};

export default nextConfig;
