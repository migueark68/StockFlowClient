import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Loader as Loader2 } from "lucide-react"
import { useUpdateStock } from "../use-stock"
import type { StockItem } from "@/types/stock"
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

const schema = z.object({
  quantidadeDisponivel: z.coerce.number().min(0, "Valor deve ser maior ou igual a 0"),
  quantidadeReservada: z.coerce.number().min(0, "Valor deve ser maior ou igual a 0"),
})

type FormValues = z.infer<typeof schema>

interface StockEditDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  item: StockItem | null
}

export function StockEditDialog({ open, onOpenChange, item }: StockEditDialogProps) {
  const updateMutation = useUpdateStock()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { quantidadeDisponivel: 0, quantidadeReservada: 0 },
  })

  useEffect(() => {
    if (open && item) {
      reset({
        quantidadeDisponivel: item.quantidadeDisponivel,
        quantidadeReservada: item.quantidadeReservada,
      })
    }
  }, [open, item, reset])

  const onSubmit = (values: FormValues) => {
    if (!item) return
    updateMutation.mutate(
      { id: item.id, input: values },
      { onSuccess: () => onOpenChange(false) },
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Estoque</DialogTitle>
          <DialogDescription>
            Atualize as quantidades do produto{" "}
            <strong>{item?.produto.nome}</strong>.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4" noValidate>
          <div className="grid gap-2">
            <Label htmlFor="quantidadeDisponivel">Quantidade Disponível</Label>
            <Input
              id="quantidadeDisponivel"
              type="number"
              min={0}
              {...register("quantidadeDisponivel")}
              aria-invalid={!!errors.quantidadeDisponivel}
            />
            {errors.quantidadeDisponivel && (
              <p className="text-xs text-destructive">{errors.quantidadeDisponivel.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="quantidadeReservada">Quantidade Reservada</Label>
            <Input
              id="quantidadeReservada"
              type="number"
              min={0}
              {...register("quantidadeReservada")}
              aria-invalid={!!errors.quantidadeReservada}
            />
            {errors.quantidadeReservada && (
              <p className="text-xs text-destructive">{errors.quantidadeReservada.message}</p>
            )}
          </div>

          <DialogFooter className="mt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={updateMutation.isPending}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={updateMutation.isPending}>
              {updateMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              Salvar alterações
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
