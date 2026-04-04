import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "s3-ap-southeast-1.amazonaws.com",
        pathname: "/easyparcel-static/**",
      },
    ],
  },
};

export default nextConfig;
