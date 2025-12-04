import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Save, LogOut, Trash2, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
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
  useProfessionalStore,
  Professional,
} from '@/stores/useProfessionalStore'
import { toast } from 'sonner'

export default function Dashboard() {
  const navigate = useNavigate()
  const { currentProfessional, isAuthenticated, updateProfile, logout } =
    useProfessionalStore()

  // Protect Route
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/entrar')
    }
  }, [isAuthenticated, navigate])

  const { register, handleSubmit, reset, setValue, watch } = useForm<
    Partial<Professional>
  >({
    defaultValues: currentProfessional || {},
  })

  // Watch serviceTypes for the checkboxes
  const serviceTypes = watch('serviceTypes') || []

  // Reset form when currentProfessional changes
  useEffect(() => {
    if (currentProfessional) {
      reset(currentProfessional)
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

  const handleLogout = () => {
    logout()
    navigate('/entrar')
  }

  if (!currentProfessional) return null

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <aside className="lg:col-span-1 space-y-6">
          <Card>
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-2 border-primary">
                <img
                  src={currentProfessional.photoUrl}
                  alt={currentProfessional.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h2 className="font-bold text-lg">{currentProfessional.name}</h2>
              <p className="text-sm text-muted-foreground mb-4">
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
            <Button variant="secondary" className="justify-start">
              <User className="w-4 h-4 mr-2" /> Meu Perfil
            </Button>
            <Button
              variant="ghost"
              className="justify-start text-destructive hover:text-destructive/90 hover:bg-destructive/10"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-2" /> Sair
            </Button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="lg:col-span-3">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-heading font-bold">Editar Perfil</h1>
            <Button
              variant="destructive"
              size="sm"
              onClick={() =>
                toast.error('Funcionalidade não implementada na demo')
              }
            >
              <Trash2 className="w-4 h-4 mr-2" /> Excluir Conta
            </Button>
          </div>

          <Tabs defaultValue="pessoal" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="pessoal">Dados Pessoais</TabsTrigger>
              <TabsTrigger value="academico">Acadêmico</TabsTrigger>
              <TabsTrigger value="atendimento">Atendimento</TabsTrigger>
            </TabsList>

            <form onSubmit={handleSubmit(onSubmit)}>
              <TabsContent value="pessoal">
                <Card>
                  <CardHeader>
                    <CardTitle>Informações Pessoais</CardTitle>
                    <CardDescription>
                      Atualize seus dados básicos e apresentação.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nome Completo</Label>
                        <Input id="name" {...register('name')} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="age">Idade</Label>
                        <Input id="age" type="number" {...register('age')} />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        className="h-32"
                        {...register('bio')}
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit">
                      <Save className="w-4 h-4 mr-2" /> Salvar Alterações
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="academico">
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
                  </CardContent>
                  <CardFooter>
                    <Button type="submit">
                      <Save className="w-4 h-4 mr-2" /> Salvar Alterações
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="atendimento">
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
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center space-x-2">
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
                            className="font-normal cursor-pointer"
                          >
                            Online
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
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
                            className="font-normal cursor-pointer"
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
                      <Input id="phone" {...register('phone')} />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit">
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
