"use client"

import { useState, useEffect, useCallback } from "react"

export interface User {
  id: string
  email: string
  firstname: string
  lastname: string
}

export function useUser() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchUser = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me", { credentials: "include" })
      const data = await res.json()
      if (!data.error && data.user) {
        setUser(data.user)
      } else {
        setUser(null)
      }
    } catch {
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchUser()
  }, [fetchUser])

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    setUser(null)
  }

  const refreshUser = async () => {
    setIsLoading(true)
    await fetchUser()
  }

  return { user, isLoading, logout, refreshUser, setUser }
}
