import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

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
  isAuthenticated: boolean
  searchQuery: {
    city: string
    specialty: string
    education: string
    serviceType: string
  }
  login: (email: string) => boolean
  logout: () => void
  register: (data: Omit<Professional, 'id' | 'isVisible'>) => void
  updateProfile: (data: Partial<Professional>) => void
  deleteAccount: () => void
  setSearchQuery: (query: Partial<ProfessionalState['searchQuery']>) => void
}

// Mock Data to populate the app initially
const MOCK_PROFESSIONALS: Professional[] = [
  {
    id: 'mock-1',
    name: 'Dr. Ana Silva',
    occupation: 'Psicanalista Clínica',
    email: 'ana.silva@example.com',
    age: 45,
    city: 'São Paulo',
    state: 'SP',
    bio: 'Especialista em psicanálise clínica com mais de 15 anos de experiência. Atendimento focado em ansiedade, depressão e desenvolvimento pessoal, utilizando a abordagem lacaniana.',
    photoUrl: 'https://img.usecurling.com/ppl/medium?gender=female&seed=123',
    serviceTypes: ['Online', 'Presencial'],
    specialties: [
      'Ansiedade',
      'Depressão',
      'Relacionamentos',
      'Autoconhecimento',
    ],
    education: ['Psicologia - USP', 'Mestrado em Psicanálise - PUC-SP'],
    courses: ['Seminários de Lacan', 'Clínica do Sujeito'],
    availability: 'Segunda a Sexta, 9h às 18h',
    phone: '5511999998888',
    isVisible: true,
  },
  {
    id: 'mock-2',
    name: 'Dr. Ricardo Mendes',
    occupation: 'Psicólogo e Psicanalista',
    email: 'ricardo.mendes@example.com',
    age: 52,
    city: 'Rio de Janeiro',
    state: 'RJ',
    bio: 'Atuo na área clínica há 20 anos, oferecendo um espaço de escuta e acolhimento. Meu trabalho é orientado pela psicanálise freudiana, visando a elaboração de conflitos e o bem-estar psíquico.',
    photoUrl: 'https://img.usecurling.com/ppl/medium?gender=male&seed=456',
    serviceTypes: ['Online'],
    specialties: ['Luto', 'Estresse', 'Trauma', 'Burnout'],
    education: ['Psicologia - UFRJ', 'Especialização em Saúde Mental'],
    courses: ['Psicopatologia Psicanalítica'],
    availability: 'Terça a Quinta, 14h às 20h',
    phone: '5521988887777',
    isVisible: true,
  },
  {
    id: 'mock-3',
    name: 'Dra. Carla Souza',
    occupation: 'Psicanalista',
    email: 'carla.souza@example.com',
    age: 38,
    city: 'Belo Horizonte',
    state: 'MG',
    bio: 'Acredito na psicanálise como uma ferramenta potente de transformação. Ofereço atendimento online para brasileiros em qualquer lugar do mundo, com foco em questões de adaptação e identidade.',
    photoUrl: 'https://img.usecurling.com/ppl/medium?gender=female&seed=789',
    serviceTypes: ['Online', 'Presencial'],
    specialties: ['Imigração', 'Identidade', 'Conflitos Familiares'],
    education: [
      'Psicologia - UFMG',
      'Formação em Psicanálise - Círculo Psicanalítico',
    ],
    courses: [],
    availability: 'Segunda a Sábado, horários flexíveis',
    phone: '5531977776666',
    isVisible: true,
  },
]

export const useProfessionalStore = create<ProfessionalState>()(
  persist(
    (set, get) => ({
      professionals: MOCK_PROFESSIONALS,
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
          isVisible: true, // Default to true as per user story
        }
        set((state) => ({
          // Prepend new professional to the beginning of the list
          // This ensures they appear first in the featured list
          professionals: [newProfessional, ...state.professionals],
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
      deleteAccount: () => {
        set((state) => {
          if (!state.currentProfessional) return state
          const updatedProfessionals = state.professionals.filter(
            (p) => p.id !== state.currentProfessional?.id,
          )
          return {
            professionals: updatedProfessionals,
            currentProfessional: null,
            isAuthenticated: false,
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
