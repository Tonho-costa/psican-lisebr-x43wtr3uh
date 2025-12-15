import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { useProfessionalStore } from '@/stores/useProfessionalStore'
import { ProfileForm } from '@/components/ProfileForm'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth()
  const {
    currentProfessional,
    fetchCurrentProfile,
    isLoading: profileLoading,
  } = useProfessionalStore()
  const navigate = useNavigate()

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/entrar')
    }
  }, [user, authLoading, navigate])

  useEffect(() => {
    if (user && !currentProfessional) {
      fetchCurrentProfile(user.id)
    }
  }, [user, currentProfessional, fetchCurrentProfile])

  if (authLoading || (profileLoading && !currentProfessional)) {
    return (
      <div className="container py-10 space-y-8 animate-pulse">
        <Skeleton className="h-12 w-48" />
        <div className="space-y-6">
          <Skeleton className="h-[200px] w-full" />
          <Skeleton className="h-[400px] w-full" />
        </div>
      </div>
    )
  }

  if (!currentProfessional) {
    return (
      <div className="container py-10">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>
            Não foi possível carregar seu perfil. Tente recarregar a página.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container py-10 max-w-4xl space-y-8 animate-fade-in">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Painel do Profissional
        </h1>
        <p className="text-muted-foreground">
          Gerencie suas informações, foto de perfil e configurações de conta.
        </p>
      </div>

      <ProfileForm professional={currentProfessional} />
    </div>
  )
}
