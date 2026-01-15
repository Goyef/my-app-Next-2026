"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"

export function useLogin() {

    const router = useRouter()

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
                router.push('/landing-page')
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