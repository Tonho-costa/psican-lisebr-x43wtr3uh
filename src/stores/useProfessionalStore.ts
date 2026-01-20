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
  role: string
}

interface ProfessionalState {
  professionals: Professional[]
  currentProfessional: Professional | null
  isLoading: boolean
  error: string | null
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
  fetchCurrentProfile: (userId: string) => Promise<Professional | null>
  updateProfile: (
    userId: string,
    data: Partial<Professional>,
  ) => Promise<Professional | null>
  setProfilePhoto: (url: string) => void
  logout: () => Promise<void>
  setSearchQuery: (query: Partial<ProfessionalState['searchQuery']>) => void
  deleteAccount: () => Promise<void>
}

export const useProfessionalStore = create<ProfessionalState>((set, _get) => ({
  professionals: [],
  currentProfessional: null,
  isLoading: false,
  error: null,
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
    set({ isLoading: true, error: null })
    try {
      const { data, error } = await profileService.getAllProfiles()
      if (error) {
        console.error('Failed to fetch professionals:', error)
        set({
          isLoading: false,
          professionals: [],
          error:
            'Não foi possível carregar a lista de profissionais. Verifique sua conexão e tente novamente.',
        })
      } else {
        set({ professionals: data || [], isLoading: false, error: null })
      }
    } catch (err) {
      console.error('Exception fetching professionals:', err)
      set({
        isLoading: false,
        professionals: [],
        error: 'Ocorreu um erro inesperado. Tente novamente mais tarde.',
      })
    }
  },

  fetchCurrentProfile: async (userId: string) => {
    set({ isLoading: true, error: null })
    try {
      const { data, error } = await profileService.getProfile(userId)
      if (data && !error) {
        set({
          currentProfessional: data,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        })
        return data
      } else {
        console.error('Failed to fetch current profile:', error)

        // Enhance error message for debugging RLS issues
        let errorMessage = 'Erro ao carregar perfil.'
        if (error?.message?.includes('recursion') || error?.code === '42P17') {
          errorMessage =
            'Erro de permissão (RLS Recursion). O sistema não conseguiu verificar seu nível de acesso.'
        } else if (error?.message?.includes('Database error')) {
          errorMessage = 'Erro de conexão com o banco de dados.'
        } else if (error?.message) {
          errorMessage = error.message
        }

        set({ isLoading: false, error: errorMessage })
        return null
      }
    } catch (err: any) {
      console.error('Unexpected error fetching profile:', err)
      set({
        isLoading: false,
        error: err?.message || 'Erro inesperado ao carregar perfil.',
      })
      return null
    }
  },

  updateProfile: async (userId: string, data: Partial<Professional>) => {
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
        return updated
      } else {
        throw error || new Error('Falha ao atualizar perfil')
      }
    } catch (error) {
      console.error('Error in store updateProfile:', error)
      throw error
    }
  },

  setProfilePhoto: (url: string) => {
    set((state) => {
      if (!state.currentProfessional) return state
      const updated = { ...state.currentProfessional, photoUrl: url }
      return {
        currentProfessional: updated,
        professionals: state.professionals.map((p) =>
          p.id === updated.id ? updated : p,
        ),
      }
    })
  },

  logout: async () => {
    await supabase.auth.signOut()
    set({ currentProfessional: null, isAuthenticated: false })
  },

  setSearchQuery: (query) =>
    set((state) => ({ searchQuery: { ...state.searchQuery, ...query } })),

  deleteAccount: async () => {
    try {
      const { error } = await profileService.deleteAccount()
      if (error) throw error
      await supabase.auth.signOut()
      set({ currentProfessional: null, isAuthenticated: false })
    } catch (error) {
      console.error('Error in store deleteAccount:', error)
      throw error
    }
  },
}))
