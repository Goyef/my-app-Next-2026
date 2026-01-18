"use client"
import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useUser } from "@/hooks/use-user"

export function useLogin() {

    const router = useRouter()
    const searchParams = useSearchParams()
    const { setUser } = useUser()

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setLoading(true)

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            })

            const data = await res.json()

            if (!res.ok || data.error) {
                setError(data.message || 'Login failed')
            } else {
                setUser({
                    id: data.data.id,
                    email: data.data.email,
                    firstname: data.data.firstname,
                    lastname: data.data.lastname,
                })
                // Rediriger vers l'URL d'origine ou la landing page
                const redirectUrl = searchParams.get('redirect') || '/landing-page'
                router.push(redirectUrl)
            }
        } catch (err) {
            setError('Network error')
        } finally {
            setLoading(false)
        }
    }

    return {
        email,
        setEmail,
        handleSubmit,
        password,
        setPassword,
        loading,
        error,
    }



}