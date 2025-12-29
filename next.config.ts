import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    qualities: [100],

    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },

      {
        protocol: 'https',
        hostname: 'pbs.twimg.com',
      },

      {
        protocol: 'https',
        hostname: 'res.cloudinary.com'
      },
    ],
  }
};

export default nextConfig;
