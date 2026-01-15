"use client"
import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"

export function OTPForm({ ...props }: React.ComponentProps<typeof Card>) {
  const searchParams = useSearchParams()
  const email = searchParams.get("email") || ""
  const [otp, setOtp] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [resending, setResending] = useState(false)

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      })

      const data = await response.json()

      if (data.error) {
        setError(data.message)
      } else {
        // Redirection vers le dashboard après vérification
        window.location.href = "/dashboard"
      }
    } catch (err) {
      setError("Une erreur est survenue")
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    setResending(true)
    setError(null)

    try {
      const response = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (data.error) {
        setError(data.message)
      }
    } catch (err) {
      setError("Impossible de renvoyer le code")
    } finally {
      setResending(false)
    }
  }

  if (!email) {
    return (
      <Card {...props}>
        <CardHeader>
          <CardTitle>Erreur</CardTitle>
          <CardDescription>Email non trouvé. Veuillez revenir en arrière et réessayer.</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Entrez le code de vérification</CardTitle>
        <CardDescription>Nous avons envoyé un code à 6 chiffres à {email}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleVerify}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="otp">Code de vérification</FieldLabel>
              <InputOTP 
                maxLength={6} 
                id="otp" 
                required
                value={otp}
                onChange={setOtp}
              >
                <InputOTPGroup className="gap-2.5 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border">
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
              <FieldDescription>
                Entrez le code à 6 chiffres envoyé à votre email.
              </FieldDescription>
              {error && (
                <p className="text-sm text-red-500 mt-2">{error}</p>
              )}
            </Field>
            <FieldGroup>
              <Button type="submit" onClick={() => {document.location.href = "/landing-page"}}>Vérifier</Button>
              <FieldDescription className="text-center">
                Vous n'avez pas reçu le code?{" "}
                <button 
                  type="button"
                  onClick={handleResend}
                  disabled={resending}
                  className="text-primary underline hover:no-underline disabled:opacity-50"
                >
                  {resending ? "Envoie..." : "Renvoyer"}
                </button>
              </FieldDescription>
            </FieldGroup>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
