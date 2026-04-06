import { Routes, Route } from 'react-router-dom'
import { PharmacyAuthProvider } from './context/PharmacyAuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import LoginPage from './pages/LoginPage'
import Dashboard from './pages/Dashboard'
import Deliveries from './pages/Deliveries'
import POD from './pages/POD'

export default function App() {
  return (
    <PharmacyAuthProvider>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/deliveries"
          element={
            <ProtectedRoute>
              <Deliveries />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pod/:orderId"
          element={
            <ProtectedRoute>
              <POD />
            </ProtectedRoute>
          }
        />
      </Routes>
    </PharmacyAuthProvider>
  )
}
