import { useEffect, useMemo } from "react"
import { useForm, useFieldArray, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { AnimatePresence } from "motion/react"
import { Loader as Loader2, Package } from "lucide-react"

import { movementFormSchema, type MovementFormValues } from "../movement.schema"
import { useCreateMovement } from "../use-movements"
import { ORIGENS_BY_TIPO, TIPO_LABEL, MAX_ITEMS } from "../movements.constants"
import { MovementItemCard } from "./movement-item-card"
import { MovementAddPlaceholder } from "./movement-add-placeholder"
import { useProducts } from "@/features/products/use-products"
import type { TipoMovimentacao } from "@/types/movement"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog"
import { Button } from "@/shared/ui/button"
import { Input } from "@/shared/ui/input"
import { Label } from "@/shared/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select"
import { Badge } from "@/shared/ui/badge"
import { TIPO_BADGE_VARIANT } from "../movements.constants"

interface MovementCreateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  tipo: TipoMovimentacao
}

export function MovementCreateDialog({ open, onOpenChange, tipo }: MovementCreateDialogProps) {
  const createMutation = useCreateMovement()
  const { data: productsData } = useProducts({})
  const activeProducts = useMemo(
    () => (productsData ?? []).filter((p) => p.ativo),
    [productsData],
  )

  const form = useForm<MovementFormValues>({
    resolver: zodResolver(movementFormSchema),
    defaultValues: {
      origemMovimentacao: "",
      observacao: "",
      itens: [{ produtoId: 0, quantidade: 1, custoUnitario: 0 }],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "itens",
  })

  useEffect(() => {
    if (open) {
      form.reset({
        origemMovimentacao: "",
        observacao: "",
        itens: [{ produtoId: 0, quantidade: 1, custoUnitario: 0 }],
      })
    }
  }, [open, form])

  const itens = useWatch({ control: form.control, name: "itens" })

  const totalQty = useMemo(
    () => itens.reduce((acc, i) => acc + (Number(i.quantidade) || 0), 0),
    [itens],
  )
  const totalValue = useMemo(
    () =>
      itens.reduce(
        (acc, i) => acc + (Number(i.quantidade) || 0) * (Number(i.custoUnitario) || 0),
        0,
      ),
    [itens],
  )

  const onSubmit = (values: MovementFormValues) => {
    createMutation.mutate(
      {
        tipoMovimentacao: tipo,
        origemMovimentacao: values.origemMovimentacao,
        observacao: values.observacao || undefined,
        itens: values.itens.map((i) => ({
          produtoId: Number(i.produtoId),
          quantidade: Number(i.quantidade),
          custoUnitario: Number(i.custoUnitario),
        })),
      },
      { onSuccess: () => onOpenChange(false) },
    )
  }

  const origemOptions = ORIGENS_BY_TIPO[tipo]
  const origem = form.watch("origemMovimentacao")

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90vh] flex-col sm:max-w-2xl">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <DialogTitle>Nova Movimentação</DialogTitle>
            <Badge variant={TIPO_BADGE_VARIANT[tipo]}>{TIPO_LABEL[tipo]}</Badge>
          </div>
          <DialogDescription>
            Preencha os dados e adicione os produtos desta movimentação.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex min-h-0 flex-1 flex-col gap-5"
          noValidate
        >
          <div className="flex-1 overflow-y-auto pr-1">
            {/* Header fields */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="origemMovimentacao">Origem</Label>
                <Select
                  value={origem}
                  onValueChange={(v) => form.setValue("origemMovimentacao", v)}
                >
                  <SelectTrigger id="origemMovimentacao">
                    <SelectValue placeholder="Selecione a origem" />
                  </SelectTrigger>
                  <SelectContent>
                    {origemOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.origemMovimentacao && (
                  <p className="text-xs text-destructive">
                    {form.formState.errors.origemMovimentacao.message}
                  </p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="observacao">Observação</Label>
                <Input
                  id="observacao"
                  placeholder="Opcional"
                  {...form.register("observacao")}
                />
              </div>
            </div>

            {/* Items section */}
            <div className="mt-5">
              <div className="mb-3 flex items-center gap-2">
                <Package className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">
                  Produtos ({fields.length}/{MAX_ITEMS})
                </span>
              </div>

              <div className="flex flex-col gap-3">
                <AnimatePresence mode="popLayout">
                  {fields.map((field, index) => (
                    <MovementItemCard
                      key={field.id}
                      index={index}
                      form={form}
                      products={activeProducts}
                      canRemove={fields.length > 1}
                      onRemove={() => remove(index)}
                    />
                  ))}

                  {fields.length < MAX_ITEMS && (
                    <MovementAddPlaceholder
                      key="placeholder"
                      onAdd={() =>
                        append({ produtoId: 0, quantidade: 1, custoUnitario: 0 })
                      }
                    />
                  )}
                </AnimatePresence>
              </div>

              {form.formState.errors.itens?.root && (
                <p className="mt-2 text-xs text-destructive">
                  {form.formState.errors.itens.root.message}
                </p>
              )}
            </div>
          </div>

          {/* Summary bar */}
          <div className="rounded-xl border border-border bg-muted/30 px-4 py-3">
            <div className="flex items-center justify-between gap-4 text-sm">
              <div className="flex items-center gap-4">
                <span className="text-muted-foreground">
                  Qtd. Total:{" "}
                  <strong className="text-foreground">{totalQty.toLocaleString("pt-BR")}</strong>
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs text-muted-foreground">Valor Total</span>
                <p className="font-heading text-lg font-bold text-primary">
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(totalValue)}
                </p>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={createMutation.isPending}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              Registrar Movimentação
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
