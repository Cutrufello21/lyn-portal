import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const PharmacyAuthContext = createContext(null)

export function PharmacyAuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [tenant, setTenant] = useState(null)
  const [loading, setLoading] = useState(true)

  async function fetchTenant(userId) {
    try {
      const { data: tenantUser, error: tuError } = await supabase
        .from('tenant_users')
        .select('tenant_id, role')
        .eq('user_id', userId)
        .single()

      if (tuError || !tenantUser) {
        setTenant(null)
        return
      }

      const { data: tenantData, error: tError } = await supabase
        .from('tenants')
        .select('*')
        .eq('id', tenantUser.tenant_id)
        .single()

      if (tError || !tenantData) {
        setTenant(null)
        return
      }

      setTenant({ ...tenantData, role: tenantUser.role })
    } catch {
      setTenant(null)
    }
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      const currentUser = session?.user ?? null
      setUser(currentUser)
      if (currentUser) {
        fetchTenant(currentUser.id).finally(() => setLoading(false))
      } else {
        setLoading(false)
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        const currentUser = session?.user ?? null
        setUser(currentUser)
        if (currentUser) {
          fetchTenant(currentUser.id).finally(() => setLoading(false))
        } else {
          setTenant(null)
          setLoading(false)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  async function signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    return data
  }

  async function signOut() {
    await supabase.auth.signOut()
    setUser(null)
    setTenant(null)
  }

  return (
    <PharmacyAuthContext.Provider value={{ user, tenant, loading, signIn, signOut }}>
      {children}
    </PharmacyAuthContext.Provider>
  )
}

export function usePharmacyAuth() {
  const ctx = useContext(PharmacyAuthContext)
  if (!ctx) throw new Error('usePharmacyAuth must be used inside PharmacyAuthProvider')
  return ctx
}
