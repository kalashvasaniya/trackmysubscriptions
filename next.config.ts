/** @type {import('next').NextConfig} */

const nextConfig = {
  redirects: async () => {
    return [
      {
        source: "/quotes/overview",
        destination: "/",
        permanent: true,
      },
    ]
  },
}

export default nextConfig
