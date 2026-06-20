import { type LucideIcon } from "lucide-react"
import { motion } from "motion/react"
import { Card, CardContent } from "@/shared/ui/card"
import { Skeleton } from "@/shared/ui/skeleton"
import { cn } from "@/lib/utils"

interface KpiCardProps {
  label: string
  value: string | number
  sub?: string
  icon: LucideIcon
  iconColor?: string
  iconBg?: string
  valueColor?: string
  isLoading?: boolean
  progress?: number
  index?: number
}

export function KpiCard({
  label,
  value,
  sub,
  icon: Icon,
  iconColor = "text-primary",
  iconBg = "bg-primary/10",
  valueColor,
  isLoading,
  progress,
  index = 0,
}: KpiCardProps) {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-5">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="mt-3 h-7 w-16" />
          <Skeleton className="mt-2 h-3 w-20" />
        </CardContent>
      </Card>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut", delay: index * 0.05 }}
    >
      <Card className="h-full">
        <CardContent className="flex flex-col gap-3 p-5">
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm font-medium text-muted-foreground leading-tight">{label}</p>
            <div className={cn("flex size-9 shrink-0 items-center justify-center rounded-lg", iconBg)}>
              <Icon className={cn("h-4 w-4", iconColor)} />
            </div>
          </div>
          <div>
            <p className={cn("font-heading text-2xl font-bold", valueColor)}>{value}</p>
            {sub && <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p>}
          </div>
          {progress !== undefined && (
            <div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <motion.div
                  className="h-full rounded-full bg-primary"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(progress, 100)}%` }}
                  transition={{ duration: 0.6, ease: "easeOut", delay: index * 0.05 + 0.2 }}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
