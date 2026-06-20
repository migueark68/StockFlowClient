import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader as Loader2 } from "lucide-react"
import { categoryFormSchema, type CategoryFormValues } from "../category.schema"
import { useCreateCategory, useUpdateCategory } from "../use-categories"
import type { Category } from "@/types/category"
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
import { Switch } from "@/shared/ui/switch"

interface CategoryFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  category?: Category | null
}

export function CategoryFormDialog({ open, onOpenChange, category }: CategoryFormDialogProps) {
  const isEdit = Boolean(category)
  const createMutation = useCreateCategory()
  const updateMutation = useUpdateCategory()
  const isPending = createMutation.isPending || updateMutation.isPending

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      nome: "",
      descricao: "",
      ativo: true,
    },
  })

  useEffect(() => {
    if (open) {
      reset({
        nome: category?.nome ?? "",
        descricao: category?.descricao ?? "",
        ativo: category?.ativo ?? true,
      })
    }
  }, [open, category, reset])

  const ativo = watch("ativo")

  const onSubmit = (values: CategoryFormValues) => {
    if (isEdit && category) {
      const payload = {
        nome: values.nome,
        descricao: values.descricao,
        ativo: values.ativo,
      }
      updateMutation.mutate(
        { id: String(category.id), input: payload },
        { onSuccess: () => onOpenChange(false) },
      )
    } else {
      createMutation.mutate(
        { nome: values.nome, descricao: values.descricao },
        { onSuccess: () => onOpenChange(false) },
      )
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Editar categoria" : "Nova categoria"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Atualize os dados da categoria."
              : "Preencha os dados para cadastrar uma nova categoria."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4" noValidate>
          <div className="grid gap-2">
            <Label htmlFor="nome">Nome</Label>
            <Input id="nome" placeholder="Ex: Eletrônicos" {...register("nome")} aria-invalid={!!errors.nome} />
            {errors.nome && <p className="text-xs text-destructive">{errors.nome.message}</p>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="descricao">Descrição</Label>
            <Input
              id="descricao"
              placeholder="Ex: Produtos eletrônicos em geral"
              {...register("descricao")}
              aria-invalid={!!errors.descricao}
            />
            {errors.descricao && <p className="text-xs text-destructive">{errors.descricao.message}</p>}
          </div>

          {isEdit && (
            <div className="flex items-center gap-3">
              <Switch id="ativo" checked={ativo} onCheckedChange={(v) => setValue("ativo", v)} />
              <Label htmlFor="ativo" className="cursor-pointer">
                {ativo ? "Ativo" : "Inativo"}
              </Label>
            </div>
          )}

          <DialogFooter className="mt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              {isEdit ? "Salvar alterações" : "Criar categoria"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
