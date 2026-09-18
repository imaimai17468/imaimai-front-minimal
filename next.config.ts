import type { NextConfig } from "next";

const SECURITY_HEADERS = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
];

const config: NextConfig = {
  experimental: {
    useTypeScriptCli: true,
  },
  headers() {
    return Promise.resolve([{ source: "/(.*)", headers: SECURITY_HEADERS }]);
  },
};

export default config;
