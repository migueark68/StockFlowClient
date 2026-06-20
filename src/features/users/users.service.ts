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
    const { data } = await api.get<Paginated<User> | User[]>("/usuarios", { params })
    return data
  },

  getById: async (id: string) => {
    const { data } = await api.get<User>(`/usuarios/${id}`)
    return data
  },

  create: async (input: CreateUserPayload) => {
    const { data } = await api.post<User>("/usuarios", input)
    return data
  },

  update: async (id: string, input: UpdateUserPayload) => {
    const { data } = await api.patch<User>(`/usuarios/${id}`, input)
    return data
  },

  remove: async (id: string) => {
    await api.delete(`/usuarios/${id}`)
  },
}
