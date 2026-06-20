import { useState, useMemo } from "react"
import { motion } from "motion/react"
import { Search, ArrowUpDown } from "lucide-react"

import { useStock } from "./use-stock"
import { StockCard } from "./components/stock-card"
import { StockSummaryCards } from "./components/stock-summary-cards"
import { StockEditDialog } from "./components/stock-edit-dialog"
import type { StockItem } from "@/types/stock"
import { Button } from "@/shared/ui/button"
import { Input } from "@/shared/ui/input"
import { Skeleton } from "@/shared/ui/skeleton"
import { EmptyState } from "@/shared/components/empty-state"
import { ErrorState } from "@/shared/components/error-state"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu"
import { useAuth } from "@/context/auth-context"

type SortKey = "nome" | "maior" | "menor" | "recente"

const SORT_LABELS: Record<SortKey, string> = {
  nome: "Nome",
  maior: "Maior estoque",
  menor: "Menor estoque",
  recente: "Última atualização",
}

export function StockPage() {
  const { user } = useAuth()
  const canEdit = user?.cargo === "ADMINISTRADOR"

  const [search, setSearch] = useState("")
  const [sortKey, setSortKey] = useState<SortKey>("nome")
  const [editOpen, setEditOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<StockItem | null>(null)

  const { data, isLoading, isError, refetch } = useStock()

  const filtered = useMemo(() => {
    if (!data) return []
    let items = data
    if (search.trim()) {
      const term = search.toLowerCase()
      items = items.filter((i) => i.produto.nome.toLowerCase().includes(term))
    }
    return [...items].sort((a, b) => {
      switch (sortKey) {
        case "nome":
          return a.produto.nome.localeCompare(b.produto.nome, "pt-BR")
        case "maior":
          return b.quantidadeDisponivel - a.quantidadeDisponivel
        case "menor":
          return a.quantidadeDisponivel - b.quantidadeDisponivel
        case "recente":
          return (
            new Date(b.ultimaAtualizacao).getTime() - new Date(a.ultimaAtualizacao).getTime()
          )
        default:
          return 0
      }
    })
  }, [data, search, sortKey])

  function handleEdit(item: StockItem) {
    setEditingItem(item)
    setEditOpen(true)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="flex flex-col gap-6"
    >
      <div className="flex flex-col gap-1">
        <h2 className="font-heading text-xl font-semibold tracking-tight">
          Visualização de Estoque
        </h2>
        <p className="text-sm text-muted-foreground">
          Monitore o estado atual do inventário em tempo real.
        </p>
      </div>

      {/* Summary */}
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
      ) : data ? (
        <StockSummaryCards items={data} />
      ) : null}

      {/* Controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome do produto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="shrink-0 gap-2">
              <ArrowUpDown className="h-4 w-4" />
              Ordenar por: {SORT_LABELS[sortKey]}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {(Object.keys(SORT_LABELS) as SortKey[]).map((key) => (
              <DropdownMenuItem
                key={key}
                onSelect={() => setSortKey(key)}
                className={sortKey === key ? "text-primary" : ""}
              >
                {SORT_LABELS[key]}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Content */}
      {isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-80 rounded-xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Search}
          title="Nenhum item encontrado"
          description="Tente ajustar os filtros de pesquisa."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((item, index) => (
            <StockCard
              key={item.id}
              item={item}
              canEdit={canEdit}
              onEdit={handleEdit}
              index={index}
            />
          ))}
        </div>
      )}

      <StockEditDialog
        open={editOpen}
        onOpenChange={(open) => {
          setEditOpen(open)
          if (!open) setEditingItem(null)
        }}
        item={editingItem}
      />
    </motion.div>
  )
}
