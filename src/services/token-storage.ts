import type { AuthUser } from "@/types/auth"

const TOKEN_KEY = "stockflow.token"
const USER_KEY = "stockflow.user"

export const tokenStorage = {
  getToken(): string | null {
    try {
      return localStorage.getItem(TOKEN_KEY)
    } catch {
      return null
    }
  },
  setToken(token: string) {
    localStorage.setItem(TOKEN_KEY, token)
  },
  getUser(): AuthUser | null {
    try {
      const raw = localStorage.getItem(USER_KEY)
      return raw ? (JSON.parse(raw) as AuthUser) : null
    } catch {
      return null
    }
  },
  setUser(user: AuthUser) {
    localStorage.setItem(USER_KEY, JSON.stringify(user))
  },
  clear() {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  },
}
