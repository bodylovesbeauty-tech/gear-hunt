/** @type {import('next').NextConfig} */
const nextConfig = {
  /* GGF NOTE: Humne yahan se eslint ki purani settings mita di hain */
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;