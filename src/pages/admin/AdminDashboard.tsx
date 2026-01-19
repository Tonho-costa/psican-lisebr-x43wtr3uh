import { useEffect, useState } from 'react'
import { adminService, DashboardStats } from '@/services/adminService'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Users, UserCheck, Star, Activity, AlertTriangle } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadStats = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await adminService.getDashboardStats()
      setStats(data)
    } catch (err) {
      console.error('Failed to load dashboard stats', err)
      setError('Não foi possível carregar as estatísticas.')
      toast.error('Erro ao carregar dados do dashboard.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
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
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div
          className={`p-2 rounded-full bg-muted ${colorClass.replace('text-', 'bg-').replace('500', '100')}`}
        >
          <Icon className={`h-4 w-4 ${colorClass}`} />
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-8 w-16 my-2" />
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

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-4 text-center">
        <AlertTriangle className="w-12 h-12 text-yellow-500" />
        <h2 className="text-xl font-semibold">Erro ao carregar dashboard</h2>
        <p className="text-muted-foreground">{error}</p>
        <Button onClick={loadStats}>Tentar Novamente</Button>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">
            Painel de Controle
          </h1>
          <p className="text-muted-foreground mt-2">
            Visão geral da plataforma e métricas principais.
          </p>
        </div>
        <Button variant="outline" onClick={loadStats} disabled={loading}>
          Atualizar Dados
        </Button>
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
          title="Perfis Ativos"
          value={stats?.activeProfiles || 0}
          icon={UserCheck}
          colorClass="text-green-500"
          description="Profissionais visíveis para o público"
        />
        <StatCard
          title="Destaques"
          value={stats?.featuredProfiles || 0}
          icon={Star}
          colorClass="text-yellow-500"
          description="Exibidos na página inicial"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="col-span-1 md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              Status do Sistema
            </CardTitle>
            <CardDescription>
              Monitoramento básico da integridade da aplicação
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg border border-border">
              <div className="relative">
                <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                <div className="w-3 h-3 rounded-full bg-green-500 absolute top-0 left-0 blur-sm opacity-50"></div>
              </div>
              <div>
                <span className="text-sm font-medium text-green-700 dark:text-green-400 block">
                  Sistemas Operacionais
                </span>
                <p className="text-xs text-muted-foreground mt-1">
                  Conexão com banco de dados e serviços de autenticação estável.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
