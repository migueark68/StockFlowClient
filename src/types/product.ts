export interface ProductCategory {
  id: number
  nome: string
}

export interface Product {
  id: number
  codigo: string
  nome: string
  descricao: string
  estoqueMinimo: number
  estoqueMaximo: number
  categoria: ProductCategory
  dataCadastro: string
  ativo: boolean
}

export interface CreateProductPayload {
  codigo: string
  nome: string
  descricao: string
  estoqueMinimo: number
  estoqueMaximo: number
  categoriaId: number
}

export interface UpdateProductPayload {
  codigo?: string
  nome?: string
  descricao?: string
  estoqueMinimo?: number
  estoqueMaximo?: number
  categoriaId?: number
  ativo?: boolean
}
