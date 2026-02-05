import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/dashboard/", "/subscriptions/", "/settings/", "/analytics/", "/calendar/", "/folders/", "/tags/", "/payment-methods/"],
      },
    ],
    sitemap: "https://trackmysubscriptions.com/sitemap.xml",
  }
}
