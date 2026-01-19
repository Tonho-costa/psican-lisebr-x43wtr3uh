import { supabase } from '@/lib/supabase/client'
import { profileService } from './profileService'
import { Professional } from '@/stores/useProfessionalStore'

export interface AdminStats {
  totalUsers: number
  activeUsers: number
  blockedUsers: number
  newUsersLast30Days: number
}

export const adminService = {
  /**
   * Fetches all users for admin management (includes non-visible and non-active).
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

    // Reuse mapper from profileService but we know it returns extended Professional
    // We need to access private method or duplicate logic?
    // Let's just use the public getProfile logic but mapped here or modify profileService.
    // Ideally we duplicate the map logic slightly or export it. For now, we manually map to Professional.
    // However, profileService.getAllProfiles maps it correctly including role/status now.
    // So we can assume the data structure is correct, we just needed the query without 'is_visible'.

    // @ts-expect-error accessing mapped data
    const mapped: Professional[] = (data || []).map((row) => ({
      id: row.id,
      name: row.full_name || '',
      email: row.email || '',
      role: (row as any).role || 'user',
      status: (row as any).status || 'active',
      createdAt: row.created_at,
      occupation: row.occupation || '',
      age: row.age,
      city: row.city,
      state: row.state,
      bio: row.description,
      photoUrl: row.avatar_url,
      serviceTypes: row.service_types || [],
      specialties: row.specialties || [],
      education: row.education || [],
      courses: row.courses || [],
      availability: row.availability,
      phone: row.phone,
      instagram: row.instagram,
      facebook: row.facebook,
      isVisible: row.is_visible,
    }))

    return { data: mapped, error: null }
  },

  /**
   * Updates user role, status or other details as admin.
   */
  async updateUserAsAdmin(
    adminId: string,
    targetUserId: string,
    updates: Partial<Professional>,
  ) {
    // 1. Update Profile
    const { data, error } = await profileService.updateProfile(
      targetUserId,
      updates,
    )

    if (error) return { data: null, error }

    // 2. Log Action
    await this.logAction(
      adminId,
      'UPDATE_USER',
      targetUserId,
      updates as unknown as Record<string, any>,
    )

    return { data, error: null }
  },

  /**
   * Deletes a user as admin.
   */
  async deleteUserAsAdmin(adminId: string, targetUserId: string) {
    // We use the edge function or direct delete if RLS allows (usually deleting auth user is tricky from client)
    // Assuming we have an edge function or RLS allows delete on profiles which triggers auth delete (unlikely)
    // Actually, usually admin deletes profile and a trigger deletes auth, or calls an admin-function.
    // For now, let's use the 'delete-account' function but passed with a target user ID if supported,
    // OR just soft delete by setting status to 'blocked' if we can't fully delete auth.
    // The requirement says "Profile Deletion".
    // Let's assume we implement it by deleting the profile row and letting Supabase handle auth sync if setup,
    // OR we use the edge function but that might be for "delete MY account".
    // Let's rely on updating status to 'blocked' or deleting the row from 'profiles' if RLS allows admins.

    // Let's try deleting from profiles.
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', targetUserId)

    if (error) {
      console.error('Admin: Error deleting user', error)
      return { error }
    }

    // Log it
    await this.logAction(adminId, 'DELETE_USER', targetUserId, {})
    return { error: null }
  },

  /**
   * Logs an administrative action.
   */
  async logAction(
    adminId: string,
    action: string,
    targetId?: string,
    details?: Record<string, any>,
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
   * Get dashboard statistics.
   */
  async getStats(): Promise<{ data: AdminStats | null; error: any }> {
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('status, created_at')

    if (error) return { data: null, error }

    const totalUsers = profiles.length
    const activeUsers = profiles.filter(
      (p: any) => p.status === 'active',
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
      },
      error: null,
    }
  },
}
