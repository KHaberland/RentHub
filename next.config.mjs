/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com"
      }
    ]
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb" // Увеличено для поддержки загрузки изображений в Base64
    }
  }
};

export default nextConfig;
