import { useEffect, useState, useCallback } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Loader2,
  MoreHorizontal,
  Search,
  CheckCircle2,
  XCircle,
  Shield,
  ExternalLink,
} from 'lucide-react'
import { profileService } from '@/services/profileService'
import { Professional } from '@/stores/useProfessionalStore'
import { toast } from 'sonner'
import { Link } from 'react-router-dom'

export default function AdminProfessionals() {
  const [professionals, setProfessionals] = useState<Professional[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const fetchProfiles = useCallback(async () => {
    setIsLoading(true)
    try {
      const { data, error } = await profileService.getAdminProfiles()
      if (error) {
        throw error
      }
      if (data) {
        setProfessionals(data)
      }
    } catch (error) {
      console.error('Error fetching professionals:', error)
      toast.error('Erro ao carregar profissionais')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProfiles()
  }, [fetchProfiles])

  const handleToggleVisibility = async (professional: Professional) => {
    try {
      const { data, error } = await profileService.updateProfile(
        professional.id,
        {
          isVisible: !professional.isVisible,
        },
      )

      if (error) throw error

      if (data) {
        setProfessionals((prev) =>
          prev.map((p) => (p.id === data.id ? data : p)),
        )
        toast.success(
          `Perfil ${data.isVisible ? 'visível' : 'oculto'} com sucesso`,
        )
      }
    } catch (error) {
      console.error('Error toggling visibility:', error)
      toast.error('Erro ao atualizar visibilidade')
    }
  }

  const filteredProfessionals = professionals.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.email.toLowerCase().includes(search.toLowerCase())

    if (!matchesSearch) return false

    if (statusFilter === 'visible') return p.isVisible
    if (statusFilter === 'hidden') return !p.isVisible
    if (statusFilter === 'admin') return p.role === 'admin'

    return true
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Usuários</h2>
          <p className="text-muted-foreground mt-1">
            Gerencie todos os usuários cadastrados na plataforma.
          </p>
        </div>
        <Button onClick={fetchProfiles} variant="outline" size="sm">
          Atualizar Lista
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-card p-4 rounded-lg border shadow-sm">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome ou email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
        <div className="w-full sm:w-auto flex items-center gap-2">
          <span className="text-sm text-muted-foreground whitespace-nowrap">
            Filtrar por:
          </span>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="visible">Visíveis</SelectItem>
              <SelectItem value="hidden">Ocultos</SelectItem>
              <SelectItem value="admin">Administradores</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="bg-card rounded-md border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Foto</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Função</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Carregando dados...
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredProfessionals.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  Nenhum usuário encontrado.
                </TableCell>
              </TableRow>
            ) : (
              filteredProfessionals.map((pro) => (
                <TableRow key={pro.id}>
                  <TableCell>
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={pro.photoUrl} alt={pro.name} />
                      <AvatarFallback>
                        {pro.name?.[0]?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{pro.name}</span>
                      <span className="text-xs text-muted-foreground truncate max-w-[150px]">
                        {pro.occupation}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{pro.email}</TableCell>
                  <TableCell>
                    {pro.role === 'admin' ? (
                      <Badge
                        variant="default"
                        className="bg-purple-600 hover:bg-purple-700"
                      >
                        <Shield className="w-3 h-3 mr-1" /> Admin
                      </Badge>
                    ) : (
                      <Badge variant="secondary">Usuário</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {pro.isVisible ? (
                      <Badge
                        variant="outline"
                        className="text-green-600 border-green-200 bg-green-50"
                      >
                        <CheckCircle2 className="w-3 h-3 mr-1" /> Visível
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="text-amber-600 border-amber-200 bg-amber-50"
                      >
                        <XCircle className="w-3 h-3 mr-1" /> Oculto
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                        <DropdownMenuItem asChild>
                          <Link to={`/perfil/${pro.id}`} target="_blank">
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Ver Perfil Público
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleToggleVisibility(pro)}
                        >
                          {pro.isVisible ? (
                            <>
                              <XCircle className="mr-2 h-4 w-4" />
                              Ocultar Perfil
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="mr-2 h-4 w-4" />
                              Publicar Perfil
                            </>
                          )}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <div className="text-xs text-muted-foreground text-center">
        Mostrando {filteredProfessionals.length} de {professionals.length}{' '}
        usuários
      </div>
    </div>
  )
}
