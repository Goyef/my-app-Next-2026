"use client"

import { useEffect, useState } from "react"
import { useUser } from "@/hooks/use-user"
import { ProtectedRoute } from "@/components/protected-route"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, Download, ExternalLink, Receipt, XCircle, ArrowLeft } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"

interface Invoice {
  id: string
  number: string | null
  status: string | null
  amount: number
  currency: string
  created: number
  due_date: number | null
  paid_at: number | null
  invoice_pdf: string | null
  hosted_invoice_url: string | null
  description: string
}

function InvoicesList() {
  const { user } = useUser()
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [cancellingId, setCancellingId] = useState<string | null>(null)

  useEffect(() => {
    const fetchInvoices = async () => {
      if (!user?.id) return

      try {
        const response = await fetch(`/api/stripe/invoices?userId=${user.id}`)
        const data = await response.json()

        if (data.success) {
          setInvoices(data.invoices)
        } else {
          setError(data.error || "Erreur lors de la récupération des factures")
        }
      } catch (err) {
        setError("Erreur de connexion")
      } finally {
        setLoading(false)
      }
    }

    fetchInvoices()
  }, [user])



  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(amount)
  }

  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-500 text-white">Payée</Badge>
      case "open":
        return <Badge className="bg-yellow-500 text-white">En attente</Badge>
      case "draft":
        return <Badge className="bg-gray-500 text-white">Brouillon</Badge>
      case "uncollectible":
        return <Badge className="bg-red-500 text-white">Impayée</Badge>
      case "void":
        return <Badge className="bg-gray-400 text-white">Annulée</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Chargement des factures...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  if (invoices.length === 0) {
    return (
      <Card className="max-w-md mx-auto">
        <CardHeader className="text-center">
            <Button variant="ghost" size="sm" asChild className="mb-4">
              <Link href="/landing-page">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour à l'accueil
              </Link>
            </Button>
          <Receipt className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <CardTitle>Aucune facture</CardTitle>
          <CardDescription>
            Vous n'avez pas encore de factures. Les factures seront générées automatiquement lors de vos paiements.
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
    )
  }

  return (
    <div className="space-y-4">
        <Button variant="ghost" size="sm" asChild className="mb-4">
              <Link href="/landing-page">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour à l'accueil
              </Link>
            </Button>
      {invoices.map((invoice) => (
        <Card key={invoice.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-muted rounded-lg">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">
                      Facture {invoice.number || invoice.id.slice(-8)}
                    </h3>
                    {getStatusBadge(invoice.status)}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {invoice.description}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(invoice.created)}
                    {invoice.paid_at && ` • Payée le ${formatDate(invoice.paid_at)}`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-xl font-bold">
                    {formatAmount(invoice.amount, invoice.currency)}
                  </p>
                </div>
                <div className="flex gap-2">
                  {invoice.invoice_pdf && (
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                    >
                      <a href={invoice.invoice_pdf} target="_blank" rel="noopener noreferrer">
                        <Download className="h-4 w-4 mr-1" />
                        PDF
                      </a>
                    </Button>
                  )}
                  {invoice.hosted_invoice_url && (
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                    >
                      <a href={invoice.hosted_invoice_url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-1" />
                        Voir
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default function FacturesPage() {
  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Mes Factures</h1>
          <p className="text-muted-foreground mt-2">
            Retrouvez l'historique de toutes vos factures et téléchargez-les au format PDF.
          </p>
        </div>
        <InvoicesList />
      </div>
    </ProtectedRoute>
  )
}
