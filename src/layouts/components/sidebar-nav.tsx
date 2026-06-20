import { useState } from "react"
import { NavLink, useLocation } from "react-router-dom"
import { ChevronDown } from "lucide-react"
import { NAV_ITEMS, type NavEntry, type NavItem } from "@/app/navigation"
import { useAuth } from "@/context/auth-context"
import { canAccess } from "@/shared/utils/roles"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/ui/tooltip"

interface SidebarNavProps {
  collapsed: boolean
  onNavigate?: () => void
}

function NavItemLink({
  item,
  collapsed,
  onNavigate,
  indent = false,
}: {
  item: NavItem
  collapsed: boolean
  onNavigate?: () => void
  indent?: boolean
}) {
  const link = (
    <NavLink
      to={item.to}
      end={item.end}
      onClick={onNavigate}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
          "text-muted-foreground hover:bg-secondary hover:text-foreground",
          isActive &&
            "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
          collapsed && "justify-center px-0",
          indent && !collapsed && "pl-9",
        )
      }
    >
      <item.icon className="h-5 w-5 shrink-0" aria-hidden="true" />
      {!collapsed && <span className="truncate">{item.label}</span>}
      {collapsed && <span className="sr-only">{item.label}</span>}
    </NavLink>
  )

  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{link}</TooltipTrigger>
        <TooltipContent side="right">{item.label}</TooltipContent>
      </Tooltip>
    )
  }

  return link
}

export function SidebarNav({ collapsed, onNavigate }: SidebarNavProps) {
  const { user } = useAuth()
  const role = user?.cargo
  const location = useLocation()

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {}
    for (const entry of NAV_ITEMS) {
      if (entry.type === "group") {
        const hasActive = entry.items.some((item) =>
          location.pathname.startsWith(item.to),
        )
        initial[entry.label] = hasActive
      }
    }
    return initial
  })

  const visibleEntries = NAV_ITEMS.filter((entry) => canAccess(role, entry.roles))

  return (
    <nav className="flex flex-col gap-1 px-3 py-2" aria-label="Navegação principal">
      {visibleEntries.map((entry) => {
        if (entry.type === "group") {
          const isOpen = openGroups[entry.label] ?? false
          const hasActive = entry.items.some((item) =>
            location.pathname.startsWith(item.to),
          )

          if (collapsed) {
            return entry.items.map((item) => (
              <NavItemLink
                key={item.to}
                item={item}
                collapsed={collapsed}
                onNavigate={onNavigate}
              />
            ))
          }

          return (
            <div key={entry.label}>
              <button
                type="button"
                onClick={() =>
                  setOpenGroups((prev) => ({
                    ...prev,
                    [entry.label]: !prev[entry.label],
                  }))
                }
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  "text-muted-foreground hover:bg-secondary hover:text-foreground",
                  hasActive && !isOpen && "text-foreground",
                )}
              >
                <entry.icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                <span className="flex-1 truncate text-left">{entry.label}</span>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 shrink-0 transition-transform duration-200",
                    isOpen && "rotate-180",
                  )}
                />
              </button>

              {isOpen && (
                <div className="mt-1 flex flex-col gap-1">
                  {entry.items.map((item) => (
                    <NavItemLink
                      key={item.to}
                      item={item}
                      collapsed={false}
                      onNavigate={onNavigate}
                      indent
                    />
                  ))}
                </div>
              )}
            </div>
          )
        }

        // Regular NavItem
        return (
          <NavItemLink
            key={(entry as NavItem).to}
            item={entry as NavItem}
            collapsed={collapsed}
            onNavigate={onNavigate}
          />
        )
      })}
    </nav>
  )
}
