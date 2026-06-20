import { useState } from "react"
import { motion } from "motion/react"
import { Trash2, Check, ChevronsUpDown } from "lucide-react"
import { type UseFormReturn, useWatch } from "react-hook-form"

import { Button } from "@/shared/ui/button"
import { Input } from "@/shared/ui/input"
import { Label } from "@/shared/ui/label"
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
import type { MovementFormValues } from "../movement.schema"
import type { Product } from "@/types/product"

interface MovementItemCardProps {
  index: number
  form: UseFormReturn<MovementFormValues>
  products: Product[]
  canRemove: boolean
  onRemove: () => void
}

export function MovementItemCard({
  index,
  form,
  products,
  canRemove,
  onRemove,
}: MovementItemCardProps) {
  const [productOpen, setProductOpen] = useState(false)

  const { register, setValue, formState: { errors } } = form

  const produtoId = useWatch({ control: form.control, name: `itens.${index}.produtoId` })
  const quantidade = useWatch({ control: form.control, name: `itens.${index}.quantidade` })
  const custoUnitario = useWatch({ control: form.control, name: `itens.${index}.custoUnitario` })

  const selectedProduct = products.find((p) => p.id === Number(produtoId))

  const qty = Number(quantidade) || 0
  const cost = Number(custoUnitario) || 0
  const lineTotal = qty * cost

  const itemErrors = errors.itens?.[index]

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="relative rounded-xl border border-border bg-card p-4 shadow-sm"
    >
      <div className="absolute right-3 top-3">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={onRemove}
          disabled={!canRemove}
          className="text-muted-foreground hover:text-destructive disabled:opacity-30"
          aria-label="Remover item"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>

      <div className="grid gap-3 pr-8">
        {/* Product combobox */}
        <div className="grid gap-1.5">
          <Label className="text-xs text-muted-foreground">Produto</Label>
          <Popover open={productOpen} onOpenChange={setProductOpen}>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                role="combobox"
                aria-expanded={productOpen}
                className={cn(
                  "h-9 w-full justify-between text-sm",
                  !selectedProduct && "text-muted-foreground",
                )}
              >
                <span className="truncate">
                  {selectedProduct ? selectedProduct.nome : "Selecione um produto..."}
                </span>
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-72 p-0">
              <Command>
                <CommandInput placeholder="Buscar produto..." />
                <CommandList>
                  <CommandEmpty>Nenhum produto encontrado.</CommandEmpty>
                  <CommandGroup>
                    {products.map((p) => (
                      <CommandItem
                        key={p.id}
                        value={p.nome}
                        onSelect={() => {
                          setValue(`itens.${index}.produtoId`, p.id)
                          setProductOpen(false)
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            Number(produtoId) === p.id ? "opacity-100" : "opacity-0",
                          )}
                        />
                        <span className="truncate">{p.nome}</span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          {itemErrors?.produtoId && (
            <p className="text-xs text-destructive">{itemErrors.produtoId.message}</p>
          )}
        </div>

        {/* Qty + cost */}
        <div className="grid grid-cols-2 gap-3">
          <div className="grid gap-1.5">
            <Label htmlFor={`itens.${index}.quantidade`} className="text-xs text-muted-foreground">
              Quantidade
            </Label>
            <Input
              id={`itens.${index}.quantidade`}
              type="number"
              min={1}
              placeholder="0"
              className="h-9 text-sm"
              {...register(`itens.${index}.quantidade`)}
            />
            {itemErrors?.quantidade && (
              <p className="text-xs text-destructive">{itemErrors.quantidade.message}</p>
            )}
          </div>
          <div className="grid gap-1.5">
            <Label
              htmlFor={`itens.${index}.custoUnitario`}
              className="text-xs text-muted-foreground"
            >
              Custo Unitário
            </Label>
            <Input
              id={`itens.${index}.custoUnitario`}
              type="number"
              min={0}
              step="0.01"
              placeholder="0,00"
              className="h-9 text-sm"
              {...register(`itens.${index}.custoUnitario`)}
            />
            {itemErrors?.custoUnitario && (
              <p className="text-xs text-destructive">{itemErrors.custoUnitario.message}</p>
            )}
          </div>
        </div>

        {/* Line total */}
        {lineTotal > 0 && (
          <p className="text-right text-xs text-muted-foreground">
            Subtotal:{" "}
            <span className="font-semibold text-foreground">
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(lineTotal)}
            </span>
          </p>
        )}
      </div>
    </motion.div>
  )
}
