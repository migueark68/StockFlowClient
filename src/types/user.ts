import type { Cargo } from "./auth"

export interface User {
  id: number
  nome: string
  email: string
  login: string
  cargo: Cargo
  ativo: boolean
  criadoEm: string
  atualizadoEm: string
}

export interface CreateUserPayload {
  nome: string
  email: string
  login: string
  senha: string
  cargo: Cargo
}

export interface UpdateUserPayload {
  nome?: string
  email?: string
  login?: string
  cargo?: Cargo
  ativo?: boolean
}
