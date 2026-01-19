import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { adminService } from '@/services/adminService'
import { Users, FileText, Activity } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export default function AdminDashboard() {
  const [stats, setStats] = useState<{
    profilesCount: number
    pendingTriageCount: number
  } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadStats() {
      const { data } = await adminService.getStats()
      if (data) {
        setStats(data)
      }
      setLoading(false)
    }
    loadStats()
  }, [])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-heading font-bold text-foreground">
          Dashboard
        </h1>
        <p className="text-muted-foreground">
          Visão geral do sistema e pendências.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de Profissionais
            </CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? '...' : stats?.profilesCount}
            </div>
            <p className="text-xs text-muted-foreground">
              Cadastrados na plataforma
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Triagens Pendentes
            </CardTitle>
            <FileText className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? '...' : stats?.pendingTriageCount}
            </div>
            <p className="text-xs text-muted-foreground">
              Aguardando aprovação
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Status do Sistema
            </CardTitle>
            <Activity className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Online</div>
            <p className="text-xs text-muted-foreground">
              Todos os serviços operando
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Link to="/admin/triagem">
              <Button className="w-full justify-between" variant="outline">
                Ver Solicitações de Triagem
                <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
                  {stats?.pendingTriageCount || 0}
                </span>
              </Button>
            </Link>
            <Link to="/admin/logs">
              <Button className="w-full justify-between" variant="outline">
                Ver Logs de Atividade
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
