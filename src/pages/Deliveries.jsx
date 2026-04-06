import { useState, useEffect } from 'react'
import { usePharmacyAuth } from '../context/PharmacyAuthContext'
import { supabase } from '../lib/supabase'
import { Link, useNavigate } from 'react-router-dom'
import './portal.css'

function todayStr() {
  return new Date().toISOString().slice(0, 10)
}

function sevenDaysAgo() {
  const d = new Date()
  d.setDate(d.getDate() - 7)
  return d.toISOString().slice(0, 10)
}

const STATUS_COLORS = {
  delivered: 'portal__badge--success',
  failed: 'portal__badge--danger',
  assigned: 'portal__badge--info',
  in_transit: 'portal__badge--warning',
  picked_up: 'portal__badge--warning',
  pending: 'portal__badge--neutral',
}

export default function Deliveries() {
  const { tenant, signOut } = usePharmacyAuth()
  const navigate = useNavigate()
  const [startDate, setStartDate] = useState(sevenDaysAgo())
  const [endDate, setEndDate] = useState(todayStr())
  const [stops, setStops] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  async function fetchStops() {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('daily_stops')
        .select('*')
        .eq('pharmacy', tenant.name)
        .gte('created_at', `${startDate}T00:00:00`)
        .lte('created_at', `${endDate}T23:59:59.999`)
        .order('created_at', { ascending: false })

      if (error) {
        console.warn('daily_stops query error:', error.message)
        setStops([])
      } else {
        setStops(data || [])
      }
    } catch {
      setStops([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStops()
  }, [startDate, endDate, tenant.name])

  const filtered = stops.filter((s) => {
    if (statusFilter !== 'all' && s.status !== statusFilter) return false
    if (search) {
      const q = search.toLowerCase()
      const fields = [
        s.patient_name,
        s.address,
        s.city,
        s.zip,
        s.driver_name,
        s.status,
      ]
      if (!fields.some((f) => f && f.toLowerCase().includes(q))) return false
    }
    return true
  })

  return (
    <div className="portal__page">
      <header className="portal__header">
        <div className="portal__header-left">
          <h1 className="portal__tenant-name">{tenant.display_name}</h1>
          <nav className="portal__nav">
            <Link to="/dashboard" className="portal__nav-link">Dashboard</Link>
            <Link to="/deliveries" className="portal__nav-link portal__nav-link--active">Deliveries</Link>
          </nav>
        </div>
        <button onClick={signOut} className="portal__btn portal__btn--outline">Sign Out</button>
      </header>

      <main className="portal__main">
        <div className="portal__toolbar">
          <h2 className="portal__section-title">Deliveries</h2>
          <div className="portal__toolbar-controls">
            <input
              type="date"
              className="portal__date-input"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <span className="portal__date-sep">to</span>
            <input
              type="date"
              className="portal__date-input"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>

        <div className="portal__filters">
          <input
            type="text"
            className="portal__input portal__search-input"
            placeholder="Search patient, address, driver..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="portal__select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="delivered">Delivered</option>
            <option value="in_transit">In Transit</option>
            <option value="assigned">Assigned</option>
            <option value="failed">Failed</option>
            <option value="pending">Pending</option>
          </select>
        </div>

        {loading ? (
          <div className="portal__loading"><div className="portal__spinner" /><p>Loading...</p></div>
        ) : filtered.length === 0 ? (
          <div className="portal__empty">No deliveries found.</div>
        ) : (
          <div className="portal__table-wrap">
            <table className="portal__table">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Address</th>
                  <th>City</th>
                  <th>ZIP</th>
                  <th>Driver</th>
                  <th>Status</th>
                  <th>Delivered At</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => (
                  <tr
                    key={s.id}
                    className="portal__table-row--clickable"
                    onClick={() => navigate(`/pod/${s.order_id || s.id}`)}
                  >
                    <td>{s.patient_name || '-'}</td>
                    <td>{s.address || '-'}</td>
                    <td>{s.city || '-'}</td>
                    <td>{s.zip || '-'}</td>
                    <td>{s.driver_name || '-'}</td>
                    <td>
                      <span className={`portal__badge ${STATUS_COLORS[s.status] || 'portal__badge--neutral'}`}>
                        {(s.status || 'unknown').replace('_', ' ')}
                      </span>
                    </td>
                    <td>
                      {s.delivered_at
                        ? new Date(s.delivered_at).toLocaleString()
                        : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  )
}
