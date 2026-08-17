import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: ['192.168.100.174'],
  images: {
    remotePatterns: [
      {
        // MinIO local
        protocol: 'http',
        hostname: '192.168.100.174',
        port: '9000',
        pathname: '/tukas-media/**',
      },
      {
        // Cloudflare R2 (production — update hostname as needed)
        protocol: 'https',
        hostname: '*.r2.dev',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
