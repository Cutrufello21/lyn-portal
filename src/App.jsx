import { Routes, Route } from 'react-router-dom'
import { PharmacyAuthProvider } from './context/PharmacyAuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import AppLayout from './components/AppLayout'
import LoginPage from './pages/LoginPage'
import Dashboard from './pages/Dashboard'
import Deliveries from './pages/Deliveries'
import PODRecords from './pages/PODRecords'

export default function App() {
  return (
    <PharmacyAuthProvider>
      <Routes>
        <Route path="/" element={<LoginPage />} />

        {/* Protected routes with AppLayout */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <AppLayout title="Dashboard" />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
        </Route>

        <Route
          path="/deliveries"
          element={
            <ProtectedRoute>
              <AppLayout title="Deliveries" />
            </ProtectedRoute>
          }
        >
          <Route index element={<Deliveries />} />
        </Route>

        <Route
          path="/pod-records"
          element={
            <ProtectedRoute>
              <AppLayout title="POD Records" />
            </ProtectedRoute>
          }
        >
          <Route index element={<PODRecords />} />
        </Route>

        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <AppLayout title="Reports" />
            </ProtectedRoute>
          }
        >
          <Route index element={<PlaceholderPage text="Reports coming soon." />} />
        </Route>

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <AppLayout title="Settings" />
            </ProtectedRoute>
          }
        >
          <Route index element={<PlaceholderPage text="Settings coming soon." />} />
        </Route>
      </Routes>
    </PharmacyAuthProvider>
  )
}

function PlaceholderPage({ text }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '40vh',
      color: '#9CA3AF',
      fontSize: 15,
    }}>
      {text}
    </div>
  )
}
