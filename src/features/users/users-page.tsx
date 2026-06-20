import { useState, useMemo } from "react"
import { motion } from "motion/react"
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  type SortingState,
  type ColumnDef,
} from "@tanstack/react-table"
import { Search, Plus, Pencil, Trash2, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"

import { useUsers } from "./use-users"
import { UserFormDialog } from "./components/user-form-dialog"
import { UserDeleteDialog } from "./components/user-delete-dialog"
import type { User } from "@/types/user"
import { Button } from "@/shared/ui/button"
import { Input } from "@/shared/ui/input"
import { Badge } from "@/shared/ui/badge"
import { Skeleton } from "@/shared/ui/skeleton"
import { EmptyState } from "@/shared/components/empty-state"
import { ErrorState } from "@/shared/components/error-state"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/ui/table"
import { CARGO_LABEL, CARGO_BADGE_VARIANT } from "@/shared/utils/roles"
import { formatDate } from "@/lib/utils"
import { useAuth } from "@/context/auth-context"

export function UsersPage() {
  const { user: authUser } = useAuth()
  const canManageUsers = authUser?.cargo === "ADMINISTRADOR"

  const [search, setSearch] = useState("")
  const [sorting, setSorting] = useState<SortingState>([])
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 })
  const [formOpen, setFormOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deletingUser, setDeletingUser] = useState<User | null>(null)

  const { data, isLoading, isError, refetch } = useUsers({ search, page: pagination.pageIndex + 1, pageSize: pagination.pageSize })

  const columns = useMemo<ColumnDef<User>[]>(
    () => [
      {
        accessorKey: "id",
        header: "ID",
        size: 60,
        cell: ({ row }) => <span className="text-muted-foreground">{row.original.id}</span>,
      },
      {
        accessorKey: "nome",
        header: "Nome",
        size: 220,
        cell: ({ row }) => (
          <div className="flex flex-col">
            <span className="font-medium">{row.original.nome}</span>
            <span className="text-xs text-muted-foreground">{row.original.email}</span>
          </div>
        ),
      },
      {
        accessorKey: "login",
        header: "Login",
        size: 140,
      },
      {
        accessorKey: "cargo",
        header: "Cargo",
        size: 140,
        cell: ({ row }) => (
          <Badge variant={CARGO_BADGE_VARIANT[row.original.cargo]}>
            {CARGO_LABEL[row.original.cargo]}
          </Badge>
        ),
      },
      {
        accessorKey: "ativo",
        header: "Status",
        size: 100,
        cell: ({ row }) => (
          <Badge variant={row.original.ativo ? "green" : "gray"}>
            {row.original.ativo ? "Ativo" : "Inativo"}
          </Badge>
        ),
      },
      {
        accessorKey: "criadoEm",
        header: "Criado em",
        size: 150,
        cell: ({ row }) => formatDate(row.original.criadoEm),
      },
      {
        accessorKey: "atualizadoEm",
        header: "Atualizado em",
        size: 150,
        cell: ({ row }) => formatDate(row.original.atualizadoEm),
      },
      ...(canManageUsers
        ? [
            {
              id: "acoes",
              header: "",
              size: 100,
              cell: ({ row }: { row: { original: User } }) => (
                <div className="flex items-center justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => {
                      setEditingUser(row.original)
                      setFormOpen(true)
                    }}
                    aria-label="Editar"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => {
                      setDeletingUser(row.original)
                      setDeleteOpen(true)
                    }}
                    aria-label="Excluir"
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ),
            } as ColumnDef<User>,
          ]
        : []),
    ],
    [canManageUsers],
  )

  const table = useReactTable({
    data: data?.items ?? [],
    columns,
    state: { sorting, pagination },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    pageCount: data ? Math.ceil(data.total / pagination.pageSize) : -1,
  })

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="flex flex-col gap-6"
    >
      <div className="flex flex-col gap-1">
        <h2 className="font-heading text-xl font-semibold tracking-tight">Gerenciamento de Usuários</h2>
        <p className="text-sm text-muted-foreground">Gerencie todos os usuários cadastrados no sistema.</p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome, email ou login..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPagination((p) => ({ ...p, pageIndex: 0 }))
            }}
            className="pl-9"
          />
        </div>
        {canManageUsers && (
          <Button
            onClick={() => {
              setEditingUser(null)
              setFormOpen(true)
            }}
          >
            <Plus className="h-4 w-4" />
            Novo Usuário
          </Button>
        )}
      </div>

      {isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : (
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
                ) : table.getRowModel().rows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-64">
                      <EmptyState
                        icon={Search}
                        title="Nenhum usuário encontrado"
                        description="Tente ajustar os filtros ou adicione um novo usuário."
                        action={
                          canManageUsers ? (
                            <Button
                              onClick={() => {
                                setEditingUser(null)
                                setFormOpen(true)
                              }}
                            >
                              <Plus className="h-4 w-4" />
                              Novo Usuário
                            </Button>
                          ) : undefined
                        }
                      />
                    </TableCell>
                  </TableRow>
                ) : (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id}>
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
              {data ? (
                <span>
                  Mostrando <strong>{pagination.pageIndex * pagination.pageSize + 1}</strong> -{" "}
                  <strong>{Math.min((pagination.pageIndex + 1) * pagination.pageSize, data.total)}</strong> de{" "}
                  <strong>{data.total}</strong> resultados
                </span>
              ) : (
                <span>Carregando...</span>
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
                Página {pagination.pageIndex + 1} de {table.getPageCount()}
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
      )}

      {canManageUsers && (
        <>
          <UserFormDialog
            open={formOpen}
            onOpenChange={(open) => {
              setFormOpen(open)
              if (!open) setEditingUser(null)
            }}
            user={editingUser}
          />

          <UserDeleteDialog
            open={deleteOpen}
            onOpenChange={(open) => {
              setDeleteOpen(open)
              if (!open) setDeletingUser(null)
            }}
            user={deletingUser}
          />
        </>
      )}
    </motion.div>
  )
}
