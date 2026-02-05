import { NextResponse } from "next/server"
import { getAllComparisonSlugs } from "@/data/pseo/comparisons"

const BASE_URL = "https://trackmysubscriptions.com"
const URLS_PER_CHUNK = 40000

// ── /sitemaps/0  /sitemaps/1  /sitemaps/2 … ─────────────────────────
// Each chunk returns up to 40 000 comparison-page URLs as sitemap XML.

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const chunkIndex = parseInt(id, 10)
  if (isNaN(chunkIndex) || chunkIndex < 0) {
    return NextResponse.json({ error: "Invalid sitemap id" }, { status: 400 })
  }

  const allSlugs = getAllComparisonSlugs()
  const start = chunkIndex * URLS_PER_CHUNK
  const end = Math.min(start + URLS_PER_CHUNK, allSlugs.length)

  if (start >= allSlugs.length) {
    return NextResponse.json({ error: "Sitemap chunk not found" }, { status: 404 })
  }

  const chunk = allSlugs.slice(start, end)
  const now = new Date().toISOString()

  const xml = [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
    ...chunk.map(
      (slug) =>
        `<url><loc>${BASE_URL}/compare/${slug}</loc><lastmod>${now}</lastmod><changefreq>monthly</changefreq><priority>0.6</priority></url>`
    ),
    `</urlset>`,
  ].join("\n")

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  })
}
