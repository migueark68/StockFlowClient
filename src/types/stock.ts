export interface StockProduct {
  id: number
  nome: string
  estoqueMinimo: number
  estoqueMaximo: number
}

export interface StockItem {
  id: number
  quantidadeDisponivel: number
  quantidadeReservada: number
  produto: StockProduct
  ultimaAtualizacao: string
}

export interface UpdateStockPayload {
  quantidadeDisponivel: number
  quantidadeReservada: number
}
