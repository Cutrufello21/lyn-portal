import { useState, useEffect } from 'react'
import { usePharmacyAuth } from '../context/PharmacyAuthContext'
import { supabase } from '../lib/supabase'
import { Link } from 'react-router-dom'
import './portal.css'

function todayStr() {
  return new Date().toISOString().slice(0, 10)
}

export default function Dashboard() {
  const { tenant, signOut } = usePharmacyAuth()
  const [date, setDate] = useState(todayStr())
  const [stops, setStops] = useState([])
  const [loading, setLoading] = useState(true)

  async function fetchStops() {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('daily_stops')
        .select('*')
        .eq('pharmacy', tenant.name)
        .gte('created_at', `${date}T00:00:00`)
        .lt('created_at', `${date}T23:59:59.999`)
        .order('created_at', { ascending: true })

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
  }, [date, tenant.name])

  // Realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel('daily_stops_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'daily_stops' },
        (payload) => {
          const row = payload.new
          if (row && row.pharmacy === tenant.name) {
            fetchStops()
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [date, tenant.name])

  const total = stops.length
  const delivered = stops.filter((s) => s.status === 'delivered').length
  const inProgress = stops.filter((s) =>
    ['assigned', 'in_transit', 'picked_up'].includes(s.status)
  ).length
  const failed = stops.filter((s) => s.status === 'failed').length
  const pct = total > 0 ? Math.round((delivered / total) * 100) : 0

  // Active drivers
  const driverMap = {}
  stops.forEach((s) => {
    if (!s.driver_name) return
    if (!driverMap[s.driver_name]) {
      driverMap[s.driver_name] = { total: 0, delivered: 0 }
    }
    driverMap[s.driver_name].total++
    if (s.status === 'delivered') driverMap[s.driver_name].delivered++
  })
  const drivers = Object.entries(driverMap).map(([name, d]) => ({
    name,
    ...d,
  }))

  return (
    <div className="portal__page">
      <header className="portal__header">
        <div className="portal__header-left">
          <h1 className="portal__tenant-name">{tenant.display_name}</h1>
          <nav className="portal__nav">
            <Link to="/dashboard" className="portal__nav-link portal__nav-link--active">Dashboard</Link>
            <Link to="/deliveries" className="portal__nav-link">Deliveries</Link>
          </nav>
        </div>
        <button onClick={signOut} className="portal__btn portal__btn--outline">Sign Out</button>
      </header>

      <main className="portal__main">
        <div className="portal__toolbar">
          <h2 className="portal__section-title">Daily Overview</h2>
          <input
            type="date"
            className="portal__date-input"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="portal__loading"><div className="portal__spinner" /><p>Loading...</p></div>
        ) : (
          <>
            <div className="portal__kpi-grid">
              <div className="portal__kpi-card">
                <span className="portal__kpi-value">{total}</span>
                <span className="portal__kpi-label">Total Stops</span>
              </div>
              <div className="portal__kpi-card portal__kpi-card--success">
                <span className="portal__kpi-value">{delivered}</span>
                <span className="portal__kpi-label">Delivered</span>
              </div>
              <div className="portal__kpi-card portal__kpi-card--warning">
                <span className="portal__kpi-value">{inProgress}</span>
                <span className="portal__kpi-label">In Progress</span>
              </div>
              <div className="portal__kpi-card portal__kpi-card--danger">
                <span className="portal__kpi-value">{failed}</span>
                <span className="portal__kpi-label">Failed</span>
              </div>
            </div>

            <div className="portal__progress-section">
              <div className="portal__progress-bar-bg">
                <div
                  className="portal__progress-bar-fill"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="portal__progress-label">{pct}% delivered</span>
            </div>

            {total === 0 ? (
              <div className="portal__empty">No deliveries for this date.</div>
            ) : (
              <>
                <h3 className="portal__section-title">Active Drivers</h3>
                {drivers.length === 0 ? (
                  <div className="portal__empty">No assigned drivers.</div>
                ) : (
                  <div className="portal__table-wrap">
                    <table className="portal__table">
                      <thead>
                        <tr>
                          <th>Driver</th>
                          <th>Stops</th>
                          <th>Delivered</th>
                          <th>Remaining</th>
                        </tr>
                      </thead>
                      <tbody>
                        {drivers.map((d) => (
                          <tr key={d.name}>
                            <td>{d.name}</td>
                            <td>{d.total}</td>
                            <td>{d.delivered}</td>
                            <td>{d.total - d.delivered}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </main>
    </div>
  )
}
