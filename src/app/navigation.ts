import {
  LayoutDashboard,
  Package,
  ArrowDownToLine,
  ArrowUpFromLine,
  SlidersHorizontal,
  Boxes,
  Truck,
  BarChart3,
  Users,
  Settings,
  Tags,
  ClipboardList,
  type LucideIcon,
} from "lucide-react"

import type { Cargo } from "@/types/auth"
import { canAccess } from "@/shared/utils/roles"

export interface NavItem {
  type?: "item"
  label: string
  to: string
  icon: LucideIcon
  roles?: Cargo[]
  placeholder?: boolean
  end?: boolean
}

export interface NavGroup {
  type: "group"
  label: string
  icon: LucideIcon
  roles?: Cargo[]
  items: NavItem[]
}

export type NavEntry = NavItem | NavGroup

export const NAV_ITEMS: NavEntry[] = [
  { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
  { label: "Produtos", to: "/produtos", icon: Package },
  { label: "Estoque", to: "/estoque", icon: Boxes },
  {
    type: "group",
    label: "Movimentações",
    icon: ClipboardList,
    items: [
      { label: "Entradas", to: "/entradas", icon: ArrowDownToLine },
      { label: "Saídas", to: "/saidas", icon: ArrowUpFromLine },
      { label: "Ajustes", to: "/ajustes", icon: SlidersHorizontal },
    ],
  },
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

/** Returns a flat list of all NavItem leaves (from both top-level items and groups). */
export function getFlatNavItems(cargo: Cargo | undefined): NavItem[] {
  const result: NavItem[] = []
  for (const entry of NAV_ITEMS) {
    if (!canAccess(cargo, entry.roles)) continue
    if (entry.type === "group") {
      result.push(...entry.items)
    } else {
      result.push(entry)
    }
  }
  return result
}
