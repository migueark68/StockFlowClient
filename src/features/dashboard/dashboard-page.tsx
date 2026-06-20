import { motion } from "motion/react"
import { useAuth } from "@/context/auth-context"
import { useProducts } from "@/features/products/use-products"
import { useCategories } from "@/features/categories/use-categories"
import { useStock } from "@/features/stock/use-stock"
import { useAllMovementsSummary } from "@/features/movements/use-movements"
import { DashboardHeader } from "./components/dashboard-header"
import { KpiCard } from "./components/kpi-card"
import { MovementDonutChart } from "./components/movement-donut-chart"
import { MovementBarChart } from "./components/movement-bar-chart"
import { StockLowList, StockHighList } from "./components/stock-alerts"
import { RecentMovements } from "./components/recent-movements"
import { QuickActions } from "./components/quick-actions"
import { Package, Tags, Box, Lock, AlertTriangle, BarChart3 } from "lucide-react"
import type { StockItem } from "@/types/stock"

export function DashboardPage() {
  const { user } = useAuth()
  const isEncarregado = user?.cargo === "ENCARREGADO"

  const { data: products = [], isLoading: loadingProducts } = useProducts()
  const { data: categories = [], isLoading: loadingCategories } = useCategories()
  const { data: stockItems = [], isLoading: loadingStock } = useStock()
  const { data: movements = [], isLoading: loadingMovements } = useAllMovementsSummary()

  const totalProducts = products.length
  const totalCategories = categories.length
  const totalAvailable = stockItems.reduce((sum: number, i: StockItem) => sum + i.quantidadeDisponivel, 0)
  const totalReserved = stockItems.reduce((sum: number, i: StockItem) => sum + i.quantidadeReservada, 0)
  const lowStockCount = stockItems.filter(
    (i: StockItem) => i.quantidadeDisponivel <= i.produto.estoqueMinimo
  ).length

  const avgOccupancy = (() => {
    const valid = stockItems.filter((i: StockItem) => i.produto.estoqueMaximo > 0)
    if (valid.length === 0) return 0
    const totalPct = valid.reduce(
      (sum: number, i: StockItem) => sum + i.quantidadeDisponivel / i.produto.estoqueMaximo,
      0
    )
    return Math.round((totalPct / valid.length) * 100)
  })()

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="flex flex-col gap-6"
    >
      <DashboardHeader />

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <KpiCard
          label="Produtos"
          value={totalProducts}
          icon={Package}
          isLoading={loadingProducts}
          index={0}
        />
        <KpiCard
          label="Categorias"
          value={totalCategories}
          icon={Tags}
          isLoading={loadingCategories}
          index={1}
        />
        <KpiCard
          label="Itens Disponíveis"
          value={totalAvailable}
          icon={Box}
          isLoading={loadingStock}
          index={2}
        />
        <KpiCard
          label="Itens Reservados"
          value={totalReserved}
          icon={Lock}
          isLoading={loadingStock}
          index={3}
        />
        <KpiCard
          label="Estoque Baixo"
          value={lowStockCount}
          icon={AlertTriangle}
          valueColor={lowStockCount > 0 ? "text-destructive" : undefined}
          iconColor={lowStockCount > 0 ? "text-destructive" : undefined}
          iconBg={lowStockCount > 0 ? "bg-destructive/10" : undefined}
          isLoading={loadingStock}
          index={4}
        />
        <KpiCard
          label="Ocupação Média"
          value={`${avgOccupancy}%`}
          icon={BarChart3}
          progress={avgOccupancy}
          isLoading={loadingStock}
          index={5}
        />
      </div>

      {isEncarregado ? (
        <div className="grid gap-6 lg:grid-cols-2">
          <MovementDonutChart data={movements} isLoading={loadingMovements} />
          <MovementBarChart data={movements} isLoading={loadingMovements} />
        </div>
      ) : (
        <>
          <div className="grid gap-6 lg:grid-cols-3">
            <MovementDonutChart data={movements} isLoading={loadingMovements} />
            <MovementBarChart data={movements} isLoading={loadingMovements} />
            <div className="flex flex-col gap-6">
              <StockLowList items={stockItems} isLoading={loadingStock} />
              <StockHighList items={stockItems} isLoading={loadingStock} />
            </div>
          </div>

          <RecentMovements data={movements} isLoading={loadingMovements} />

          <QuickActions />
        </>
      )}
    </motion.div>
  )
}
