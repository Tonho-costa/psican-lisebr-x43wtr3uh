import { useEffect, useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { adminService, AdminLog } from '@/services/adminService'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export default function AdminLogs() {
  const [logs, setLogs] = useState<AdminLog[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchLogs = async () => {
      setIsLoading(true)
      const { data, error } = await adminService.getLogs()
      if (!error && data) {
        setLogs(data)
      } else {
        toast.error('Erro ao carregar logs')
      }
      setIsLoading(false)
    }
    fetchLogs()
  }, [])

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-heading font-bold">Logs de Auditoria</h1>

      <div className="bg-card rounded-lg border border-border overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data/Hora</TableHead>
              <TableHead>Ação</TableHead>
              <TableHead>Admin ID</TableHead>
              <TableHead>Alvo ID</TableHead>
              <TableHead>Detalhes</TableHead>
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
            ) : logs.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-24 text-center text-muted-foreground"
                >
                  Nenhum registro encontrado.
                </TableCell>
              </TableRow>
            ) : (
              logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="whitespace-nowrap">
                    {format(new Date(log.created_at), 'dd/MM/yyyy HH:mm', {
                      locale: ptBR,
                    })}
                  </TableCell>
                  <TableCell>
                    <span className="capitalize font-medium">{log.action}</span>
                  </TableCell>
                  <TableCell
                    className="font-mono text-xs text-muted-foreground"
                    title={log.admin_id || ''}
                  >
                    {log.admin_id?.slice(0, 8)}...
                  </TableCell>
                  <TableCell
                    className="font-mono text-xs text-muted-foreground"
                    title={log.target_id || ''}
                  >
                    {log.target_id?.slice(0, 8)}...
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate text-xs text-muted-foreground">
                    {JSON.stringify(log.details)}
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
