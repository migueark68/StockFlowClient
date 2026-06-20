import { motion } from "motion/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card"
import { Skeleton } from "@/shared/ui/skeleton"
import type { MovementSummary, TipoMovimentacao } from "@/types/movement"
import { TIPO_LABEL } from "@/features/movements/movements.constants"

const TIPO_COLOR: Record<TipoMovimentacao, string> = {
  ENTRADA: "var(--color-success)",
  SAIDA: "var(--color-destructive)",
  AJUSTE: "var(--color-warning)",
}

interface DonutChartProps {
  data: MovementSummary[]
  isLoading: boolean
}

const TIPOS: TipoMovimentacao[] = ["ENTRADA", "SAIDA", "AJUSTE"]
const R = 44
const CX = 60
const CY = 60
const C = 2 * Math.PI * R

export function MovementDonutChart({ data, isLoading }: DonutChartProps) {
  const counts: Record<TipoMovimentacao, number> = { ENTRADA: 0, SAIDA: 0, AJUSTE: 0 }
  data.forEach((m) => { counts[m.tipoMovimentacao]++ })
  const total = counts.ENTRADA + counts.SAIDA + counts.AJUSTE

  const segments = TIPOS.map((tipo) => ({
    tipo,
    count: counts[tipo],
    pct: total > 0 ? counts[tipo] / total : 0,
  }))

  let offset = 0
  const arcs = segments.map((seg) => {
    const len = seg.pct * C
    const dasharray = `${len} ${C - len}`
    const dashoffset = -offset
    offset += len
    return { ...seg, dasharray, dashoffset }
  })

  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Movimentações por Tipo</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col items-center gap-4">
        {isLoading ? (
          <Skeleton className="h-32 w-32 rounded-full" />
        ) : (
          <div className="relative">
            <svg
              width={120}
              height={120}
              viewBox="0 0 120 120"
              style={{ transform: "rotate(-90deg)" }}
            >
              {total === 0 ? (
                <circle
                  cx={CX}
                  cy={CY}
                  r={R}
                  fill="none"
                  stroke="var(--color-muted)"
                  strokeWidth={13}
                />
              ) : (
                arcs.map((arc) => (
                  <motion.circle
                    key={arc.tipo}
                    cx={CX}
                    cy={CY}
                    r={R}
                    fill="none"
                    stroke={TIPO_COLOR[arc.tipo]}
                    strokeWidth={13}
                    strokeDasharray={arc.dasharray}
                    strokeDashoffset={arc.dashoffset}
                    strokeLinecap="butt"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4 }}
                  />
                ))
              )}
            </svg>
            <div
              className="absolute inset-0 flex flex-col items-center justify-center"
              style={{ transform: "none" }}
            >
              <span className="font-heading text-xl font-bold">{total}</span>
              <span className="text-[10px] text-muted-foreground">Total</span>
            </div>
          </div>
        )}

        <div className="flex w-full flex-col gap-2">
          {TIPOS.map((tipo) => {
            const count = counts[tipo]
            const pct = total > 0 ? Math.round((count / total) * 100) : 0
            return (
              <div key={tipo} className="flex items-center gap-2 text-sm">
                <span
                  className="inline-block h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ background: TIPO_COLOR[tipo] }}
                />
                <span className="flex-1 text-muted-foreground">{TIPO_LABEL[tipo]}</span>
                <span className="font-medium">{count}</span>
                <span className="w-8 text-right text-xs text-muted-foreground">{pct}%</span>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
