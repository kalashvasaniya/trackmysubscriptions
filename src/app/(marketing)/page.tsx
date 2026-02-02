import { CTA } from "@/components/landing/CTA"
import { Features } from "@/components/landing/Features"
import { Hero } from "@/components/landing/Hero"
import { HowItWorks } from "@/components/landing/HowItWorks"
import { Stats } from "@/components/landing/Stats"
// import { Testimonials } from "@/components/landing/Testimonials"

export default function HomePage() {
  return (
    <>
      <Hero />
      <Features />
      <HowItWorks />
      <Stats />
      {/* Testimonials – Loved by thousands, Sarah/James/Emily quotes, 4.9 rating, 98% recommend */}
      {/* <Testimonials /> */}
      <CTA />
    </>
  )
}
