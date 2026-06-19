import { AlertTriangle, RotateCw } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/shared/ui/button"

interface ErrorStateProps {
  title?: string
  description?: string
  onRetry?: () => void
  className?: string
}

export function ErrorState({
  title = "Algo deu errado",
  description = "Não foi possível carregar os dados. Tente novamente.",
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 px-6 py-16 text-center",
        className,
      )}
    >
      <div className="flex size-14 items-center justify-center rounded-2xl border border-destructive/30 bg-destructive/10">
        <AlertTriangle className="size-6 text-destructive" />
      </div>
      <div className="flex flex-col gap-1">
        <p className="font-heading text-base font-semibold">{title}</p>
        <p className="mx-auto max-w-sm text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry} className="mt-2">
          <RotateCw />
          Tentar novamente
        </Button>
      )}
    </div>
  )
}
