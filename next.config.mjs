/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Emit a self-contained server bundle for the Docker runtime stage.
  output: "standalone",
  // Linting is not part of the base project; keep builds focused on type-checking.
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;
