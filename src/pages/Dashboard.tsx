import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loader2, LogOut } from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '@/hooks/use-auth'
import { useProfessionalStore } from '@/stores/useProfessionalStore'
import { ProfileForm } from '@/components/ProfileForm'
import { Button } from '@/components/ui/button'

export default function Dashboard() {
  const { user, loading: authLoading, signOut } = useAuth()
  const {
    currentProfessional,
    fetchCurrentProfile,
    isLoading,
    logout: storeLogout,
  } = useProfessionalStore()
  const navigate = useNavigate()

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/entrar')
    } else if (user && !currentProfessional) {
      fetchCurrentProfile(user.id)
    }
  }, [user, authLoading, currentProfessional, fetchCurrentProfile, navigate])

  const handleLogout = async () => {
    try {
      const { error } = await signOut()
      if (error) {
        toast.error('Erro ao sair da conta.')
        console.error(error)
        return
      }
      storeLogout()
      navigate('/entrar')
      toast.success('Você saiu com sucesso.')
    } catch (error) {
      console.error(error)
      toast.error('Ocorreu um erro ao tentar sair.')
    }
  }

  if (authLoading || isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Carregando...</span>
      </div>
    )
  }

  if (!user || !currentProfessional) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-4">
        <h2 className="text-xl font-semibold">Perfil não encontrado</h2>
        <p className="text-muted-foreground">
          Não foi possível carregar seus dados.
        </p>
        <Button onClick={() => window.location.reload()}>
          Tentar novamente
        </Button>
      </div>
    )
  }

  return (
    <div className="container max-w-5xl mx-auto py-8 px-4 animate-fade-in">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading">Editar Perfil</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie suas informações profissionais e mantenha seu perfil
            atualizado.
          </p>
        </div>
        <Button
          variant="destructive"
          onClick={handleLogout}
          className="w-full md:w-auto"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sair
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-border shadow-sm p-6 md:p-8">
        <ProfileForm professional={currentProfessional} />
      </div>
    </div>
  )
}
