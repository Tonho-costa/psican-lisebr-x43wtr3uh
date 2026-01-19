import { supabase } from '@/lib/supabase/client'

export interface TriageSubmission {
  full_name: string
  phone: string
  profile_url?: string
  service_mode: string
  education: string
  crp_status: string
  theoretical_approach: string
  experience_level: string
  weekly_availability: string
  accepts_social_value: boolean
  agrees_to_ethics: boolean
  agrees_to_terms: boolean
}

export const triageService = {
  async submitTriage(data: TriageSubmission) {
    // Casting supabase as any to bypass type check for the new table
    // since we cannot update types.ts directly
    const { error } = await (supabase as any)
      .from('triage_submissions')
      .insert(data)

    return { error }
  },
}
