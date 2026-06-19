export type Cargo = "ADMINISTRADOR" | "GERENTE" | "SUPERVISOR" | "ENCARREGADO"

export interface AuthUser {
  id: number
  nome: string
  email: string
  cargo: Cargo
}

export interface LoginRequest {
  login: string
  senha: string
}

export interface LoginResponse {
  accessToken: string
  tokenType: string
  expiresIn: number
  usuario: AuthUser
}
