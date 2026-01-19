import { useEffect } from 'react'
import {
  Users,
  UserCheck,
  UserX,
  TrendingUp,
  Activity,
  AlertCircle,
} from 'lucide-react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useAdminStore } from '@/stores/useAdminStore'

export default function AdminDashboard() {
  const { stats, fetchStats, isLoading } = useAdminStore()

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  const statsCards = [
    {
      title: 'Total de Usuários',
      value: stats?.totalUsers || 0,
      icon: <Users className="w-5 h-5 text-blue-500" />,
      description: 'Usuários cadastrados',
    },
    {
      title: 'Usuários Ativos',
      value: stats?.activeUsers || 0,
      icon: <UserCheck className="w-5 h-5 text-green-500" />,
      description: 'Status ativo',
    },
    {
      title: 'Novos (30 dias)',
      value: stats?.newUsersLast30Days || 0,
      icon: <TrendingUp className="w-5 h-5 text-yellow-500" />,
      description: 'Crescimento recente',
    },
    {
      title: 'Usuários Bloqueados',
      value: stats?.blockedUsers || 0,
      icon: <UserX className="w-5 h-5 text-red-500" />,
      description: 'Acesso restrito',
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-heading font-bold text-foreground">
          Visão Geral
        </h1>
        <p className="text-muted-foreground">
          Acompanhe as principais métricas da plataforma.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading
          ? Array(4)
              .fill(0)
              .map((_, i) => (
                <Card key={i}>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-4" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-8 w-12 mb-2" />
                    <Skeleton className="h-3 w-32" />
                  </CardContent>
                </Card>
              ))
          : statsCards.map((card, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {card.title}
                  </CardTitle>
                  {card.icon}
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{card.value}</div>
                  <p className="text-xs text-muted-foreground">
                    {card.description}
                  </p>
                </CardContent>
              </Card>
            ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              Atividade do Sistema
            </CardTitle>
            <CardDescription>Resumo de ações recentes.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground text-sm">
              <AlertCircle className="w-8 h-8 mb-2 opacity-50" />
              <p>Logs de atividade serão exibidos aqui em breve.</p>
            </div>
          </CardContent>
        </Card>
        {/* Placeholder for future chart or more detailed stats */}
        <Card>
          <CardHeader>
            <CardTitle>Status da Plataforma</CardTitle>
            <CardDescription>Integridade do sistema.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Banco de Dados</span>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                  Operacional
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Armazenamento</span>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                  Operacional
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Autenticação</span>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                  Operacional
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
