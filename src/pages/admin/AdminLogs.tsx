import { useEffect } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { useAdminStore } from '@/stores/useAdminStore'
import { ScrollText } from 'lucide-react'

export default function AdminLogs() {
  const { logs, fetchLogs, isLoading } = useAdminStore()

  useEffect(() => {
    fetchLogs()
  }, [fetchLogs])

  const formatAction = (action: string) => {
    return action.replace('_', ' ')
  }

  const getBadgeVariant = (action: string) => {
    if (action.includes('APPROVE') || action.includes('active'))
      return 'default' // primary
    if (action.includes('REJECT') || action.includes('blocked'))
      return 'destructive'
    return 'secondary'
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-heading font-bold text-foreground">
          Logs de Auditoria
        </h1>
        <p className="text-muted-foreground">
          Histórico de ações administrativas para segurança e compliance.
        </p>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead>Ação</TableHead>
              <TableHead>Admin ID</TableHead>
              <TableHead>Alvo ID</TableHead>
              <TableHead>Detalhes (JSON)</TableHead>
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
            ) : logs.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-10 text-muted-foreground"
                >
                  <div className="flex flex-col items-center gap-2">
                    <ScrollText className="w-10 h-10 opacity-20" />
                    <p>Nenhum registro encontrado.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="whitespace-nowrap">
                    {new Date(log.created_at).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={getBadgeVariant(log.action)}
                      className="uppercase text-[10px]"
                    >
                      {formatAction(log.action)}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {log.admin_id?.slice(0, 8)}...
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {log.target_id?.slice(0, 8)}...
                  </TableCell>
                  <TableCell className="max-w-[300px] truncate text-xs font-mono text-muted-foreground">
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
