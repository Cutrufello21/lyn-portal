import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { usePharmacyAuth } from '../context/PharmacyAuthContext'
import { supabase } from '../lib/supabase'
import './portal.css'

export default function POD() {
  const { orderId } = useParams()
  const { tenant, signOut } = usePharmacyAuth()
  const [stop, setStop] = useState(null)
  const [confirmation, setConfirmation] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetch() {
      setLoading(true)
      try {
        // Fetch the stop
        const { data: stopData } = await supabase
          .from('daily_stops')
          .select('*')
          .eq('pharmacy', tenant.name)
          .or(`order_id.eq.${orderId},id.eq.${orderId}`)
          .single()

        setStop(stopData || null)

        // Fetch delivery confirmation if table exists
        if (stopData) {
          const { data: confData, error: confErr } = await supabase
            .from('delivery_confirmations')
            .select('*')
            .eq('stop_id', stopData.id)
            .single()

          if (!confErr && confData) {
            setConfirmation(confData)
          }
        }
      } catch {
        // Tables may not exist yet
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [orderId, tenant.name])

  function handlePrint() {
    window.print()
  }

  return (
    <div className="portal__page">
      <header className="portal__header">
        <div className="portal__header-left">
          <h1 className="portal__tenant-name">{tenant.display_name}</h1>
          <nav className="portal__nav">
            <Link to="/dashboard" className="portal__nav-link">Dashboard</Link>
            <Link to="/deliveries" className="portal__nav-link">Deliveries</Link>
          </nav>
        </div>
        <button onClick={signOut} className="portal__btn portal__btn--outline">Sign Out</button>
      </header>

      <main className="portal__main">
        <div className="portal__toolbar">
          <h2 className="portal__section-title">Proof of Delivery</h2>
          <div className="portal__toolbar-controls">
            <Link to="/deliveries" className="portal__btn portal__btn--outline">Back</Link>
            <button onClick={handlePrint} className="portal__btn portal__btn--primary">Print</button>
          </div>
        </div>

        {loading ? (
          <div className="portal__loading"><div className="portal__spinner" /><p>Loading...</p></div>
        ) : !stop ? (
          <div className="portal__empty">Delivery not found.</div>
        ) : (
          <div className="portal__pod">
            {/* Patient & Delivery Info */}
            <section className="portal__pod-section">
              <h3 className="portal__pod-heading">Delivery Information</h3>
              <div className="portal__pod-grid">
                <div className="portal__pod-field">
                  <span className="portal__pod-label">Patient</span>
                  <span className="portal__pod-value">{stop.patient_name || '-'}</span>
                </div>
                <div className="portal__pod-field">
                  <span className="portal__pod-label">Address</span>
                  <span className="portal__pod-value">
                    {stop.address || '-'}{stop.city ? `, ${stop.city}` : ''}{stop.zip ? ` ${stop.zip}` : ''}
                  </span>
                </div>
                <div className="portal__pod-field">
                  <span className="portal__pod-label">Driver</span>
                  <span className="portal__pod-value">{stop.driver_name || '-'}</span>
                </div>
                <div className="portal__pod-field">
                  <span className="portal__pod-label">Status</span>
                  <span className="portal__pod-value">{(stop.status || '-').replace('_', ' ')}</span>
                </div>
                <div className="portal__pod-field">
                  <span className="portal__pod-label">Delivered At</span>
                  <span className="portal__pod-value">
                    {stop.delivered_at ? new Date(stop.delivered_at).toLocaleString() : '-'}
                  </span>
                </div>
              </div>
            </section>

            {/* Confirmation / POD data */}
            {confirmation ? (
              <>
                <section className="portal__pod-section">
                  <h3 className="portal__pod-heading">Photos</h3>
                  <div className="portal__pod-photos">
                    {confirmation.package_photo_url && (
                      <div className="portal__pod-photo-wrap">
                        <p className="portal__pod-photo-label">Package</p>
                        <img
                          src={confirmation.package_photo_url}
                          alt="Package"
                          className="portal__pod-photo"
                        />
                      </div>
                    )}
                    {confirmation.house_photo_url && (
                      <div className="portal__pod-photo-wrap">
                        <p className="portal__pod-photo-label">Drop-off Location</p>
                        <img
                          src={confirmation.house_photo_url}
                          alt="Drop-off location"
                          className="portal__pod-photo"
                        />
                      </div>
                    )}
                  </div>
                </section>

                {confirmation.signature_url && (
                  <section className="portal__pod-section">
                    <h3 className="portal__pod-heading">Signature</h3>
                    <img
                      src={confirmation.signature_url}
                      alt="Signature"
                      className="portal__pod-signature"
                    />
                  </section>
                )}

                <section className="portal__pod-section">
                  <h3 className="portal__pod-heading">Additional Details</h3>
                  <div className="portal__pod-grid">
                    {confirmation.gps_lat != null && confirmation.gps_lng != null && (
                      <div className="portal__pod-field">
                        <span className="portal__pod-label">GPS</span>
                        <span className="portal__pod-value">
                          {confirmation.gps_lat.toFixed(6)}, {confirmation.gps_lng.toFixed(6)}
                        </span>
                      </div>
                    )}
                    {confirmation.geofence_status && (
                      <div className="portal__pod-field">
                        <span className="portal__pod-label">Geofence</span>
                        <span className={`portal__pod-value ${
                          confirmation.geofence_status === 'inside'
                            ? 'portal__text--success'
                            : 'portal__text--danger'
                        }`}>
                          {confirmation.geofence_status === 'inside' ? 'Within range' : 'Outside range'}
                        </span>
                      </div>
                    )}
                    {confirmation.delivery_note && (
                      <div className="portal__pod-field portal__pod-field--full">
                        <span className="portal__pod-label">Delivery Note</span>
                        <span className="portal__pod-value">{confirmation.delivery_note}</span>
                      </div>
                    )}
                  </div>
                </section>
              </>
            ) : (
              <div className="portal__empty">
                No proof of delivery available yet.
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
