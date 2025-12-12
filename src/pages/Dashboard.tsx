import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { useProfessionalStore } from '@/stores/useProfessionalStore'
import { ProfileForm } from '@/components/ProfileForm'
import { Separator } from '@/components/ui/separator'

export default function Dashboard() {
  const navigate = useNavigate()
  const { user, loading: authLoading } = useAuth()
  const {
    currentProfessional,
    fetchCurrentProfile,
    isLoading: profileLoading,
  } = useProfessionalStore()

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/entrar')
      return
    }

    if (user?.id) {
      fetchCurrentProfile(user.id)
    }
  }, [user, authLoading, navigate, fetchCurrentProfile])

  // Show loading if auth is loading or if profile is loading and we don't have it yet
  if (authLoading || (profileLoading && !currentProfessional)) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!currentProfessional) {
    return (
      <div className="container max-w-4xl py-10">
        <div className="rounded-lg border border-destructive/50 p-6 text-center">
          <h2 className="text-lg font-semibold text-destructive">
            Perfil não encontrado
          </h2>
          <p className="text-muted-foreground">
            Não foi possível carregar as informações do seu perfil. Tente
            recarregar a página ou entre em contato com o suporte.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="container max-w-4xl py-10 space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-heading">
          Configurações do Perfil
        </h1>
        <p className="text-muted-foreground">
          Gerencie suas informações pessoais e profissionais para que os
          pacientes possam te encontrar.
        </p>
      </div>
      <Separator />
      <ProfileForm professional={currentProfessional} />
    </div>
  )
}
