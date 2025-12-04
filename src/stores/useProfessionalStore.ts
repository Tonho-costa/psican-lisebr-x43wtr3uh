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

const MOCK_PROFESSIONALS: Professional[] = [
  {
    id: '1',
    name: 'Dra. Ana Silva',
    occupation: 'Psicanalista Clínica',
    email: 'ana.silva@example.com',
    age: 45,
    city: 'São Paulo',
    state: 'SP',
    bio: 'Especialista em psicanálise freudiana com mais de 15 anos de experiência clínica. Foco em tratamento de ansiedade e depressão.',
    photoUrl: 'https://img.usecurling.com/ppl/medium?gender=female&seed=1',
    serviceTypes: ['Online', 'Presencial'],
    specialties: ['Ansiedade', 'Depressão', 'Terapia de Casal'],
    education: [
      'Doutorado em Psicologia Clínica - USP',
      'Mestrado em Psicanálise - PUC-SP',
    ],
    courses: [
      'Formação em Psicanálise Lacaniana',
      'Extensão em Psicossomática',
    ],
    availability: 'Segunda a Quinta, 09h às 18h',
    phone: '11999999999',
  },
  {
    id: '2',
    name: 'Dr. Carlos Oliveira',
    occupation: 'Psicólogo e Psicanalista',
    email: 'carlos.oliveira@example.com',
    age: 52,
    city: 'Rio de Janeiro',
    state: 'RJ',
    bio: 'Atendimento focado em desenvolvimento pessoal e resolução de conflitos. Abordagem humanista integrada à psicanálise.',
    photoUrl: 'https://img.usecurling.com/ppl/medium?gender=male&seed=2',
    serviceTypes: ['Online'],
    specialties: ['Autoconhecimento', 'Estresse', 'Carreira'],
    education: [
      'Graduação em Psicologia - UFRJ',
      'Especialização em Psicanálise Contemporânea',
    ],
    courses: ['Workshop de Inteligência Emocional'],
    availability: 'Terça e Quinta, 14h às 20h',
    phone: '21988888888',
  },
  {
    id: '3',
    name: 'Mariana Santos',
    occupation: 'Terapeuta Psicanalítica',
    email: 'mariana.santos@example.com',
    age: 38,
    city: 'Belo Horizonte',
    state: 'MG',
    bio: 'Acolhimento e escuta qualificada para questões emocionais e relacionais. Experiência com adolescentes e adultos.',
    photoUrl: 'https://img.usecurling.com/ppl/medium?gender=female&seed=3',
    serviceTypes: ['Presencial'],
    specialties: ['Adolescência', 'Luto', 'Conflitos Familiares'],
    education: ['Graduação em Psicologia - UFMG'],
    courses: ['Curso de Psicanálise Infantil'],
    availability: 'Segunda a Sexta, 08h às 17h',
    phone: '31977777777',
  },
  {
    id: '4',
    name: 'Roberto Costa',
    occupation: 'Psicanalista',
    email: 'roberto.costa@example.com',
    age: 60,
    city: 'Campinas',
    state: 'SP',
    bio: 'Longa trajetória no atendimento clínico, auxiliando pacientes a encontrarem novos caminhos e significados.',
    photoUrl: 'https://img.usecurling.com/ppl/medium?gender=male&seed=4',
    serviceTypes: ['Online', 'Presencial'],
    specialties: ['Traumas', 'Fobias', 'Pânico'],
    education: ['Mestrado em Psicologia - UNICAMP'],
    courses: ['Seminários de Freud e Lacan'],
    availability: 'Horários flexíveis',
    phone: '19966666666',
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
      onRehydrateStorage: () => (state) => {
        // If local storage was empty or had empty professionals list, ensure we have mocks
        if (state && state.professionals.length === 0) {
          state.professionals = MOCK_PROFESSIONALS
        }
      },
    },
  ),
)
