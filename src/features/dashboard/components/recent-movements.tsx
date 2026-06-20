import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card"
import { Badge } from "@/shared/ui/badge"
import { Skeleton } from "@/shared/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/ui/table"
import { EmptyState } from "@/shared/components/empty-state"
import { MovementDetailsDialog } from "@/features/movements/components/movement-details-dialog"
import {
  TIPO_LABEL,
  TIPO_BADGE_VARIANT,
  ORIGEM_LABEL,
} from "@/features/movements/movements.constants"
import { CARGO_LABEL, CARGO_BADGE_VARIANT } from "@/shared/utils/roles"
import { formatDate } from "@/lib/utils"
import { ClipboardList } from "lucide-react"
import type { MovementSummary } from "@/types/movement"

interface RecentMovementsProps {
  data: MovementSummary[]
  isLoading: boolean
}

export function RecentMovements({ data, isLoading }: RecentMovementsProps) {
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [selectedId, setSelectedId] = useState<number | null>(null)

  const recent = [...data]
    .sort(
      (a, b) =>
        new Date(b.dataRegistro).getTime() - new Date(a.dataRegistro).getTime(),
    )
    .slice(0, 10)

  function handleRowClick(id: number) {
    setSelectedId(id)
    setDetailsOpen(true)
  }

  const STUB_COLUMNS = 5

  return (
    <>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Últimas Movimentações</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Origem</TableHead>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Cargo</TableHead>
                  <TableHead>Data</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      {Array.from({ length: STUB_COLUMNS }).map((_, ci) => (
                        <TableCell key={ci}>
                          <Skeleton className="h-4 w-full" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : recent.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={STUB_COLUMNS} className="h-40">
                      <EmptyState
                        icon={ClipboardList}
                        title="Nenhuma movimentação registrada"
                        className="py-8"
                      />
                    </TableCell>
                  </TableRow>
                ) : (
                  recent.map((m) => (
                    <TableRow
                      key={m.id}
                      className="cursor-pointer"
                      onClick={() => handleRowClick(m.id)}
                    >
                      <TableCell>
                        <Badge variant={TIPO_BADGE_VARIANT[m.tipoMovimentacao]}>
                          {TIPO_LABEL[m.tipoMovimentacao]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {ORIGEM_LABEL[m.origemMovimentacao] ?? m.origemMovimentacao}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{m.usuario.nome}</span>
                          <span className="text-xs text-muted-foreground">
                            {m.usuario.email}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={CARGO_BADGE_VARIANT[m.usuario.cargo]}>
                          {CARGO_LABEL[m.usuario.cargo]}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDate(m.dataRegistro)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <MovementDetailsDialog
        movementId={selectedId}
        open={detailsOpen}
        onOpenChange={(open) => {
          setDetailsOpen(open)
          if (!open) setSelectedId(null)
        }}
      />
    </>
  )
}
