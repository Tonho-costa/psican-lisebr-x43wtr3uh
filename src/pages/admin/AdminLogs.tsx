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
import { adminService } from '@/services/adminService'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

export default function AdminLogs() {
  const [logs, setLogs] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadLogs()
  }, [])

  const loadLogs = async () => {
    setIsLoading(true)
    const { data, error } = await adminService.getLogs()
    if (!error && data) {
      setLogs(data)
    } else {
      toast.error('Erro ao carregar logs')
    }
    setIsLoading(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-heading font-bold">Logs do Sistema</h2>
        <p className="text-muted-foreground">
          Registro de auditoria das ações administrativas.
        </p>
      </div>

      <div className="bg-card rounded-md border shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[180px]">Data/Hora</TableHead>
              <TableHead>Ação</TableHead>
              <TableHead>Admin ID</TableHead>
              <TableHead>Alvo ID</TableHead>
              <TableHead>Detalhes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
                </TableCell>
              </TableRow>
            ) : logs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10">
                  Nenhum log registrado.
                </TableCell>
              </TableRow>
            ) : (
              logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="text-xs text-muted-foreground">
                    {format(new Date(log.created_at), 'dd/MM/yyyy HH:mm:ss')}
                  </TableCell>
                  <TableCell className="font-medium text-xs">
                    {log.action}
                  </TableCell>
                  <TableCell className="text-xs font-mono">
                    {log.admin_id?.slice(0, 8)}...
                  </TableCell>
                  <TableCell className="text-xs font-mono">
                    {log.target_id?.slice(0, 8)}...
                  </TableCell>
                  <TableCell
                    className="text-xs font-mono max-w-[300px] truncate"
                    title={JSON.stringify(log.details, null, 2)}
                  >
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
