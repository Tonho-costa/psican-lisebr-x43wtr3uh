import { supabase } from '@/lib/supabase/client'
import { Professional } from '@/stores/useProfessionalStore'
import { Database } from '@/lib/supabase/types'

type ProfileRow = Database['public']['Tables']['profiles']['Row']
type ProfileUpdate = Database['public']['Tables']['profiles']['Update']

// Maps Database Row to Professional Interface
const mapToProfessional = (row: ProfileRow): Professional => ({
  id: row.id,
  name: row.full_name || '',
  occupation: row.occupation || '',
  email: row.email || '',
  age: row.age || 0,
  city: row.city || '',
  state: row.state || '',
  bio: row.description || '',
  photoUrl: row.avatar_url || '',
  serviceTypes: (row.service_types as ('Online' | 'Presencial')[]) || [],
  specialties: row.specialties || [],
  education: row.education || [],
  courses: row.courses || [],
  availability: row.availability || '',
  phone: row.phone || '',
  instagram: row.instagram || undefined,
  facebook: row.facebook || undefined,
  isVisible: row.is_visible ?? true,
  role: row.role || 'user',
})

// Maps Professional Interface to Database Update object
const mapToDB = (professional: Partial<Professional>): ProfileUpdate => {
  const db: ProfileUpdate = {}
  if (professional.name !== undefined) db.full_name = professional.name
  if (professional.occupation !== undefined)
    db.occupation = professional.occupation
  if (professional.email !== undefined) db.email = professional.email
  if (professional.age !== undefined) db.age = professional.age
  if (professional.city !== undefined) db.city = professional.city
  if (professional.state !== undefined) db.state = professional.state
  if (professional.bio !== undefined) db.description = professional.bio
  if (professional.photoUrl !== undefined) db.avatar_url = professional.photoUrl
  if (professional.serviceTypes !== undefined)
    db.service_types = professional.serviceTypes
  if (professional.specialties !== undefined)
    db.specialties = professional.specialties
  if (professional.education !== undefined)
    db.education = professional.education
  if (professional.courses !== undefined) db.courses = professional.courses
  if (professional.availability !== undefined)
    db.availability = professional.availability
  if (professional.phone !== undefined) db.phone = professional.phone
  if (professional.instagram !== undefined)
    db.instagram = professional.instagram
  if (professional.facebook !== undefined) db.facebook = professional.facebook
  if (professional.isVisible !== undefined)
    db.is_visible = professional.isVisible
  // role is usually not updatable via this service, but could be added if needed
  return db
}

export const profileService = {
  /**
   * Fetches a profile by its ID.
   */
  async getProfile(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      console.error('Error fetching profile:', error)
      return { data: null, error }
    }
    return { data: mapToProfessional(data), error: null }
  },

  /**
   * Updates a profile.
   * Returns the updated profile from the database to ensure UI consistency.
   */
  async updateProfile(userId: string, updates: Partial<Professional>) {
    try {
      const dbUpdates = mapToDB(updates)
      const { data, error } = await supabase
        .from('profiles')
        .update(dbUpdates)
        .eq('id', userId)
        .select()
        .single()

      if (error) {
        console.error('Error updating profile:', error)
        return { data: null, error }
      }
      return { data: mapToProfessional(data), error: null }
    } catch (err: any) {
      console.error('Unexpected error in updateProfile:', err)
      return { data: null, error: err }
    }
  },

  /**
   * Fetches all visible profiles.
   */
  async getAllProfiles() {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('is_visible', true)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching all profiles:', error)
      return { data: null, error }
    }
    return { data: (data || []).map(mapToProfessional), error: null }
  },

  /**
   * Fetches featured profiles.
   */
  async getFeaturedProfiles() {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('is_featured', true)
      .eq('is_visible', true)
      .limit(3)

    if (error) {
      console.error('Error fetching featured profiles:', error)
      return { data: null, error }
    }
    return { data: (data || []).map(mapToProfessional), error: null }
  },

  /**
   * Searches/Filters profiles.
   */
  async searchProfiles(_filters?: any) {
    // Currently re-using getAllProfiles as filtering is done client-side in the store or component for now
    // In a real app with many users, this should be a DB query
    return this.getAllProfiles()
  },

  /**
   * Deletes the current user account via edge function.
   */
  async deleteAccount() {
    const { data, error } = await supabase.functions.invoke('delete-account', {
      method: 'POST',
    })
    return { data, error }
  },
}
