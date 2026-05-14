'use client'

import { useEffect, useState } from "react"

export type Role = "ADMIN" | "VENDOR" | "USER"

type AuthUser = {
  id: string
  role: Role
  firstName?: string
  lastName?: string
}
export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    syncUser()
  }, [])

  const syncUser = () => {
    const token = localStorage.getItem("access_token")

    if (!token) {
      setUser(null)
      setLoading(false)
      return
    }

    const role = localStorage.getItem("role") as Role
    const firstName = localStorage.getItem("firstName") || ""
    const lastName = localStorage.getItem("lastName") || ""

    setUser({
      id: "temp-id",
      role,
      firstName,
      lastName
    })

    setLoading(false)
  }

  const logout = () => {
    localStorage.clear()
    setUser(null) // 🔥 THIS IS THE FIX
  }

  return { user, loading, logout }
}