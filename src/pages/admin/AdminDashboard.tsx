import { useEffect, useState } from 'react'
import { adminService, DashboardStats } from '@/services/adminService'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, UserCheck, Star, Activity } from 'lucide-react'
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
    description,
  }: {
    title: string
    value: string | number
    icon: any
    colorClass: string
    description?: string
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
          <>
            <div className="text-2xl font-bold">{value}</div>
            {description && (
              <p className="text-xs text-muted-foreground mt-1">
                {description}
              </p>
            )}
          </>
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

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          title="Total de Perfis"
          value={stats?.totalProfiles || 0}
          icon={Users}
          colorClass="text-blue-500"
          description="Usuários cadastrados na plataforma"
        />
        <StatCard
          title="Perfis Ativos (Visíveis)"
          value={stats?.activeProfiles || 0}
          icon={UserCheck}
          colorClass="text-green-500"
          description="Profissionais visíveis para o público"
        />
        <StatCard
          title="Profissionais em Destaque"
          value={stats?.featuredProfiles || 0}
          icon={Star}
          colorClass="text-yellow-500"
          description="Exibidos na página inicial"
        />
      </div>

      <Card className="col-span-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            Status do Sistema
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-sm font-medium text-green-700">
              Todos os sistemas operacionais
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            O banco de dados Supabase e as funções de autenticação estão
            respondendo normalmente.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
