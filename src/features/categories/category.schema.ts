import { z } from "zod"

export const categoryFormSchema = z.object({
  nome: z.string().min(1, "Informe o nome da categoria"),
  descricao: z.string().min(1, "Informe a descrição da categoria"),
  ativo: z.boolean().default(true),
})

export type CategoryFormValues = z.infer<typeof categoryFormSchema>
