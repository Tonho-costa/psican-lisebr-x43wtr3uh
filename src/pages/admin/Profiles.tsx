import { useEffect, useState } from 'react'
import { adminService } from '@/services/adminService'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search, Loader2 } from 'lucide-react'
import { useProfessionalStore } from '@/stores/useProfessionalStore'
import { toast } from 'sonner'
import { format } from 'date-fns'

interface AdminProfile {
  id: string
  name: string
  email: string
  role: string
  status: string
  createdAt: string
  avatarUrl: string | null
}

export default function AdminProfiles() {
  const [profiles, setProfiles] = useState<AdminProfile[]>([])
  const [filteredProfiles, setFilteredProfiles] = useState<AdminProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const { currentProfessional } = useProfessionalStore()

  useEffect(() => {
    loadProfiles()
  }, [])

  useEffect(() => {
    filterData()
  }, [search, roleFilter, statusFilter, profiles])

  const loadProfiles = async () => {
    try {
      setLoading(true)
      const data = await adminService.getAllProfiles()
      setProfiles(data)
    } catch (error) {
      toast.error('Erro ao carregar perfis')
    } finally {
      setLoading(false)
    }
  }

  const filterData = () => {
    let result = profiles

    if (search) {
      const lower = search.toLowerCase()
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(lower) ||
          p.email.toLowerCase().includes(lower),
      )
    }

    if (roleFilter !== 'all') {
      result = result.filter((p) => p.role === roleFilter)
    }

    if (statusFilter !== 'all') {
      result = result.filter((p) => p.status === statusFilter)
    }

    setFilteredProfiles(result)
  }

  const handleStatusChange = async (
    targetId: string,
    newStatus: string,
    currentRole: string,
  ) => {
    if (!currentProfessional) return
    const toastId = toast.loading('Atualizando status...')
    try {
      await adminService.updateProfileStatus(
        currentProfessional.id,
        targetId,
        newStatus,
        currentRole,
        'Alteração manual via painel admin',
      )
      // Update local state
      setProfiles((prev) =>
        prev.map((p) => (p.id === targetId ? { ...p, status: newStatus } : p)),
      )
      toast.success('Status atualizado', { id: toastId })
    } catch (error) {
      toast.error('Erro ao atualizar status', { id: toastId })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold">Gerenciar Perfis</h1>
          <p className="text-muted-foreground">
            Visualize e gerencie todos os usuários cadastrados.
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center bg-card p-4 rounded-lg border">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome ou email..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Função" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas Funções</SelectItem>
            <SelectItem value="user">Usuário</SelectItem>
            <SelectItem value="professional">Profissional</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos Status</SelectItem>
            <SelectItem value="pending">Pendente</SelectItem>
            <SelectItem value="verified">Verificado</SelectItem>
            <SelectItem value="blocked">Bloqueado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="border rounded-lg bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Função</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Data Criação</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" />
                </TableCell>
              </TableRow>
            ) : filteredProfiles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  Nenhum perfil encontrado.
                </TableCell>
              </TableRow>
            ) : (
              filteredProfiles.map((profile) => (
                <TableRow key={profile.id}>
                  <TableCell className="font-medium">{profile.name}</TableCell>
                  <TableCell>{profile.email}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{profile.role}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={
                        profile.status === 'verified'
                          ? 'bg-green-100 text-green-800 border-green-200'
                          : profile.status === 'blocked'
                            ? 'bg-red-100 text-red-800 border-red-200'
                            : 'bg-yellow-100 text-yellow-800 border-yellow-200'
                      }
                    >
                      {profile.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {format(new Date(profile.createdAt), 'dd/MM/yyyy')}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {profile.status !== 'blocked' && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() =>
                            handleStatusChange(
                              profile.id,
                              'blocked',
                              profile.role,
                            )
                          }
                        >
                          Bloquear
                        </Button>
                      )}
                      {profile.status === 'blocked' && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-green-600 border-green-200 hover:bg-green-50"
                          onClick={() =>
                            handleStatusChange(
                              profile.id,
                              'verified',
                              profile.role,
                            )
                          }
                        >
                          Desbloquear
                        </Button>
                      )}
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
