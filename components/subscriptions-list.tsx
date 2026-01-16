"use client"

import { useEffect, useState } from "react"
import { useUser } from "@/hooks/use-user"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Crown, 
  CalendarDays, 
  CreditCard, 
  FileText, 
  XCircle, 
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Clock
} from "lucide-react"
import { toast } from "sonner"

interface StripeSubscription {
  id: string
  status: string
  current_period_start: number
  current_period_end: number
  cancel_at_period_end: boolean
  canceled_at: number | null
  created: number
  plan: {
    id: string
    amount: number
    currency: string
    interval: string
    interval_count: number
    product_name: string
    product_description: string | null
  }
  default_payment_method: {
    brand: string
    last4: string
  } | null
}

export function SubscriptionsList() {
  const { user } = useUser()
  const [subscriptions, setSubscriptions] = useState<StripeSubscription[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const fetchSubscriptions = async () => {
    if (!user?.id) return

    setLoading(true)
    try {
      const response = await fetch(`/api/stripe/subscriptions?userId=${user.id}`)
      const data = await response.json()

      if (data.success) {
        setSubscriptions(data.subscriptions)
        setError(null)
      } else {
        setError(data.error || "Erreur lors de la récupération des abonnements")
      }
    } catch (err) {
      setError("Erreur de connexion")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSubscriptions()
  }, [user])

  const handleCancelSubscription = async (subscriptionId: string, immediately: boolean = false) => {
    if (!user?.id) return

    const message = immediately
      ? "Êtes-vous sûr de vouloir annuler cet abonnement immédiatement ? Vous perdrez l'accès immédiatement."
      : "Êtes-vous sûr de vouloir annuler cet abonnement ? Vous conserverez l'accès jusqu'à la fin de la période."

    const confirmed = window.confirm(message)
    if (!confirmed) return

    setActionLoading(subscriptionId)

    try {
      const response = await fetch("/api/stripe/subscriptions", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subscriptionId,
          userId: user.id,
          cancelImmediately: immediately,
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast.success(data.message)
        await fetchSubscriptions()
      } else {
        toast.error(data.error || "Erreur lors de l'annulation")
      }
    } catch (err) {
      toast.error("Erreur de connexion")
    } finally {
      setActionLoading(null)
    }
  }

  const handleReactivateSubscription = async (subscriptionId: string) => {
    if (!user?.id) return

    setActionLoading(subscriptionId)

    try {
      const response = await fetch("/api/stripe/subscriptions", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subscriptionId,
          userId: user.id,
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast.success(data.message)
        await fetchSubscriptions()
      } else {
        toast.error(data.error || "Erreur lors de la réactivation")
      }
    } catch (err) {
      toast.error("Erreur de connexion")
    } finally {
      setActionLoading(null)
    }
  }

  const formatDate = (timestamp: number) => {
    // Fix: vérifier si le timestamp est valide (non nul et non undefined)
    if (!timestamp || timestamp <= 0) {
      return "Date non disponible"
    }
    return new Date(timestamp * 1000).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(amount)
  }

  const getIntervalLabel = (interval: string, count: number) => {
    const intervals: Record<string, string> = {
      day: count === 1 ? "jour" : "jours",
      week: count === 1 ? "semaine" : "semaines",
      month: count === 1 ? "mois" : "mois",
      year: count === 1 ? "an" : "ans",
    }
    return count === 1 ? `par ${intervals[interval]}` : `tous les ${count} ${intervals[interval]}`
  }

  const getStatusBadge = (subscription: StripeSubscription) => {
    const status = subscription.status

    if (subscription.cancel_at_period_end) {
      return (
        <Badge variant="outline" className="bg-orange-100 text-orange-700 border-orange-300">
          <AlertTriangle className="h-3 w-3 mr-1" />
          Annulation programmée
        </Badge>
      )
    }

    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-500 text-white">
            <CheckCircle className="h-3 w-3 mr-1" />
            Actif
          </Badge>
        )
      case "past_due":
        return (
          <Badge variant="destructive">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Paiement en retard
          </Badge>
        )
      case "canceled":
        return (
          <Badge variant="secondary">
            <XCircle className="h-3 w-3 mr-1" />
            Annulé
          </Badge>
        )
      case "trialing":
        return (
          <Badge className="bg-blue-500 text-white">
            <Clock className="h-3 w-3 mr-1" />
            Période d'essai
          </Badge>
        )
      case "unpaid":
        return (
          <Badge variant="destructive">
            <XCircle className="h-3 w-3 mr-1" />
            Impayé
          </Badge>
        )
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getDaysRemaining = (endTimestamp: number) => {
    // Fix: vérifier si le timestamp est valide
    if (!endTimestamp || endTimestamp <= 0) {
      return null
    }
    const end = new Date(endTimestamp * 1000)
    const now = new Date()
    const diff = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    return diff
  }

  // Ne rien afficher si l'utilisateur n'est pas connecté
  if (!user) {
    return null
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="mt-4 text-muted-foreground">Chargement de vos abonnements...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="max-w-md">
          <CardHeader className="text-center">
            <XCircle className="h-12 w-12 text-destructive mx-auto" />
            <CardTitle className="text-destructive">Erreur</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button onClick={fetchSubscriptions}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Réessayer
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (subscriptions.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="max-w-md">
          <CardHeader className="text-center">
            <Crown className="h-12 w-12 text-muted-foreground mx-auto" />
            <CardTitle>Aucun abonnement</CardTitle>
            <CardDescription>
              Vous n'avez pas encore d'abonnement actif. Découvrez nos offres pour profiter de toutes les fonctionnalités.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button asChild>
              <a href="/pricing">Voir les offres</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">
            {subscriptions.length} abonnement{subscriptions.length > 1 ? "s" : ""}
          </h2>
          <p className="text-sm text-muted-foreground">
            Gérez vos abonnements et votre facturation
          </p>
        </div>
        <Button variant="outline" onClick={fetchSubscriptions}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Actualiser
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {subscriptions.map((subscription) => {
          const daysRemaining = getDaysRemaining(subscription.current_period_end)
          const isActionLoading = actionLoading === subscription.id
          const hasValidEndDate = daysRemaining !== null

          return (
            <Card key={subscription.id} className="relative overflow-hidden">
              {subscription.cancel_at_period_end && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-orange-500" />
              )}
              
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="flex items-center gap-2">
                      <Crown className="h-5 w-5 text-yellow-500" />
                      {subscription.plan.product_name}
                    </CardTitle>
                    {subscription.plan.product_description && (
                      <CardDescription className="text-xs">
                        {subscription.plan.product_description}
                      </CardDescription>
                    )}
                  </div>
                  {getStatusBadge(subscription)}
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Prix */}
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold">
                    {formatCurrency(subscription.plan.amount, subscription.plan.currency)}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {getIntervalLabel(subscription.plan.interval, subscription.plan.interval_count)}
                  </span>
                </div>

                {/* Dates */}
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <CalendarDays className="h-4 w-4" />
                    <span>Période actuelle : {formatDate(subscription.current_period_start)}</span>
                  </div>
                  {hasValidEndDate && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <CalendarDays className="h-4 w-4" />
                      <span>
                        {subscription.cancel_at_period_end ? "Se termine le" : "Prochain renouvellement"} : {formatDate(subscription.current_period_end)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Jours restants - seulement si la date est valide */}
                {subscription.status === "active" && hasValidEndDate && daysRemaining > 0 && (
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Période en cours</span>
                      <span className={daysRemaining <= 7 ? "text-orange-500 font-medium" : "text-green-500 font-medium"}>
                        {daysRemaining} jour{daysRemaining > 1 ? "s" : ""} restant{daysRemaining > 1 ? "s" : ""}
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          daysRemaining <= 7 ? "bg-orange-500" : "bg-green-500"
                        }`}
                        style={{
                          width: `${Math.max(0, Math.min(100, (daysRemaining / 30) * 100))}%`,
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Moyen de paiement */}
                {subscription.default_payment_method && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2 border-t">
                    <CreditCard className="h-4 w-4" />
                    <span className="capitalize">{subscription.default_payment_method.brand}</span>
                    <span>•••• {subscription.default_payment_method.last4}</span>
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-col gap-2 pt-2">
                  <Button variant="outline" size="sm" asChild>
                    <a href="/factures">
                      <FileText className="h-4 w-4 mr-2" />
                      Voir mes factures
                    </a>
                  </Button>

                  {subscription.status === "active" && !subscription.cancel_at_period_end && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleCancelSubscription(subscription.id, false)}
                      disabled={isActionLoading}
                    >
                      {isActionLoading ? (
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <XCircle className="h-4 w-4 mr-2" />
                      )}
                      Annuler l'abonnement
                    </Button>
                  )}

                  {subscription.cancel_at_period_end && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-green-600 hover:text-green-600"
                      onClick={() => handleReactivateSubscription(subscription.id)}
                      disabled={isActionLoading}
                    >
                      {isActionLoading ? (
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <RefreshCw className="h-4 w-4 mr-2" />
                      )}
                      Réactiver l'abonnement
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
