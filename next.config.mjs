/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  images: { formats: ["image/avif", "image/webp"] },

  async redirects() {
    return [
      // garde ta redirection utile
      { source: "/quiz/intro", destination: "/intro", permanent: true },
    ];
  },
};

export default nextConfig;
