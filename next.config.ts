import type { NextConfig } from "next";

// GitHub Pages serves this repo under /flutter-flow-docs, so every asset and
// link needs that prefix. Static export because Pages has no Node runtime.
const repo = "flutter-flow-docs";
const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  output: "export",
  basePath: isProd ? `/${repo}` : "",
  assetPrefix: isProd ? `/${repo}/` : "",
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
