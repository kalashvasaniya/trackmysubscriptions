import { Features } from "@/components/landing/Features"
import { Hero } from "@/components/landing/Hero"
import { HowItWorks } from "@/components/landing/HowItWorks"
import { Integrations } from "@/components/landing/Integrations"
import { Pricing } from "@/components/landing/Pricing"
import { Stats } from "@/components/landing/Stats"

export default function HomePage() {
  return (
    <>
      <Hero />
      <Features />
      <HowItWorks />
      <Stats />
      <Integrations />
      <Pricing />
    </>
  )
}
