/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    config.externals.push("pino-pretty", "lokijs", "encoding");
    return config;
  },
  images: {
    domains: [
      "bafybeihmnzln7owlnyo7s6cjtca66d35s3bl522yfx5tjnn3j7z6ol4aiy.ipfs.nftstorage.link",
      "https://flame.buyholdearn.com",
    ],
  },
};

module.exports = nextConfig;
