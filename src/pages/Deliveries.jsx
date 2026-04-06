import { useState } from 'react'
import { DEMO_DELIVERIES } from '../data/demoData'
import PODModal from '../components/PODModal'
import './portal.css'

const DRIVERS = [...new Set(DEMO_DELIVERIES.map((d) => d.driver))]

export default function Deliveries() {
  const [selectedDelivery, setSelectedDelivery] = useState(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [driverFilter, setDriverFilter] = useState('all')

  const filtered = DEMO_DELIVERIES.filter((d) => {
    if (statusFilter !== 'all' && d.status !== statusFilter) return false
    if (driverFilter !== 'all' && d.driver !== driverFilter) return false
    if (search) {
      const q = search.toLowerCase()
      const fields = [d.patient, d.address, d.city, d.zip, d.driver]
      if (!fields.some((f) => f && f.toLowerCase().includes(q))) return false
    }
    return true
  })

  return (
    <>
      {/* Filters */}
      <div className="lyn__filters">
        <div className="lyn__date-range">
          <input type="date" className="lyn__input" defaultValue="2026-04-06" />
          <span className="lyn__date-sep">to</span>
          <input type="date" className="lyn__input" defaultValue="2026-04-06" />
        </div>
        <input
          type="text"
          className="lyn__input lyn__input--search"
          placeholder="Search patient, address, driver..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="lyn__select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Statuses</option>
          <option value="delivered">Delivered</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
        </select>
        <select
          className="lyn__select"
          value={driverFilter}
          onChange={(e) => setDriverFilter(e.target.value)}
        >
          <option value="all">All Drivers</option>
          {DRIVERS.map((driver) => (
            <option key={driver} value={driver}>{driver}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="lyn__table-card">
        <div className="lyn__table-wrap">
          <table className="lyn__table">
            <thead>
              <tr>
                <th>Patient Name</th>
                <th>Address</th>
                <th>City</th>
                <th>ZIP</th>
                <th>Driver</th>
                <th>Status</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((d) => (
                <tr key={d.id} onClick={() => setSelectedDelivery(d)}>
                  <td style={{ fontWeight: 600 }}>
                    {d.patient}
                    {d.coldChain && (
                      <span className="lyn__cold-chain" style={{ marginLeft: 8 }}>&#10052;</span>
                    )}
                  </td>
                  <td>{d.address}</td>
                  <td>{d.city}</td>
                  <td>{d.zip}</td>
                  <td>{d.driver}</td>
                  <td>
                    <span className={`lyn__badge lyn__badge--${d.status}`}>
                      <span className="lyn__badge-dot" />
                      {d.status}
                    </span>
                  </td>
                  <td>{d.time}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', color: 'var(--lyn-gray)', padding: 40 }}>
                    No deliveries match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* POD Modal */}
      {selectedDelivery && (
        <PODModal
          delivery={selectedDelivery}
          onClose={() => setSelectedDelivery(null)}
        />
      )}
    </>
  )
}
