import type { NextConfig } from "next"

const securityHeaders = [
  // Prevent clickjacking
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  // Prevent MIME type sniffing
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  // Enable XSS filtering
  {
    key: "X-XSS-Protection",
    value: "1; mode=block",
  },
  // Control referrer information
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  // Permissions Policy (formerly Feature-Policy)
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  // Strict Transport Security (HSTS)
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains",
  },
  // Content Security Policy
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // Required for Next.js
      "style-src 'self' 'unsafe-inline'", // Required for Tailwind
      "img-src 'self' data: https: blob:",
      "font-src 'self' data:",
      "connect-src 'self' https://api.exchangerate-api.com https://accounts.google.com",
      "frame-ancestors 'none'",
      "form-action 'self'",
      "base-uri 'self'",
    ].join("; "),
  },
]

const nextConfig: NextConfig = {
  // Security headers for all routes
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ]
  },

  // Disable x-powered-by header
  poweredByHeader: false,

  // Enable strict mode for React
  reactStrictMode: true,

  // Image optimization configuration
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com", // Google profile pictures
      },
    ],
  },

  // Redirect HTTP to HTTPS in production
  async redirects() {
    return process.env.NODE_ENV === "production"
      ? [
          {
            source: "/:path*",
            has: [
              {
                type: "header",
                key: "x-forwarded-proto",
                value: "http",
              },
            ],
            destination: "https://:path*",
            permanent: true,
          },
        ]
      : []
  },
}

export default nextConfig
