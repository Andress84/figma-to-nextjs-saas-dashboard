import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_PAGES === "true";
const repositoryName = "figma-to-nextjs-saas-dashboard";
const basePath = isGitHubPages ? `/${repositoryName}` : "";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  typedRoutes: true,
  ...(isGitHubPages
    ? {
        output: "export",
        basePath,
        trailingSlash: true,
        images: {
          unoptimized: true,
        },
      }
    : {}),
};

export default nextConfig;
