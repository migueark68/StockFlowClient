import * as React from "react"
import { useQueryClient } from "@tanstack/react-query"

import { authService } from "@/features/auth/auth.service"
import { api, setUnauthorizedHandler } from "@/services/api"
import { tokenStorage } from "@/services/token-storage"
import type { AuthUser, Cargo, LoginRequest } from "@/types/auth"

interface AuthContextValue {
  user: AuthUser | null
  token: string | null
  isAuthenticated: boolean
  isInitializing: boolean
  login: (payload: LoginRequest) => Promise<void>
  logout: () => void
  hasRole: (roles: Cargo | Cargo[]) => boolean
}

const AuthContext = React.createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient()
  const [user, setUser] = React.useState<AuthUser | null>(null)
  const [token, setToken] = React.useState<string | null>(null)
  const [isInitializing, setIsInitializing] = React.useState(true)

  const logout = React.useCallback(() => {
    tokenStorage.clear()
    setUser(null)
    setToken(null)
    delete api.defaults.headers.common.Authorization
    try {
      sessionStorage.clear()
    } catch {
      // ignore
    }
    queryClient.clear()
  }, [queryClient])

  // Recover the session from localStorage on first mount.
  React.useEffect(() => {
    const storedToken = tokenStorage.getToken()
    const storedUser = tokenStorage.getUser()
    if (storedToken && storedUser) {
      setToken(storedToken)
      setUser(storedUser)
      api.defaults.headers.common.Authorization = `Bearer ${storedToken}`
    }
    setIsInitializing(false)
  }, [])

  // Wire the 401 handler so expired/invalid tokens trigger a logout.
  React.useEffect(() => {
    setUnauthorizedHandler(() => logout())
    return () => setUnauthorizedHandler(null)
  }, [logout])

  const login = React.useCallback(async (payload: LoginRequest) => {
    const response = await authService.login(payload)
    tokenStorage.setToken(response.accessToken)
    tokenStorage.setUser(response.usuario)
    api.defaults.headers.common.Authorization = `Bearer ${response.accessToken}`
    setToken(response.accessToken)
    setUser(response.usuario)
    queryClient.clear()
  }, [queryClient])

  const hasRole = React.useCallback(
    (roles: Cargo | Cargo[]) => {
      if (!user) return false
      const list = Array.isArray(roles) ? roles : [roles]
      return list.includes(user.cargo)
    },
    [user],
  )

  const value = React.useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token && user),
      isInitializing,
      login,
      logout,
      hasRole,
    }),
    [user, token, isInitializing, login, logout, hasRole],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = React.useContext(AuthContext)
  if (!ctx) throw new Error("useAuth deve ser usado dentro de um AuthProvider")
  return ctx
}
