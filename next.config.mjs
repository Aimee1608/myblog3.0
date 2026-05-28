/** @type {import('next').NextConfig} */
const nextConfig = {
  // standalone: produce a self-contained server bundle for a small Docker image
  output: 'standalone',
  reactStrictMode: true,
};

export default nextConfig;
