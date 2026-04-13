import { useState, useMemo } from 'react'
import { DEMO_DELIVERIES, DEMO_STATS } from '../data/demoData'
import PODModal from '../components/PODModal'
import './portal.css'

const DRIVERS = [...new Set(DEMO_DELIVERIES.map((d) => d.driver))].sort()
const CITIES = [...new Set(DEMO_DELIVERIES.map((d) => d.city))].sort()
const ZIPS = [...new Set(DEMO_DELIVERIES.map((d) => d.zip))].sort()

export default function Dashboard() {
  const [selectedDelivery, setSelectedDelivery] = useState(null)

  // Search & filters
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [driverFilter, setDriverFilter] = useState('all')
  const [cityFilter, setCityFilter] = useState('all')
  const [zipFilter, setZipFilter] = useState('all')

  // Sorting
  const [sortCol, setSortCol] = useState(null)
  const [sortAsc, setSortAsc] = useState(true)

  function toggleSort(col) {
    if (sortCol === col) setSortAsc(!sortAsc)
    else { setSortCol(col); setSortAsc(true) }
  }

  function sortArrow(col) {
    if (sortCol !== col) return <span className="lyn__sort-icon">&#8597;</span>
    return <span className="lyn__sort-icon lyn__sort-icon--active">{sortAsc ? '\u25B2' : '\u25BC'}</span>
  }

  const filtered = useMemo(() => {
    let rows = DEMO_DELIVERIES.filter((d) => {
      if (statusFilter !== 'all' && d.status !== statusFilter) return false
      if (driverFilter !== 'all' && d.driver !== driverFilter) return false
      if (cityFilter !== 'all' && d.city !== cityFilter) return false
      if (zipFilter !== 'all' && d.zip !== zipFilter) return false
      if (search) {
        const q = search.toLowerCase()
        const fields = [d.patient, d.address, d.city, d.zip, d.driver, String(d.id)]
        if (!fields.some((f) => f && f.toLowerCase().includes(q))) return false
      }
      return true
    })

    if (sortCol) {
      rows = [...rows].sort((a, b) => {
        const dir = sortAsc ? 1 : -1
        const va = (a[sortCol] || '').toString().toLowerCase()
        const vb = (b[sortCol] || '').toString().toLowerCase()
        return va < vb ? -dir : va > vb ? dir : 0
      })
    }

    return rows
  }, [search, statusFilter, driverFilter, cityFilter, zipFilter, sortCol, sortAsc])

  const hasFilters = search || statusFilter !== 'all' || driverFilter !== 'all' || cityFilter !== 'all' || zipFilter !== 'all'

  const delivered = DEMO_DELIVERIES.filter((d) => d.status === 'delivered').length
  const total = DEMO_DELIVERIES.length
  const pct = Math.round((delivered / total) * 100)

  return (
    <>
      {/* Stats Row */}
      <div className="lyn__stats-grid">
        <div className="lyn__stat-card">
          <span className="lyn__stat-icon">&#128230;</span>
          <div className="lyn__stat-value">{DEMO_STATS.total}</div>
          <div className="lyn__stat-label">Total Deliveries</div>
          <span className="lyn__stat-trend lyn__stat-trend--up">&#9650; {DEMO_STATS.totalTrend} vs last week</span>
        </div>
        <div className="lyn__stat-card">
          <span className="lyn__stat-icon">&#10003;</span>
          <div className="lyn__stat-value" style={{ color: 'var(--lyn-emerald)' }}>{DEMO_STATS.delivered}</div>
          <div className="lyn__stat-label">Delivered</div>
          <span className="lyn__stat-trend lyn__stat-trend--up">&#9650; {DEMO_STATS.deliveredTrend} vs last week</span>
        </div>
        <div className="lyn__stat-card">
          <span className="lyn__stat-icon">&#9201;</span>
          <div className="lyn__stat-value" style={{ color: 'var(--lyn-amber)' }}>{DEMO_STATS.pending}</div>
          <div className="lyn__stat-label">Pending</div>
          <span className="lyn__stat-trend lyn__stat-trend--neutral">&#9660; {DEMO_STATS.pendingTrend} vs last week</span>
        </div>
        <div className="lyn__stat-card">
          <span className="lyn__stat-icon">&#10007;</span>
          <div className="lyn__stat-value" style={{ color: 'var(--lyn-red)' }}>{DEMO_STATS.failed}</div>
          <div className="lyn__stat-label">Failed</div>
          <span className="lyn__stat-trend lyn__stat-trend--up">&#9660; {DEMO_STATS.failedTrend} vs last week</span>
        </div>
      </div>

      {/* Activity Card */}
      <div className="lyn__activity-card">
        <div className="lyn__activity-header">
          <span className="lyn__activity-title">Today's Activity</span>
          <span className="lyn__activity-pct">{pct}% Complete</span>
        </div>
        <div className="lyn__activity-bar-bg">
          <div
            className="lyn__activity-bar-fill lyn__activity-bar-fill--emerald"
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="lyn__activity-stats">
          <div className="lyn__activity-stat">
            <span className="lyn__activity-dot lyn__activity-dot--emerald" />
            {delivered} Delivered
          </div>
          <div className="lyn__activity-stat">
            <span className="lyn__activity-dot lyn__activity-dot--amber" />
            {DEMO_DELIVERIES.filter((d) => d.status === 'pending').length} Pending
          </div>
          <div className="lyn__activity-stat">
            <span className="lyn__activity-dot lyn__activity-dot--red" />
            {DEMO_DELIVERIES.filter((d) => d.status === 'failed').length} Failed
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="lyn__section-header" style={{ marginBottom: 0 }}>
        <h3 className="lyn__section-title">Recent Deliveries</h3>
        {hasFilters && (
          <span className="lyn__filter-count">{filtered.length} of {DEMO_DELIVERIES.length} orders</span>
        )}
      </div>

      <div className="lyn__filters">
        <input
          type="text"
          className="lyn__input lyn__input--search"
          placeholder="Search order #, patient name, address..."
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
          {DRIVERS.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
        <select
          className="lyn__select"
          value={cityFilter}
          onChange={(e) => setCityFilter(e.target.value)}
        >
          <option value="all">All Cities</option>
          {CITIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select
          className="lyn__select"
          value={zipFilter}
          onChange={(e) => setZipFilter(e.target.value)}
        >
          <option value="all">All ZIPs</option>
          {ZIPS.map((z) => (
            <option key={z} value={z}>{z}</option>
          ))}
        </select>
        {hasFilters && (
          <button
            className="lyn__clear-btn"
            onClick={() => { setSearch(''); setStatusFilter('all'); setDriverFilter('all'); setCityFilter('all'); setZipFilter('all'); setSortCol(null); setSortAsc(true) }}
          >
            Clear
          </button>
        )}
      </div>

      {/* Table */}
      <div className="lyn__table-card">
        <div className="lyn__table-wrap">
          <table className="lyn__table">
            <thead>
              <tr>
                <th onClick={() => toggleSort('patient')} className="lyn__th--sortable">
                  Patient {sortArrow('patient')}
                </th>
                <th onClick={() => toggleSort('address')} className="lyn__th--sortable">
                  Address {sortArrow('address')}
                </th>
                <th onClick={() => toggleSort('city')} className="lyn__th--sortable">
                  City {sortArrow('city')}
                </th>
                <th onClick={() => toggleSort('zip')} className="lyn__th--sortable">
                  ZIP {sortArrow('zip')}
                </th>
                <th onClick={() => toggleSort('driver')} className="lyn__th--sortable">
                  Driver {sortArrow('driver')}
                </th>
                <th onClick={() => toggleSort('status')} className="lyn__th--sortable">
                  Status {sortArrow('status')}
                </th>
                <th onClick={() => toggleSort('time')} className="lyn__th--sortable">
                  Time {sortArrow('time')}
                </th>
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
                    No deliveries match your search.
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
