import { api } from "@/services/api"
import type { StockItem, UpdateStockPayload } from "@/types/stock"

export const stockService = {
  list: async () => {
    const { data } = await api.get<StockItem[]>("/estoques")
    return data
  },

  getById: async (id: number) => {
    const { data } = await api.get<StockItem>(`/estoques/${id}`)
    return data
  },

  update: async (id: number, input: UpdateStockPayload) => {
    const { data } = await api.patch<StockItem>(`/estoques/${id}`, input)
    return data
  },
}
