import { Navigate } from 'react-router-dom'
import { usePharmacyAuth } from '../context/PharmacyAuthContext'

export default function ProtectedRoute({ children }) {
  const { user, tenant, loading } = usePharmacyAuth()

  if (loading) {
    return (
      <div className="portal__loading">
        <div className="portal__spinner" />
        <p>Loading...</p>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/" replace />
  }

  if (!tenant) {
    return (
      <div className="portal__no-access">
        <h2>No Access</h2>
        <p>Your account is not linked to a pharmacy tenant. Please contact your administrator.</p>
      </div>
    )
  }

  return children
}
