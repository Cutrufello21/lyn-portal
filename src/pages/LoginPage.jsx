import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePharmacyAuth } from '../context/PharmacyAuthContext'
import './portal.css'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const { signIn, user } = usePharmacyAuth()
  const navigate = useNavigate()

  // If already logged in, redirect
  if (user) {
    navigate('/dashboard', { replace: true })
    return null
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      await signIn(email, password)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'Sign in failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="lyn__login-bg">
      <div className="lyn__login-card">
        <div className="lyn__login-logo">
          <span className="lyn__login-logo-text">
            LYN<span className="lyn__login-logo-dot" />
          </span>
        </div>
        <p className="lyn__login-subtitle">Pharmacy Portal</p>

        <form onSubmit={handleSubmit} className="lyn__login-form">
          <label className="lyn__login-label">
            Email
            <input
              type="email"
              className="lyn__login-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              placeholder="pharmacy@example.com"
            />
          </label>

          <label className="lyn__login-label">
            Password
            <input
              type="password"
              className="lyn__login-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              placeholder="Enter password"
            />
          </label>

          {error && <div className="lyn__login-error">{error}</div>}

          <button
            type="submit"
            className="lyn__login-btn"
            disabled={submitting}
          >
            {submitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}
