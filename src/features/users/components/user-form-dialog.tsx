import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader as Loader2 } from "lucide-react"
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
import { Switch } from "@/shared/ui/switch"
import { CARGO_OPTIONS } from "@/shared/utils/roles"

interface UserFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user?: User | null
}

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
      nome: "",
      email: "",
      login: "",
      cargo: "ENCARREGADO",
      ativo: true,
      senha: "",
    },
  })

  useEffect(() => {
    if (open) {
      reset({
        nome: user?.nome ?? "",
        email: user?.email ?? "",
        login: user?.login ?? "",
        cargo: user?.cargo ?? "ENCARREGADO",
        ativo: user?.ativo ?? true,
        senha: "",
      })
    }
  }, [open, user, reset])

  const cargo = watch("cargo")
  const ativo = watch("ativo")

  const onSubmit = (values: UserFormValues) => {
    if (isEdit && user) {
      const payload = {
        nome: values.nome,
        email: values.email,
        login: values.login,
        cargo: values.cargo,
        ativo: values.ativo,
      }
      updateMutation.mutate(
        { id: String(user.id), input: payload },
        { onSuccess: () => onOpenChange(false) },
      )
    } else {
      if (!values.senha) return
      createMutation.mutate(
        {
          nome: values.nome,
          email: values.email,
          login: values.login,
          cargo: values.cargo,
          senha: values.senha,
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
              ? "Atualize os dados do usuário."
              : "Preencha os dados para cadastrar um novo usuário."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4" noValidate>
          <div className="grid gap-2">
            <Label htmlFor="nome">Nome completo</Label>
            <Input id="nome" placeholder="Ex: João Silva" {...register("nome")} aria-invalid={!!errors.nome} />
            {errors.nome && <p className="text-xs text-destructive">{errors.nome.message}</p>}
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

          <div className="grid gap-2">
            <Label htmlFor="login">Login</Label>
            <Input id="login" placeholder="seu.login" {...register("login")} aria-invalid={!!errors.login} />
            {errors.login && <p className="text-xs text-destructive">{errors.login.message}</p>}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="cargo">Cargo</Label>
              <Select value={cargo} onValueChange={(v) => setValue("cargo", v as UserFormValues["cargo"])}>
                <SelectTrigger id="cargo">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {CARGO_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.cargo && <p className="text-xs text-destructive">{errors.cargo.message}</p>}
            </div>

            {isEdit && (
              <div className="flex items-center gap-3 pt-6">
                <Switch id="ativo" checked={ativo} onCheckedChange={(v) => setValue("ativo", v)} />
                <Label htmlFor="ativo" className="cursor-pointer">
                  {ativo ? "Ativo" : "Inativo"}
                </Label>
              </div>
            )}
          </div>

          {!isEdit && (
            <div className="grid gap-2">
              <Label htmlFor="senha">Senha</Label>
              <Input
                id="senha"
                type="password"
                placeholder="••••••••"
                {...register("senha")}
                aria-invalid={!!errors.senha}
              />
              {errors.senha && <p className="text-xs text-destructive">{errors.senha.message}</p>}
              {!errors.senha && <p className="text-xs text-muted-foreground">Mínimo de 6 caracteres.</p>}
            </div>
          )}

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
