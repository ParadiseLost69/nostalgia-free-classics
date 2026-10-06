/** @type {import('next').NextConfig} */
const nextConfig = {
  // jsdom (used by isomorphic-dompurify) must not be bundled.
  serverExternalPackages: ['isomorphic-dompurify', 'jsdom'],
  experimental: {
    serverActions: { bodySizeLimit: '2mb' },
  },
};

export default nextConfig;
