import type { TipoMovimentacao } from "@/types/movement"
import type { BadgeProps } from "@/shared/ui/badge"

export const TIPO_LABEL: Record<TipoMovimentacao, string> = {
  ENTRADA: "Entrada",
  SAIDA: "Saída",
  AJUSTE: "Ajuste",
}

export const TIPO_BADGE_VARIANT: Record<TipoMovimentacao, NonNullable<BadgeProps["variant"]>> = {
  ENTRADA: "green",
  SAIDA: "red",
  AJUSTE: "yellow",
}

export const ORIGENS_BY_TIPO: Record<TipoMovimentacao, { value: string; label: string }[]> = {
  ENTRADA: [
    { value: "COMPRA", label: "Compra" },
    { value: "DEVOLUCAO", label: "Devolução" },
    { value: "TRANSFERENCIA", label: "Transferência" },
  ],
  SAIDA: [
    { value: "VENDA", label: "Venda" },
    { value: "DEVOLUCAO", label: "Devolução" },
    { value: "TRANSFERENCIA", label: "Transferência" },
  ],
  AJUSTE: [
    { value: "AJUSTE", label: "Ajuste" },
    { value: "PERDA", label: "Perda" },
    { value: "INVENTARIO", label: "Inventário" },
  ],
}

export const ORIGEM_LABEL: Record<string, string> = {
  COMPRA: "Compra",
  VENDA: "Venda",
  DEVOLUCAO: "Devolução",
  TRANSFERENCIA: "Transferência",
  AJUSTE: "Ajuste",
  PERDA: "Perda",
  INVENTARIO: "Inventário",
}

export const MAX_ITEMS = 4

export const PAGE_TITLE: Record<TipoMovimentacao, string> = {
  ENTRADA: "Entradas",
  SAIDA: "Saídas",
  AJUSTE: "Ajustes",
}

export const NEW_BUTTON_LABEL: Record<TipoMovimentacao, string> = {
  ENTRADA: "Nova Entrada",
  SAIDA: "Nova Saída",
  AJUSTE: "Novo Ajuste",
}
