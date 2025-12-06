import { useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Filter, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  useProfessionalStore,
  Professional,
} from '@/stores/useProfessionalStore'
import { ProfessionalCard } from '@/components/ProfessionalCard'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { SearchFilters } from '@/components/SearchFilters'

// Helper function to filter professionals based on criteria
const filterList = (
  list: Professional[],
  occupation: string,
  stateFilter: string,
  cityFilter: string,
  specFilter: string,
  typeFilter: string,
) => {
  let filtered = list

  if (occupation) {
    const lowerTerm = occupation.toLowerCase()
    filtered = filtered.filter(
      (p) => p.occupation && p.occupation.toLowerCase().includes(lowerTerm),
    )
  }

  if (stateFilter && stateFilter !== 'all') {
    filtered = filtered.filter((p) => p.state === stateFilter)
  }

  if (cityFilter && cityFilter !== 'all') {
    filtered = filtered.filter((p) => p.city === cityFilter)
  }

  if (specFilter && specFilter !== 'all') {
    filtered = filtered.filter((p) => p.specialties.includes(specFilter))
  }

  if (typeFilter && typeFilter !== 'all') {
    const type = typeFilter as 'Online' | 'Presencial'
    filtered = filtered.filter((p) => p.serviceTypes.includes(type))
  }

  return filtered
}

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { professionals } = useProfessionalStore()

  // Filter visible professionals only
  const visibleProfessionals = useMemo(
    () => professionals.filter((p) => p.isVisible !== false),
    [professionals],
  )

  // Initial values from URL params
  const initialOccupation =
    searchParams.get('ocupacao') || searchParams.get('q') || ''
  const initialState = searchParams.get('estado') || 'all'
  const initialCity = searchParams.get('cidade') || 'all'
  const initialSpec = searchParams.get('especialidade') || 'all'
  const initialType = searchParams.get('tipo') || 'all'

  // Filters state initialized from URL
  const [occupation, setOccupation] = useState(initialOccupation)
  const [stateFilter, setStateFilter] = useState(initialState)
  const [city, setCity] = useState(initialCity)
  const [specialty, setSpecialty] = useState(initialSpec)
  const [serviceType, setServiceType] = useState(initialType)

  // Initialize filtered list using the helper function directly with visibleProfessionals
  const [filteredPros, setFilteredPros] = useState(() =>
    filterList(
      visibleProfessionals,
      initialOccupation,
      initialState,
      initialCity,
      initialSpec,
      initialType,
    ),
  )

  // Extract unique values for filters based on visible professionals
  const states = useMemo(
    () =>
      Array.from(new Set(visibleProfessionals.map((p) => p.state)))
        .filter(Boolean)
        .sort(),
    [visibleProfessionals],
  )

  // Filter cities based on selected state to improve UX (dependent dropdown)
  const cities = useMemo(() => {
    const relevantPros =
      stateFilter && stateFilter !== 'all'
        ? visibleProfessionals.filter((p) => p.state === stateFilter)
        : visibleProfessionals
    return Array.from(new Set(relevantPros.map((p) => p.city)))
      .filter(Boolean)
      .sort()
  }, [visibleProfessionals, stateFilter])

  const specialties = useMemo(
    () =>
      Array.from(new Set(visibleProfessionals.flatMap((p) => p.specialties)))
        .filter(Boolean)
        .sort(),
    [visibleProfessionals],
  )

  const applyFilters = () => {
    const filtered = filterList(
      visibleProfessionals,
      occupation,
      stateFilter,
      city,
      specialty,
      serviceType,
    )
    setFilteredPros(filtered)

    // Update URL params
    const params = new URLSearchParams()
    if (occupation) params.set('ocupacao', occupation)
    if (stateFilter && stateFilter !== 'all') params.set('estado', stateFilter)
    if (city && city !== 'all') params.set('cidade', city)
    if (specialty && specialty !== 'all') params.set('especialidade', specialty)
    if (serviceType && serviceType !== 'all') params.set('tipo', serviceType)
    setSearchParams(params)
  }

  const clearFilters = () => {
    setOccupation('')
    setStateFilter('all')
    setCity('all')
    setSpecialty('all')
    setServiceType('all')
    setFilteredPros(visibleProfessionals)
    setSearchParams(new URLSearchParams())
  }

  const filterProps = {
    occupation,
    setOccupation,
    stateFilter,
    setStateFilter,
    city,
    setCity,
    specialty,
    setSpecialty,
    serviceType,
    setServiceType,
    states,
    cities,
    specialties,
    onApplyFilters: applyFilters,
    onClearFilters: clearFilters,
  }

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Desktop Filters */}
        <aside className="hidden md:block w-64 shrink-0 space-y-6 bg-card p-6 rounded-lg border border-border h-fit sticky top-24">
          <h2 className="font-heading font-bold text-xl mb-4">Filtros</h2>
          <SearchFilters {...filterProps} />
        </aside>

        {/* Mobile Filters & Results */}
        <div className="flex-grow">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-heading font-bold">
              Profissionais Encontrados
            </h1>
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Filter className="w-4 h-4" /> Filtros
                  </Button>
                </SheetTrigger>
                <SheetContent side="left">
                  <SheetHeader>
                    <SheetTitle>Filtros de Busca</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <SearchFilters {...filterProps} />
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          {filteredPros.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPros.map((pro) => (
                  <ProfessionalCard key={pro.id} professional={pro} />
                ))}
              </div>
              <div className="mt-8 text-center text-sm text-muted-foreground">
                Exibindo {filteredPros.length} resultado(s).
              </div>
            </>
          ) : (
            <div className="text-center py-20 bg-muted/20 rounded-lg">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-bold mb-2">
                Nenhum profissional encontrado
              </h3>
              <p className="text-muted-foreground mb-6">
                Tente ajustar seus filtros para encontrar o que procura.
              </p>
              <Button variant="outline" onClick={clearFilters}>
                Limpar todos os filtros
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
