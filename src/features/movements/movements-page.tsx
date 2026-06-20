import { useState, useMemo } from "react"
import { motion } from "motion/react"
import { Search, Plus, Calendar } from "lucide-react"

import { useMovementsSummary } from "./use-movements"
import { MovementTable } from "./components/movement-table"
import { MovementDetailsDialog } from "./components/movement-details-dialog"
import { MovementCreateDialog } from "./components/movement-create-dialog"
import { PAGE_TITLE, NEW_BUTTON_LABEL, ORIGEM_LABEL } from "./movements.constants"
import type { TipoMovimentacao } from "@/types/movement"
import { Button } from "@/shared/ui/button"
import { Input } from "@/shared/ui/input"
import { EmptyState } from "@/shared/components/empty-state"
import { ErrorState } from "@/shared/components/error-state"
import { useAuth } from "@/context/auth-context"

interface MovementsPageProps {
  tipo: TipoMovimentacao
}

export function MovementsPage({ tipo }: MovementsPageProps) {
  const { user } = useAuth()
  const canCreate =
    user?.cargo === "GERENTE" ||
    user?.cargo === "SUPERVISOR" ||
    user?.cargo === "ENCARREGADO"

  const [search, setSearch] = useState("")
  const [dateFilter, setDateFilter] = useState("")
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [createOpen, setCreateOpen] = useState(false)

  const { data, isLoading, isError, refetch } = useMovementsSummary(tipo)

  const filtered = useMemo(() => {
    if (!data) return []
    let items = data
    if (search.trim()) {
      const term = search.toLowerCase()
      items = items.filter(
        (m) =>
          m.usuario.nome.toLowerCase().includes(term) ||
          (ORIGEM_LABEL[m.origemMovimentacao] ?? m.origemMovimentacao)
            .toLowerCase()
            .includes(term),
      )
    }
    if (dateFilter) {
      items = items.filter((m) => m.dataRegistro.startsWith(dateFilter))
    }
    return items
  }, [data, search, dateFilter])

  function handleViewDetails(id: number) {
    setSelectedId(id)
    setDetailsOpen(true)
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
          {PAGE_TITLE[tipo]}
        </h2>
        <p className="text-sm text-muted-foreground">
          Histórico de movimentações do tipo{" "}
          <span className="font-medium text-foreground">
            {PAGE_TITLE[tipo].toLowerCase()}
          </span>
          .
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative max-w-sm flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por usuário ou origem..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="relative">
            <Calendar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-44 pl-9"
              aria-label="Filtrar por data"
            />
          </div>
        </div>
        {canCreate && (
          <Button onClick={() => setCreateOpen(true)} className="shrink-0">
            <Plus className="h-4 w-4" />
            {NEW_BUTTON_LABEL[tipo]}
          </Button>
        )}
      </div>

      {/* Table / states */}
      {isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : !isLoading && filtered.length === 0 ? (
        <div className="rounded-xl border border-border bg-card">
          <EmptyState
            icon={Search}
            title="Nenhuma movimentação encontrada"
            description="Tente ajustar os filtros ou registre uma nova movimentação."
            action={
              canCreate ? (
                <Button onClick={() => setCreateOpen(true)}>
                  <Plus className="h-4 w-4" />
                  {NEW_BUTTON_LABEL[tipo]}
                </Button>
              ) : undefined
            }
          />
        </div>
      ) : (
        <MovementTable
          data={filtered}
          isLoading={isLoading}
          onViewDetails={handleViewDetails}
        />
      )}

      <MovementDetailsDialog
        movementId={selectedId}
        open={detailsOpen}
        onOpenChange={(open) => {
          setDetailsOpen(open)
          if (!open) setSelectedId(null)
        }}
      />

      <MovementCreateDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        tipo={tipo}
      />
    </motion.div>
  )
}
