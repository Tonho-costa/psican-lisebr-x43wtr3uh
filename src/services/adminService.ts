import { supabase } from '@/lib/supabase/client'
import { Database } from '@/lib/supabase/types'

type TriageSubmission =
  Database['public']['Tables']['triage_submissions']['Row']
type AdminLog = Database['public']['Tables']['admin_logs']['Row']
type Profile = Database['public']['Tables']['profiles']['Row']

export const adminService = {
  // --- Triage Submissions ---

  async getSubmissions() {
    const { data, error } = await supabase
      .from('triage_submissions')
      .select('*')
      .order('created_at', { ascending: false })

    return { data, error }
  },

  async updateSubmissionStatus(
    id: string,
    status: string,
    notes: string,
    adminId: string,
  ) {
    // 1. Update the submission
    const { data, error } = await supabase
      .from('triage_submissions')
      .update({
        status,
        admin_notes: notes,
        processed_at: new Date().toISOString(),
        processed_by: adminId,
      })
      .eq('id', id)
      .select()
      .single()

    if (error) return { data: null, error }

    // 2. Log the action
    await this.logAction(adminId, 'UPDATE_SUBMISSION_STATUS', id, {
      status,
      notes,
    })

    return { data, error: null }
  },

  // --- Profiles Management ---

  async getAllProfiles() {
    // Unlike profileService.getAllProfiles, this fetches ALL profiles (even hidden ones)
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })

    return { data, error }
  },

  async toggleProfileVisibility(
    adminId: string,
    profileId: string,
    isVisible: boolean,
  ) {
    const { data, error } = await supabase
      .from('profiles')
      .update({ is_visible: isVisible })
      .eq('id', profileId)
      .select()
      .single()

    if (!error) {
      await this.logAction(adminId, 'TOGGLE_PROFILE_VISIBILITY', profileId, {
        is_visible: isVisible,
      })
    }

    return { data, error }
  },

  async toggleProfileFeatured(
    adminId: string,
    profileId: string,
    isFeatured: boolean,
  ) {
    const { data, error } = await supabase
      .from('profiles')
      .update({ is_featured: isFeatured })
      .eq('id', profileId)
      .select()
      .single()

    if (!error) {
      await this.logAction(adminId, 'TOGGLE_PROFILE_FEATURED', profileId, {
        is_featured: isFeatured,
      })
    }

    return { data, error }
  },

  async updateProfileStatus(
    adminId: string,
    profileId: string,
    status: string,
  ) {
    const { data, error } = await supabase
      .from('profiles')
      .update({ status: status })
      .eq('id', profileId)
      .select()
      .single()

    if (!error) {
      await this.logAction(adminId, 'UPDATE_PROFILE_STATUS', profileId, {
        status,
      })
    }

    return { data, error }
  },

  // --- Admin Logs ---

  async getLogs() {
    const { data, error } = await supabase
      .from('admin_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100)

    return { data, error }
  },

  async logAction(
    adminId: string,
    action: string,
    targetId: string | null,
    details: any,
  ) {
    const { error } = await supabase.from('admin_logs').insert({
      admin_id: adminId,
      action,
      target_id: targetId,
      details,
    })

    if (error) console.error('Failed to create audit log:', error)
    return { error }
  },
}
