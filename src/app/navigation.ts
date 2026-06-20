import {
  LayoutDashboard,
  Package,
  ArrowDownToLine,
  ArrowUpFromLine,
  Boxes,
  Truck,
  BarChart3,
  Users,
  Settings,
  Tags,
  type LucideIcon,
} from "lucide-react"

import type { Cargo } from "@/types/auth"

export interface NavItem {
  label: string
  to: string
  icon: LucideIcon
  /** Roles allowed to see this item. Empty = all roles. */
  roles?: Cargo[]
  /** Placeholder routes are not yet implemented. */
  placeholder?: boolean
  end?: boolean
}

export const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
  { label: "Produtos", to: "/produtos", icon: Package },
  { label: "Entradas", to: "/entradas", icon: ArrowDownToLine, placeholder: true },
  { label: "Saídas", to: "/saidas", icon: ArrowUpFromLine, placeholder: true },
  { label: "Estoque", to: "/estoque", icon: Boxes, placeholder: true },
  {
    label: "Fornecedores",
    to: "/fornecedores",
    icon: Truck,
    placeholder: true,
    roles: ["ADMINISTRADOR", "GERENTE", "SUPERVISOR"],
  },
  {
    label: "Relatórios",
    to: "/relatorios",
    icon: BarChart3,
    placeholder: true,
    roles: ["ADMINISTRADOR", "GERENTE"],
  },
  {
    label: "Usuários",
    to: "/usuarios",
    icon: Users,
    roles: ["ADMINISTRADOR", "GERENTE"],
  },
  {
    label: "Categorias",
    to: "/categorias",
    icon: Tags,
  },
  {
    label: "Configurações",
    to: "/configuracoes",
    icon: Settings,
    placeholder: true,
    roles: ["ADMINISTRADOR"],
  },
]

export function getVisibleNavItems(cargo: Cargo | undefined): NavItem[] {
  if (!cargo) return []
  return NAV_ITEMS.filter((item) => !item.roles || item.roles.includes(cargo))
}
