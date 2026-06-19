import { api } from "@/services/api"
import type { LoginRequest, LoginResponse } from "@/types/auth"

export const authService = {
  async login(payload: LoginRequest): Promise<LoginResponse> {
    const { data } = await api.post<LoginResponse>("/api/auth/login", payload)
    return data
  },
}
