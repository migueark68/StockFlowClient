import { motion } from "motion/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card"
import { Skeleton } from "@/shared/ui/skeleton"
import { EmptyState } from "@/shared/components/empty-state"
import { ChartBar as BarChart3 } from "lucide-react"
import type { MovementSummary } from "@/types/movement"
import { ORIGEM_LABEL } from "@/features/movements/movements.constants"

interface BarChartProps {
  data: MovementSummary[]
  isLoading: boolean
}

export function MovementBarChart({ data, isLoading }: BarChartProps) {
  const counts: Record<string, number> = {}
  data.forEach((m) => {
    const key = m.origemMovimentacao
    counts[key] = (counts[key] ?? 0) + 1
  })

  const entries = Object.entries(counts).sort((a, b) => b[1] - a[1])
  const max = entries[0]?.[1] ?? 1

  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Movimentações por Origem</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col">
        {isLoading ? (
          <div className="flex h-40 items-end gap-3 px-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton
                key={i}
                className="flex-1 rounded-t-md"
                style={{ height: `${40 + i * 18}%` }}
              />
            ))}
          </div>
        ) : entries.length === 0 ? (
          <EmptyState icon={BarChart3} title="Sem dados" className="py-8" />
        ) : (
          <div className="flex h-44 items-end gap-2">
            {entries.map(([origem, count], i) => {
              const heightPct = (count / max) * 100
              const label = ORIGEM_LABEL[origem] ?? origem
              return (
                <div
                  key={origem}
                  className="group flex flex-1 flex-col items-center gap-1"
                  title={`${label}: ${count}`}
                >
                  <span className="text-xs font-medium tabular-nums opacity-0 transition-opacity group-hover:opacity-100">
                    {count}
                  </span>
                  <div className="relative w-full flex-1 flex items-end">
                    <motion.div
                      className="w-full rounded-t-md bg-primary/70 transition-colors group-hover:bg-primary"
                      initial={{ height: 0 }}
                      animate={{ height: `${heightPct}%` }}
                      transition={{ duration: 0.5, ease: "easeOut", delay: i * 0.07 }}
                      style={{ position: "absolute", bottom: 0 }}
                    />
                  </div>
                  <span
                    className="mt-1 w-full truncate text-center text-[10px] text-muted-foreground"
                    title={label}
                  >
                    {label}
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
