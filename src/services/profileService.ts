import { supabase } from '@/lib/supabase/client'

// Define the Profile interface locally since the global types are auto-generated
// and might not be available immediately during development of this feature.
export interface Profile {
  id: string
  created_at: string
  full_name: string | null
  avatar_url: string | null
  description: string | null
  is_featured: boolean
  is_visible: boolean
}

export const profileService = {
  /**
   * Fetches a profile by its ID.
   * @param userId The UUID of the user/profile.
   */
  async getProfile(userId: string) {
    // Using 'as any' for table name because Types are not yet generated
    const { data, error } = await supabase
      .from('profiles' as any)
      .select('*')
      .eq('id', userId)
      .single()

    return { data: data as Profile | null, error }
  },

  /**
   * Updates a profile.
   * @param userId The UUID of the user/profile to update.
   * @param updates Partial profile object with fields to update.
   */
  async updateProfile(userId: string, updates: Partial<Profile>) {
    const { data, error } = await supabase
      .from('profiles' as any)
      .update(updates)
      .eq('id', userId)
      .select()
      .single()

    return { data: data as Profile | null, error }
  },

  /**
   * Fetches all featured and visible profiles.
   */
  async getFeaturedProfiles() {
    const { data, error } = await supabase
      .from('profiles' as any)
      .select('*')
      .eq('is_featured', true)
      .eq('is_visible', true)

    return { data: data as Profile[] | null, error }
  },

  /**
   * Checks if a profile exists for the current user session
   */
  async getCurrentUserProfile() {
    const { data: sessionData } = await supabase.auth.getSession()
    if (!sessionData.session?.user) return { data: null, error: 'No session' }

    return this.getProfile(sessionData.session.user.id)
  },
}
