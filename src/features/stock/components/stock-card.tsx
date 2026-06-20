import { useState } from "react"
import { motion } from "motion/react"
import { Pencil, Clock, TrendingUp } from "lucide-react"
import { Badge } from "@/shared/ui/badge"
import { Button } from "@/shared/ui/button"
import { Input } from "@/shared/ui/input"
import { Label } from "@/shared/ui/label"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/ui/tooltip"
import { formatDate } from "@/lib/utils"
import type { StockItem } from "@/types/stock"

function getStockStatus(available: number, min: number): {
  label: string
  variant: "green" | "yellow" | "red"
} {
  if (available <= min) return { label: "Estoque Baixo", variant: "red" }
  if (available <= min * 1.2) return { label: "Atenção", variant: "yellow" }
  return { label: "Normal", variant: "green" }
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value)
}

interface StockCardProps {
  item: StockItem
  canEdit: boolean
  onEdit: (item: StockItem) => void
  index: number
}

export function StockCard({ item, canEdit, onEdit, index }: StockCardProps) {
  const [unitPrice, setUnitPrice] = useState("")

  const { produto, quantidadeDisponivel, quantidadeReservada, ultimaAtualizacao } = item
  const { estoqueMinimo, estoqueMaximo, nome } = produto

  const status = getStockStatus(quantidadeDisponivel, estoqueMinimo)
  const utilizationPct = Math.min(
    Math.round((quantidadeDisponivel / Math.max(estoqueMaximo, 1)) * 100),
    100,
  )

  const parsedPrice = parseFloat(unitPrice.replace(",", "."))
  const potentialValue =
    !isNaN(parsedPrice) && parsedPrice > 0 ? parsedPrice * quantidadeDisponivel : null

  const barColor =
    status.variant === "red"
      ? "bg-destructive"
      : status.variant === "yellow"
        ? "bg-warning"
        : "bg-success"

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut", delay: index * 0.04 }}
      className="group flex flex-col rounded-xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md hover:shadow-black/20"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <h3 className="font-heading truncate text-sm font-semibold leading-snug">{nome}</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">ID #{produto.id}</p>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          <Badge variant={status.variant}>{status.label}</Badge>
          {canEdit && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => onEdit(item)}
                  aria-label="Editar estoque"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Editar estoque</TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-4">
        <div className="mb-1.5 flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Utilização do estoque</span>
          <span className="text-xs font-medium">{utilizationPct}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
          <motion.div
            className={`h-full rounded-full ${barColor}`}
            initial={{ width: 0 }}
            animate={{ width: `${utilizationPct}%` }}
            transition={{ duration: 0.6, ease: "easeOut", delay: index * 0.04 + 0.1 }}
          />
        </div>
      </div>

      {/* Stats grid */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-0.5 rounded-lg bg-muted/40 px-3 py-2.5">
          <span className="text-[11px] uppercase tracking-wide text-muted-foreground">
            Disponível
          </span>
          <span className="text-lg font-bold tabular-nums text-foreground">
            {quantidadeDisponivel.toLocaleString("pt-BR")}
          </span>
        </div>
        <div className="flex flex-col gap-0.5 rounded-lg bg-muted/40 px-3 py-2.5">
          <span className="text-[11px] uppercase tracking-wide text-muted-foreground">
            Reservado
          </span>
          <span className="text-lg font-bold tabular-nums text-foreground">
            {quantidadeReservada.toLocaleString("pt-BR")}
          </span>
        </div>
        <div className="flex flex-col gap-0.5 rounded-lg bg-muted/40 px-3 py-2.5">
          <span className="text-[11px] uppercase tracking-wide text-muted-foreground">
            Mínimo
          </span>
          <span className="text-base font-semibold tabular-nums text-muted-foreground">
            {estoqueMinimo.toLocaleString("pt-BR")}
          </span>
        </div>
        <div className="flex flex-col gap-0.5 rounded-lg bg-muted/40 px-3 py-2.5">
          <span className="text-[11px] uppercase tracking-wide text-muted-foreground">
            Máximo
          </span>
          <span className="text-base font-semibold tabular-nums text-muted-foreground">
            {estoqueMaximo.toLocaleString("pt-BR")}
          </span>
        </div>
      </div>

      {/* Local price estimator */}
      <div className="mt-4 rounded-lg border border-border bg-accent/40 p-3">
        <div className="flex items-center gap-1.5">
          <TrendingUp className="h-3.5 w-3.5 text-primary" />
          <Label className="text-[11px] uppercase tracking-wide text-muted-foreground">
            Preço Unitário de Venda
          </Label>
        </div>
        <Input
          className="mt-2 h-8 text-sm"
          placeholder="Ex: 18,50"
          value={unitPrice}
          onChange={(e) => setUnitPrice(e.target.value)}
          type="text"
          inputMode="decimal"
        />
        {potentialValue !== null && (
          <div className="mt-2.5">
            <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
              Valor Potencial em Estoque
            </p>
            <p className="mt-0.5 font-heading text-xl font-bold text-primary">
              {formatCurrency(potentialValue)}
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-auto flex items-center gap-1.5 pt-3">
        <Clock className="h-3 w-3 shrink-0 text-muted-foreground/60" />
        <span className="text-[11px] text-muted-foreground/60">
          {formatDate(ultimaAtualizacao)}
        </span>
      </div>
    </motion.div>
  )
}
