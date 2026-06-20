import { useNavigate } from "react-router-dom"
import { motion } from "motion/react"
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  SlidersHorizontal,
  Package,
  Tags,
  Boxes,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card"

const ACTIONS = [
  {
    label: "Nova Entrada",
    description: "Registrar entrada de produtos",
    icon: ArrowDownToLine,
    to: "/entradas",
    color: "text-success",
    bg: "bg-success/10",
  },
  {
    label: "Nova Saída",
    description: "Registrar saída de produtos",
    icon: ArrowUpFromLine,
    to: "/saidas",
    color: "text-destructive",
    bg: "bg-destructive/10",
  },
  {
    label: "Novo Ajuste",
    description: "Registrar ajuste de estoque",
    icon: SlidersHorizontal,
    to: "/ajustes",
    color: "text-warning",
    bg: "bg-warning/10",
  },
  {
    label: "Produtos",
    description: "Gerenciar catálogo de produtos",
    icon: Package,
    to: "/produtos",
    color: "text-info",
    bg: "bg-info/10",
  },
  {
    label: "Categorias",
    description: "Gerenciar categorias",
    icon: Tags,
    to: "/categorias",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    label: "Estoque",
    description: "Visualizar estado do estoque",
    icon: Boxes,
    to: "/estoque",
    color: "text-muted-foreground",
    bg: "bg-muted/60",
  },
]

export function QuickActions() {
  const navigate = useNavigate()

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Atalhos Rápidos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {ACTIONS.map((action, i) => (
            <motion.button
              key={action.label}
              type="button"
              onClick={() => navigate(action.to)}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, ease: "easeOut", delay: i * 0.04 }}
              whileHover={{ y: -2, scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="flex flex-col items-center gap-2.5 rounded-xl border border-border bg-muted/20 px-3 py-4 text-center transition-colors hover:bg-accent hover:border-primary/30 cursor-pointer"
            >
              <div
                className={`flex size-10 items-center justify-center rounded-xl ${action.bg}`}
              >
                <action.icon className={`h-5 w-5 ${action.color}`} />
              </div>
              <div>
                <p className="text-xs font-semibold leading-tight">{action.label}</p>
                <p className="mt-0.5 text-[10px] leading-tight text-muted-foreground">
                  {action.description}
                </p>
              </div>
            </motion.button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
