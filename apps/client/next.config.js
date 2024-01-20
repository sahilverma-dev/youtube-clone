/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "res.cloudinary.com",
      },
      {
        hostname: "img.youtube.com",
      },
      {
        hostname: "yt3.googleusercontent.com",
      },
      {
        hostname: "yt3.ggpht.com",
      },
    ],
  },
};

module.exports = nextConfig;
