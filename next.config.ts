import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "i.imgur.com",
				pathname: "/**",
			},
			{
				protocol: "https",
				hostname: "ireland-faq-storage.b-cdn.net",
				pathname: "/**",
			},
			{
				protocol: "https",
				hostname: "avatars.githubusercontent.com",
				pathname: "/**",
			},
		],
	},
	// Handle Node.js modules in the browser environment
	webpack: (config, { isServer }) => {
		if (!isServer) {
			// Don't resolve 'fs', 'child_process', etc. on the client
			config.resolve.fallback = {
				...config.resolve.fallback,
				fs: false,
				child_process: false,
				crypto: false,
				net: false,
				tls: false,
			};
		}
		return config;
	},
};

export default nextConfig;
