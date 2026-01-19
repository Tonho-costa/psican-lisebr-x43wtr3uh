import { create } from 'zustand'
import { adminService, AdminStats } from '@/services/adminService'
import { Professional } from '@/stores/useProfessionalStore'

interface AdminState {
  users: Professional[]
  stats: AdminStats | null
  isLoading: boolean
  error: string | null
  fetchUsers: () => Promise<void>
  fetchStats: () => Promise<void>
  updateUser: (
    adminId: string,
    userId: string,
    data: Partial<Professional>,
  ) => Promise<boolean>
  deleteUser: (adminId: string, userId: string) => Promise<boolean>
}

export const useAdminStore = create<AdminState>((set, get) => ({
  users: [],
  stats: null,
  isLoading: false,
  error: null,

  fetchUsers: async () => {
    set({ isLoading: true, error: null })
    const { data, error } = await adminService.getAllUsers()
    if (error) {
      set({ isLoading: false, error: error.message })
    } else {
      set({ isLoading: false, users: data })
    }
  },

  fetchStats: async () => {
    set({ isLoading: true, error: null })
    const { data, error } = await adminService.getStats()
    if (error) {
      set({ isLoading: false, error: error.message })
    } else {
      set({ isLoading: false, stats: data })
    }
  },

  updateUser: async (adminId, userId, data) => {
    set({ isLoading: true })
    const { data: updated, error } = await adminService.updateUserAsAdmin(
      adminId,
      userId,
      data,
    )
    if (error || !updated) {
      set({ isLoading: false, error: error?.message || 'Erro ao atualizar' })
      return false
    }

    set((state) => ({
      isLoading: false,
      users: state.users.map((u) => (u.id === userId ? updated : u)),
    }))
    return true
  },

  deleteUser: async (adminId, userId) => {
    set({ isLoading: true })
    const { error } = await adminService.deleteUserAsAdmin(adminId, userId)
    if (error) {
      set({ isLoading: false, error: error.message })
      return false
    }

    set((state) => ({
      isLoading: false,
      users: state.users.filter((u) => u.id !== userId),
    }))
    return true
  },
}))
