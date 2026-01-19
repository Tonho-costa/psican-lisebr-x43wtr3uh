import { useEffect, useState } from 'react'
import { adminService, TriageSubmission } from '@/services/adminService'
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Check, X } from 'lucide-react'
import { toast } from 'sonner'
import { format } from 'date-fns'

export default function AdminTriage() {
  const [submissions, setSubmissions] = useState<TriageSubmission[]>([])
  const [loading, setLoading] = useState(true)

  const loadSubmissions = async () => {
    setLoading(true)
    const { data } = await adminService.getTriageSubmissions()
    if (data) {
      setSubmissions(data)
    }
    setLoading(false)
  }

  useEffect(() => {
    loadSubmissions()
  }, [])

  const handleStatusUpdate = async (
    id: string,
    status: 'approved' | 'rejected',
  ) => {
    const { error } = await adminService.updateTriageStatus(id, status)
    if (!error) {
      toast.success(
        `Triagem ${status === 'approved' ? 'aprovada' : 'rejeitada'} com sucesso.`,
      )
      loadSubmissions()
    } else {
      toast.error('Erro ao atualizar status.')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-heading font-bold">Triagem</h1>
        <Button onClick={loadSubmissions} variant="outline" size="sm">
          Atualizar
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Solicitações Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-muted-foreground text-center py-8">
              Carregando...
            </p>
          ) : submissions.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              Nenhuma solicitação encontrada.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>CRP</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {submissions.map((sub) => (
                    <TableRow key={sub.id}>
                      <TableCell>
                        {format(new Date(sub.created_at), 'dd/MM/yyyy HH:mm')}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{sub.full_name}</span>
                          <span className="text-xs text-muted-foreground">
                            {sub.email}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{sub.crp_status}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            sub.status === 'pending'
                              ? 'secondary'
                              : sub.status === 'approved'
                                ? 'default'
                                : 'destructive'
                          }
                        >
                          {sub.status === 'pending'
                            ? 'Pendente'
                            : sub.status === 'approved'
                              ? 'Aprovado'
                              : 'Rejeitado'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {sub.status === 'pending' && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              className="h-8 w-8 p-0 bg-green-600 hover:bg-green-700"
                              onClick={() =>
                                handleStatusUpdate(sub.id, 'approved')
                              }
                              title="Aprovar"
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              className="h-8 w-8 p-0"
                              onClick={() =>
                                handleStatusUpdate(sub.id, 'rejected')
                              }
                              title="Rejeitar"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
