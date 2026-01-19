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
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Loader2, Eye, CheckCircle, XCircle, AlertTriangle } from 'lucide-react'
import { useProfessionalStore } from '@/stores/useProfessionalStore'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { Database } from '@/lib/supabase/types'

type TriageSubmission =
  Database['public']['Tables']['triage_submissions']['Row']

export default function AdminTriage() {
  const [submissions, setSubmissions] = useState<TriageSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSubmission, setSelectedSubmission] =
    useState<TriageSubmission | null>(null)
  const [actionNotes, setActionNotes] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const { currentProfessional } = useProfessionalStore()

  useEffect(() => {
    loadSubmissions()
  }, [])

  const loadSubmissions = async () => {
    try {
      setLoading(true)
      const data = await adminService.getTriageSubmissions()
      setSubmissions(data)
    } catch (error) {
      toast.error('Erro ao carregar triagens')
    } finally {
      setLoading(false)
    }
  }

  const handleAction = async (
    action: 'approve' | 'reject' | 'request_changes',
  ) => {
    if (!currentProfessional || !selectedSubmission) return
    if (!actionNotes.trim() && action !== 'approve') {
      toast.error('Justificativa é obrigatória para rejeição ou ajustes.')
      return
    }

    setIsProcessing(true)
    try {
      await adminService.processTriage(
        currentProfessional.id,
        selectedSubmission.id,
        action,
        actionNotes,
        selectedSubmission.user_id || undefined,
      )
      toast.success('Triagem processada com sucesso!')
      setSelectedSubmission(null)
      setActionNotes('')
      loadSubmissions() // Refresh list
    } catch (error) {
      toast.error('Erro ao processar triagem')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-bold">
          Triagem de Profissionais
        </h1>
        <p className="text-muted-foreground">
          Analise e valide as candidaturas de novos profissionais.
        </p>
      </div>

      <div className="border rounded-lg bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>CRP</TableHead>
              <TableHead>Data Envio</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" />
                </TableCell>
              </TableRow>
            ) : submissions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  Nenhuma triagem encontrada.
                </TableCell>
              </TableRow>
            ) : (
              submissions.map((sub) => (
                <TableRow key={sub.id}>
                  <TableCell className="font-medium">{sub.full_name}</TableCell>
                  <TableCell>{sub.crp_status}</TableCell>
                  <TableCell>
                    {format(new Date(sub.created_at), 'dd/MM/yyyy HH:mm')}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        sub.status === 'approved'
                          ? 'default' // Changed from 'success' as it's not a standard shadcn badge variant
                          : sub.status === 'rejected'
                            ? 'destructive'
                            : 'secondary'
                      }
                      className="capitalize"
                    >
                      {sub.status.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedSubmission(sub)}
                      className="gap-2"
                    >
                      <Eye className="w-4 h-4" /> Detalhes
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Details Dialog */}
      <Dialog
        open={!!selectedSubmission}
        onOpenChange={(open) => !open && setSelectedSubmission(null)}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalhes da Candidatura</DialogTitle>
            <DialogDescription>
              Revise as informações antes de tomar uma decisão.
            </DialogDescription>
          </DialogHeader>

          {selectedSubmission && (
            <div className="grid gap-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Nome Completo</Label>
                  <p className="font-medium">{selectedSubmission.full_name}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Email</Label>
                  <p className="font-medium">{selectedSubmission.email}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Telefone</Label>
                  <p className="font-medium">{selectedSubmission.phone}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">CRP Status</Label>
                  <p className="font-medium">{selectedSubmission.crp_status}</p>
                </div>
              </div>

              <div>
                <Label className="text-muted-foreground">Formação</Label>
                <p className="bg-muted p-2 rounded-md text-sm mt-1">
                  {selectedSubmission.education}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Abordagem</Label>
                  <p className="font-medium">
                    {selectedSubmission.theoretical_approach}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Experiência</Label>
                  <p className="font-medium">
                    {selectedSubmission.experience_level}
                  </p>
                </div>
              </div>

              <div>
                <Label className="text-muted-foreground">
                  Disponibilidade Semanal
                </Label>
                <p className="font-medium">
                  {selectedSubmission.weekly_availability}
                </p>
              </div>

              <div className="space-y-2 border-t pt-4 mt-2">
                <Label>Notas do Administrador / Justificativa</Label>
                <Textarea
                  placeholder="Escreva aqui a razão da aprovação, rejeição ou solicitação de ajuste..."
                  value={actionNotes}
                  onChange={(e) => setActionNotes(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 sm:justify-between">
            <div className="flex gap-2 w-full sm:w-auto">
              <Button
                variant="destructive"
                onClick={() => handleAction('reject')}
                disabled={isProcessing}
                className="flex-1 sm:flex-none"
              >
                <XCircle className="w-4 h-4 mr-2" /> Reprovar
              </Button>
              <Button
                variant="outline"
                onClick={() => handleAction('request_changes')}
                disabled={isProcessing}
                className="flex-1 sm:flex-none"
              >
                <AlertTriangle className="w-4 h-4 mr-2" /> Ajustes
              </Button>
            </div>
            <Button
              onClick={() => handleAction('approve')}
              disabled={isProcessing}
              className="bg-green-600 hover:bg-green-700 w-full sm:w-auto"
            >
              {isProcessing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" /> Aprovar
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
