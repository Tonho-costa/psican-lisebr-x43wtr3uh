import { supabase } from '@/lib/supabase/client'
import { Database } from '@/lib/supabase/types'

export type AdminLog = Database['public']['Tables']['admin_logs']['Row']
export type Profile = Database['public']['Tables']['profiles']['Row']

export const adminService = {
  async approveProfessional(userId: string) {
    return supabase.rpc('aprovar_profissional', { target_id: userId })
  },

  async rejectProfessional(userId: string, reason: string) {
    return supabase.rpc('reprovar_profissional', {
      target_id: userId,
      motivo: reason,
    })
  },

  async blockUser(userId: string) {
    return supabase.rpc('bloquear_usuario', { target_id: userId })
  },

  async getProfiles(status?: string) {
    let query = supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })
    if (status && status !== 'all') {
      query = query.eq('status', status)
    }
    return query
  },

  async getLogs() {
    return supabase
      .from('admin_logs')
      .select('*')
      .order('created_at', { ascending: false })
  },
}
