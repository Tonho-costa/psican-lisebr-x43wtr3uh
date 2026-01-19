import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { adminService } from '@/services/adminService'
import { useProfessionalStore } from '@/stores/useProfessionalStore'
import { toast } from 'sonner'
import { Loader2, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'

export default function AdminSubmissions() {
  const [submissions, setSubmissions] = useState<any[]>([])
  const [filteredSubmissions, setFilteredSubmissions] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSubmission, setSelectedSubmission] = useState<any | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newStatus, setNewStatus] = useState('')
  const [notes, setNotes] = useState('')
  const [isUpdating, setIsUpdating] = useState(false)

  const { currentProfessional } = useProfessionalStore()

  useEffect(() => {
    loadSubmissions()
  }, [])

  useEffect(() => {
    const lowerTerm = searchTerm.toLowerCase()
    const filtered = submissions.filter(
      (s) =>
        s.full_name?.toLowerCase().includes(lowerTerm) ||
        s.email?.toLowerCase().includes(lowerTerm) ||
        s.status?.toLowerCase().includes(lowerTerm),
    )
    setFilteredSubmissions(filtered)
  }, [searchTerm, submissions])

  const loadSubmissions = async () => {
    setIsLoading(true)
    const { data, error } = await adminService.getSubmissions()
    if (!error && data) {
      setSubmissions(data)
      setFilteredSubmissions(data)
    } else {
      toast.error('Erro ao carregar submissões')
    }
    setIsLoading(false)
  }

  const handleEdit = (submission: any) => {
    setSelectedSubmission(submission)
    setNewStatus(submission.status)
    setNotes(submission.admin_notes || '')
    setIsDialogOpen(true)
  }

  const handleSave = async () => {
    if (!currentProfessional?.id || !selectedSubmission) return

    setIsUpdating(true)
    const { error } = await adminService.updateSubmissionStatus(
      selectedSubmission.id,
      newStatus,
      notes,
      currentProfessional.id,
    )

    if (!error) {
      toast.success('Submissão atualizada com sucesso')
      await loadSubmissions()
      setIsDialogOpen(false)
    } else {
      toast.error('Erro ao atualizar submissão')
    }
    setIsUpdating(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
      case 'Processed':
        return 'bg-green-100 text-green-800 hover:bg-green-200'
      case 'Rejected':
        return 'bg-red-100 text-red-800 hover:bg-red-200'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-heading font-bold">Submissões</h2>
          <p className="text-muted-foreground">
            Gerencie as triagens recebidas.
          </p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome ou email..."
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
              <TableHead>Data</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
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
            ) : filteredSubmissions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10">
                  Nenhuma submissão encontrada.
                </TableCell>
              </TableRow>
            ) : (
              filteredSubmissions.map((submission) => (
                <TableRow key={submission.id}>
                  <TableCell>
                    {format(new Date(submission.created_at), 'dd/MM/yyyy')}
                  </TableCell>
                  <TableCell className="font-medium">
                    {submission.full_name}
                  </TableCell>
                  <TableCell>{submission.email}</TableCell>
                  <TableCell>
                    <Badge
                      className={getStatusColor(submission.status)}
                      variant="outline"
                    >
                      {submission.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(submission)}
                    >
                      Detalhes
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Detalhes da Submissão</DialogTitle>
          </DialogHeader>
          {selectedSubmission && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-bold block text-muted-foreground">
                    Nome:
                  </span>
                  {selectedSubmission.full_name}
                </div>
                <div>
                  <span className="font-bold block text-muted-foreground">
                    Email:
                  </span>
                  {selectedSubmission.email}
                </div>
                <div>
                  <span className="font-bold block text-muted-foreground">
                    Telefone:
                  </span>
                  {selectedSubmission.phone}
                </div>
                <div>
                  <span className="font-bold block text-muted-foreground">
                    CRP:
                  </span>
                  {selectedSubmission.crp_status}
                </div>
              </div>

              <div className="text-sm">
                <span className="font-bold block text-muted-foreground">
                  Educação:
                </span>
                <p className="whitespace-pre-wrap">
                  {selectedSubmission.education}
                </p>
              </div>

              <div className="space-y-2 pt-4 border-t">
                <Label>Status</Label>
                <Select value={newStatus} onValueChange={setNewStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pending">Pendente</SelectItem>
                    <SelectItem value="Processed">Processado</SelectItem>
                    <SelectItem value="Rejected">Rejeitado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Notas do Administrador</Label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Adicione observações internas..."
                  rows={4}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={isUpdating}>
              {isUpdating ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              Salvar Alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
