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
    <div className="portal__login-bg">
      <div className="portal__login-card">
        <h1 className="portal__login-title">Pharmacy Portal</h1>
        <p className="portal__login-subtitle">CNC Delivery</p>

        <form onSubmit={handleSubmit} className="portal__login-form">
          <label className="portal__label">
            Email
            <input
              type="email"
              className="portal__input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              placeholder="pharmacy@example.com"
            />
          </label>

          <label className="portal__label">
            Password
            <input
              type="password"
              className="portal__input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              placeholder="Enter password"
            />
          </label>

          {error && <div className="portal__error">{error}</div>}

          <button
            type="submit"
            className="portal__btn portal__btn--primary"
            disabled={submitting}
          >
            {submitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}
