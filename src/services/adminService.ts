import { supabase } from '@/lib/supabase/client'
import { Database } from '@/lib/supabase/types'

export type TriageSubmission =
  Database['public']['Tables']['triage_submissions']['Row']
export type AdminLog = Database['public']['Tables']['admin_logs']['Row']

export const adminService = {
  /**
   * Fetches dashboard statistics.
   */
  async getStats() {
    try {
      const { count: profilesCount, error: profilesError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })

      const { count: triageCount, error: triageError } = await supabase
        .from('triage_submissions')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending')

      if (profilesError) throw profilesError
      if (triageError) throw triageError

      return {
        data: {
          profilesCount: profilesCount || 0,
          pendingTriageCount: triageCount || 0,
        },
        error: null,
      }
    } catch (error) {
      console.error('Error fetching admin stats:', error)
      return { data: null, error }
    }
  },

  /**
   * Fetches all triage submissions.
   */
  async getTriageSubmissions() {
    const { data, error } = await supabase
      .from('triage_submissions')
      .select('*')
      .order('created_at', { ascending: false })

    return { data, error }
  },

  /**
   * Updates a triage submission status.
   */
  async updateTriageStatus(
    id: string,
    status: 'approved' | 'rejected',
    notes?: string,
  ) {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return { error: 'No user found' }

    const { data, error } = await supabase
      .from('triage_submissions')
      .update({
        status,
        admin_notes: notes,
        processed_by: user.id,
        processed_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()

    if (!error) {
      // Log the action
      await this.logAction('update_triage', id, { status, notes })
    }

    return { data, error }
  },

  /**
   * Fetches admin logs.
   */
  async getLogs() {
    const { data, error } = await supabase
      .from('admin_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100)

    return { data, error }
  },

  /**
   * Logs an admin action.
   */
  async logAction(action: string, targetId?: string, details?: any) {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return

    await supabase.from('admin_logs').insert({
      admin_id: user.id,
      action,
      target_id: targetId,
      details,
    })
  },
}
