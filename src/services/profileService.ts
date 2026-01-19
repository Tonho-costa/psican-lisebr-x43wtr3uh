import { supabase } from '@/lib/supabase/client'
import { Professional } from '@/stores/useProfessionalStore'
import { Database } from '@/lib/supabase/types'

// Define a local interface for the DB Row matching the migration
// This is necessary because the generated types.ts might be outdated
interface LocalProfileRow {
  id: string
  created_at?: string | null
  email?: string | null
  full_name?: string | null
  occupation?: string | null
  city?: string | null
  state?: string | null
  description?: string | null
  avatar_url?: string | null
  phone?: string | null
  instagram?: string | null
  facebook?: string | null
  availability?: string | null
  age?: number | null
  service_types?: string[] | null
  specialties?: string[] | null
  education?: string[] | null
  courses?: string[] | null
  is_visible?: boolean | null
  is_featured?: boolean | null
  role?: string | null
  status?: string | null
}

type ProfileUpdate = Database['public']['Tables']['profiles']['Update']

// Maps Database Row to Professional Interface
// Ensures no crashes if fields are null
const mapToProfessional = (row: any): Professional => {
  const r = row as LocalProfileRow
  return {
    id: r.id,
    name: r.full_name ?? '',
    occupation: r.occupation ?? '',
    email: r.email ?? '',
    age: r.age ?? 0,
    city: r.city ?? '',
    state: r.state ?? '',
    bio: r.description ?? '',
    photoUrl: r.avatar_url ?? '',
    serviceTypes: (Array.isArray(r.service_types) ? r.service_types : []) as (
      | 'Online'
      | 'Presencial'
    )[],
    specialties: Array.isArray(r.specialties) ? r.specialties : [],
    education: Array.isArray(r.education) ? r.education : [],
    courses: Array.isArray(r.courses) ? r.courses : [],
    availability: r.availability ?? '',
    phone: r.phone ?? '',
    instagram: r.instagram || undefined,
    facebook: r.facebook || undefined,
    isVisible: r.is_visible ?? false,
    role: r.role ?? 'user',
  }
}

// Maps Professional Interface to Database Update object
const mapToDB = (professional: Partial<Professional>): any => {
  const db: any = {}
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
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('is_visible', true)
        .order('created_at', { ascending: false })

      if (error) {
        return { data: null, error }
      }
      return { data: (data || []).map(mapToProfessional), error: null }
    } catch (error) {
      return { data: null, error }
    }
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
