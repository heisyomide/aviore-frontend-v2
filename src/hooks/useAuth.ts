'use client'

import { useEffect, useState, useCallback } from "react"

export type Role = "ADMIN" | "VENDOR" | "CUSTOMER"

interface AuthUser {
  id: string
  role: Role
  firstName?: string
  lastName?: string
}

// Custom event name for cross-tab or cross-component syncing
const AUTH_EVENT = "aviore_auth_sync"

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const syncUser = useCallback(() => {
    if (typeof window === 'undefined') return

    const token = localStorage.getItem("access_token")
    const role = localStorage.getItem("role")?.toUpperCase() as Role
    const firstName = localStorage.getItem("firstName") || ""
    const lastName = localStorage.getItem("lastName") || ""

    if (!token || !role) {
      setUser(null)
    } else {
      setUser({
        id: "user-session", // In a real app, extract ID from JWT if possible
        role,
        firstName,
        lastName
      })
    }
    setIsLoading(false)
  }, [])

  useEffect(() => {
    // 1. Initial sync
    syncUser()

    // 2. Listen for internal app changes (login/logout)
    const handleCustomSync = () => syncUser()
    window.addEventListener(AUTH_EVENT, handleCustomSync)

    // 3. Listen for changes from other tabs (StorageEvent)
    const handleStorageChange = (e: StorageEvent) => {
      if (['access_token', 'role'].includes(e.key || '')) {
        syncUser()
      }
    }
    window.addEventListener("storage", handleStorageChange)

    return () => {
      window.removeEventListener(AUTH_EVENT, handleCustomSync)
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [syncUser])

  const logout = () => {
    localStorage.clear()
    
    // Dispatch event so all useAuth instances update immediately
    window.dispatchEvent(new Event(AUTH_EVENT))
    
    // Force redirect to login
    window.location.href = "/login"
  }

  return { 
    user, 
    isLoading, 
    logout, 
    isAuthenticated: !!user,
    isVendor: user?.role === 'VENDOR',
    isAdmin: user?.role === 'ADMIN'
  }
}