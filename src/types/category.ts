export interface Category {
  id: number
  nome: string
  descricao: string
  dataCadastro: string
  ativo: boolean
}

export interface CreateCategoryPayload {
  nome: string
  descricao: string
}

export interface UpdateCategoryPayload {
  nome?: string
  descricao?: string
  ativo?: boolean
}
