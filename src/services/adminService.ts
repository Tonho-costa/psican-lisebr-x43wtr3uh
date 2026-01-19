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
    // Delete the user from auth via edge function is preferred,
    // but here we might just delete the profile row if that's the requirement.
    // However, usually deleting profile row requires cascade or admin privilege on auth.users.
    // We will assume the edge function 'delete-account' handles the current user,
    // but for admin deleting OTHER users, we might need a specific edge function or RLS.
    // For now, we'll try direct delete on profiles table which usually triggers cascade or is enough for the UI.
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

    return { data, error }
  },
}
