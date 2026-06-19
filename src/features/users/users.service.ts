import { api } from "@/services/api"
import type { Paginated } from "@/types/api"
import type { CreateUserPayload, UpdateUserPayload, User } from "@/types/user"

export interface ListUsersParams {
  search?: string
  cargo?: string
  page?: number
  pageSize?: number
}

export const usersService = {
  list: async (params: ListUsersParams = {}) => {
    const { data } = await api.get<Paginated<User> | User[]>("/api/usuarios", { params })
    return data
  },

  getById: async (id: string) => {
    const { data } = await api.get<User>(`/api/usuarios/${id}`)
    return data
  },

  create: async (input: CreateUserPayload) => {
    const { data } = await api.post<User>("/api/usuarios", input)
    return data
  },

  update: async (id: string, input: UpdateUserPayload) => {
    const { data } = await api.patch<User>(`/api/usuarios/${id}`, input)
    return data
  },

  remove: async (id: string) => {
    await api.delete(`/api/usuarios/${id}`)
  },
}
