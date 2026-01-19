import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { adminService, Profile } from '@/services/adminService'
import { toast } from 'sonner'
import { Loader2, Check, X, Ban, Eye } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function AdminProfessionals() {
  const [searchParams, setSearchParams] = useSearchParams()
  const statusFilter = searchParams.get('status') || 'all'

  const [profiles, setProfiles] = useState<Profile[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [rejectId, setRejectId] = useState<string | null>(null)
  const [rejectReason, setRejectReason] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  const fetchProfiles = async () => {
    setIsLoading(true)
    const { data, error } = await adminService.getProfiles(statusFilter)
    if (!error && data) {
      setProfiles(data)
    } else {
      toast.error('Erro ao carregar profissionais')
    }
    setIsLoading(false)
  }

  useEffect(() => {
    fetchProfiles()
  }, [statusFilter])

  const handleStatusFilterChange = (value: string) => {
    setSearchParams({ status: value })
  }

  const handleApprove = async (id: string) => {
    if (!confirm('Tem certeza que deseja aprovar este profissional?')) return

    setIsProcessing(true)
    const { error } = await adminService.approveProfessional(id)
    setIsProcessing(false)

    if (error) {
      toast.error('Erro ao aprovar: ' + error.message)
    } else {
      toast.success('Profissional aprovado com sucesso!')
      fetchProfiles()
    }
  }

  const handleBlock = async (id: string) => {
    if (!confirm('Tem certeza que deseja bloquear este usuário?')) return

    setIsProcessing(true)
    const { error } = await adminService.blockUser(id)
    setIsProcessing(false)

    if (error) {
      toast.error('Erro ao bloquear: ' + error.message)
    } else {
      toast.success('Usuário bloqueado com sucesso!')
      fetchProfiles()
    }
  }

  const handleRejectSubmit = async () => {
    if (!rejectId || !rejectReason.trim()) return

    setIsProcessing(true)
    const { error } = await adminService.rejectProfessional(
      rejectId,
      rejectReason,
    )
    setIsProcessing(false)

    if (error) {
      toast.error('Erro ao reprovar: ' + error.message)
    } else {
      toast.success('Profissional reprovado.')
      setRejectId(null)
      setRejectReason('')
      fetchProfiles()
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ativo':
        return <Badge className="bg-green-600 hover:bg-green-700">Ativo</Badge>
      case 'analise':
        return (
          <Badge className="bg-yellow-600 hover:bg-yellow-700">
            Em Análise
          </Badge>
        )
      case 'reprovado':
        return <Badge variant="destructive">Reprovado</Badge>
      case 'bloqueado':
        return <Badge variant="secondary">Bloqueado</Badge>
      default:
        return <Badge variant="outline">{status || 'Pendente'}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-heading font-bold">
          Gestão de Profissionais
        </h1>
        <div className="w-full sm:w-64">
          <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="analise">Em Análise</SelectItem>
              <SelectItem value="ativo">Ativos</SelectItem>
              <SelectItem value="reprovado">Reprovados</SelectItem>
              <SelectItem value="bloqueado">Bloqueados</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="bg-card rounded-lg border border-border overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>CRP</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  <div className="flex justify-center">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  </div>
                </TableCell>
              </TableRow>
            ) : profiles.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-24 text-center text-muted-foreground"
                >
                  Nenhum profissional encontrado.
                </TableCell>
              </TableRow>
            ) : (
              profiles.map((profile) => (
                <TableRow key={profile.id}>
                  <TableCell className="font-medium">
                    <div className="flex flex-col">
                      <span>{profile.full_name}</span>
                      <span className="text-xs text-muted-foreground sm:hidden">
                        {profile.email}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {profile.email}
                  </TableCell>
                  <TableCell>{profile.crp_status || '-'}</TableCell>
                  <TableCell>
                    {getStatusBadge(profile.status || 'pendente')}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Ver Detalhes"
                        asChild
                      >
                        <a
                          href={`/perfil/${profile.id}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <Eye className="w-4 h-4" />
                        </a>
                      </Button>

                      {profile.status === 'analise' && (
                        <>
                          <Button
                            variant="outline"
                            size="icon"
                            className="text-green-600 hover:text-green-700 hover:bg-green-50"
                            onClick={() => handleApprove(profile.id)}
                            disabled={isProcessing}
                            title="Aprovar"
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => setRejectId(profile.id)}
                            disabled={isProcessing}
                            title="Reprovar"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </>
                      )}

                      {profile.status === 'ativo' && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-muted-foreground hover:text-destructive"
                          onClick={() => handleBlock(profile.id)}
                          disabled={isProcessing}
                          title="Bloquear"
                        >
                          <Ban className="w-4 h-4" />
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

      <Dialog
        open={!!rejectId}
        onOpenChange={(open) => !open && setRejectId(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reprovar Profissional</DialogTitle>
            <DialogDescription>
              Por favor, informe o motivo da reprovação. Isso será registrado
              nos logs.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reason">Motivo</Label>
              <Textarea
                id="reason"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Ex: Documentação incompleta..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRejectId(null)}
              disabled={isProcessing}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleRejectSubmit}
              disabled={isProcessing || !rejectReason.trim()}
            >
              {isProcessing && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              Confirmar Reprovação
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
