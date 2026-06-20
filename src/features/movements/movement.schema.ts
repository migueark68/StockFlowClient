import { z } from "zod"

export const movementItemSchema = z.object({
  produtoId: z.coerce.number().min(1, "Selecione um produto"),
  quantidade: z.coerce.number().min(1, "Quantidade deve ser no mínimo 1"),
  custoUnitario: z.coerce.number().min(0, "Custo deve ser maior ou igual a 0"),
})

export const movementFormSchema = z.object({
  origemMovimentacao: z.string().min(1, "Selecione a origem"),
  observacao: z.string().optional(),
  itens: z
    .array(movementItemSchema)
    .min(1, "Adicione ao menos um item"),
})

export type MovementItemFormValues = z.infer<typeof movementItemSchema>
export type MovementFormValues = z.infer<typeof movementFormSchema>
