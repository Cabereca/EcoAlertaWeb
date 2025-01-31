import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    forceSwcTransforms: true,
  },
  /* config options here */
};

export default nextConfig;
