import type {NextConfig} from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 's1.it.atcdn.net',
                pathname: '/**',
            },            {
                protocol: 'https',
                hostname: 'img.daisyui.com',
                pathname: '/**',
            },
        ],
    },


};

export default nextConfig;
