import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "http", hostname: "localhost" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
    ],
  },
  webpack: (config) => {
    // Wajib untuk quagga barcode scanner
    config.externals = [...(config.externals || []), "canvas", "jsdom"];
    return config;
  },
};

export default nextConfig;