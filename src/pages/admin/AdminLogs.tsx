import { useEffect, useState } from 'react'
import { adminService, AdminLog } from '@/services/adminService'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { format } from 'date-fns'

export default function AdminLogs() {
  const [logs, setLogs] = useState<AdminLog[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadLogs() {
      const { data } = await adminService.getLogs()
      if (data) {
        setLogs(data)
      }
      setLoading(false)
    }
    loadLogs()
  }, [])

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-heading font-bold">Logs do Sistema</h1>

      <Card>
        <CardHeader>
          <CardTitle>Últimas Atividades Administrativas</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-muted-foreground text-center py-8">
              Carregando...
            </p>
          ) : logs.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              Nenhum log encontrado.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data/Hora</TableHead>
                  <TableHead>Admin ID</TableHead>
                  <TableHead>Ação</TableHead>
                  <TableHead>Detalhes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>
                      {format(new Date(log.created_at), 'dd/MM/yyyy HH:mm:ss')}
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {log.admin_id}
                    </TableCell>
                    <TableCell className="font-medium">{log.action}</TableCell>
                    <TableCell className="text-xs text-muted-foreground max-w-xs truncate">
                      {JSON.stringify(log.details)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
