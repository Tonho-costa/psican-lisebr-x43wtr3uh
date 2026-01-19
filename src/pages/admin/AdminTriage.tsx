import { useEffect, useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Eye, CheckCircle2 } from 'lucide-react'
import { useAdminStore } from '@/stores/useAdminStore'
import { useProfessionalStore } from '@/stores/useProfessionalStore'
import { TriageDetailSheet } from '@/components/admin/TriageDetailSheet'
import { StatusChangeDialog } from '@/components/admin/StatusChangeDialog'
import { TriageSubmission } from '@/services/triageService'
import { toast } from 'sonner'

export default function AdminTriage() {
  const {
    triageSubmissions,
    fetchTriage,
    approveTriage,
    rejectTriage,
    isLoading,
  } = useAdminStore()
  const { currentProfessional } = useProfessionalStore()

  const [selectedSubmission, setSelectedSubmission] =
    useState<TriageSubmission | null>(null)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(
    null,
  )
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    fetchTriage()
  }, [fetchTriage])

  const handleView = (submission: TriageSubmission) => {
    setSelectedSubmission(submission)
    setIsSheetOpen(true)
  }

  const handleActionClick = (
    submission: TriageSubmission,
    type: 'approve' | 'reject',
  ) => {
    setSelectedSubmission(submission)
    setActionType(type)
    // Close sheet if open to show dialog clearly
    setIsSheetOpen(false)
    setIsDialogOpen(true)
  }

  const handleConfirmAction = async (justification: string) => {
    if (!selectedSubmission || !currentProfessional || !actionType) return

    let success = false
    if (actionType === 'approve') {
      success = await approveTriage(
        currentProfessional.id,
        selectedSubmission,
        justification,
      )
      if (success) toast.success('Profissional aprovado com sucesso!')
    } else {
      success = await rejectTriage(
        currentProfessional.id,
        selectedSubmission,
        justification,
      )
      if (success) toast.success('Solicitação rejeitada.')
    }

    if (success) {
      setIsDialogOpen(false)
      setSelectedSubmission(null)
      setActionType(null)
    } else {
      toast.error('Ocorreu um erro ao processar a ação.')
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-heading font-bold text-foreground">
          Triagem de Profissionais
        </h1>
        <p className="text-muted-foreground">
          Avalie e valide as solicitações de cadastro.
        </p>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Formação</TableHead>
              <TableHead>Status CRP</TableHead>
              <TableHead>Data</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10">
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                </TableCell>
              </TableRow>
            ) : triageSubmissions.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-10 text-muted-foreground"
                >
                  <div className="flex flex-col items-center gap-2">
                    <CheckCircle2 className="w-10 h-10 text-green-500/50" />
                    <p>Tudo em dia! Nenhuma solicitação pendente.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              triageSubmissions.map((sub) => (
                <TableRow key={sub.id}>
                  <TableCell className="font-medium">{sub.full_name}</TableCell>
                  <TableCell>{sub.email || 'Não informado'}</TableCell>
                  <TableCell>{sub.education}</TableCell>
                  <TableCell>{sub.crp_status}</TableCell>
                  <TableCell>
                    {sub.created_at
                      ? new Date(sub.created_at).toLocaleDateString()
                      : '-'}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleView(sub)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Analisar
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <TriageDetailSheet
        submission={selectedSubmission}
        open={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        onApprove={(s) => handleActionClick(s, 'approve')}
        onReject={(s) => handleActionClick(s, 'reject')}
      />

      <StatusChangeDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onConfirm={handleConfirmAction}
        isLoading={isLoading}
        title={
          actionType === 'approve'
            ? 'Aprovar Profissional'
            : 'Rejeitar Solicitação'
        }
        description={
          actionType === 'approve'
            ? 'Ao aprovar, o perfil será ativado e o profissional receberá acesso à plataforma. Justifique sua decisão.'
            : 'Ao rejeitar, o cadastro será arquivado e o usuário notificado. Justifique o motivo.'
        }
        actionLabel={
          actionType === 'approve'
            ? 'Confirmar Aprovação'
            : 'Confirmar Rejeição'
        }
      />
    </div>
  )
}
