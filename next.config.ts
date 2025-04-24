import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "s1.it.atcdn.net",
				pathname: "/**",
			},
			{
				protocol: "https",
				hostname: "img.daisyui.com",
				pathname: "/**",
			},
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
		],
	},
};

export default nextConfig;
