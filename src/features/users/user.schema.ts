import { z } from "zod"

export const userFormSchema = z.object({
  nome: z.string().min(2, "Informe o nome completo"),
  email: z.string().min(1, "Informe o e-mail").email("E-mail inválido"),
  login: z.string().min(1, "Informe o login"),
  cargo: z.enum(["ADMINISTRADOR", "GERENTE", "SUPERVISOR", "ENCARREGADO"], {
    errorMap: () => ({ message: "Selecione um cargo" }),
  }),
  ativo: z.boolean().default(true),
  senha: z
    .string()
    .min(6, "A senha deve ter ao menos 6 caracteres")
    .optional()
    .or(z.literal("")),
})

export type UserFormValues = z.infer<typeof userFormSchema>
