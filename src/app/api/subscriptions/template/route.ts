import { getCSVTemplate } from "@/lib/csv"
import { NextResponse } from "next/server"

export async function GET() {
  const template = getCSVTemplate()

  return new NextResponse(template, {
    status: 200,
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": 'attachment; filename="subscription-template.csv"',
    },
  })
}
