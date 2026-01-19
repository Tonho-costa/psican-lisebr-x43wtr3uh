import { supabase } from '@/lib/supabase/client'
import { profileService } from './profileService'
import { Professional } from '@/stores/useProfessionalStore'
import { TriageSubmission } from '@/services/triageService'

export interface AdminStats {
  totalUsers: number
  activeUsers: number
  blockedUsers: number
  newUsersLast30Days: number
  pendingTriage: number
}

export interface AdminLog {
  id: string
  admin_id: string
  action: string
  target_id: string
  details: any
  created_at: string
  admin_email?: string // Joined field
}

export const adminService = {
  /**
   * Fetches all users for admin management.
   */
  async getAllUsers() {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Admin: Error fetching all users', error)
      return { data: [], error }
    }

    const mapped: Professional[] = (data || []).map((row) => ({
      id: row.id,
      name: row.full_name || '',
      email: row.email || '',
      role: (row as any).role || 'user',
      status: (row as any).status || 'pending',
      createdAt: row.created_at,
      occupation: row.occupation || '',
      age: row.age || 0,
      city: row.city || '',
      state: row.state || '',
      bio: row.description || '',
      photoUrl: row.avatar_url || '',
      serviceTypes: row.service_types || [],
      specialties: row.specialties || [],
      education: row.education || [],
      courses: row.courses || [],
      availability: row.availability || '',
      phone: row.phone || '',
      instagram: row.instagram || undefined,
      facebook: row.facebook || undefined,
      isVisible: row.is_visible ?? true,
    }))

    return { data: mapped, error: null }
  },

  /**
   * Updates user status/role with mandatory justification.
   */
  async updateUserStatus(
    adminId: string,
    targetUserId: string,
    updates: { status?: string; role?: string },
    justification: string,
  ) {
    // 1. Update Profile
    const { data, error } = await profileService.updateProfile(
      targetUserId,
      updates,
    )

    if (error) return { data: null, error }

    // 2. Log Action
    await this.logAction(adminId, 'UPDATE_STATUS', targetUserId, {
      updates,
      justification,
    })

    // 3. Notify User
    await this.notifyUser(targetUserId, 'status_update', {
      status: updates.status,
      message: justification,
    })

    return { data, error: null }
  },

  /**
   * Fetches pending triage submissions.
   */
  async getTriageSubmissions(status: string = 'pending') {
    const { data, error } = await supabase
      .from('triage_submissions')
      .select('*')
      .eq('status', status)
      .order('created_at', { ascending: false })

    if (error) return { data: [], error }
    return { data: data as TriageSubmission[], error: null }
  },

  /**
   * Approves a triage submission.
   */
  async approveTriage(
    adminId: string,
    submission: TriageSubmission,
    justification: string,
  ) {
    if (!submission.user_id) {
      return { error: { message: 'Submission has no linked user.' } }
    }

    // 1. Update Submission Status
    const { error: subError } = await supabase
      .from('triage_submissions')
      .update({
        status: 'approved',
        processed_at: new Date().toISOString(),
        processed_by: adminId,
        admin_notes: justification,
      })
      .eq('id', submission.id)

    if (subError) return { error: subError }

    // 2. Update Profile to Approved/Active
    const { error: profileError } = await profileService.updateProfile(
      submission.user_id,
      {
        status: 'approved',
        role: 'user', // Ensure they are a regular user/professional
        // We could also map triage fields to profile here if they differ
      },
    )

    if (profileError) return { error: profileError }

    // 3. Log Action
    await this.logAction(adminId, 'APPROVE_TRIAGE', submission.user_id, {
      submissionId: submission.id,
      justification,
    })

    // 4. Notify User
    await this.notifyUser(submission.user_id, 'triage_approved', {
      message: justification,
    })

    return { error: null }
  },

  /**
   * Rejects a triage submission.
   */
  async rejectTriage(
    adminId: string,
    submission: TriageSubmission,
    justification: string,
  ) {
    // 1. Update Submission Status
    const { error: subError } = await supabase
      .from('triage_submissions')
      .update({
        status: 'rejected',
        processed_at: new Date().toISOString(),
        processed_by: adminId,
        admin_notes: justification,
      })
      .eq('id', submission.id)

    if (subError) return { error: subError }

    // 2. Update Profile to Rejected (if user exists)
    if (submission.user_id) {
      await profileService.updateProfile(submission.user_id, {
        status: 'rejected',
      })
    }

    // 3. Log Action
    await this.logAction(
      adminId,
      'REJECT_TRIAGE',
      submission.user_id || 'unknown',
      {
        submissionId: submission.id,
        justification,
      },
    )

    // 4. Notify User
    if (submission.user_id) {
      await this.notifyUser(submission.user_id, 'triage_rejected', {
        message: justification,
      })
    }

    return { error: null }
  },

  /**
   * Fetches audit logs.
   */
  async getLogs() {
    const { data, error } = await supabase
      .from('admin_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100)

    if (error) return { data: [], error }
    return { data: data as AdminLog[], error: null }
  },

  /**
   * Logs an administrative action.
   */
  async logAction(
    adminId: string,
    action: string,
    targetId: string,
    details: any,
  ) {
    const { error } = await supabase.from('admin_logs').insert({
      admin_id: adminId,
      action,
      target_id: targetId,
      details,
    })
    if (error) console.error('Admin: Error logging action', error)
  },

  /**
   * Triggers the notify-user edge function.
   */
  async notifyUser(userId: string, type: string, payload: any) {
    try {
      await supabase.functions.invoke('notify-user', {
        body: { userId, type, payload },
      })
    } catch (e) {
      console.error('Failed to notify user', e)
    }
  },

  /**
   * Get dashboard statistics.
   */
  async getStats(): Promise<{ data: AdminStats | null; error: any }> {
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('status, created_at')

    if (error) return { data: null, error }

    const { count: pendingTriage } = await supabase
      .from('triage_submissions')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending')

    const totalUsers = profiles.length
    const activeUsers = profiles.filter(
      (p: any) => p.status === 'approved' || p.status === 'active',
    ).length
    const blockedUsers = profiles.filter(
      (p: any) => p.status === 'blocked',
    ).length
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    const newUsersLast30Days = profiles.filter(
      (p) => new Date(p.created_at) >= thirtyDaysAgo,
    ).length

    return {
      data: {
        totalUsers,
        activeUsers,
        blockedUsers,
        newUsersLast30Days,
        pendingTriage: pendingTriage || 0,
      },
      error: null,
    }
  },
}
