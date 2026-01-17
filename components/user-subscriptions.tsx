"use client"

import { useEffect, useState } from "react"
import { useUser } from "@/hooks/use-user"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CalendarDays, Crown, FileText } from "lucide-react"

interface Subscription {
  id_subscription: string
  plan: string
  start_date: string
  end_date: string
}

export function UserSubscriptions() {
  const { user, isLoading: userLoading } = useUser()
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSubscriptions = async () => {
      if (!user?.id) {
        setLoading(false)
        return
      }

      try {
        const response = await fetch(`/api/subscription/user?userId=${user.id}`)
        const data = await response.json()

        if (data.success) {
          setSubscriptions(data.subscriptions)
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des abonnements:", error)
      } finally {
        setLoading(false)
      }
    }

    if (!userLoading) {
      fetchSubscriptions()
    }
  }, [user, userLoading])

  // Ne rien afficher si l'utilisateur n'est pas connecté
  if (!user) {
    return null
  }

  if (loading || userLoading) {
    return (
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="text-center text-muted-foreground">Chargement des abonnements...</div>
        </div>
      </section>
    )
  }

  if (subscriptions.length === 0) {
    return (
      <section className="py-8">
        <div className="container mx-auto px-4">
          <Card className="max-w-md mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <Crown className="h-5 w-5 text-muted-foreground" />
                Aucun abonnement actif
              </CardTitle>
              <CardDescription>
                Découvrez nos offres et souscrivez à un abonnement pour profiter de toutes les fonctionnalités.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <a
                href="/pricing"
                className="inline-block px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
              >
                Voir les offres
              </a>
            </CardContent>
          </Card>
        </div>
      </section>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  const getDaysRemaining = (endDate: string) => {
    const end = new Date(endDate)
    const now = new Date()
    const diff = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    return diff
  }

  const getPlanColor = (plan: string) => {
    switch (plan.toLowerCase()) {
      case "premium":
        return "bg-gradient-to-r from-orange-400 to-rose-400 text-white"
      case "basic":
        return "bg-blue-500 text-white"
      default:
        return "bg-zinc-500 text-white"
    }
  }

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6 text-center text-foreground">
          Vos abonnements actifs
        </h2>
        <div className="flex flex-wrap justify-center gap-4">
          {subscriptions.map((subscription) => {
            const daysRemaining = getDaysRemaining(subscription.end_date)
            return (
              <Card key={subscription.id_subscription} className="w-80">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Crown className="h-5 w-5 text-yellow-500" />
                      {subscription.plan}
                    </CardTitle>
                    <Badge className={getPlanColor(subscription.plan)}>Actif</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CalendarDays className="h-4 w-4" />
                    <span>Début : {formatDate(subscription.start_date)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CalendarDays className="h-4 w-4" />
                    <span>Fin : {formatDate(subscription.end_date)}</span>
                  </div>
                  <div className="pt-2">
                    <div className="text-sm font-medium">
                      {daysRemaining > 0 ? (
                        <span className="text-green-500">
                          {daysRemaining} jour{daysRemaining > 1 ? "s" : ""} restant{daysRemaining > 1 ? "s" : ""}
                        </span>
                      ) : (
                        <span className="text-red-500">Expiré</span>
                      )}
                    </div>
                    <div className="w-full bg-muted rounded-full h-2 mt-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{
                          width: `${Math.max(0, Math.min(100, (daysRemaining / 30) * 100))}%`,
                        }}
                      />
                    </div>
                  </div>
                  <div className="pt-3">
                    <Button variant="outline" size="sm" className="w-full" asChild>
                      <a href="/factures">
                        <FileText className="h-4 w-4 mr-2" />
                        Voir mes factures
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
