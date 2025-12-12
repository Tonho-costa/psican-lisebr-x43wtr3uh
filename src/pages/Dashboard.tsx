import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogOut, ExternalLink } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { useProfessionalStore } from '@/stores/useProfessionalStore'
import { ProfileForm } from '@/components/ProfileForm'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth()
  const {
    currentProfessional,
    fetchCurrentProfile,
    isLoading: storeLoading,
    logout: storeLogout,
  } = useProfessionalStore()
  const navigate = useNavigate()

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/entrar')
      return
    }

    if (user && !currentProfessional) {
      fetchCurrentProfile(user.id)
    }
  }, [user, authLoading, currentProfessional, fetchCurrentProfile, navigate])

  const handleLogout = async () => {
    await storeLogout()
    navigate('/')
  }

  if (authLoading || storeLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-muted-foreground">Carregando perfil...</p>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="container max-w-5xl py-8 px-4 animate-fade-in">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold font-heading tracking-tight">
            Painel do Profissional
          </h1>
          <p className="text-muted-foreground">
            Gerencie suas informações e visibilidade.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {currentProfessional && (
            <Button
              variant="outline"
              onClick={() => navigate(`/perfil/${currentProfessional.id}`)}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Ver Perfil Público
            </Button>
          )}
          <Button
            variant="ghost"
            className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>
        </div>
      </div>

      <Separator className="my-6" />

      {currentProfessional ? (
        <ProfileForm professional={currentProfessional} />
      ) : (
        <div className="text-center py-10">
          <p className="text-destructive mb-4">
            Não foi possível carregar os dados do perfil.
          </p>
          <Button
            variant="link"
            onClick={() => user && fetchCurrentProfile(user.id)}
          >
            Tentar novamente
          </Button>
        </div>
      )}
    </div>
  )
}
