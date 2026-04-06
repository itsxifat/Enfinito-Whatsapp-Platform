/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['better-sqlite3'],
  webpack: (config) => {
    config.resolve.symlinks = false
    config.cache = false
    return config
  },
}

export default nextConfig
