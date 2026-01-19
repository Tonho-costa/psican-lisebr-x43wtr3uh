import { create } from 'zustand'
import { adminService, AdminStats, AdminLog } from '@/services/adminService'
import { Professional } from '@/stores/useProfessionalStore'
import { TriageSubmission } from '@/services/triageService'

interface AdminState {
  users: Professional[]
  triageSubmissions: TriageSubmission[]
  logs: AdminLog[]
  stats: AdminStats | null
  isLoading: boolean
  error: string | null

  fetchUsers: () => Promise<void>
  fetchTriage: () => Promise<void>
  fetchLogs: () => Promise<void>
  fetchStats: () => Promise<void>

  updateUserStatus: (
    adminId: string,
    userId: string,
    updates: { status?: string; role?: string },
    justification: string,
  ) => Promise<boolean>

  approveTriage: (
    adminId: string,
    submission: TriageSubmission,
    justification: string,
  ) => Promise<boolean>

  rejectTriage: (
    adminId: string,
    submission: TriageSubmission,
    justification: string,
  ) => Promise<boolean>
}

export const useAdminStore = create<AdminState>((set, get) => ({
  users: [],
  triageSubmissions: [],
  logs: [],
  stats: null,
  isLoading: false,
  error: null,

  fetchUsers: async () => {
    set({ isLoading: true, error: null })
    const { data, error } = await adminService.getAllUsers()
    if (error) set({ error: error.message })
    else set({ users: data })
    set({ isLoading: false })
  },

  fetchTriage: async () => {
    set({ isLoading: true, error: null })
    const { data, error } = await adminService.getTriageSubmissions()
    if (error) set({ error: error.message })
    else set({ triageSubmissions: data })
    set({ isLoading: false })
  },

  fetchLogs: async () => {
    set({ isLoading: true, error: null })
    const { data, error } = await adminService.getLogs()
    if (error) set({ error: error.message })
    else set({ logs: data })
    set({ isLoading: false })
  },

  fetchStats: async () => {
    set({ isLoading: true, error: null })
    const { data, error } = await adminService.getStats()
    if (error) set({ error: error.message })
    else set({ stats: data })
    set({ isLoading: false })
  },

  updateUserStatus: async (adminId, userId, updates, justification) => {
    set({ isLoading: true })
    const { data, error } = await adminService.updateUserStatus(
      adminId,
      userId,
      updates,
      justification,
    )
    if (error) {
      set({ isLoading: false, error: error.message })
      return false
    }

    set((state) => ({
      isLoading: false,
      users: state.users.map((u) =>
        u.id === userId ? { ...u, ...updates } : u,
      ),
    }))
    return true
  },

  approveTriage: async (adminId, submission, justification) => {
    set({ isLoading: true })
    const { error } = await adminService.approveTriage(
      adminId,
      submission,
      justification,
    )
    if (error) {
      set({ isLoading: false, error: error.message })
      return false
    }
    set((state) => ({
      isLoading: false,
      triageSubmissions: state.triageSubmissions.filter(
        (s) => s.id !== submission.id,
      ),
    }))
    return true
  },

  rejectTriage: async (adminId, submission, justification) => {
    set({ isLoading: true })
    const { error } = await adminService.rejectTriage(
      adminId,
      submission,
      justification,
    )
    if (error) {
      set({ isLoading: false, error: error.message })
      return false
    }
    set((state) => ({
      isLoading: false,
      triageSubmissions: state.triageSubmissions.filter(
        (s) => s.id !== submission.id,
      ),
    }))
    return true
  },
}))
