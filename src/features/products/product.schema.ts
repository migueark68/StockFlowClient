import { z } from "zod"

export const productFormSchema = z.object({
  codigo: z.string().min(1, "Informe o código do produto"),
  nome: z.string().min(1, "Informe o nome do produto"),
  descricao: z.string().optional(),
  estoqueMinimo: z.coerce.number().min(1, "Estoque mínimo deve ser no mínimo 1"),
  estoqueMaximo: z.coerce.number().min(1, "Estoque máximo deve ser no mínimo 1"),
  categoriaId: z.coerce.number({ invalid_type_error: "Selecione uma categoria" }).min(1, "Selecione uma categoria"),
  ativo: z.boolean().default(true),
})

export type ProductFormValues = z.infer<typeof productFormSchema>
