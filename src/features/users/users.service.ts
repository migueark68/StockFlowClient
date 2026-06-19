import { api } from "@/services/api"
import type { Paginated } from "@/types/api"
import type { CreateUserInput, UpdateUserInput, User } from "@/types/user"

export interface ListUsersParams {
  search?: string
  role?: string
  page?: number
  pageSize?: number
}

export const usersService = {
  list: async (params: ListUsersParams = {}) => {
    const { data } = await api.get<Paginated<User> | User[]>("/users", { params })
    return data
  },

  getById: async (id: string) => {
    const { data } = await api.get<User>(`/users/${id}`)
    return data
  },

  create: async (input: CreateUserInput) => {
    const { data } = await api.post<User>("/users", input)
    return data
  },

  update: async (id: string, input: UpdateUserInput) => {
    const { data } = await api.put<User>(`/users/${id}`, input)
    return data
  },

  remove: async (id: string) => {
    await api.delete(`/users/${id}`)
  },
}
