import { useEffect, useState } from "react"
import { Outlet, useLocation } from "react-router-dom"
import { AnimatePresence, motion } from "motion/react"
import { Menu, PanelLeftClose, PanelLeft, X } from "lucide-react"
import { Logo, LogoMark } from "@/shared/components/logo"
import { SidebarNav } from "./components/sidebar-nav"
import { UserMenu } from "./components/user-menu"
import { Button } from "@/shared/ui/button"
import { useMediaQuery } from "@/shared/hooks/use-media-query"
import { getFlatNavItems } from "@/app/navigation"
import { useAuth } from "@/context/auth-context"
import { cn } from "@/lib/utils"

const COLLAPSE_KEY = "stockflow:sidebar-collapsed"

export function DashboardLayout() {
  const isDesktop = useMediaQuery("(min-width: 1024px)")
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem(COLLAPSE_KEY) === "true")
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const { user } = useAuth()

  useEffect(() => {
    localStorage.setItem(COLLAPSE_KEY, String(collapsed))
  }, [collapsed])

  // Close drawer on route change
  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  const activeItem = getFlatNavItems(user?.cargo).find((item) =>
    item.end ? location.pathname === item.to : location.pathname.startsWith(item.to),
  )

  return (
    <div className="flex min-h-svh bg-background">
      {/* Desktop sidebar */}
      {isDesktop && (
        <aside
          className={cn(
            "sticky top-0 flex h-svh shrink-0 flex-col border-r border-border bg-card transition-[width] duration-300",
            collapsed ? "w-[76px]" : "w-64",
          )}
        >
          <div className={cn("flex h-16 items-center border-b border-border px-4", collapsed && "justify-center px-0")}>
            {collapsed ? <LogoMark className="h-9 w-9" /> : <Logo />}
          </div>
          <div className="flex-1 overflow-y-auto py-2">
            <SidebarNav collapsed={collapsed} />
          </div>
          <div className="border-t border-border p-3">
            <UserMenu collapsed={collapsed} />
          </div>
        </aside>
      )}

      {/* Mobile drawer */}
      <AnimatePresence>
        {!isDesktop && mobileOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/60"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              aria-hidden="true"
            />
            <motion.aside
              className="fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-border bg-card"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              role="dialog"
              aria-label="Menu de navegação"
            >
              <div className="flex h-16 items-center justify-between border-b border-border px-4">
                <Logo />
                <Button variant="ghost" size="icon" onClick={() => setMobileOpen(false)} aria-label="Fechar menu">
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <div className="flex-1 overflow-y-auto py-2">
                <SidebarNav collapsed={false} onNavigate={() => setMobileOpen(false)} />
              </div>
              <div className="border-t border-border p-3">
                <UserMenu collapsed={false} />
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-sm lg:px-6">
          {isDesktop ? (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCollapsed((c) => !c)}
              aria-label={collapsed ? "Expandir menu" : "Recolher menu"}
            >
              {collapsed ? <PanelLeft className="h-5 w-5" /> : <PanelLeftClose className="h-5 w-5" />}
            </Button>
          ) : (
            <Button variant="ghost" size="icon" onClick={() => setMobileOpen(true)} aria-label="Abrir menu">
              <Menu className="h-5 w-5" />
            </Button>
          )}
          <h1 className="font-sans text-lg font-semibold text-foreground">{activeItem?.label ?? "StockFlow"}</h1>
        </header>

        <main className="flex-1 p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
