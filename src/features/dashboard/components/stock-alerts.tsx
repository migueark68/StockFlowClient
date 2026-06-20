import { motion } from "motion/react"
import { TriangleAlert as AlertTriangle, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card"
import { Badge } from "@/shared/ui/badge"
import { Skeleton } from "@/shared/ui/skeleton"
import { EmptyState } from "@/shared/components/empty-state"
import type { StockItem } from "@/types/stock"

interface StockLowListProps {
  items: StockItem[]
  isLoading: boolean
}

export function StockLowList({ items, isLoading }: StockLowListProps) {
  const critical = [...items]
    .filter((i) => i.quantidadeDisponivel <= i.produto.estoqueMinimo)
    .sort((a, b) => a.quantidadeDisponivel - b.quantidadeDisponivel)
    .slice(0, 5)

  return (
    <Card className="flex flex-col">
      <CardHeader className="flex flex-row items-center gap-2 pb-2">
        <div className="flex size-7 items-center justify-center rounded-lg bg-destructive/10">
          <AlertTriangle className="h-3.5 w-3.5 text-destructive" />
        </div>
        <CardTitle className="text-base">Estoque Baixo</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-2">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-12 rounded-lg" />
          ))
        ) : critical.length === 0 ? (
          <EmptyState
            icon={AlertTriangle}
            title="Nenhum produto crítico"
            description="Todos os produtos estão acima do estoque mínimo."
            className="py-8"
          />
        ) : (
          critical.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 px-3 py-2.5"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{item.produto.nome}</p>
                <p className="text-xs text-muted-foreground">
                  Mínimo: {item.produto.estoqueMinimo}
                </p>
              </div>
              <div className="text-right">
                <Badge variant="red">{item.quantidadeDisponivel}</Badge>
              </div>
            </motion.div>
          ))
        )}
      </CardContent>
    </Card>
  )
}

interface StockHighListProps {
  items: StockItem[]
  isLoading: boolean
}

export function StockHighList({ items, isLoading }: StockHighListProps) {
  const nearMax = [...items]
    .map((i) => ({
      ...i,
      pct: i.produto.estoqueMaximo > 0
        ? i.quantidadeDisponivel / i.produto.estoqueMaximo
        : 0,
    }))
    .filter((i) => i.pct > 0.9)
    .sort((a, b) => b.pct - a.pct)
    .slice(0, 5)

  return (
    <Card className="flex flex-col">
      <CardHeader className="flex flex-row items-center gap-2 pb-2">
        <div className="flex size-7 items-center justify-center rounded-lg bg-warning/10">
          <TrendingUp className="h-3.5 w-3.5 text-warning" />
        </div>
        <CardTitle className="text-base">Próximos do Máximo</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-2">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-12 rounded-lg" />
          ))
        ) : nearMax.length === 0 ? (
          <EmptyState
            icon={TrendingUp}
            title="Nenhum produto próximo do máximo"
            className="py-8"
          />
        ) : (
          nearMax.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 px-3 py-2.5"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{item.produto.nome}</p>
                <p className="text-xs text-muted-foreground">
                  Máximo: {item.produto.estoqueMaximo}
                </p>
              </div>
              <div className="text-right">
                <Badge variant="yellow">{Math.round(item.pct * 100)}%</Badge>
              </div>
            </motion.div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
