import { create } from 'zustand'
import { profileService } from '@/services/profileService'

export interface Professional {
  id: string
  name: string
  occupation: string
  email: string
  age: number
  city: string
  state: string
  bio: string
  photoUrl: string
  serviceTypes: ('Online' | 'Presencial')[]
  specialties: string[]
  education: string[]
  courses: string[]
  availability: string
  phone: string
  instagram?: string
  facebook?: string
  isVisible: boolean
}

interface ProfessionalState {
  professionals: Professional[]
  currentProfessional: Professional | null
  isLoading: boolean
  isAuthenticated: boolean // kept for store compatibility, but driven by auth hook mainly
  searchQuery: {
    city: string
    specialty: string
    education: string
    serviceType: string
  }
  // Actions
  setProfessionals: (pros: Professional[]) => void
  setCurrentProfessional: (pro: Professional | null) => void
  fetchProfessionals: () => Promise<void>
  fetchCurrentProfile: (userId: string) => Promise<void>
  updateProfile: (userId: string, data: Partial<Professional>) => Promise<void>
  logout: () => void // Resets store state
  setSearchQuery: (query: Partial<ProfessionalState['searchQuery']>) => void
  // Legacy/Auth actions (handled by useAuth now, but kept as placeholders or helpers)
  login: (email: string) => boolean // Deprecated in favor of useAuth
  register: (data: any) => void // Deprecated in favor of useAuth
  deleteAccount: () => void
}

export const useProfessionalStore = create<ProfessionalState>((set, get) => ({
  professionals: [],
  currentProfessional: null,
  isLoading: false,
  isAuthenticated: false,
  searchQuery: {
    city: '',
    specialty: '',
    education: '',
    serviceType: '',
  },

  setProfessionals: (pros) => set({ professionals: pros }),
  setCurrentProfessional: (pro) =>
    set({ currentProfessional: pro, isAuthenticated: !!pro }),

  fetchProfessionals: async () => {
    set({ isLoading: true })
    const { data, error } = await profileService.getAllProfiles()
    if (data && !error) {
      set({ professionals: data, isLoading: false })
    } else {
      console.error('Failed to fetch professionals:', error)
      set({ isLoading: false })
    }
  },

  fetchCurrentProfile: async (userId: string) => {
    set({ isLoading: true })
    const { data, error } = await profileService.getProfile(userId)
    if (data && !error) {
      set({
        currentProfessional: data,
        isAuthenticated: true,
        isLoading: false,
      })
    } else {
      console.error('Failed to fetch current profile:', error)
      set({ isLoading: false })
    }
  },

  updateProfile: async (userId: string, data: Partial<Professional>) => {
    set({ isLoading: true })
    const { data: updated, error } = await profileService.updateProfile(
      userId,
      data,
    )
    if (updated && !error) {
      set((state) => ({
        currentProfessional: updated,
        professionals: state.professionals.map((p) =>
          p.id === updated.id ? updated : p,
        ),
        isLoading: false,
      }))
    } else {
      set({ isLoading: false })
      throw error
    }
  },

  logout: () => set({ currentProfessional: null, isAuthenticated: false }),

  setSearchQuery: (query) =>
    set((state) => ({ searchQuery: { ...state.searchQuery, ...query } })),

  // Deprecated/No-op actions that should be handled by components via useAuth
  login: () => {
    console.warn('Use useAuth().signIn instead')
    return false
  },
  register: () => {
    console.warn('Use useAuth().signUp instead')
  },
  deleteAccount: () => {
    // Logic to delete account via Supabase Edge Function or Client (if allowed)
    console.warn(
      'Delete account implementation requires Supabase admin/functions',
    )
    set({ currentProfessional: null, isAuthenticated: false })
  },
}))
