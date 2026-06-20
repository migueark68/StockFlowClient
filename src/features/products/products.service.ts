import { api } from "@/services/api"
import type { CreateProductPayload, UpdateProductPayload, Product } from "@/types/product"

export interface ListProductsParams {
  search?: string
  page?: number
  pageSize?: number
}

export const productsService = {
  list: async (params: ListProductsParams = {}) => {
    const { data } = await api.get<Product[]>("/produtos", { params })
    return data
  },

  getById: async (id: string) => {
    const { data } = await api.get<Product>(`/produtos/${id}`)
    return data
  },

  create: async (input: CreateProductPayload) => {
    const { data } = await api.post<Product>("/produtos", input)
    return data
  },

  update: async (id: string, input: UpdateProductPayload) => {
    const { data } = await api.patch<Product>(`/produtos/${id}`, input)
    return data
  },

  remove: async (id: string) => {
    await api.delete(`/produtos/${id}`)
  },
}
