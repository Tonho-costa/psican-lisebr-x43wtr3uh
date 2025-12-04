import { create } from 'zustand'

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

// Mock data
const MOCK_PROFESSIONALS: Professional[] = [
  {
    id: '1',
    name: 'Dr. Ana Silva',
    email: 'ana.silva@example.com',
    age: 42,
    city: 'São Paulo',
    state: 'SP',
    bio: 'Psicanalista com mais de 15 anos de experiência clínica. Especialista em ansiedade e depressão, com foco na abordagem freudiana.',
    photoUrl: 'https://img.usecurling.com/ppl/medium?gender=female&seed=1',
    serviceTypes: ['Online', 'Presencial'],
    specialties: ['Ansiedade', 'Depressão', 'Relacionamentos'],
    education: [
      'Graduação em Psicologia - USP',
      'Mestrado em Psicanálise - PUC-SP',
    ],
    courses: ['Curso Avançado de Freud', 'Seminários Lacanianos'],
    availability: 'Segunda a Sexta, 08:00 - 18:00',
    phone: '5511999999999',
  },
  {
    id: '2',
    name: 'Dr. Carlos Oliveira',
    email: 'carlos.oliveira@example.com',
    age: 50,
    city: 'Rio de Janeiro',
    state: 'RJ',
    bio: 'Atuo na clínica psicanalítica ajudando pacientes a compreenderem seus processos inconscientes e superarem traumas.',
    photoUrl: 'https://img.usecurling.com/ppl/medium?gender=male&seed=2',
    serviceTypes: ['Online'],
    specialties: ['Traumas', 'Fobias', 'Luto'],
    education: [
      'Graduação em Psicologia - UFRJ',
      'Doutorado em Psicologia Clínica',
    ],
    courses: ['Trauma e Recuperação', 'A Clínica do Real'],
    availability: 'Terça a Sábado, 10:00 - 20:00',
    phone: '5521988888888',
  },
  {
    id: '3',
    name: 'Dra. Mariana Santos',
    email: 'mariana.santos@example.com',
    age: 35,
    city: 'Belo Horizonte',
    state: 'MG',
    bio: 'Especialista em terapia de casal e família. Abordagem acolhedora e focada na resolução de conflitos.',
    photoUrl: 'https://img.usecurling.com/ppl/medium?gender=female&seed=3',
    serviceTypes: ['Presencial'],
    specialties: ['Terapia de Casal', 'Conflitos Familiares', 'Autoestima'],
    education: [
      'Graduação em Psicologia - UFMG',
      'Especialização em Terapia Familiar',
    ],
    courses: ['Mediação de Conflitos'],
    availability: 'Segunda a Quinta, 09:00 - 17:00',
    phone: '5531977777777',
  },
]

export const useProfessionalStore = create<ProfessionalState>((set, get) => ({
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
}))
