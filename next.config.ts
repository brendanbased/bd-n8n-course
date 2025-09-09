import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.discordapp.com',
        port: '',
        pathname: '/avatars/**',
      },
    ],
  },
  webpack: (config, { isServer }) => {
    // Handle native modules for Discord.js
    config.externals = config.externals || [];
    
    if (isServer) {
      config.externals.push({
        'zlib-sync': 'commonjs zlib-sync',
        'discord.js': 'commonjs discord.js'
      });
    }

    // Ignore native modules in client-side bundles
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      crypto: false,
      stream: false,
      url: false,
      zlib: false,
      http: false,
      https: false,
      assert: false,
      os: false,
      path: false,
    };

    return config;
  },
};

export default nextConfig;
