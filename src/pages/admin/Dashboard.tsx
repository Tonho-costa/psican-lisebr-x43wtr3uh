import { useEffect, useState } from 'react'
import { adminService, DashboardStats } from '@/services/adminService'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, UserCheck, ClipboardList, Activity } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await adminService.getDashboardStats()
        setStats(data)
      } catch (error) {
        console.error('Failed to load dashboard stats', error)
      } finally {
        setLoading(false)
      }
    }
    loadStats()
  }, [])

  const StatCard = ({
    title,
    value,
    icon: Icon,
    colorClass,
  }: {
    title: string
    value: string | number
    icon: any
    colorClass: string
  }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${colorClass}`} />
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-8 w-16" />
        ) : (
          <div className="text-2xl font-bold">{value}</div>
        )}
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-heading font-bold text-foreground">
          Painel de Controle
        </h1>
        <p className="text-muted-foreground mt-2">
          Visão geral da plataforma e métricas principais.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total de Perfis"
          value={stats?.totalProfiles || 0}
          icon={Users}
          colorClass="text-blue-500"
        />
        <StatCard
          title="Profissionais Ativos"
          value={stats?.activeProfessionals || 0}
          icon={UserCheck}
          colorClass="text-green-500"
        />
        <StatCard
          title="Triagens Pendentes"
          value={stats?.pendingTriage || 0}
          icon={ClipboardList}
          colorClass="text-orange-500"
        />
        <StatCard
          title="Usuários (Pacientes)"
          value={stats?.totalUsers || 0}
          icon={Activity}
          colorClass="text-purple-500"
        />
      </div>

      {/* Placeholder for charts or lists if needed */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Atividade Recente</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Monitoramento de atividades será implementado em breve.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
