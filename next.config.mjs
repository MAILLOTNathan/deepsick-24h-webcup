/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Linting is not part of the base project; keep builds focused on type-checking.
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;
