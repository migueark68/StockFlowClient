import { NavLink } from "react-router-dom"
import { NAV_ITEMS } from "@/app/navigation"
import { useAuth } from "@/context/auth-context"
import { canAccess } from "@/shared/utils/roles"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/ui/tooltip"

interface SidebarNavProps {
  collapsed: boolean
  onNavigate?: () => void
}

export function SidebarNav({ collapsed, onNavigate }: SidebarNavProps) {
  const { user } = useAuth()
  const role = user?.role

  const items = NAV_ITEMS.filter((item) => canAccess(role, item.roles))

  return (
    <nav className="flex flex-col gap-1 px-3 py-2" aria-label="Navegação principal">
      {items.map((item) => {
        const Icon = item.icon
        const link = (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                "text-muted-foreground hover:bg-secondary hover:text-foreground",
                isActive && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                collapsed && "justify-center px-0",
              )
            }
          >
            <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
            {!collapsed && <span className="truncate">{item.label}</span>}
            {collapsed && <span className="sr-only">{item.label}</span>}
          </NavLink>
        )

        if (collapsed) {
          return (
            <Tooltip key={item.to}>
              <TooltipTrigger asChild>{link}</TooltipTrigger>
              <TooltipContent side="right">{item.label}</TooltipContent>
            </Tooltip>
          )
        }

        return link
      })}
    </nav>
  )
}
