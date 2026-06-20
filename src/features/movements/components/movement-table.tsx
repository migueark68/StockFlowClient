import { useMemo, useState } from "react"
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  type SortingState,
  type ColumnDef,
} from "@tanstack/react-table"
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Eye,
} from "lucide-react"

import { Button } from "@/shared/ui/button"
import { Badge } from "@/shared/ui/badge"
import { Skeleton } from "@/shared/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/ui/table"
import { CARGO_LABEL, CARGO_BADGE_VARIANT } from "@/shared/utils/roles"
import { TIPO_LABEL, TIPO_BADGE_VARIANT, ORIGEM_LABEL } from "../movements.constants"
import { formatDate } from "@/lib/utils"
import type { MovementSummary } from "@/types/movement"

interface MovementTableProps {
  data: MovementSummary[]
  isLoading: boolean
  onViewDetails: (id: number) => void
}

export function MovementTable({ data, isLoading, onViewDetails }: MovementTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 })

  const columns = useMemo<ColumnDef<MovementSummary>[]>(
    () => [
      {
        accessorKey: "id",
        header: "ID",
        size: 70,
        cell: ({ row }) => (
          <span className="text-muted-foreground">#{row.original.id}</span>
        ),
      },
      {
        accessorKey: "tipoMovimentacao",
        header: "Tipo",
        size: 100,
        cell: ({ row }) => (
          <Badge variant={TIPO_BADGE_VARIANT[row.original.tipoMovimentacao]}>
            {TIPO_LABEL[row.original.tipoMovimentacao]}
          </Badge>
        ),
      },
      {
        accessorKey: "origemMovimentacao",
        header: "Origem",
        size: 130,
        cell: ({ row }) => (
          <span>
            {ORIGEM_LABEL[row.original.origemMovimentacao] ?? row.original.origemMovimentacao}
          </span>
        ),
      },
      {
        accessorKey: "usuario",
        header: "Usuário",
        size: 200,
        cell: ({ row }) => (
          <div className="flex flex-col">
            <span className="font-medium">{row.original.usuario.nome}</span>
            <span className="text-xs text-muted-foreground">{row.original.usuario.email}</span>
          </div>
        ),
      },
      {
        id: "cargo",
        header: "Cargo",
        size: 130,
        cell: ({ row }) => (
          <Badge variant={CARGO_BADGE_VARIANT[row.original.usuario.cargo]}>
            {CARGO_LABEL[row.original.usuario.cargo]}
          </Badge>
        ),
      },
      {
        accessorKey: "dataRegistro",
        header: "Data",
        size: 170,
        cell: ({ row }) => formatDate(row.original.dataRegistro),
      },
      {
        id: "acoes",
        header: "",
        size: 80,
        cell: ({ row }) => (
          <div className="flex items-center justify-end">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={(e) => {
                e.stopPropagation()
                onViewDetails(row.original.id)
              }}
              aria-label="Ver detalhes"
            >
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        ),
      },
    ],
    [onViewDetails],
  )

  const table = useReactTable({
    data,
    columns,
    state: { sorting, pagination },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  const total = data.length

  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    style={{ width: header.getSize() }}
                    className={header.column.getCanSort() ? "cursor-pointer select-none" : ""}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div className="flex items-center gap-1">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getCanSort() && (
                        <span className="inline-flex">
                          {header.column.getIsSorted() === "asc" ? (
                            <ArrowUp className="h-3.5 w-3.5" />
                          ) : header.column.getIsSorted() === "desc" ? (
                            <ArrowDown className="h-3.5 w-3.5" />
                          ) : (
                            <ArrowUpDown className="h-3.5 w-3.5 opacity-40" />
                          )}
                        </span>
                      )}
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {columns.map((_, ci) => (
                    <TableCell key={ci}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="cursor-pointer"
                  onClick={() => onViewDetails(row.original.id)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between border-t border-border px-4 py-3">
        <div className="text-sm text-muted-foreground">
          {!isLoading && total > 0 && (
            <span>
              Mostrando{" "}
              <strong>{pagination.pageIndex * pagination.pageSize + 1}</strong> –{" "}
              <strong>
                {Math.min((pagination.pageIndex + 1) * pagination.pageSize, total)}
              </strong>{" "}
              de <strong>{total}</strong> resultados
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
            aria-label="Primeira página"
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            aria-label="Página anterior"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="px-2 text-sm text-muted-foreground">
            Página {pagination.pageIndex + 1} de {table.getPageCount() || 1}
          </span>
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            aria-label="Próxima página"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
            aria-label="Última página"
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
