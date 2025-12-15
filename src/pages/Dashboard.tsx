import { useEffect } from 'react'
import { useProfessionalStore } from '@/stores/useProfessionalStore'
import { ProfilePhotoUploader } from '@/components/ProfilePhotoUploader'
import { ProfileForm } from '@/components/ProfileForm'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { LogOut, Trash2 } from 'lucide-react'
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
import { useAuth } from '@/hooks/use-auth'

export default function Dashboard() {
  const {
    currentProfessional,
    fetchCurrentProfile,
    isLoading,
    updateProfile,
    deleteAccount,
  } = useProfessionalStore()
  const { user, signOut } = useAuth()

  useEffect(() => {
    if (user?.id && !currentProfessional) {
      fetchCurrentProfile(user.id)
    }
  }, [user, currentProfessional, fetchCurrentProfile])

  if (isLoading || !currentProfessional) {
    return (
      <div className="container max-w-4xl py-10 space-y-8">
        <Skeleton className="h-48 w-full rounded-xl" />
        <Skeleton className="h-96 w-full rounded-xl" />
      </div>
    )
  }

  return (
    <div className="container max-w-4xl py-10 space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Seu Perfil</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie suas informações profissionais e foto de perfil.
          </p>
        </div>
        <Button variant="outline" onClick={() => signOut()}>
          <LogOut className="w-4 h-4 mr-2" />
          Sair
        </Button>
      </div>

      <div className="space-y-6">
        <ProfilePhotoUploader
          value={currentProfessional.photoUrl}
          onChange={(url) => {
            // Local state is already updated by the component via store action
            console.log('New photo uploaded:', url)
          }}
          name={currentProfessional.name}
          userId={currentProfessional.id}
        />

        <Separator />

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Informações Pessoais</h2>
          <ProfileForm
            professional={currentProfessional}
            onSubmit={async (data) => {
              await updateProfile(currentProfessional.id, data)
            }}
          />
        </div>

        <Separator />

        <div className="pt-4">
          <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-6">
            <h3 className="text-lg font-semibold text-destructive mb-2">
              Zona de Perigo
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Ao excluir sua conta, todos os seus dados serão permanentemente
              removidos. Esta ação não pode ser desfeita.
            </p>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Excluir minha conta
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta ação é irreversível. Isso excluirá permanentemente sua
                    conta e removerá seus dados de nossos servidores.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => deleteAccount()}
                    className="bg-destructive hover:bg-destructive/90"
                  >
                    Excluir Conta
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
    </div>
  )
}
