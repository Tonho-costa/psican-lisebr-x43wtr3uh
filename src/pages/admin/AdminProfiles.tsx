import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
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
import { Button } from '@/components/ui/button'
import { adminService } from '@/services/adminService'
import { useProfessionalStore } from '@/stores/useProfessionalStore'
import { toast } from 'sonner'
import { Loader2, Search, Edit2, Trash2, Eye } from 'lucide-react'
import { EditProfileSheet } from '@/components/admin/EditProfileSheet'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Database } from '@/lib/supabase/types'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

type Profile = Database['public']['Tables']['profiles']['Row']

export default function AdminProfiles() {
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [filteredProfiles, setFilteredProfiles] = useState<Profile[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const [editingProfile, setEditingProfile] = useState<Profile | null>(null)
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false)

  const [deletingProfile, setDeletingProfile] = useState<Profile | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const { currentProfessional } = useProfessionalStore()

  useEffect(() => {
    loadProfiles()
  }, [])

  useEffect(() => {
    let filtered = profiles

    // Search
    if (searchTerm) {
      const lower = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (p) =>
          p.full_name?.toLowerCase().includes(lower) ||
          p.email?.toLowerCase().includes(lower) ||
          p.occupation?.toLowerCase().includes(lower),
      )
    }

    // Filter by Visibility/Status
    if (statusFilter !== 'all') {
      if (statusFilter === 'visible') {
        filtered = filtered.filter((p) => p.is_visible)
      } else if (statusFilter === 'hidden') {
        filtered = filtered.filter((p) => !p.is_visible)
      }
    }

    setFilteredProfiles(filtered)
  }, [searchTerm, statusFilter, profiles])

  const loadProfiles = async () => {
    setIsLoading(true)
    const { data, error } = await adminService.getAllProfiles()
    if (!error && data) {
      setProfiles(data)
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

    // Optimistic Update
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
      loadProfiles() // Revert
    } else {
      toast.success('Visibilidade atualizada')
    }
  }

  const handleToggleFeatured = async (
    profileId: string,
    currentVal: boolean,
  ) => {
    if (!currentProfessional?.id) return

    // Optimistic Update
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
      loadProfiles() // Revert
    } else {
      toast.success('Destaque atualizado')
    }
  }

  const handleEditClick = (profile: Profile) => {
    setEditingProfile(profile)
    setIsEditSheetOpen(true)
  }

  const handleDeleteClick = (profile: Profile) => {
    setDeletingProfile(profile)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!deletingProfile) return

    const { error } = await adminService.deleteProfile(deletingProfile.id)

    if (error) {
      toast.error('Erro ao excluir perfil')
    } else {
      toast.success('Perfil excluído com sucesso')
      // Update local state
      setProfiles((prev) => prev.filter((p) => p.id !== deletingProfile.id))
    }
    setIsDeleteDialogOpen(false)
    setDeletingProfile(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold">Gerenciar Perfis</h1>
          <p className="text-muted-foreground">
            Listagem completa de profissionais e usuários.
          </p>
        </div>
        <Button onClick={() => loadProfiles()} variant="outline" size="sm">
          <Loader2
            className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`}
          />
          Atualizar Lista
        </Button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-card p-4 rounded-lg border">
        <div className="relative md:col-span-3">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome, email ou ocupação..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Visibilidade" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="visible">Visíveis</SelectItem>
            <SelectItem value="hidden">Ocultos</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="bg-card rounded-md border shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Profissional</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-center">Visível</TableHead>
              <TableHead className="text-center">Destaque</TableHead>
              <TableHead className="text-right">Ações</TableHead>
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
                      <div className="text-xs text-muted-foreground italic">
                        {profile.occupation || 'Sem ocupação'}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={
                        profile.status === 'verified'
                          ? 'bg-green-100 text-green-800'
                          : profile.status === 'blocked'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                      }
                      variant="outline"
                    >
                      {profile.status || 'pending'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center">
                      <Switch
                        checked={!!profile.is_visible}
                        onCheckedChange={() =>
                          handleToggleVisibility(
                            profile.id,
                            !!profile.is_visible,
                          )
                        }
                      />
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center">
                      <Switch
                        checked={!!profile.is_featured}
                        onCheckedChange={() =>
                          handleToggleFeatured(
                            profile.id,
                            !!profile.is_featured,
                          )
                        }
                      />
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            asChild
                            className="text-muted-foreground hover:text-primary"
                          >
                            <Link
                              to={`/perfil/${profile.id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Ver Perfil Público</TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditClick(profile)}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Editar Perfil</TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => handleDeleteClick(profile)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Excluir Perfil</TooltipContent>
                      </Tooltip>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <EditProfileSheet
        open={isEditSheetOpen}
        onOpenChange={setIsEditSheetOpen}
        profile={editingProfile}
        onProfileUpdated={loadProfiles}
      />

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso excluirá permanentemente o
              perfil de <strong>{deletingProfile?.full_name}</strong> e todos os
              dados associados do banco de dados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={confirmDelete}
            >
              Excluir Perfil
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
