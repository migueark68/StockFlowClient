import { Boxes, PackageCheck, PackageMinus, TriangleAlert as AlertTriangle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card"
import type { StockItem } from "@/types/stock"

interface StockSummaryCardsProps {
  items: StockItem[]
}

export function StockSummaryCards({ items }: StockSummaryCardsProps) {
  const totalProducts = items.length
  const totalAvailable = items.reduce((acc, i) => acc + i.quantidadeDisponivel, 0)
  const totalReserved = items.reduce((acc, i) => acc + i.quantidadeReservada, 0)
  const lowStock = items.filter((i) => i.quantidadeDisponivel <= i.produto.estoqueMinimo).length

  const stats = [
    {
      label: "Produtos em Estoque",
      value: totalProducts.toLocaleString("pt-BR"),
      icon: Boxes,
      color: "text-info",
      bg: "bg-info/10",
    },
    {
      label: "Itens Disponíveis",
      value: totalAvailable.toLocaleString("pt-BR"),
      icon: PackageCheck,
      color: "text-success",
      bg: "bg-success/10",
    },
    {
      label: "Itens Reservados",
      value: totalReserved.toLocaleString("pt-BR"),
      icon: PackageMinus,
      color: "text-warning",
      bg: "bg-warning/10",
    },
    {
      label: "Estoque Baixo",
      value: lowStock.toLocaleString("pt-BR"),
      icon: AlertTriangle,
      color: "text-destructive",
      bg: "bg-destructive/10",
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.label}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.label}
            </CardTitle>
            <div className={`flex size-8 items-center justify-center rounded-lg ${stat.bg}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
