import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { Providers } from "./app/providers"
import { DashboardLayout } from "./layouts/dashboard-layout"
import { ProtectedRoute } from "./routes/protected-route"
import { LoginPage } from "./features/auth/login-page"
import { DashboardPage } from "./features/dashboard/dashboard-page"
import { UsersPage } from "./features/users/users-page"

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
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </Providers>
  )
}
