import { cn } from "@/lib/utils"

interface LogoMarkProps {
  className?: string
}

/**
 * StockFlow brand mark — a cube wrapped by a circular flow arrow,
 * representing inventory in continuous movement.
 */
export function LogoMark({ className }: LogoMarkProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("size-8", className)}
      aria-hidden="true"
    >
      <path
        d="M24 5 41 14.5V33.5L24 43 7 33.5V14.5L24 5Z"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinejoin="round"
        className="text-primary"
      />
      <path
        d="M24 14 33 19V29L24 34 15 29V19L24 14Z"
        fill="currentColor"
        className="text-primary"
        opacity="0.18"
      />
      <path
        d="M24 14 33 19V29L24 34 15 29V19L24 14Z"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinejoin="round"
        className="text-primary"
      />
      <path
        d="M24 14V24M24 24 33 19M24 24 15 19"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        className="text-primary"
      />
    </svg>
  )
}

interface LogoProps {
  collapsed?: boolean
  className?: string
}

export function Logo({ collapsed = false, className }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <LogoMark className="size-8 shrink-0" />
      {!collapsed && (
        <span className="font-heading text-lg font-bold leading-none tracking-tight">
          Stock<span className="text-primary">Flow</span>
        </span>
      )}
    </div>
  )
}
