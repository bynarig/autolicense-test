import type {NextConfig} from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 's1.it.atcdn.net',
                pathname: '/**',
            },
        ],
    },

};

export default nextConfig;
