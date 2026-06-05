import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    output: "standalone",
    images: {
        formats: ["image/avif", "image/webp"],
        minimumCacheTTL: 2592000, // 30 days
        remotePatterns: [
            { protocol: "https", hostname: "images.unsplash.com" },
            { protocol: "https", hostname: "*.b-cdn.net" },
            { protocol: "https", hostname: "storage.bunnycdn.com" },
            { protocol: "https", hostname: "via.placeholder.com" },
            { protocol: "https", hostname: "logo.clearbit.com" },
            { protocol: "https", hostname: "upload.wikimedia.org" },
        ],
    },

    async headers() {
        return [
            {
                source: "/(.*)",
                headers: [
                    { key: "X-DNS-Prefetch-Control", value: "on" },
                    { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
                    { key: "X-Frame-Options", value: "SAMEORIGIN" },
                    { key: "X-Content-Type-Options", value: "nosniff" },
                    { key: "X-XSS-Protection", value: "1; mode=block" },
                    { key: "Referrer-Policy", value: "origin-when-cross-origin" },
                    { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
                ],
            },
        ];
    },

    allowedDevOrigins: ["10.35.210.30", "172.25.224.1"],

    reactStrictMode: true,

    experimental: {
        optimizePackageImports: ["@heroicons/react", "framer-motion"],
    },
};

export default nextConfig;
