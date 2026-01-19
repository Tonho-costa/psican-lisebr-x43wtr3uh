import { Users, Activity, MessageSquare, AlertTriangle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useProfessionalStore } from '@/stores/useProfessionalStore'

export default function AdminDashboard() {
  const { currentProfessional } = useProfessionalStore()

  const stats = [
    {
      title: 'Usuários Ativos',
      value: '1,248',
      icon: <Users className="w-4 h-4 text-muted-foreground" />,
      description: '+18% em relação ao mês passado',
    },
    {
      title: 'Novos Cadastros',
      value: '132',
      icon: <Activity className="w-4 h-4 text-muted-foreground" />,
      description: '+5% na última semana',
    },
    {
      title: 'Mensagens Trocadas',
      value: '4,890',
      icon: <MessageSquare className="w-4 h-4 text-muted-foreground" />,
      description: 'Média de 4 por sessão',
    },
    {
      title: 'Alertas Pendentes',
      value: '12',
      icon: <AlertTriangle className="w-4 h-4 text-destructive" />,
      description: 'Requer atenção imediata',
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground mt-1">
          Bem-vindo de volta, {currentProfessional?.name}. Aqui está o resumo da
          plataforma.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Visão Geral</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[200px] w-full flex items-center justify-center text-muted-foreground bg-muted/20 rounded-md border border-dashed">
              Gráfico de Atividade (Placeholder)
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Atividades Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((_, i) => (
                <div key={i} className="flex items-center">
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      Novo cadastro profissional
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Há {i * 15 + 5} minutos
                    </p>
                  </div>
                  <div className="ml-auto font-medium text-xs text-green-600">
                    + Aprovado
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
