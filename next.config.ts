import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';
import path from 'path';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    // 禁用Turbopack特定功能
    turbo: {
      resolveAlias: {
        '@': path.resolve(__dirname, './src')
      }
    },
    // 禁用其他可能冲突的特性
    serverComponentsExternalPackages: [],
  },
  // 确保使用webpack而不是turbopack
  webpack: (config, { isServer }) => {
    // 这里可以自定义webpack配置
    return config;
  },
};

export default withNextIntl(nextConfig);
