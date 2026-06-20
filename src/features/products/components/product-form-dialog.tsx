import { useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader as Loader2, Check, ChevronsUpDown } from "lucide-react"
import { productFormSchema, type ProductFormValues } from "../product.schema"
import { useCreateProduct, useUpdateProduct } from "../use-products"
import { useCategories } from "@/features/categories/use-categories"
import type { Product } from "@/types/product"
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/ui/popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/shared/ui/command"
import { cn } from "@/lib/utils"

interface ProductFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  product?: Product | null
}

export function ProductFormDialog({ open, onOpenChange, product }: ProductFormDialogProps) {
  const isEdit = Boolean(product)
  const createMutation = useCreateProduct()
  const updateMutation = useUpdateProduct()
  const isPending = createMutation.isPending || updateMutation.isPending

  const { data: categoriesData } = useCategories({})
  const activeCategories = useMemo(() => (categoriesData ?? []).filter((c) => c.ativo), [categoriesData])

  const [categoryOpen, setCategoryOpen] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      codigo: "",
      nome: "",
      descricao: "",
      estoqueMinimo: 1,
      estoqueMaximo: 1,
      categoriaId: 0,
      ativo: true,
    },
  })

  useEffect(() => {
    if (open) {
      reset({
        codigo: product?.codigo ?? "",
        nome: product?.nome ?? "",
        descricao: product?.descricao ?? "",
        estoqueMinimo: product?.estoqueMinimo ?? 1,
        estoqueMaximo: product?.estoqueMaximo ?? 1,
        categoriaId: product?.categoria?.id ?? 0,
        ativo: product?.ativo ?? true,
      })
    }
  }, [open, product, reset])

  const ativo = watch("ativo")
  const categoriaId = watch("categoriaId")
  const selectedCategory = activeCategories.find((c) => c.id === Number(categoriaId))

  const onSubmit = (values: ProductFormValues) => {
    if (isEdit && product) {
      const payload = {
        codigo: values.codigo,
        nome: values.nome,
        descricao: values.descricao,
        estoqueMinimo: values.estoqueMinimo,
        estoqueMaximo: values.estoqueMaximo,
        categoriaId: values.categoriaId,
        ativo: values.ativo,
      }
      updateMutation.mutate(
        { id: String(product.id), input: payload },
        { onSuccess: () => onOpenChange(false) },
      )
    } else {
      createMutation.mutate(
        {
          codigo: values.codigo,
          nome: values.nome,
          descricao: values.descricao ?? "",
          estoqueMinimo: values.estoqueMinimo,
          estoqueMaximo: values.estoqueMaximo,
          categoriaId: values.categoriaId,
        },
        { onSuccess: () => onOpenChange(false) },
      )
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Editar produto" : "Novo produto"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Atualize os dados do produto."
              : "Preencha os dados para cadastrar um novo produto."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4" noValidate>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="codigo">Código</Label>
              <Input id="codigo" placeholder="PRD-001" {...register("codigo")} aria-invalid={!!errors.codigo} />
              {errors.codigo && <p className="text-xs text-destructive">{errors.codigo.message}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="nome">Nome</Label>
              <Input id="nome" placeholder="Ex: Notebook Dell" {...register("nome")} aria-invalid={!!errors.nome} />
              {errors.nome && <p className="text-xs text-destructive">{errors.nome.message}</p>}
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="descricao">Descrição</Label>
            <Input id="descricao" placeholder="Descrição do produto (opcional)" {...register("descricao")} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="estoqueMinimo">Estoque mínimo</Label>
              <Input
                id="estoqueMinimo"
                type="number"
                min={1}
                {...register("estoqueMinimo")}
                aria-invalid={!!errors.estoqueMinimo}
              />
              {errors.estoqueMinimo && <p className="text-xs text-destructive">{errors.estoqueMinimo.message}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="estoqueMaximo">Estoque máximo</Label>
              <Input
                id="estoqueMaximo"
                type="number"
                min={1}
                {...register("estoqueMaximo")}
                aria-invalid={!!errors.estoqueMaximo}
              />
              {errors.estoqueMaximo && <p className="text-xs text-destructive">{errors.estoqueMaximo.message}</p>}
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Categoria</Label>
            <Popover open={categoryOpen} onOpenChange={setCategoryOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={categoryOpen}
                  className="w-full justify-between"
                >
                  {selectedCategory ? selectedCategory.nome : "Selecione uma categoria..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput placeholder="Buscar categoria..." />
                  <CommandList>
                    <CommandEmpty>Nenhuma categoria encontrada.</CommandEmpty>
                    <CommandGroup>
                      {activeCategories.map((cat) => (
                        <CommandItem
                          key={cat.id}
                          value={cat.nome}
                          onSelect={() => {
                            setValue("categoriaId", cat.id)
                            setCategoryOpen(false)
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              Number(categoriaId) === cat.id ? "opacity-100" : "opacity-0",
                            )}
                          />
                          {cat.nome}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            {errors.categoriaId && <p className="text-xs text-destructive">{errors.categoriaId.message}</p>}
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
              {isEdit ? "Salvar alterações" : "Criar produto"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
