import { useState, useMemo, useEffect } from 'react'
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
  if (!list) return []
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

  // Filter visible professionals only - Reactive to store changes
  const visibleProfessionals = useMemo(
    () => professionals.filter((p) => p.isVisible !== false),
    [professionals],
  )

  // Derived active filters from URL params (Single Source of Truth for the filtered list)
  const activeOccupation =
    searchParams.get('ocupacao') || searchParams.get('q') || ''
  const activeState = searchParams.get('estado') || 'all'
  const activeCity = searchParams.get('cidade') || 'all'
  const activeSpec = searchParams.get('especialidade') || 'all'
  const activeType = searchParams.get('tipo') || 'all'

  // Draft state for filter inputs (controlled components)
  const [occupation, setOccupation] = useState(activeOccupation)
  const [stateFilter, setStateFilter] = useState(activeState)
  const [city, setCity] = useState(activeCity)
  const [specialty, setSpecialty] = useState(activeSpec)
  const [serviceType, setServiceType] = useState(activeType)
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false)

  // Sync draft state with URL params changes (e.g. browser back/forward)
  useEffect(() => {
    setOccupation(activeOccupation)
    setStateFilter(activeState)
    setCity(activeCity)
    setSpecialty(activeSpec)
    setServiceType(activeType)
  }, [activeOccupation, activeState, activeCity, activeSpec, activeType])

  // Initialize filtered list based on current active filters
  const [filteredPros, setFilteredPros] = useState(() =>
    filterList(
      visibleProfessionals,
      activeOccupation,
      activeState,
      activeCity,
      activeSpec,
      activeType,
    ),
  )

  // Update list when visible professionals change OR when URL filters change
  useEffect(() => {
    const filtered = filterList(
      visibleProfessionals,
      activeOccupation,
      activeState,
      activeCity,
      activeSpec,
      activeType,
    )
    setFilteredPros(filtered)
  }, [
    visibleProfessionals,
    activeOccupation,
    activeState,
    activeCity,
    activeSpec,
    activeType,
  ])

  // Extract unique values for filters based on visible professionals
  const states = useMemo(
    () =>
      Array.from(new Set(visibleProfessionals.map((p) => p.state)))
        .filter(Boolean)
        .sort(),
    [visibleProfessionals],
  )

  // Filter cities based on selected state (draft) to improve UX (dependent dropdown)
  // Note: Using draft state 'stateFilter' here so dropdown updates as user selects state
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
    // Update URL params to reflect the draft state
    // This will update activeXXX variables and trigger the list update via useEffect
    const params = new URLSearchParams()
    if (occupation) params.set('ocupacao', occupation)
    if (stateFilter && stateFilter !== 'all') params.set('estado', stateFilter)
    if (city && city !== 'all') params.set('cidade', city)
    if (specialty && specialty !== 'all') params.set('especialidade', specialty)
    if (serviceType && serviceType !== 'all') params.set('tipo', serviceType)
    setSearchParams(params)

    // Close mobile sheet if open
    setIsMobileFiltersOpen(false)
  }

  const clearFilters = () => {
    // Clear URL params
    setSearchParams(new URLSearchParams())
    setIsMobileFiltersOpen(false)
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
    <div className="container mx-auto px-4 py-6 md:py-8 min-h-screen">
      <div className="flex flex-col md:flex-row gap-6 lg:gap-8">
        {/* Desktop Filters */}
        <aside className="hidden md:block w-64 shrink-0 space-y-6 bg-card p-6 rounded-lg border border-border h-fit sticky top-24">
          <h2 className="font-heading font-bold text-xl mb-4">Filtros</h2>
          <SearchFilters {...filterProps} />
        </aside>

        {/* Mobile Filters & Results */}
        <div className="flex-grow">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl md:text-2xl font-heading font-bold">
              Profissionais Encontrados
            </h1>
            <div className="md:hidden">
              <Sheet
                open={isMobileFiltersOpen}
                onOpenChange={setIsMobileFiltersOpen}
              >
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Filter className="w-4 h-4" /> Filtros
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="left"
                  className="w-[300px] sm:w-[400px] overflow-y-auto"
                >
                  <SheetHeader>
                    <SheetTitle>Filtros de Busca</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6 pb-6">
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
            <div className="text-center py-12 md:py-20 bg-muted/20 rounded-lg border border-dashed">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-bold mb-2">
                Nenhum profissional encontrado
              </h3>
              <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                Tente ajustar seus filtros ou termos de busca para encontrar o
                que procura.
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
