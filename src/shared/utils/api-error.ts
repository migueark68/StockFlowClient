import { AxiosError } from "axios"

import type { ApiError } from "@/types/api"

/**
 * Extracts a human-friendly message from an API error following the
 * backend contract: { timestamp, status, error, message, path }.
 */
export function getApiErrorMessage(error: unknown, fallback = "Ocorreu um erro inesperado."): string {
  if (error instanceof AxiosError) {
    const data = error.response?.data as Partial<ApiError> | undefined
    if (data?.message) return data.message
    if (error.code === "ERR_NETWORK") {
      return "Não foi possível conectar ao servidor. Verifique sua conexão."
    }
    if (error.message) return error.message
  }
  if (error instanceof Error && error.message) return error.message
  return fallback
}
