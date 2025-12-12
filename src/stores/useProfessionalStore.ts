import { create } from 'zustand'
import { profileService } from '@/services/profileService'
import { supabase } from '@/lib/supabase/client'

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
  isAuthenticated: boolean
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
  logout: () => Promise<void> // Resets store state and signs out
  setSearchQuery: (query: Partial<ProfessionalState['searchQuery']>) => void
  // Legacy/Auth actions
  login: (email: string) => boolean
  register: (data: any) => void
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
    // Avoid setting global isLoading to prevent UI flashing
    try {
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
        }))
      } else {
        throw error || new Error('Falha ao atualizar perfil')
      }
    } catch (error) {
      console.error('Error in store updateProfile:', error)
      throw error
    }
  },

  logout: async () => {
    await supabase.auth.signOut()
    set({ currentProfessional: null, isAuthenticated: false })
  },

  setSearchQuery: (query) =>
    set((state) => ({ searchQuery: { ...state.searchQuery, ...query } })),

  // Deprecated/No-op actions
  login: () => {
    console.warn('Use useAuth().signIn instead')
    return false
  },
  register: () => {
    console.warn('Use useAuth().signUp instead')
  },
  deleteAccount: () => {
    console.warn(
      'Delete account implementation requires Supabase admin/functions',
    )
    set({ currentProfessional: null, isAuthenticated: false })
  },
}))
