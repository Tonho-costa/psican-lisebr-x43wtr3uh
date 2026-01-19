import { useState, useEffect, useMemo } from 'react'
import {
  MoreHorizontal,
  Pencil,
  Trash2,
  Search,
  ShieldAlert,
  Shield,
  User,
  Power,
  Ban,
} from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { useAdminStore } from '@/stores/useAdminStore'
import {
  useProfessionalStore,
  Professional,
} from '@/stores/useProfessionalStore'
import { UserEditSheet } from '@/components/admin/UserEditSheet'
import { StatusChangeDialog } from '@/components/admin/StatusChangeDialog'
import { toast } from 'sonner'

export default function AdminUsers() {
  const { users, fetchUsers, isLoading, updateUserStatus } = useAdminStore()
  const { currentProfessional } = useProfessionalStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  // Edit State
  const [editingUser, setEditingUser] = useState<Professional | null>(null)
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false)

  // Status Change State
  const [targetUser, setTargetUser] = useState<Professional | null>(null)
  const [statusAction, setStatusAction] = useState<
    'activate' | 'suspend' | 'block' | null
  >(null)
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false)

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesRole = roleFilter === 'all' || user.role === roleFilter
      const matchesStatus =
        statusFilter === 'all' || user.status === statusFilter

      return matchesSearch && matchesRole && matchesStatus
    })
  }, [users, searchTerm, roleFilter, statusFilter])

  const handleEdit = (user: Professional) => {
    setEditingUser(user)
    setIsEditSheetOpen(true)
  }

  const handleStatusChange = (
    user: Professional,
    action: 'activate' | 'suspend' | 'block',
  ) => {
    setTargetUser(user)
    setStatusAction(action)
    setIsStatusDialogOpen(true)
  }

  const confirmStatusChange = async (justification: string) => {
    if (!targetUser || !currentProfessional || !statusAction) return

    let newStatus = ''
    if (statusAction === 'activate') newStatus = 'approved'
    if (statusAction === 'suspend') newStatus = 'suspended'
    if (statusAction === 'block') newStatus = 'blocked'

    const success = await updateUserStatus(
      currentProfessional.id,
      targetUser.id,
      { status: newStatus },
      justification,
    )

    if (success) {
      toast.success(`Status alterado para ${newStatus}`)
      setIsStatusDialogOpen(false)
      setTargetUser(null)
      setStatusAction(null)
    } else {
      toast.error('Erro ao alterar status')
    }
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return (
          <Badge className="bg-purple-600 hover:bg-purple-700">Admin</Badge>
        )
      case 'moderator':
        return <Badge className="bg-blue-600 hover:bg-blue-700">Mod</Badge>
      default:
        return <Badge variant="secondary">User</Badge>
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
      case 'approved':
        return (
          <Badge className="bg-green-600 hover:bg-green-700">Aprovado</Badge>
        )
      case 'suspended':
        return (
          <Badge className="bg-yellow-600 hover:bg-yellow-700">Suspenso</Badge>
        )
      case 'blocked':
        return <Badge variant="destructive">Bloqueado</Badge>
      case 'pending':
        return (
          <Badge
            variant="outline"
            className="text-orange-500 border-orange-500"
          >
            Em Análise
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-heading font-bold text-foreground">
          Gestão de Usuários
        </h1>
        <p className="text-muted-foreground">
          Governança completa de perfis e acessos.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-card p-4 rounded-lg border border-border shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome ou email..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Função" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas Funções</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="moderator">Moderador</SelectItem>
              <SelectItem value="user">Usuário</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos Status</SelectItem>
              <SelectItem value="approved">Aprovado</SelectItem>
              <SelectItem value="pending">Em Análise</SelectItem>
              <SelectItem value="suspended">Suspenso</SelectItem>
              <SelectItem value="blocked">Bloqueado</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Usuário</TableHead>
              <TableHead>Função</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Cadastro</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10">
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-10 text-muted-foreground"
                >
                  Nenhum usuário encontrado.
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{user.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {user.email}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{getRoleBadge(user.role)}</TableCell>
                  <TableCell>{getStatusBadge(user.status)}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString()
                      : '-'}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Abrir menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleEdit(user)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Detalhes / Editar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {user.status !== 'approved' &&
                          user.status !== 'active' && (
                            <DropdownMenuItem
                              onClick={() =>
                                handleStatusChange(user, 'activate')
                              }
                            >
                              <Power className="mr-2 h-4 w-4 text-green-600" />
                              Aprovar / Ativar
                            </DropdownMenuItem>
                          )}
                        {user.status !== 'suspended' && (
                          <DropdownMenuItem
                            onClick={() => handleStatusChange(user, 'suspend')}
                          >
                            <ShieldAlert className="mr-2 h-4 w-4 text-yellow-600" />
                            Suspender
                          </DropdownMenuItem>
                        )}
                        {user.status !== 'blocked' && (
                          <DropdownMenuItem
                            onClick={() => handleStatusChange(user, 'block')}
                            className="text-destructive"
                          >
                            <Ban className="mr-2 h-4 w-4" />
                            Bloquear
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <UserEditSheet
        user={editingUser}
        open={isEditSheetOpen}
        onOpenChange={setIsEditSheetOpen}
      />

      <StatusChangeDialog
        isOpen={isStatusDialogOpen}
        onClose={() => setIsStatusDialogOpen(false)}
        onConfirm={confirmStatusChange}
        isLoading={isLoading}
        title={`Alterar Status para ${statusAction?.toUpperCase()}`}
        description={`Você está prestes a alterar o status de ${targetUser?.name}. Esta ação requer uma justificativa obrigatória.`}
        actionLabel="Confirmar Alteração"
      />
    </div>
  )
}
