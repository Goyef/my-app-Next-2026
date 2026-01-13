"use client"

import { useState } from "react"
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

export function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    const fieldName = id === "firstName" ? "firstname" : 
                      id === "lastName" ? "lastname" : 
                      id === "confirm-password" ? "confirmPassword" : id
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstname: formData.firstname,
          lastname: formData.lastname,
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        }),
      })

      const data = await response.json()

      if (data.error) {
        setError(Array.isArray(data) ? data.join(", ") : data.message || "Registration failed")
        setSuccess(false)
      } else {
        setSuccess(true)
        setFormData({
          firstname: "",
          lastname: "",
          email: "",
          password: "",
          confirmPassword: "",
        })
        setTimeout(() => {
          window.location.href = "/login"
        }, 500)
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
      setSuccess(false)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>
          Enter your information below to create your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="firstName">First Name</FieldLabel>
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
              <FieldLabel htmlFor="lastName">Last Name</FieldLabel>
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
                We&apos;ll use this to contact you. We will not share your email
                with anyone else.
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input 
                id="password" 
                type="password" 
                required 
                value={formData.password}
                onChange={handleInputChange}
              />
              <FieldDescription>
                Must be at least 8 characters long.
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="confirm-password">
                Confirm Password
              </FieldLabel>
              <Input 
                id="confirm-password" 
                type="password" 
                required 
                value={formData.confirmPassword}
                onChange={handleInputChange}
              />
              <FieldDescription>Please confirm your password.</FieldDescription>
            </Field>
            {error && (
              <div className="rounded-md bg-red-50 p-3 text-sm text-red-800">
                {error}
              </div>
            )}
            {success && (
              <div className="rounded-md bg-green-50 p-3 text-sm text-green-800">
                Account created successfully! Redirecting to login...
              </div>
            )}
            <FieldGroup>
              <Field>
                <Button type="submit" disabled={loading}>
                  {loading ? "Creating Account..." : "Create Account"}
                </Button>
       
                <FieldDescription className="px-6 text-center">
                  Already have an account? <a href="/login">Sign in</a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
