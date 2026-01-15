"use client"

import { useState } from "react"
import { PricingHeader } from "@/components/landing-page"
import { PricingSwitch } from "@/components/landing-page"
import { PricingCard } from "@/components/landing-page"

export default function page() {
  const [isYearly, setIsYearly] = useState(false)
  const togglePricingPeriod = (value: string) => setIsYearly(parseInt(value) === 1)

  const plans = [
    {
      title: "Basic",
      monthlyPrice: 10,
      yearlyPrice: 100,
      description: "Fonctionnalités essentielles pour commencer",
      features: ["Example Feature Number 1", "Example Feature Number 2", "Example Feature Number 3"],
      actionLabel: "Commencez",
    },
    {
      title: "Premium",
      monthlyPrice: 25,
      yearlyPrice: 250,
      description: "Parfait pour les propriétaires de petites et moyennes entreprises",
      features: ["Example Feature Number 1", "Example Feature Number 2", "Example Feature Number 3"],
      actionLabel: "Commencez",
      popular: true,
    },
    {
      title: "Entreprise",
      price: "Customisable",
      description: "Des solutions sur mesure pour les grandes entreprises",
      features: ["Example Feature Number 1", "Example Feature Number 2", "Example Feature Number 3", "Super Exclusive Feature"],
      actionLabel: "Contactez nous",
      exclusive: true,
    },
  ]
  return (
    <div className="py-8">
      <PricingHeader title="Abonnements" subtitle="Choisissez votre abonnement" />
      <PricingSwitch onSwitch={togglePricingPeriod} />
      <section className="flex flex-col sm:flex-row sm:flex-wrap justify-center gap-8 mt-8">
        {plans.map((plan) => {
          return <PricingCard key={plan.title} {...plan} isYearly={isYearly} />
        })}
      </section>
    </div>
  )
}