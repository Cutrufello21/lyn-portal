import { useState } from 'react'
import { DEMO_DELIVERIES, DEMO_STATS } from '../data/demoData'
import PODModal from '../components/PODModal'
import './portal.css'

export default function Dashboard() {
  const [selectedDelivery, setSelectedDelivery] = useState(null)

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

      {/* Recent Deliveries Table */}
      <div className="lyn__section-header">
        <h3 className="lyn__section-title">Recent Deliveries</h3>
      </div>
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
              {DEMO_DELIVERIES.map((d) => (
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
