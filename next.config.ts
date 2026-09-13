import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Doctor profile photo uploads are capped at 5MB (see
      // MAX_IMAGE_SIZE_BYTES in src/lib/storage/r2.ts); this must stay
      // above that to leave room for multipart/form-data overhead.
      bodySizeLimit: "6mb",
    },
  },
};

export default nextConfig;
