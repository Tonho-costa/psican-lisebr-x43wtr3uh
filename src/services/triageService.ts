import { supabase } from '@/lib/supabase/client'

export interface TriageSubmission {
  id?: string
  created_at?: string
  full_name: string
  phone: string
  profile_url?: string | null
  service_mode: string
  education: string
  crp_status: string
  theoretical_approach: string
  experience_level: string
  weekly_availability: string
  accepts_social_value: boolean
  agrees_to_ethics: boolean
  agrees_to_terms: boolean
  status?: string
  user_id?: string | null
  email?: string | null
  admin_notes?: string | null
}

export const triageService = {
  async submitTriage(data: TriageSubmission) {
    const { error } = await supabase
      .from('triage_submissions')
      .insert(data as any)

    return { error }
  },
}
