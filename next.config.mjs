/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.pinimg.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "base-meta.s3.ap-southeast-1.amazonaws.com",
        port: "",
      },
    ],
  },
};

export default nextConfig;
