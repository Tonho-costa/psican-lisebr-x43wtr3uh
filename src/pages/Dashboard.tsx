import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Save, LogOut, Trash2, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Switch } from '@/components/ui/switch'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
import {
  useProfessionalStore,
  Professional,
} from '@/stores/useProfessionalStore'
import { toast } from 'sonner'
import { ProfilePhotoUploader } from '@/components/ProfilePhotoUploader'
import { InstagramIcon, FacebookIcon } from '@/components/Icons'

export default function Dashboard() {
  const navigate = useNavigate()
  const {
    currentProfessional,
    isAuthenticated,
    updateProfile,
    logout,
    deleteAccount,
  } = useProfessionalStore()

  // Protect Route
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/entrar')
    }
  }, [isAuthenticated, navigate])

  const { register, handleSubmit, reset, setValue, watch } = useForm<
    Partial<Professional>
  >({
    defaultValues: {
      ...currentProfessional,
      isVisible: currentProfessional?.isVisible ?? true,
    },
  })

  // Watch serviceTypes for the checkboxes
  const serviceTypes = watch('serviceTypes') || []

  // Reset form when currentProfessional changes (e.g. from sync)
  useEffect(() => {
    if (currentProfessional) {
      reset({
        ...currentProfessional,
        isVisible: currentProfessional.isVisible ?? true,
      })
    }
  }, [currentProfessional, reset])

  const onSubmit = (data: Partial<Professional>) => {
    // Handle arrays stored as strings in inputs
    const processedData = { ...data }
    const specialtiesValue = data.specialties as unknown

    if (typeof specialtiesValue === 'string') {
      processedData.specialties = specialtiesValue
        .split(',')
        .map((s) => s.trim())
    }

    updateProfile(processedData)
    toast.success('Perfil atualizado com sucesso!')
  }

  const handlePhotoUpdate = (newPhotoUrl: string) => {
    updateProfile({ photoUrl: newPhotoUrl })
  }

  const handleLogout = () => {
    logout()
    navigate('/entrar')
  }

  const handleDeleteAccount = () => {
    deleteAccount()
    toast.success('Sua conta foi excluída permanentemente.')
    // Navigation to /entrar is handled by auth check effect
  }

  if (!currentProfessional) return null

  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
        {/* Sidebar */}
        <aside className="lg:col-span-1 space-y-6">
          <Card className="overflow-hidden">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <ProfilePhotoUploader
                currentPhotoUrl={currentProfessional.photoUrl}
                onPhotoChange={handlePhotoUpdate}
                className="mb-4"
              />
              <h2 className="font-bold text-lg leading-tight mb-1">
                {currentProfessional.name}
              </h2>
              {currentProfessional.occupation && (
                <p className="text-sm font-medium text-primary mb-1">
                  {currentProfessional.occupation}
                </p>
              )}
              <p className="text-xs text-muted-foreground mb-4 break-all">
                {currentProfessional.email}
              </p>
              <Button
                variant="outline"
                size="sm"
                className="w-full mb-2"
                onClick={() => navigate(`/perfil/${currentProfessional.id}`)}
              >
                Ver Perfil Público
              </Button>
            </CardContent>
          </Card>

          <nav className="flex flex-col gap-2">
            <Button variant="secondary" className="justify-start w-full">
              <User className="w-4 h-4 mr-2" /> Meu Perfil
            </Button>
            <Button
              variant="ghost"
              className="justify-start w-full text-destructive hover:text-destructive/90 hover:bg-destructive/10"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-2" /> Sair
            </Button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="lg:col-span-3">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h1 className="text-2xl md:text-3xl font-heading font-bold">
              Editar Perfil
            </h1>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  size="sm"
                  className="w-full sm:w-auto"
                >
                  <Trash2 className="w-4 h-4 mr-2" /> Excluir Conta
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="w-[95vw] max-w-lg">
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Tem certeza que deseja excluir sua conta?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta ação não pode ser desfeita. Isso excluirá
                    permanentemente sua conta e removerá seus dados de nossos
                    servidores.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="gap-2 sm:gap-0">
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteAccount}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Sim, excluir conta
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          <Tabs defaultValue="pessoal" className="w-full">
            <TabsList className="w-full h-auto grid grid-cols-1 sm:grid-cols-3 mb-6 bg-muted p-1 gap-1 sm:gap-0">
              <TabsTrigger value="pessoal">Dados Pessoais</TabsTrigger>
              <TabsTrigger value="academico">Acadêmico</TabsTrigger>
              <TabsTrigger value="atendimento">Atendimento</TabsTrigger>
            </TabsList>

            <form onSubmit={handleSubmit(onSubmit)}>
              <TabsContent value="pessoal" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Informações Pessoais</CardTitle>
                    <CardDescription>
                      Atualize seus dados básicos e apresentação.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between rounded-lg border p-4 bg-muted/10">
                      <div className="space-y-0.5 pr-4">
                        <Label className="text-base font-semibold">
                          Perfil Público
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Permitir que seu perfil apareça nos resultados de
                          busca.
                        </p>
                      </div>
                      <Switch
                        checked={watch('isVisible')}
                        onCheckedChange={(checked) =>
                          setValue('isVisible', checked)
                        }
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nome Completo</Label>
                        <Input id="name" {...register('name')} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="occupation">Ocupação</Label>
                        <Input
                          id="occupation"
                          placeholder="Psicanalista, Psicólogo..."
                          {...register('occupation')}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="age">Idade</Label>
                        <Input id="age" type="number" {...register('age')} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="city">Cidade</Label>
                        <Input id="city" {...register('city')} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state">Estado</Label>
                        <Input id="state" {...register('state')} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        className="h-32 min-h-[120px]"
                        {...register('bio')}
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" className="w-full sm:w-auto">
                      <Save className="w-4 h-4 mr-2" /> Salvar Alterações
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="academico" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Formação e Especialidades</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded text-yellow-800 text-sm mb-4">
                      Nota: Nesta demonstração, edite especialidades separando
                      por vírgulas.
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="specialties">Especialidades</Label>
                      <Input id="specialties" {...register('specialties')} />
                    </div>
                    <div className="space-y-2">
                      <Label>Formação Acadêmica</Label>
                      <div className="p-3 rounded-md border bg-muted/20 text-sm text-muted-foreground">
                        Edição de formação acadêmica simplificada para
                        demonstração.
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" className="w-full sm:w-auto">
                      <Save className="w-4 h-4 mr-2" /> Salvar Alterações
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="atendimento" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Detalhes de Atendimento</CardTitle>
                    <CardDescription>
                      Configure como e onde você atende seus pacientes.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3 mb-4">
                      <Label>Tipos de Atendimento</Label>
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center space-x-2 p-2 rounded border hover:bg-muted/20 transition-colors">
                          <Checkbox
                            id="srv-online"
                            checked={serviceTypes.includes('Online')}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setValue('serviceTypes', [
                                  ...serviceTypes,
                                  'Online',
                                ])
                              } else {
                                setValue(
                                  'serviceTypes',
                                  serviceTypes.filter((t) => t !== 'Online'),
                                )
                              }
                            }}
                          />
                          <Label
                            htmlFor="srv-online"
                            className="font-normal cursor-pointer flex-grow py-1"
                          >
                            Online
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2 p-2 rounded border hover:bg-muted/20 transition-colors">
                          <Checkbox
                            id="srv-presencial"
                            checked={serviceTypes.includes('Presencial')}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setValue('serviceTypes', [
                                  ...serviceTypes,
                                  'Presencial',
                                ])
                              } else {
                                setValue(
                                  'serviceTypes',
                                  serviceTypes.filter(
                                    (t) => t !== 'Presencial',
                                  ),
                                )
                              }
                            }}
                          />
                          <Label
                            htmlFor="srv-presencial"
                            className="font-normal cursor-pointer flex-grow py-1"
                          >
                            Presencial
                          </Label>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="availability">Disponibilidade</Label>
                      <Input id="availability" {...register('availability')} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">WhatsApp</Label>
                      <Input
                        id="phone"
                        placeholder="Ex: 5511999999999"
                        {...register('phone')}
                      />
                      <p className="text-xs text-muted-foreground">
                        Insira o número com o código do país (ex: 55 para
                        Brasil).
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="instagram">Instagram (URL)</Label>
                      <div className="relative">
                        <div className="absolute left-3 top-3 text-muted-foreground flex items-center justify-center w-4 h-4">
                          <InstagramIcon className="w-4 h-4" />
                        </div>
                        <Input
                          id="instagram"
                          className="pl-9"
                          placeholder="https://instagram.com/seu.perfil"
                          {...register('instagram')}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="facebook">Facebook (URL)</Label>
                      <div className="relative">
                        <div className="absolute left-3 top-3 text-muted-foreground flex items-center justify-center w-4 h-4">
                          <FacebookIcon className="w-4 h-4" />
                        </div>
                        <Input
                          id="facebook"
                          className="pl-9"
                          placeholder="https://facebook.com/seu.perfil"
                          {...register('facebook')}
                        />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" className="w-full sm:w-auto">
                      <Save className="w-4 h-4 mr-2" /> Salvar Alterações
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </form>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
