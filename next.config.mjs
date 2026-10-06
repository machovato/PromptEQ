import { readFileSync } from "node:fs";

const { version } = JSON.parse(readFileSync(new URL("./package.json", import.meta.url), "utf8"));

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Exposes only the version string to the client, not the whole package.json.
  env: { NEXT_PUBLIC_APP_VERSION: version },
};

export default nextConfig;
