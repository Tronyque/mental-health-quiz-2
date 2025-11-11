/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // ✅ Force PostCSS (Tailwind 4)
  experimental: {
    optimizeCss: false,
  },

  eslint: { ignoreDuringBuilds: true },

  images: { formats: ['image/avif', 'image/webp'] },

  async redirects() {
    return [
      // ✅ Si quelqu’un utilise encore l’ancienne URL, redirige vers la nouvelle
      { source: '/quiz/intro', destination: '/intro', permanent: true },
    ];
  },
};

export default nextConfig;
