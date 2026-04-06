import { useState } from 'react'
import { DEMO_DELIVERIES } from '../data/demoData'
import PODModal from '../components/PODModal'
import './portal.css'

// Only show deliveries that have a completed status (delivered or failed)
const POD_RECORDS = DEMO_DELIVERIES.filter((d) => d.status === 'delivered' || d.status === 'failed')

export default function PODRecords() {
  const [selectedDelivery, setSelectedDelivery] = useState(null)

  return (
    <>
      <div className="lyn__section-header" style={{ marginBottom: 20 }}>
        <h3 className="lyn__section-title">Delivery Confirmations</h3>
        <span style={{ fontSize: 13, color: 'var(--lyn-gray)' }}>
          {POD_RECORDS.length} records
        </span>
      </div>

      <div className="lyn__pod-grid">
        {POD_RECORDS.map((d) => (
          <div
            key={d.id}
            className="lyn__pod-card"
            onClick={() => setSelectedDelivery(d)}
          >
            <div className="lyn__pod-card-header">
              <span className="lyn__pod-card-patient">{d.patient}</span>
              <span className={`lyn__badge lyn__badge--${d.status}`}>
                <span className="lyn__badge-dot" />
                {d.status}
              </span>
            </div>
            <div className="lyn__pod-card-address">
              {d.address}<br />
              {d.city}, OH {d.zip}
            </div>
            <div className="lyn__pod-card-meta">
              <span>{d.driver}</span>
              <span>{d.time}</span>
            </div>
            <div className="lyn__pod-card-photo">
              &#128247;
            </div>
          </div>
        ))}
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
