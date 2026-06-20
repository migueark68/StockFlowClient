import { Loader as Loader2 } from "lucide-react"
import { motion } from "motion/react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/shared/ui/dialog"
import { Badge } from "@/shared/ui/badge"
import { Skeleton } from "@/shared/ui/skeleton"
import { useMovementDetail } from "../use-movements"
import {
  TIPO_LABEL,
  TIPO_BADGE_VARIANT,
  ORIGEM_LABEL,
} from "../movements.constants"
import { CARGO_LABEL, CARGO_BADGE_VARIANT } from "@/shared/utils/roles"
import { formatDate } from "@/lib/utils"

interface MovementDetailsDialogProps {
  movementId: number | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function MovementDetailsDialog({
  movementId,
  open,
  onOpenChange,
}: MovementDetailsDialogProps) {
  const { data: movement, isLoading } = useMovementDetail(open ? movementId : null)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90vh] flex-col sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Detalhes da Movimentação
            {movement && (
              <Badge variant={TIPO_BADGE_VARIANT[movement.tipoMovimentacao]}>
                {TIPO_LABEL[movement.tipoMovimentacao]}
              </Badge>
            )}
          </DialogTitle>
          <DialogDescription>
            {movement
              ? `Movimentação #${movement.id} — ${formatDate(movement.dataRegistro)}`
              : "Carregando informações..."}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex flex-col gap-4">
              <Skeleton className="h-28 rounded-xl" />
              <Skeleton className="h-24 rounded-xl" />
              <div className="grid gap-3 sm:grid-cols-2">
                <Skeleton className="h-32 rounded-xl" />
                <Skeleton className="h-32 rounded-xl" />
              </div>
            </div>
          ) : movement ? (
            <div className="flex flex-col gap-4">
              {/* General info */}
              <section>
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Informações Gerais
                </h3>
                <div className="rounded-xl border border-border bg-card p-4">
                  <dl className="grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3">
                    <div>
                      <dt className="text-xs text-muted-foreground">ID</dt>
                      <dd className="mt-0.5 text-sm font-medium">#{movement.id}</dd>
                    </div>
                    <div>
                      <dt className="text-xs text-muted-foreground">Tipo</dt>
                      <dd className="mt-0.5">
                        <Badge variant={TIPO_BADGE_VARIANT[movement.tipoMovimentacao]}>
                          {TIPO_LABEL[movement.tipoMovimentacao]}
                        </Badge>
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs text-muted-foreground">Origem</dt>
                      <dd className="mt-0.5 text-sm font-medium">
                        {ORIGEM_LABEL[movement.origemMovimentacao] ?? movement.origemMovimentacao}
                      </dd>
                    </div>
                    <div className="col-span-2 sm:col-span-3">
                      <dt className="text-xs text-muted-foreground">Data</dt>
                      <dd className="mt-0.5 text-sm font-medium">
                        {formatDate(movement.dataRegistro)}
                      </dd>
                    </div>
                    {movement.observacao && (
                      <div className="col-span-2 sm:col-span-3">
                        <dt className="text-xs text-muted-foreground">Observação</dt>
                        <dd className="mt-0.5 text-sm">{movement.observacao}</dd>
                      </div>
                    )}
                  </dl>
                </div>
              </section>

              {/* User */}
              <section>
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Usuário Responsável
                </h3>
                <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-4">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/15 text-sm font-bold text-primary">
                    {movement.usuario.nome.slice(0, 1).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{movement.usuario.nome}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {movement.usuario.email}
                    </p>
                  </div>
                  <Badge variant={CARGO_BADGE_VARIANT[movement.usuario.cargo]}>
                    {CARGO_LABEL[movement.usuario.cargo]}
                  </Badge>
                </div>
              </section>

              {/* Items */}
              <section>
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Itens ({movement.itens.length})
                </h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  {movement.itens.map((item, i) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-heading text-sm font-semibold leading-snug">
                          {item.produto.nome}
                        </p>
                        <span className="shrink-0 text-xs text-muted-foreground">
                          ID #{item.produto.id}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="rounded-lg bg-muted/40 px-3 py-2">
                          <span className="block text-[10px] uppercase tracking-wide text-muted-foreground">
                            Quantidade
                          </span>
                          <span className="text-base font-bold">
                            {item.quantidade.toLocaleString("pt-BR")}
                          </span>
                        </div>
                        <div className="rounded-lg bg-muted/40 px-3 py-2">
                          <span className="block text-[10px] uppercase tracking-wide text-muted-foreground">
                            Custo Unit.
                          </span>
                          <span className="text-base font-bold">
                            {new Intl.NumberFormat("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            }).format(item.custoUnitario)}
                          </span>
                        </div>
                        <div className="rounded-lg bg-muted/40 px-3 py-2">
                          <span className="block text-[10px] uppercase tracking-wide text-muted-foreground">
                            Estoque Mín.
                          </span>
                          <span className="font-semibold text-muted-foreground">
                            {item.produto.estoqueMinimo}
                          </span>
                        </div>
                        <div className="rounded-lg bg-muted/40 px-3 py-2">
                          <span className="block text-[10px] uppercase tracking-wide text-muted-foreground">
                            Estoque Máx.
                          </span>
                          <span className="font-semibold text-muted-foreground">
                            {item.produto.estoqueMaximo}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between border-t border-border pt-2">
                        <span className="text-xs text-muted-foreground">Custo Total</span>
                        <span className="font-heading text-sm font-bold text-primary">
                          {new Intl.NumberFormat("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          }).format(item.custoTotal)}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>
            </div>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  )
}
