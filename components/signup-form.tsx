"use client"

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
import { Input } from "@/components/ui/input"
import { useSignup } from "@/hooks/use-signup"

export function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {

  const { loading, error, success, formData, handleInputChange, handleSubmit } = useSignup()

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Créer un compte</CardTitle>
        <CardDescription>
          Entrez vos informations pour créer un nouveau compte.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="firstName">Prénom</FieldLabel>
              <Input 
                id="firstName" 
                type="text" 
                placeholder="John" 
                required 
                value={formData.firstname}
                onChange={handleInputChange}
              />
            </Field>
             <Field>
              <FieldLabel htmlFor="lastName">Nom de famille</FieldLabel>
              <Input 
                id="lastName" 
                type="text" 
                placeholder="Doe" 
                required 
                value={formData.lastname}
                onChange={handleInputChange}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={formData.email}
                onChange={handleInputChange}
              />
              <FieldDescription>
                Nous utiliserons cet email pour vous contacter. Nous ne partagerons pas votre email avec qui que ce soit.
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="password">Mot de passe</FieldLabel>
              <Input 
                id="password" 
                type="password" 
                required 
                value={formData.password}
                onChange={handleInputChange}
              />
              <FieldDescription>
                Doit contenir au moins 8 caractères.
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="confirm-password">
                Confirmer le mot de passe
              </FieldLabel>
              <Input 
                id="confirm-password" 
                type="password" 
                required 
                value={formData.confirmPassword}
                onChange={handleInputChange}
              />
              <FieldDescription>Veuillez confirmer votre mot de passe.</FieldDescription>
            </Field>
            {error && (
              <div className="rounded-md bg-red-50 p-3 text-sm text-red-800">
                {error}
              </div>
            )}
            {success && (
              <div className="rounded-md bg-green-50 p-3 text-sm text-green-800">
                Compte créé avec succès ! Redirection vers la page de connexion...
              </div>
            )}
            <FieldGroup>
              <Field>
                <Button type="submit" disabled={loading}>
                  {loading ? "Creating Account..." : "Create Account"}
                </Button>
       
                <FieldDescription className="px-6 text-center">
                  Vous avez déjà un compte ? <a href="/otp">Se connecter</a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
