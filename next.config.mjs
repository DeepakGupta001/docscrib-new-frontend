/** @type {import('next').NextConfig} */

import { config } from "dotenv";

// Load environment variables from .env.local and .env
config({ path: '.env.local' });
config({ path: '.env' });

const nextConfig = {
  env: {
    DASHBOARD_BASE_URL: process.env.DASHBOARD_BASE_URL
  }
};

export default nextConfig;
