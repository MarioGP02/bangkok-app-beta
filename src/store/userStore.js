import { create } from 'zustand'
import { supabase } from '@/lib/supabaseClient'

export const STAMPS_REQUIRED = 8

/**
 * @typedef {Object} User
 * @property {string} id               - Supabase UUID
 * @property {string} name
 * @property {string} email
 * @property {number} stamps           - current stamp count (0 to STAMPS_REQUIRED-1)
 * @property {number} completedOrders  - lifetime orders
 * @property {number} rewardsClaimed   - how many full cards completed
 * @property {'customer'|'admin'} role
 */

const useUserStore = create((set, get) => ({
  /** @type {User | null} */
  user: null,
  isAuthenticated: false,
  /** Set when a full stamp card is just completed */
  pendingReward: false,

  // ─── Guest mode ─────────────────────────────────────────────────────────────
  guestMode: false,
  guestContact: null,

  enterGuestMode()            { set({ guestMode: true, guestContact: null }) },
  exitGuestMode()             { set({ guestMode: false, guestContact: null }) },
  setGuestContact(contact)    { set({ guestContact: contact }) },

  // ─── Internal: hydrate user from profiles row ────────────────────────────────
  async _loadProfile(supabaseUser) {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', supabaseUser.id)
      .single()

    if (error || !profile) return

    set({
      user: {
        id:              supabaseUser.id,
        name:            profile.name,
        email:           supabaseUser.email,
        stamps:          profile.stamps,
        completedOrders: profile.completed_orders,
        rewardsClaimed:  profile.rewards_claimed,
        role:            profile.role,
      },
      isAuthenticated: true,
    })
  },

  // ─── Init: restore session on app load ───────────────────────────────────────
  // Call once from App.jsx useEffect. Returns cleanup function.
  async init() {
    const { data: { session } } = await supabase.auth.getSession()
    if (session?.user) {
      await get()._loadProfile(session.user)
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          await get()._loadProfile(session.user)
        } else if (event === 'SIGNED_OUT') {
          set({ user: null, isAuthenticated: false, pendingReward: false })
        }
      }
    )

    return () => subscription.unsubscribe()
  },

  // ─── Auth ────────────────────────────────────────────────────────────────────

  /**
   * @param {{ name: string, email: string, password: string }} data
   * @returns {Promise<{ error?: string, role?: string }>}
   */
  async register({ name, email, password }) {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    })
    if (error) {
      const msg = error.message.toLowerCase()
      if (msg.includes('already registered') || msg.includes('already exists')) {
        return { error: 'Este email ya está registrado.' }
      }
      return { error: error.message }
    }
    // onAuthStateChange fires and loads the profile automatically
    return { role: 'customer' }
  },

  /**
   * @param {{ email: string, password: string }} data
   * @returns {Promise<{ error?: string, role?: string }>}
   */
  async login({ email, password }) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return { error: 'Email o contraseña incorrectos.' }

    // Get role immediately (onAuthStateChange will also fire, no problem)
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', data.user.id)
      .single()

    return { role: profile?.role ?? 'customer' }
  },

  async logout() {
    await supabase.auth.signOut()
    set({
      user:         null,
      isAuthenticated: false,
      pendingReward: false,
      guestMode:    false,
      guestContact: null,
    })
  },

  // ─── Loyalty ─────────────────────────────────────────────────────────────────

  /** Add 1 stamp after a completed order. Returns true if reward earned. */
  async addStamp() {
    const { user } = get()
    if (!user) return false

    const newCompleted = user.completedOrders + 1
    const rawStamps    = user.stamps + 1
    const rewardEarned = rawStamps >= STAMPS_REQUIRED
    const newStamps    = rewardEarned ? 0 : rawStamps
    const newRewards   = (user.rewardsClaimed ?? 0) + (rewardEarned ? 1 : 0)

    await supabase
      .from('profiles')
      .update({
        stamps:           newStamps,
        completed_orders: newCompleted,
        rewards_claimed:  newRewards,
      })
      .eq('id', user.id)

    set({
      user: {
        ...user,
        stamps:          newStamps,
        completedOrders: newCompleted,
        rewardsClaimed:  newRewards,
      },
      pendingReward: rewardEarned,
    })

    return rewardEarned
  },

  clearPendingReward() {
    set({ pendingReward: false })
  },

  // ─── Profile update ───────────────────────────────────────────────────────────

  /**
   * @param {{ name: string, email: string, password?: string }} data
   * @returns {Promise<{ error?: string }>}
   */
  async updateProfile({ name, email, password }) {
    const { user } = get()
    if (!user) return { error: 'No autenticado' }

    // Auth-level updates (email / password)
    const authUpdates = {}
    if (email && email !== user.email) authUpdates.email = email
    if (password) authUpdates.password = password

    if (Object.keys(authUpdates).length > 0) {
      const { error } = await supabase.auth.updateUser(authUpdates)
      if (error) return { error: error.message }
    }

    // Profile name
    const { error: profileErr } = await supabase
      .from('profiles')
      .update({ name })
      .eq('id', user.id)

    if (profileErr) return { error: profileErr.message }

    set({ user: { ...user, name, email: email || user.email } })
    return {}
  },
}))

export default useUserStore
