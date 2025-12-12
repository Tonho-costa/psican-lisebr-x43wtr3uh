import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ExternalLink, Loader2, LogOut } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { useProfessionalStore } from '@/stores/useProfessionalStore'
import { ProfileForm } from '@/components/ProfileForm'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

export default function Dashboard() {
  const navigate = useNavigate()
  const { user, loading: authLoading, signOut } = useAuth()
  const {
    currentProfessional,
    fetchCurrentProfile,
    isLoading: profileLoading,
  } = useProfessionalStore()

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/entrar')
    }
  }, [authLoading, user, navigate])

  useEffect(() => {
    if (user?.id) {
      // Fetch profile if it's not loaded or if it doesn't match current user (e.g. after relogin with different user)
      if (!currentProfessional || currentProfessional.id !== user.id) {
        fetchCurrentProfile(user.id)
      }
    }
  }, [user, currentProfessional, fetchCurrentProfile])

  const handleLogout = async () => {
    await signOut()
    navigate('/')
  }

  const handleViewProfile = () => {
    if (currentProfessional?.id) {
      navigate(`/perfil/${currentProfessional.id}`)
    }
  }

  if (authLoading || (profileLoading && !currentProfessional)) {
    return (
      <div className="flex h-[80vh] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold font-heading text-foreground">
            Painel do Profissional
          </h1>
          <p className="mt-1 text-muted-foreground">
            Gerencie suas informações, visibilidade e dados de contato.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="outline"
            onClick={handleViewProfile}
            disabled={!currentProfessional}
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            Ver Perfil Público
          </Button>
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="text-muted-foreground hover:text-destructive"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sair
          </Button>
        </div>
      </div>

      <Separator className="mb-8" />

      <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
        <div className="p-6 md:p-8">
          {currentProfessional ? (
            <>
              <div className="mb-6">
                <h2 className="text-xl font-semibold">Editar Perfil</h2>
                <p className="text-sm text-muted-foreground">
                  Mantenha seus dados atualizados para que os pacientes possam
                  te encontrar.
                </p>
              </div>
              <ProfileForm professional={currentProfessional} />
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-4 rounded-full bg-muted p-4">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium">Carregando informações...</h3>
              <p className="mt-2 max-w-xs text-sm text-muted-foreground">
                Não foi possível carregar seu perfil. Tente recarregar a página.
              </p>
              <Button
                variant="link"
                onClick={() => user.id && fetchCurrentProfile(user.id)}
                className="mt-4"
              >
                Tentar novamente
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
