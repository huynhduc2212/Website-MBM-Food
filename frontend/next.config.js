// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['mbmfood.store'],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "mbmfood.store",
        pathname: "/images/**",
      },
      // {
      //   protocol: "http",
      //   hostname: "localhost",
      //   pathname: "/images/**",
      // },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
