import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: ["localhost", "*.netlify.app"],
  reactCompiler: true,
};

export default nextConfig;
