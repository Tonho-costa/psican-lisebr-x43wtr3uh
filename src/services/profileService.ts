import { supabase } from '@/lib/supabase/client'
import { Professional } from '@/stores/useProfessionalStore'

// Define the DB shape internally to handle mapping
interface ProfileDB {
  id: string
  created_at: string
  full_name: string | null
  avatar_url: string | null
  description: string | null
  email: string | null
  occupation: string | null
  age: number | null
  city: string | null
  state: string | null
  service_types: string[] | null
  specialties: string[] | null
  education: string[] | null
  courses: string[] | null
  availability: string | null
  phone: string | null
  instagram: string | null
  facebook: string | null
  is_featured: boolean
  is_visible: boolean
}

const mapToProfessional = (row: ProfileDB): Professional => ({
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
  isVisible: row.is_visible,
})

const mapToDB = (professional: Partial<Professional>): Partial<ProfileDB> => {
  const db: Partial<ProfileDB> = {}
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
  return db
}

export const profileService = {
  /**
   * Fetches a profile by its ID.
   */
  async getProfile(userId: string) {
    const { data, error } = await supabase
      .from('profiles' as any)
      .select('*')
      .eq('id', userId)
      .single()

    if (error) return { data: null, error }
    return { data: mapToProfessional(data as ProfileDB), error: null }
  },

  /**
   * Updates a profile.
   */
  async updateProfile(userId: string, updates: Partial<Professional>) {
    const dbUpdates = mapToDB(updates)
    const { data, error } = await supabase
      .from('profiles' as any)
      .update(dbUpdates)
      .eq('id', userId)
      .select()
      .single()

    if (error) return { data: null, error }
    return { data: mapToProfessional(data as ProfileDB), error: null }
  },

  /**
   * Fetches all visible profiles.
   */
  async getAllProfiles() {
    const { data, error } = await supabase
      .from('profiles' as any)
      .select('*')
      .eq('is_visible', true)
      .order('created_at', { ascending: false })

    if (error) return { data: null, error }
    return { data: (data as ProfileDB[]).map(mapToProfessional), error: null }
  },

  /**
   * Fetches featured profiles.
   */
  async getFeaturedProfiles() {
    const { data, error } = await supabase
      .from('profiles' as any)
      .select('*')
      .eq('is_featured', true)
      .eq('is_visible', true)
      .limit(3)

    if (error) return { data: null, error }
    return { data: (data as ProfileDB[]).map(mapToProfessional), error: null }
  },

  /**
   * Searches/Filters profiles (simple client-side filtering is done in component usually,
   * but we can add server side filtering here if needed).
   * For now, just gets all visible to filter in UI or fetches all.
   */
  async searchProfiles(filters?: any) {
    // Basic implementation returning all visible, filtering happens in store/component for now
    // to maintain parity with previous implementation complexity
    return this.getAllProfiles()
  },
}
