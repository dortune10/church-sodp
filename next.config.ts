import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone', // Optimized for Docker/VPS deployments
  poweredByHeader: false, // Remove X-Powered-By header for security
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.supabase.co' },
    ],
  },
};

export default nextConfig;
