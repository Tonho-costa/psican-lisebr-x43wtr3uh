import { useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Filter, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
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

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { professionals } = useProfessionalStore()

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
      filtered = filtered.filter((p) =>
        p.serviceTypes.includes(typeFilter as any),
      )
    }

    return filtered
  }

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

  // Initialize filtered list using the helper function directly
  const [filteredPros, setFilteredPros] = useState(() =>
    filterList(
      professionals,
      initialOccupation,
      initialState,
      initialCity,
      initialSpec,
      initialType,
    ),
  )

  // Extract unique values for filters
  const states = useMemo(
    () =>
      Array.from(new Set(professionals.map((p) => p.state)))
        .filter(Boolean)
        .sort(),
    [professionals],
  )

  // Filter cities based on selected state to improve UX (dependent dropdown)
  const cities = useMemo(() => {
    const relevantPros =
      stateFilter && stateFilter !== 'all'
        ? professionals.filter((p) => p.state === stateFilter)
        : professionals
    return Array.from(new Set(relevantPros.map((p) => p.city)))
      .filter(Boolean)
      .sort()
  }, [professionals, stateFilter])

  const specialties = useMemo(
    () =>
      Array.from(new Set(professionals.flatMap((p) => p.specialties)))
        .filter(Boolean)
        .sort(),
    [professionals],
  )

  const applyFilters = () => {
    const filtered = filterList(
      professionals,
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
    setFilteredPros(professionals)
    setSearchParams(new URLSearchParams())
  }

  const FilterContent = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Ocupação</Label>
        <Input
          placeholder="Psicanalista, Psicólogo..."
          value={occupation}
          onChange={(e) => setOccupation(e.target.value)}
          maxLength={150}
        />
      </div>

      <div className="space-y-2">
        <Label>Estado</Label>
        <Select
          value={stateFilter}
          onValueChange={(val) => {
            setStateFilter(val)
            setCity('all') // Reset city when state changes
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Todos os Estados" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os Estados</SelectItem>
            {states.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Cidade</Label>
        <Select value={city} onValueChange={setCity}>
          <SelectTrigger>
            <SelectValue placeholder="Todas as Cidades" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as Cidades</SelectItem>
            {cities.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Habilidades e Especialidades</Label>
        <Select value={specialty} onValueChange={setSpecialty}>
          <SelectTrigger>
            <SelectValue placeholder="Todas as Especialidades" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as Especialidades</SelectItem>
            {specialties.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Tipo de Atendimento</Label>
        <div className="flex flex-col gap-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="online"
              checked={serviceType === 'Online'}
              onCheckedChange={(checked) =>
                setServiceType(checked ? 'Online' : 'all')
              }
            />
            <label
              htmlFor="online"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Online
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="presencial"
              checked={serviceType === 'Presencial'}
              onCheckedChange={(checked) =>
                setServiceType(checked ? 'Presencial' : 'all')
              }
            />
            <label
              htmlFor="presencial"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Presencial
            </label>
          </div>
        </div>
      </div>

      <div className="pt-4 flex flex-col gap-2">
        <Button onClick={applyFilters} className="w-full">
          Aplicar Filtros
        </Button>
        <Button variant="outline" onClick={clearFilters} className="w-full">
          Limpar Filtros
        </Button>
      </div>
    </div>
  )

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Desktop Filters */}
        <aside className="hidden md:block w-64 shrink-0 space-y-6 bg-card p-6 rounded-lg border border-border h-fit sticky top-24">
          <h2 className="font-heading font-bold text-xl mb-4">Filtros</h2>
          <FilterContent />
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
                    <FilterContent />
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
