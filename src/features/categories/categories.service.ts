import { api } from "@/services/api"
import type { CreateCategoryPayload, UpdateCategoryPayload, Category } from "@/types/category"

export interface ListCategoriesParams {
  search?: string
  page?: number
  pageSize?: number
}

export const categoriesService = {
  list: async (params: ListCategoriesParams = {}) => {
    const { data } = await api.get<Category[]>("/categorias", { params })
    return data
  },

  getById: async (id: string) => {
    const { data } = await api.get<Category>(`/categorias/${id}`)
    return data
  },

  create: async (input: CreateCategoryPayload) => {
    const { data } = await api.post<Category>("/categorias", input)
    return data
  },

  update: async (id: string, input: UpdateCategoryPayload) => {
    const { data } = await api.patch<Category>(`/categorias/${id}`, input)
    return data
  },

  remove: async (id: string) => {
    await api.delete(`/categorias/${id}`)
  },
}
