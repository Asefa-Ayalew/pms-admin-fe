/**
 * @type {import('next').NextConfig}
 */

const nextConfig = {
  turbopack: {
    resolveAlias: {
      "next/server.js": "next/server",
      "next/navigation.js": "next/navigation",
      "next/headers.js": "next/headers",
      "next/image.js": "next/image",
      "next/router.js": "next/router",
      "@emotion/react": "@emotion/react",
      "@mantine/core/styles.css": "@mantine/core/styles.css",
      "@mantine/hooks": "@mantine/hooks",
      "@mantine/core": "@mantine/core",
      "@mantine/tiptap": "@mantine/tiptap",
      "@mantine/notifications": "@mantine/notifications",
      "@mantine/dates": "@mantine/dates",
      "@mantine/modals": "@mantine/modals",
      dateformat: "dateformat",
      lodash: "lodash",
      "lodash-es": "lodash-es",
      "file-saver": "file-saver",
      "next/navigation": "next/navigation",
    },
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
      "*.scss": {
        loaders: ["sass-loader"],
      },
      "*.css": {
        loaders: [],
      },
    },
    resolveExtensions: [
      ".tsx",
      ".ts",
      ".jsx",
      ".js",
      ".json",
      ".css",
      ".scss",
      ".svg",
    ],
  },
  images: {
    minimumCacheTTL: 3600,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [],
    formats: ["image/avif", "image/webp"],
  },
  serverExternalPackages: ["lodash"],
  experimental: {
    optimizeCss: true,
    optimizeServerReact: true,
    serverActions: {
      bodySizeLimit: "2mb",
    },
    serverMinification: true,
    workerThreads: true,
    optimisticClientCache: true,
  },
  reactStrictMode: false,
  poweredByHeader: false,
  env: {
    ENVIRONMENT: process.env.NODE_ENV,
    API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
  pageExtensions: ["tsx", "ts", "jsx", "js", "mdx"],
  distDir: ".next",
  compress: true,
  productionBrowserSourceMaps: false,
  typescript: {
    ignoreBuildErrors: false,
  },
  output: "standalone",
  generateEtags: true,
  staticPageGenerationTimeout: 120,
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  onDemandEntries: {
    maxInactiveAge: 60 * 1000,
    pagesBufferLength: 5,
  },
};
if (process.env.NODE_ENV === "production") {
  nextConfig.compress = true;
  nextConfig.productionBrowserSourceMaps = false;
  nextConfig.poweredByHeader = false;
  nextConfig.generateEtags = true;
}

export default nextConfig;
