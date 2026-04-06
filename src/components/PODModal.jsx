export default function PODModal({ delivery, onClose }) {
  if (!delivery) return null

  const isDelivered = delivery.status === 'delivered'
  const isFailed = delivery.status === 'failed'

  return (
    <div className="lyn__modal-backdrop" onClick={onClose}>
      <div className="lyn__modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="lyn__modal-header">
          <h2 className="lyn__modal-title">Proof of Delivery</h2>
          <button className="lyn__modal-close" onClick={onClose}>&times;</button>
        </div>

        {/* Body */}
        <div className="lyn__modal-body">
          {/* Patient & Delivery Info */}
          <div className="lyn__modal-section">
            <div className="lyn__modal-section-title">Delivery Details</div>
            <div className="lyn__modal-row">
              <div className="lyn__modal-field">
                <span className="lyn__modal-label">Patient</span>
                <span className="lyn__modal-value">{delivery.patient}</span>
              </div>
              <div className="lyn__modal-field">
                <span className="lyn__modal-label">Driver</span>
                <span className="lyn__modal-value">{delivery.driver}</span>
              </div>
            </div>
            <div className="lyn__modal-row">
              <div className="lyn__modal-field lyn__modal-field--full">
                <span className="lyn__modal-label">Address</span>
                <span className="lyn__modal-value">
                  {delivery.address}, {delivery.city} {delivery.zip}
                </span>
              </div>
            </div>
            <div className="lyn__modal-row">
              <div className="lyn__modal-field">
                <span className="lyn__modal-label">Status</span>
                <span className={`lyn__badge lyn__badge--${delivery.status}`}>
                  <span className="lyn__badge-dot" />
                  {delivery.status}
                </span>
              </div>
              <div className="lyn__modal-field">
                <span className="lyn__modal-label">Time</span>
                <span className="lyn__modal-value">{delivery.time}</span>
              </div>
            </div>
            {delivery.coldChain && (
              <div className="lyn__cold-chain">
                &#10052; Cold Chain - Temperature Verified
              </div>
            )}
          </div>

          {/* Photos */}
          {(isDelivered || isFailed) && (
            <div className="lyn__modal-section">
              <div className="lyn__modal-section-title">Photos</div>
              <div className="lyn__modal-photos">
                <div className="lyn__modal-photo-box">
                  <span className="lyn__modal-photo-icon">&#128247;</span>
                  <span className="lyn__modal-photo-label">Package Photo</span>
                </div>
                <div className="lyn__modal-photo-box">
                  <span className="lyn__modal-photo-icon">&#127968;</span>
                  <span className="lyn__modal-photo-label">Delivery Location</span>
                </div>
              </div>
            </div>
          )}

          {/* Signature */}
          {isDelivered && (
            <div className="lyn__modal-section">
              <div className="lyn__modal-section-title">Signature</div>
              <div className="lyn__modal-signature-box">
                <span className="lyn__modal-photo-icon">&#9997;</span>
                <span className="lyn__modal-photo-label">Signature Captured</span>
              </div>
            </div>
          )}

          {/* GPS & Geofence */}
          {delivery.gps && (
            <div className="lyn__modal-section">
              <div className="lyn__modal-section-title">Verification</div>
              <div className="lyn__modal-row">
                <div className="lyn__modal-field">
                  <span className="lyn__modal-label">GPS Coordinates</span>
                  <span className="lyn__modal-gps">
                    {delivery.gps.lat.toFixed(6)}, {delivery.gps.lng.toFixed(6)}
                  </span>
                </div>
                <div className="lyn__modal-field">
                  <span className="lyn__modal-label">Geofence</span>
                  {delivery.distance <= 150 ? (
                    <span className="lyn__modal-geofence">
                      &#10003; Within {delivery.distance} feet &mdash; Verified
                    </span>
                  ) : (
                    <span className="lyn__modal-geofence" style={{ color: 'var(--lyn-red)' }}>
                      &#10007; {delivery.distance} feet &mdash; Outside Range
                      {delivery.overridden && ' (Override)'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Delivery Note */}
          {delivery.note && (
            <div className="lyn__modal-section">
              <div className="lyn__modal-section-title">Delivery Note</div>
              <p className="lyn__modal-note">&ldquo;{delivery.note}&rdquo;</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="lyn__modal-footer">
          <button className="lyn__btn lyn__btn--ghost" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
