"use client"

import { useState } from "react"
import { PricingHeader } from "@/components/landing-page"
import { PricingSwitch } from "@/components/landing-page"
import { PricingCard } from "@/components/landing-page"

export default function Features() {
  const [isYearly, setIsYearly] = useState(false)
  const togglePricingPeriod = (value: string) => setIsYearly(parseInt(value) === 1)

  const plans = [
    {
      title: "Basic",
      description: "Fonctionnalités essentielles pour commencer",
      features: ["Example Feature Number 1", "Example Feature Number 2", "Example Feature Number 3"],
      actionLabel: "Voir plus",
      actionUrl: "/pricing",
    },
    {
      title: "Premium",
      description: "Parfait pour les propriétaires de petites et moyennes entreprises",
      features: ["Example Feature Number 1", "Example Feature Number 2", "Example Feature Number 3"],
      actionLabel: "Voir plus",
      popular: true,
      actionUrl: "/pricing",
    },
    {
      title: "Entreprise",
      description: "Des solutions sur mesure pour les grandes entreprises",
      features: ["Example Feature Number 1", "Example Feature Number 2", "Example Feature Number 3", "Super Exclusive Feature"],
      actionLabel: "Voir plus",
      exclusive: true,
      actionUrl: "/pricing",
    },
  ]
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-12 text-center text-foreground">Nos Fonctionnalités (se connecter pour en profiter)</h2>
        <div className="py-8">
          <section className="flex flex-col sm:flex-row sm:flex-wrap justify-center gap-8 mt-8">
            {plans.map((plan) => {
              return <PricingCard key={plan.title} {...plan} isYearly={isYearly} />
            })}
          </section>
        </div>
      </div>
    </section>
  );
}
