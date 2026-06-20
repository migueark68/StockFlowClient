import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { Providers } from "./app/providers"
import { DashboardLayout } from "./layouts/dashboard-layout"
import { ProtectedRoute } from "./routes/protected-route"
import { LoginPage } from "./features/auth/login-page"
import { DashboardPage } from "./features/dashboard/dashboard-page"
import { UsersPage } from "./features/users/users-page"
import { CategoriesPage } from "./features/categories/categories-page"
import { ProductsPage } from "./features/products/products-page"
import { StockPage } from "./features/stock/stock-page"
import { EntradasPage } from "./features/entradas/entradas-page"
import { SaidasPage } from "./features/saidas/saidas-page"
import { AjustesPage } from "./features/ajustes/ajustes-page"

export default function App() {
  return (
    <Providers>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/usuarios" element={<UsersPage />} />
              <Route path="/categorias" element={<CategoriesPage />} />
              <Route path="/produtos" element={<ProductsPage />} />
              <Route path="/estoque" element={<StockPage />} />
              <Route path="/entradas" element={<EntradasPage />} />
              <Route path="/saidas" element={<SaidasPage />} />
              <Route path="/ajustes" element={<AjustesPage />} />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </Providers>
  )
}
