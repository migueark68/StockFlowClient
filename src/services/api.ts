import axios from "axios"

import { tokenStorage } from "./token-storage"

/**
 * Base URL points to the real backend API. Configure it through the
 * VITE_API_URL environment variable (e.g. https://api.suaempresa.com).
 * Defaults to a relative "/api" path when proxied on the same origin.
 */
const baseURL = "http://localhost:8080/api"

export const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
})

/**
 * Callback invoked when the API returns a 401, allowing the AuthContext
 * to clear the session and redirect to the login page.
 */
let onUnauthorized: (() => void) | null = null

export function setUnauthorizedHandler(handler: (() => void) | null) {
  onUnauthorized = handler
}

// Attach the bearer token to every outgoing request.
api.interceptors.request.use((config) => {
  const token = tokenStorage.getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle automatic logout on 401 responses.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status
    const isLoginRequest = error?.config?.url?.includes("/auth/login")
    if (status === 401 && !isLoginRequest) {
      onUnauthorized?.()
    }
    return Promise.reject(error)
  },
)
