import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { navItems } from "@/components/layout/nav-items"
import LoginPage from "@/pages/auth/login"
import DashboardPage from "@/pages/dashboard"
import PlaceholderPage from "@/pages/placeholder-page"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          {navItems
            .filter((item) => item.path !== "/dashboard")
            .map((item) => (
              <Route
                key={item.path}
                path={item.path}
                element={<PlaceholderPage title={item.label} />}
              />
            ))}
        </Route>

        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
