import { z } from "zod"

export const userFormSchema = z
  .object({
    name: z.string().min(2, "Informe o nome completo"),
    email: z.string().min(1, "Informe o e-mail").email("E-mail inválido"),
    role: z.enum(["ADMINISTRADOR", "GERENTE", "OPERADOR"], {
      errorMap: () => ({ message: "Selecione um perfil" }),
    }),
    status: z.enum(["ATIVO", "INATIVO"]),
    // Optional on edit; required on create (handled in component)
    password: z
      .string()
      .min(6, "A senha deve ter ao menos 6 caracteres")
      .optional()
      .or(z.literal("")),
  })

export type UserFormValues = z.infer<typeof userFormSchema>
