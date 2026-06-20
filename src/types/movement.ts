import type { Cargo } from "./auth"

export type TipoMovimentacao = "ENTRADA" | "SAIDA" | "AJUSTE"

export interface MovementUser {
  id: number
  nome: string
  email: string
  cargo: Cargo
}

export interface MovementSummary {
  id: number
  tipoMovimentacao: TipoMovimentacao
  origemMovimentacao: string
  usuario: MovementUser
  dataRegistro: string
}

export interface MovementItem {
  id: number
  produto: {
    id: number
    nome: string
    estoqueMinimo: number
    estoqueMaximo: number
  }
  quantidade: number
  custoUnitario: number
  custoTotal: number
}

export interface Movement {
  id: number
  tipoMovimentacao: TipoMovimentacao
  origemMovimentacao: string
  observacao: string
  usuario: MovementUser
  dataRegistro: string
  itens: MovementItem[]
}

export interface CreateMovementPayload {
  tipoMovimentacao: TipoMovimentacao
  origemMovimentacao: string
  observacao?: string
  itens: {
    produtoId: number
    quantidade: number
    custoUnitario: number
  }[]
}
