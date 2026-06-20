import { api } from "@/services/api"
import type {
  Movement,
  MovementSummary,
  CreateMovementPayload,
  TipoMovimentacao,
} from "@/types/movement"

export const movementsService = {
  listSummary: async (tipo: TipoMovimentacao) => {
    const { data } = await api.get<MovementSummary[]>("/movimentacoes/resumo", {
      params: { tipo },
    })
    return data
  },

  listAllSummary: async () => {
    const { data } = await api.get<MovementSummary[]>("/movimentacoes/resumo")
    return data
  },

  getById: async (id: number) => {
    const { data } = await api.get<Movement>(`/movimentacoes/${id}`)
    return data
  },

  create: async (input: CreateMovementPayload) => {
    const { data } = await api.post<Movement>("/movimentacoes", input)
    return data
  },
}
