import { useEffect } from 'react'
import { useAuth } from '@/hooks/use-auth'
import {
  useProfessionalStore,
  Professional,
} from '@/stores/useProfessionalStore'
import { ProfileForm } from '@/components/ProfileForm'
import { ProfilePhotoUploader } from '@/components/ProfilePhotoUploader'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { LogOut, Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

export default function Dashboard() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const {
    currentProfessional,
    fetchCurrentProfile,
    updateProfile,
    deleteAccount,
    isLoading,
  } = useProfessionalStore()

  useEffect(() => {
    if (user?.id) {
      fetchCurrentProfile(user.id)
    }
  }, [user?.id, fetchCurrentProfile])

  const handleUpdateProfile = async (data: Partial<Professional>) => {
    if (user?.id) {
      await updateProfile(user.id, data)
    }
  }

  const handleLogout = async () => {
    await signOut()
    navigate('/')
  }

  const handleDeleteAccount = async () => {
    try {
      await deleteAccount()
      navigate('/')
    } catch (error) {
      console.error('Error deleting account:', error)
    }
  }

  if (isLoading || !currentProfessional) {
    return (
      <div className="container max-w-4xl py-10 space-y-8">
        <Skeleton className="h-12 w-48" />
        <Card>
          <CardContent className="p-6">
            <div className="flex gap-6">
              <Skeleton className="w-32 h-32 rounded-full" />
              <div className="space-y-4 flex-1">
                <Skeleton className="h-8 w-1/2" />
                <Skeleton className="h-4 w-1/3" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container max-w-4xl py-10 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Painel do Profissional
          </h1>
          <p className="text-muted-foreground">
            Gerencie suas informações e como você aparece para os pacientes.
          </p>
        </div>
        <Button variant="outline" onClick={handleLogout} className="gap-2">
          <LogOut className="w-4 h-4" />
          Sair
        </Button>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
          <TabsTrigger value="profile">Perfil Público</TabsTrigger>
          <TabsTrigger value="account">Conta</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Foto de Perfil</CardTitle>
              <CardDescription>
                Esta é a imagem que os pacientes verão na busca e no seu perfil.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProfilePhotoUploader
                value={currentProfessional.photoUrl}
                onChange={() => {}} // Store handles updates via subscription
                name={currentProfessional.name}
                userId={currentProfessional.id}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Informações Profissionais</CardTitle>
              <CardDescription>
                Mantenha seus dados atualizados para atrair mais pacientes.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProfileForm
                professional={currentProfessional}
                onSubmit={handleUpdateProfile}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="account" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Configurações da Conta</CardTitle>
              <CardDescription>
                Gerencie as configurações de segurança e privacidade da sua
                conta.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Email de Login</h3>
                <p className="text-sm text-muted-foreground">
                  Seu email atual é <strong>{currentProfessional.email}</strong>
                </p>
                <Button
                  variant="outline"
                  onClick={() => navigate('/redefinir-senha')}
                >
                  Alterar Senha
                </Button>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium text-destructive">
                  Zona de Perigo
                </h3>
                <p className="text-sm text-muted-foreground">
                  Ao excluir sua conta, todos os seus dados serão removidos
                  permanentemente. Esta ação não pode ser desfeita.
                </p>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="gap-2">
                      <Trash2 className="w-4 h-4" />
                      Excluir Conta
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta ação não pode ser desfeita. Isso excluirá
                        permanentemente sua conta e removerá seus dados de
                        nossos servidores.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDeleteAccount}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Excluir
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
