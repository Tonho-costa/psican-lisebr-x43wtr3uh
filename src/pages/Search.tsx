import { useState } from 'react'
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
    term: string,
    cityFilter: string,
    specFilter: string,
    typeFilter: string,
  ) => {
    let filtered = list

    if (term) {
      const lowerTerm = term.toLowerCase()
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(lowerTerm) ||
          p.city.toLowerCase().includes(lowerTerm) ||
          p.specialties.some((s) => s.toLowerCase().includes(lowerTerm)),
      )
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
  const initialTerm = searchParams.get('q') || ''
  const initialCity = searchParams.get('cidade') || 'all'
  const initialSpec = searchParams.get('especialidade') || 'all'
  const initialType = searchParams.get('tipo') || 'all'

  // Filters state initialized from URL
  const [city, setCity] = useState(initialCity)
  const [specialty, setSpecialty] = useState(initialSpec)
  const [serviceType, setServiceType] = useState(initialType)
  const [searchTerm, setSearchTerm] = useState(initialTerm)

  // Initialize filtered list using the helper function directly
  // This avoids the need for a useEffect on mount and solves dependency issues
  const [filteredPros, setFilteredPros] = useState(() =>
    filterList(
      professionals,
      initialTerm,
      initialCity,
      initialSpec,
      initialType,
    ),
  )

  // Extract unique values for filters
  const cities = Array.from(new Set(professionals.map((p) => p.city)))
  const specialties = Array.from(
    new Set(professionals.flatMap((p) => p.specialties)),
  )

  const applyFilters = () => {
    const filtered = filterList(
      professionals,
      searchTerm,
      city,
      specialty,
      serviceType,
    )
    setFilteredPros(filtered)

    // Update URL params
    const params = new URLSearchParams()
    if (searchTerm) params.set('q', searchTerm)
    if (city && city !== 'all') params.set('cidade', city)
    if (specialty && specialty !== 'all') params.set('especialidade', specialty)
    if (serviceType && serviceType !== 'all') params.set('tipo', serviceType)
    setSearchParams(params)
  }

  const clearFilters = () => {
    setCity('all')
    setSpecialty('all')
    setServiceType('all')
    setSearchTerm('')
    setFilteredPros(professionals)
    setSearchParams(new URLSearchParams())
  }

  const FilterContent = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Busca por Texto</Label>
        <Input
          placeholder="Nome, cidade, especialidade..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
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
        <Label>Especialidade</Label>
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
