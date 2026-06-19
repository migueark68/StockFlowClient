import type { BadgeProps } from "@/shared/ui/badge"
import type { Cargo } from "@/types/auth"

export const CARGO_OPTIONS: { value: Cargo; label: string }[] = [
  { value: "ADMINISTRADOR", label: "Administrador" },
  { value: "GERENTE", label: "Gerente" },
  { value: "SUPERVISOR", label: "Supervisor" },
  { value: "ENCARREGADO", label: "Encarregado" },
]

export const CARGO_LABEL: Record<Cargo, string> = {
  ADMINISTRADOR: "Administrador",
  GERENTE: "Gerente",
  SUPERVISOR: "Supervisor",
  ENCARREGADO: "Encarregado",
}

export const CARGO_BADGE_VARIANT: Record<Cargo, NonNullable<BadgeProps["variant"]>> = {
  ADMINISTRADOR: "red",
  GERENTE: "blue",
  SUPERVISOR: "yellow",
  ENCARREGADO: "gray",
}
