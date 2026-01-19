import { supabase } from '@/lib/supabase/client'
import { Database } from '@/lib/supabase/types'

type Profile = Database['public']['Tables']['profiles']['Row']

export interface DashboardStats {
  totalProfiles: number
  activeProfiles: number
  featuredProfiles: number
}

export const adminService = {
  // --- Dashboard Stats ---
  async getDashboardStats(): Promise<DashboardStats> {
    const { count: totalProfiles } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })

    const { count: activeProfiles } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('is_visible', true)

    const { count: featuredProfiles } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('is_featured', true)

    return {
      totalProfiles: totalProfiles || 0,
      activeProfiles: activeProfiles || 0,
      featuredProfiles: featuredProfiles || 0,
    }
  },

  // --- Profiles Management ---

  async getAllProfiles() {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })

    return { data, error }
  },

  async updateProfile(id: string, updates: Partial<Profile>) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    return { data, error }
  },

  async deleteProfile(id: string) {
    const { error } = await supabase.from('profiles').delete().eq('id', id)
    return { error }
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

  // --- Logs ---

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

  // --- Triage (Legacy/Existing) ---
  async getSubmissions() {
    const { data, error } = await supabase
      .from('triage_submissions')
      .select('*')
      .order('created_at', { ascending: false })

    return { data, error }
  },
}
