/** @type {import('next').NextConfig} */
const nextConfig = {
  // Turbopack 在 Next.js 13.5+ 开发模式默认启用（通过 --turbo 标志）
  // 生产构建使用 Turbopack 需要 Next.js 14+ 并设置 experimental.turbo
  // 本关主要体验开发模式的 Turbopack，生产构建仍使用默认的 Webpack
  experimental: {
    // 如果需要生产构建也用 Turbopack（Next.js 14+，实验性）
    // turbo: {}
  }
};

module.exports = nextConfig;

