import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface Professional {
  id: string
  name: string
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
}

interface ProfessionalState {
  professionals: Professional[]
  currentProfessional: Professional | null
  isAuthenticated: boolean
  searchQuery: {
    city: string
    specialty: string
    education: string
    serviceType: string
  }
  login: (email: string) => boolean
  logout: () => void
  register: (data: Omit<Professional, 'id'>) => void
  updateProfile: (data: Partial<Professional>) => void
  setSearchQuery: (query: Partial<ProfessionalState['searchQuery']>) => void
}

export const useProfessionalStore = create<ProfessionalState>()(
  persist(
    (set, get) => ({
      professionals: [],
      currentProfessional: null,
      isAuthenticated: false,
      searchQuery: {
        city: '',
        specialty: '',
        education: '',
        serviceType: '',
      },
      login: (email: string) => {
        const professional = get().professionals.find((p) => p.email === email)
        if (professional) {
          set({ currentProfessional: professional, isAuthenticated: true })
          return true
        }
        return false
      },
      logout: () => set({ currentProfessional: null, isAuthenticated: false }),
      register: (data) => {
        const newProfessional: Professional = {
          ...data,
          id: Math.random().toString(36).substring(7),
        }
        set((state) => ({
          professionals: [...state.professionals, newProfessional],
          currentProfessional: newProfessional,
          isAuthenticated: true,
        }))
      },
      updateProfile: (data) => {
        set((state) => {
          if (!state.currentProfessional) return state
          const updatedProfessional = { ...state.currentProfessional, ...data }
          const updatedList = state.professionals.map((p) =>
            p.id === updatedProfessional.id ? updatedProfessional : p,
          )
          return {
            currentProfessional: updatedProfessional,
            professionals: updatedList,
          }
        })
      },
      setSearchQuery: (query) =>
        set((state) => ({ searchQuery: { ...state.searchQuery, ...query } })),
    }),
    {
      name: 'professional-storage',
      storage: createJSONStorage(() => localStorage),
    },
  ),
)
