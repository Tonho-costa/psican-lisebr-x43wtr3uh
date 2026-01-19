import { supabase } from '@/lib/supabase/client'
import { Database } from '@/lib/supabase/types'
import { Professional } from '@/stores/useProfessionalStore'

type TriageSubmission =
  Database['public']['Tables']['triage_submissions']['Row']

export interface DashboardStats {
  totalProfiles: number
  activeProfessionals: number
  pendingTriage: number
  totalUsers: number
}

export const adminService = {
  async getDashboardStats(): Promise<DashboardStats> {
    const { count: totalProfiles } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })

    const { count: activeProfessionals } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'professional')
      .eq('status', 'active') // Assuming 'active' is the status for verified pros

    const { count: pendingTriage } = await supabase
      .from('triage_submissions')
      .select('*', { count: 'exact', head: true })
      .in('status', ['pending', 'in_review'])

    const { count: totalUsers } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'user')

    return {
      totalProfiles: totalProfiles || 0,
      activeProfessionals: activeProfessionals || 0,
      pendingTriage: pendingTriage || 0,
      totalUsers: totalUsers || 0,
    }
  },

  async getAllProfiles() {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    // Reuse mapping logic (duplicated to avoid circular deps or complex imports, keeping it simple)
    return data.map((row) => ({
      id: row.id,
      name: row.full_name || '',
      email: row.email || '',
      role: row.role || 'user',
      status: row.status || 'pending',
      createdAt: row.created_at,
      avatarUrl: row.avatar_url,
    }))
  },

  async updateProfileStatus(
    adminId: string,
    targetId: string,
    status: string,
    role: string,
    reason: string,
  ) {
    // Update Profile
    const { error } = await supabase
      .from('profiles')
      .update({ status, role })
      .eq('id', targetId)

    if (error) throw error

    // Log Action
    await this.logAdminAction(adminId, 'UPDATE_PROFILE_STATUS', targetId, {
      status,
      role,
      reason,
    })
  },

  async getTriageSubmissions(statusFilter?: string) {
    let query = supabase
      .from('triage_submissions')
      .select('*')
      .order('created_at', { ascending: false })

    if (statusFilter && statusFilter !== 'all') {
      query = query.eq('status', statusFilter)
    }

    const { data, error } = await query
    if (error) throw error
    return data as TriageSubmission[]
  },

  async processTriage(
    adminId: string,
    submissionId: string,
    action: 'approve' | 'reject' | 'request_changes',
    notes: string,
    targetUserId?: string,
  ) {
    let newStatus = 'pending'
    if (action === 'approve') newStatus = 'approved'
    if (action === 'reject') newStatus = 'rejected'
    if (action === 'request_changes') newStatus = 'changes_requested'

    // 1. Update Triage Submission
    const { error: triageError } = await supabase
      .from('triage_submissions')
      .update({
        status: newStatus,
        admin_notes: notes,
        processed_at: new Date().toISOString(),
        processed_by: adminId,
      })
      .eq('id', submissionId)

    if (triageError) throw triageError

    // 2. If Approved, Update Profile
    if (action === 'approve' && targetUserId) {
      await supabase
        .from('profiles')
        .update({ role: 'professional', status: 'verified' }) // Using 'verified' as active status
        .eq('id', targetUserId)
    }

    // 3. Log Action
    await this.logAdminAction(
      adminId,
      `TRIAGE_${action.toUpperCase()}`,
      submissionId,
      {
        notes,
        targetUserId,
      },
    )

    // 4. Notify User
    if (targetUserId) {
      await supabase.functions.invoke('notify-user', {
        body: {
          userId: targetUserId,
          type: `TRIAGE_${action.toUpperCase()}`,
          message: notes,
        },
      })
    }
  },

  async logAdminAction(
    adminId: string,
    action: string,
    targetId: string,
    details: any,
  ) {
    await supabase.from('admin_logs').insert({
      admin_id: adminId,
      action,
      target_id: targetId,
      details,
    })
  },
}
