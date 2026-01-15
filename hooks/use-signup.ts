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

export function useSignup() {
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

        console.log("[SignupForm] handleSubmit called", formData)

        if (formData.password !== formData.confirmPassword) {
            setError("Les mots de passe ne correspondent pas.")
            setLoading(false)
            return;
        }

        try {
            console.log("[SignupForm] sending POST to /api/auth/register")
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
                }),
            })

            console.log("[SignupForm] received response", response)

            let result: any = null
            try {
                result = await response.json()
            } catch (e) {
                result = { message: await response.text().catch(() => "<non-json response>") }
            }

            if (!response.ok) {
                console.error("[SignupForm] server responded with error", response.status, result)
                if (Array.isArray(result)) {
                    setError(result.map((r: any) => r.message || JSON.stringify(r)).join(', '))
                } else {
                    setError(result?.message || `Server error ${response.status}`)
                }
                setSuccess(false)
                return
            }

            const data = result

            if (data?.error) {
                if (Array.isArray(data.errors)) {
                    setError(data.errors.map((e: any) => e.message).join(', '))
                } else {
                    setError(data.message || "Échec de l'inscription")
                }
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
                    window.location.href = "/otp?email=" + encodeURIComponent(formData.email)
                }, 500)
            }
        } catch (err) {
            console.error("[SignupForm] fetch error", err)
            setError("Une erreur est survenue. Veuillez réessayer.")
            setSuccess(false)
        } finally {
            setLoading(false)
        }
    }

    return {
        loading,
        error,
        success,
        formData,
        handleInputChange,
        handleSubmit
    }
}