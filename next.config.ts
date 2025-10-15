import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },

  typescript: {
    ignoreBuildErrors: true,
  },

  images: {
    qualities: [100],

    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },

      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
  }
};

export default nextConfig;
