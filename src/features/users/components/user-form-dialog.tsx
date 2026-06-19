import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { userFormSchema, type UserFormValues } from "../user.schema"
import { useCreateUser, useUpdateUser } from "../use-users"
import type { User } from "@/types/user"
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

interface UserFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user?: User | null
}

const ROLE_OPTIONS = [
  { value: "ADMINISTRADOR", label: "Administrador" },
  { value: "GERENTE", label: "Gerente" },
  { value: "OPERADOR", label: "Operador" },
]

export function UserFormDialog({ open, onOpenChange, user }: UserFormDialogProps) {
  const isEdit = Boolean(user)
  const createMutation = useCreateUser()
  const updateMutation = useUpdateUser()
  const isPending = createMutation.isPending || updateMutation.isPending

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "OPERADOR",
      status: "ATIVO",
      password: "",
    },
  })

  useEffect(() => {
    if (open) {
      reset({
        name: user?.name ?? "",
        email: user?.email ?? "",
        role: user?.role ?? "OPERADOR",
        status: user?.status ?? "ATIVO",
        password: "",
      })
    }
  }, [open, user, reset])

  const role = watch("role")
  const status = watch("status")

  const onSubmit = (values: UserFormValues) => {
    if (isEdit && user) {
      const payload = {
        name: values.name,
        email: values.email,
        role: values.role,
        status: values.status,
        ...(values.password ? { password: values.password } : {}),
      }
      updateMutation.mutate(
        { id: user.id, input: payload },
        { onSuccess: () => onOpenChange(false) },
      )
    } else {
      if (!values.password) {
        // create requires a password
        return
      }
      createMutation.mutate(
        {
          name: values.name,
          email: values.email,
          role: values.role,
          status: values.status,
          password: values.password,
        },
        { onSuccess: () => onOpenChange(false) },
      )
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Editar usuário" : "Novo usuário"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Atualize os dados do usuário. Deixe a senha em branco para mantê-la."
              : "Preencha os dados para cadastrar um novo usuário."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4" noValidate>
          <div className="grid gap-2">
            <Label htmlFor="name">Nome completo</Label>
            <Input id="name" placeholder="Ex: João Silva" {...register("name")} aria-invalid={!!errors.name} />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              placeholder="usuario@empresa.com"
              {...register("email")}
              aria-invalid={!!errors.email}
            />
            {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="role">Perfil</Label>
              <Select value={role} onValueChange={(v) => setValue("role", v as UserFormValues["role"])}>
                <SelectTrigger id="role">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {ROLE_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.role && <p className="text-xs text-destructive">{errors.role.message}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select value={status} onValueChange={(v) => setValue("status", v as UserFormValues["status"])}>
                <SelectTrigger id="status">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ATIVO">Ativo</SelectItem>
                  <SelectItem value="INATIVO">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="password">{isEdit ? "Nova senha (opcional)" : "Senha"}</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              {...register("password")}
              aria-invalid={!!errors.password}
            />
            {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
            {!isEdit && !errors.password && (
              <p className="text-xs text-muted-foreground">Mínimo de 6 caracteres.</p>
            )}
          </div>

          <DialogFooter className="mt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              {isEdit ? "Salvar alterações" : "Criar usuário"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
