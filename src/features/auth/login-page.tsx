import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useLocation, useNavigate } from "react-router-dom"
import { motion } from "motion/react"
import { AlertCircle, Eye, EyeOff, Lock, ShieldCheck, User } from "lucide-react"
import { toast } from "sonner"

import { useAuth } from "@/context/auth-context"
import { getApiErrorMessage } from "@/shared/utils/api-error"
import { Button } from "@/shared/ui/button"
import { Input } from "@/shared/ui/input"
import { Label } from "@/shared/ui/label"
import { LogoMark } from "@/shared/components/logo"
import { loginSchema, type LoginFormValues } from "./login.schema"

const HIGHLIGHTS = [
  "Controle de entradas e saídas em tempo real",
  "Gestão de produtos, fornecedores e usuários",
  "Relatórios e indicadores inteligentes",
]

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [showPassword, setShowPassword] = React.useState(false)
  const [formError, setFormError] = React.useState<string | null>(null)

  const from = (location.state as { from?: { pathname: string } } | null)?.from?.pathname ?? "/dashboard"

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { login: "", senha: "" },
  })

  async function onSubmit(values: LoginFormValues) {
    setFormError(null)
    try {
      await login(values)
      toast.success("Bem-vindo de volta!")
      navigate(from, { replace: true })
    } catch (error) {
      const message = getApiErrorMessage(error, "Credenciais inválidas.")
      setFormError(message)
      toast.error(message)
    }
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Brand panel */}
      <aside className="relative hidden overflow-hidden bg-sidebar lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            backgroundImage:
              "radial-gradient(60% 50% at 80% 0%, rgba(220,38,38,0.18), transparent 70%), radial-gradient(50% 50% at 0% 100%, rgba(220,38,38,0.10), transparent 70%)",
          }}
        />
        <div className="relative flex items-center gap-3">
          <LogoMark className="size-9" />
          <div className="flex flex-col leading-none">
            <span className="font-heading text-xl font-bold tracking-tight">
              Stock<span className="text-primary">Flow</span>
            </span>
            <span className="mt-1 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              Controle inteligente de estoque
            </span>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative max-w-md"
        >
          <h2 className="font-heading text-3xl font-semibold leading-tight text-balance">
            Gerencie todo o seu estoque em um só lugar.
          </h2>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            Plataforma profissional para acompanhar movimentações, produtos e equipes com
            precisão e agilidade.
          </p>
          <ul className="mt-8 flex flex-col gap-3">
            {HIGHLIGHTS.map((item) => (
              <li key={item} className="flex items-center gap-3 text-sm text-sidebar-foreground">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                  <ShieldCheck className="size-3.5" />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </motion.div>

        <p className="relative text-xs text-muted-foreground">
          © {new Date().getFullYear()} StockFlow. Todos os direitos reservados.
        </p>
      </aside>

      {/* Form panel */}
      <main className="flex items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="w-full max-w-sm"
        >
          <div className="mb-8 flex flex-col items-center gap-3 text-center lg:items-start lg:text-left">
            <div className="lg:hidden">
              <LogoMark className="size-10" />
            </div>
            <div>
              <h1 className="font-heading text-2xl font-semibold tracking-tight">Acesse sua conta</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Entre com suas credenciais para continuar.
              </p>
            </div>
          </div>

          {formError && (
            <div className="mb-5 flex items-start gap-2.5 rounded-lg border border-destructive/30 bg-destructive/10 px-3.5 py-2.5 text-sm text-destructive">
              <AlertCircle className="mt-0.5 size-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
            <div className="flex flex-col gap-2">
              <Label htmlFor="login">Login</Label>
              <div className="relative">
                <User className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="login"
                  autoComplete="username"
                  placeholder="seu.login"
                  className="pl-9"
                  aria-invalid={!!errors.login}
                  {...register("login")}
                />
              </div>
              {errors.login && <p className="text-xs text-destructive">{errors.login.message}</p>}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="senha">Senha</Label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="senha"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="pl-9 pr-10"
                  aria-invalid={!!errors.senha}
                  {...register("senha")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground transition-colors hover:text-foreground"
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
              {errors.senha && <p className="text-xs text-destructive">{errors.senha.message}</p>}
            </div>

            <Button type="submit" size="lg" loading={isSubmitting} className="mt-1 w-full">
              {isSubmitting ? "Entrando..." : "Entrar"}
            </Button>
          </form>
        </motion.div>
      </main>
    </div>
  )
}
