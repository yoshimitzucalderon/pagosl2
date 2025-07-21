/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['bmcscxzddfyttjdudkeh.supabase.co'],
  },
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_N8N_BASE_URL: process.env.NEXT_PUBLIC_N8N_BASE_URL,
  },
  webpack: (config) => {
    config.resolve.alias['@'] = require('path').resolve(__dirname);
    return config;
  },
  // Configuración para optimizar el build
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
}

module.exports = nextConfig 