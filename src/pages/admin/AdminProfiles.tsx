import { useState, useEffect } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { adminService } from '@/services/adminService'
import { useProfessionalStore } from '@/stores/useProfessionalStore'
import { toast } from 'sonner'
import { Loader2, Search, Star, Eye, EyeOff } from 'lucide-react'

export default function AdminProfiles() {
  const [profiles, setProfiles] = useState<any[]>([])
  const [filteredProfiles, setFilteredProfiles] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const { currentProfessional } = useProfessionalStore()

  useEffect(() => {
    loadProfiles()
  }, [])

  useEffect(() => {
    const lowerTerm = searchTerm.toLowerCase()
    const filtered = profiles.filter(
      (p) =>
        p.full_name?.toLowerCase().includes(lowerTerm) ||
        p.email?.toLowerCase().includes(lowerTerm) ||
        p.occupation?.toLowerCase().includes(lowerTerm),
    )
    setFilteredProfiles(filtered)
  }, [searchTerm, profiles])

  const loadProfiles = async () => {
    setIsLoading(true)
    const { data, error } = await adminService.getAllProfiles()
    if (!error && data) {
      setProfiles(data)
      setFilteredProfiles(data)
    } else {
      toast.error('Erro ao carregar perfis')
    }
    setIsLoading(false)
  }

  const handleToggleVisibility = async (
    profileId: string,
    currentVal: boolean,
  ) => {
    if (!currentProfessional?.id) return

    // Optimistic update
    setProfiles((prev) =>
      prev.map((p) =>
        p.id === profileId ? { ...p, is_visible: !currentVal } : p,
      ),
    )

    const { error } = await adminService.toggleProfileVisibility(
      currentProfessional.id,
      profileId,
      !currentVal,
    )

    if (error) {
      toast.error('Erro ao atualizar visibilidade')
      // Revert on error
      loadProfiles()
    } else {
      toast.success(`Perfil ${!currentVal ? 'visível' : 'oculto'} com sucesso.`)
    }
  }

  const handleToggleFeatured = async (
    profileId: string,
    currentVal: boolean,
  ) => {
    if (!currentProfessional?.id) return

    setProfiles((prev) =>
      prev.map((p) =>
        p.id === profileId ? { ...p, is_featured: !currentVal } : p,
      ),
    )

    const { error } = await adminService.toggleProfileFeatured(
      currentProfessional.id,
      profileId,
      !currentVal,
    )

    if (error) {
      toast.error('Erro ao atualizar destaque')
      loadProfiles()
    } else {
      toast.success(
        `Perfil ${!currentVal ? 'destacado' : 'removido do destaque'}.`,
      )
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-heading font-bold">Gerenciar Perfis</h2>
          <p className="text-muted-foreground">
            Controle de visibilidade e destaques.
          </p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar profissional..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <div className="bg-card rounded-md border shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Profissional</TableHead>
              <TableHead>Ocupação</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-center">Visível</TableHead>
              <TableHead className="text-center">Destaque</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
                </TableCell>
              </TableRow>
            ) : filteredProfiles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10">
                  Nenhum perfil encontrado.
                </TableCell>
              </TableRow>
            ) : (
              filteredProfiles.map((profile) => (
                <TableRow key={profile.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{profile.full_name}</div>
                      <div className="text-xs text-muted-foreground">
                        {profile.email}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{profile.occupation || '-'}</TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className="uppercase text-[10px]"
                    >
                      {profile.status || 'Ativo'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center items-center gap-2">
                      {profile.is_visible ? (
                        <Eye className="w-4 h-4 text-green-600" />
                      ) : (
                        <EyeOff className="w-4 h-4 text-muted-foreground" />
                      )}
                      <Switch
                        checked={profile.is_visible}
                        onCheckedChange={() =>
                          handleToggleVisibility(profile.id, profile.is_visible)
                        }
                      />
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center items-center gap-2">
                      <Star
                        className={`w-4 h-4 ${profile.is_featured ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`}
                      />
                      <Switch
                        checked={profile.is_featured}
                        onCheckedChange={() =>
                          handleToggleFeatured(profile.id, profile.is_featured)
                        }
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
