import { useEffect, useState } from 'react'
import { Users, ClipboardList, AlertCircle, FileText } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { adminService } from '@/services/adminService'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProfiles: 0,
    pendingSubmissions: 0,
    totalLogs: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadStats = async () => {
      setIsLoading(true)
      try {
        const [profiles, submissions, logs] = await Promise.all([
          adminService.getAllProfiles(),
          adminService.getSubmissions(),
          adminService.getLogs(),
        ])

        setStats({
          totalProfiles: profiles.data?.length || 0,
          pendingSubmissions:
            submissions.data?.filter((s) => s.status === 'Pending').length || 0,
          totalLogs: logs.data?.length || 0,
        })
      } catch (error) {
        console.error('Failed to load dashboard stats', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadStats()
  }, [])

  const statCards = [
    {
      title: 'Submissões Pendentes',
      value: stats.pendingSubmissions,
      icon: ClipboardList,
      description: 'Aguardando revisão',
      color: 'text-orange-500',
    },
    {
      title: 'Profissionais',
      value: stats.totalProfiles,
      icon: Users,
      description: 'Cadastrados na plataforma',
      color: 'text-blue-500',
    },
    {
      title: 'Atividades Recentes',
      value: stats.totalLogs,
      icon: FileText,
      description: 'Ações administrativas (últimas 100)',
      color: 'text-green-500',
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-heading font-bold text-foreground">
          Visão Geral
        </h2>
        <p className="text-muted-foreground">
          Bem-vindo ao painel administrativo do EscutaPsi.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {statCards.map((stat, index) => (
          <Card key={index} className="shadow-sm border-l-4 border-l-primary">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-8 w-24 bg-muted animate-pulse rounded" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">
                    {stat.description}
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Dica de Gestão</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-4">
              <AlertCircle className="w-10 h-10 text-primary opacity-80" />
              <p className="text-sm text-muted-foreground leading-relaxed">
                Mantenha as submissões de triagem em dia para garantir que novos
                pacientes sejam encaminhados rapidamente. Verifique também
                periodicamente os perfis em destaque para garantir rotatividade.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
