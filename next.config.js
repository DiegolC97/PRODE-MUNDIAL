const path = require('path');

/**
 * Next.js is configured to read its App Router from
 *   src/interfaces/web/app
 * so the Clean Architecture layer boundary (`interfaces/`) is preserved.
 *
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Tell Next.js where to look for the App Router pages.
  experimental: {
    typedRoutes: true,
  },
  env: {
    MATCHES_SERVICE_URL: process.env.MATCHES_SERVICE_URL,
    PREDICTIONS_SERVICE_URL: process.env.PREDICTIONS_SERVICE_URL,
    SCORING_SERVICE_URL: process.env.SCORING_SERVICE_URL,
  },
  webpack(config) {
    config.resolve.alias['@domain'] = path.resolve(__dirname, 'src/domain');
    config.resolve.alias['@application'] = path.resolve(__dirname, 'src/application');
    config.resolve.alias['@infrastructure'] = path.resolve(__dirname, 'src/infrastructure');
    config.resolve.alias['@interfaces'] = path.resolve(__dirname, 'src/interfaces');
    return config;
  },
};

module.exports = nextConfig;
