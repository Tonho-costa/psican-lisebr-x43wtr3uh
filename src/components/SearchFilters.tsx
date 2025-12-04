import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface SearchFiltersProps {
  occupation: string
  setOccupation: (value: string) => void
  stateFilter: string
  setStateFilter: (value: string) => void
  city: string
  setCity: (value: string) => void
  specialty: string
  setSpecialty: (value: string) => void
  serviceType: string
  setServiceType: (value: string) => void
  states: string[]
  cities: string[]
  specialties: string[]
  onApplyFilters: () => void
  onClearFilters: () => void
}

export function SearchFilters({
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
  onApplyFilters,
  onClearFilters,
}: SearchFiltersProps) {
  return (
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
        <Button onClick={onApplyFilters} className="w-full">
          Aplicar Filtros
        </Button>
        <Button variant="outline" onClick={onClearFilters} className="w-full">
          Limpar Filtros
        </Button>
      </div>
    </div>
  )
}
