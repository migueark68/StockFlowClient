import { motion } from "motion/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card"
import { Package, ArrowDownToLine, ArrowUpFromLine, Boxes } from "lucide-react"

const stats = [
  { label: "Produtos cadastrados", value: "1.248", change: "+12%", icon: Package },
  { label: "Entradas (mês)", value: "320", change: "+8%", icon: ArrowDownToLine },
  { label: "Saídas (mês)", value: "278", change: "+15%", icon: ArrowUpFromLine },
  { label: "Itens em estoque", value: "970", change: "+5%", icon: Boxes },
]

export function DashboardPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="flex flex-col gap-6"
    >
      <div>
        <h2 className="font-heading text-xl font-semibold tracking-tight">Dashboard</h2>
        <p className="text-sm text-muted-foreground">Visão geral do sistema em tempo real.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-success">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Movimentações (mês)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-64 items-center justify-center rounded-lg border border-dashed border-border bg-muted/40 text-sm text-muted-foreground">
            Gráfico de movimentações — placeholder
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
