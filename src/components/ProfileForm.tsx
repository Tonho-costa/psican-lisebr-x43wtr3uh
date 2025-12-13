import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import {
  Loader2,
  Save,
  Mail,
  Fingerprint,
  Eye,
  EyeOff,
  Trash2,
} from 'lucide-react'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import {
  Professional,
  useProfessionalStore,
} from '@/stores/useProfessionalStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Checkbox } from '@/components/ui/checkbox'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { StringListInput } from '@/components/StringListInput'
import { ProfilePhotoUploader } from '@/components/ProfilePhotoUploader'
import { Switch } from '@/components/ui/switch'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
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

const profileSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  occupation: z.string().min(2, 'Profissão é obrigatória'),
  age: z.coerce.number().min(18, 'Idade mínima é 18 anos'),
  city: z.string().min(2, 'Cidade é obrigatória'),
  state: z
    .string()
    .min(2, 'Estado é obrigatório')
    .max(2, 'Use a sigla do estado'),
  bio: z.string().max(2000, 'Biografia muito longa'),
  photoUrl: z.string().url('URL inválida').or(z.literal('')),
  serviceTypes: z
    .array(z.enum(['Online', 'Presencial']))
    .refine((val) => val.length > 0, {
      message: 'Selecione pelo menos um tipo de atendimento',
    }),
  specialties: z.array(z.string()),
  education: z.array(z.string()),
  courses: z.array(z.string()),
  availability: z.string(),
  phone: z.string(),
  instagram: z.string().optional(),
  facebook: z.string().optional(),
  isVisible: z.boolean().default(true),
})

type ProfileFormValues = z.infer<typeof profileSchema>

interface ProfileFormProps {
  professional: Professional
}

export function ProfileForm({ professional }: ProfileFormProps) {
  const { updateProfile, deleteAccount } = useProfessionalStore()
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const navigate = useNavigate()

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: professional.name,
      occupation: professional.occupation,
      age: professional.age,
      city: professional.city,
      state: professional.state,
      bio: professional.bio,
      photoUrl: professional.photoUrl,
      serviceTypes: professional.serviceTypes,
      specialties: professional.specialties || [],
      education: professional.education || [],
      courses: professional.courses || [],
      availability: professional.availability,
      phone: professional.phone,
      instagram: professional.instagram || '',
      facebook: professional.facebook || '',
      isVisible: professional.isVisible,
    },
  })

  const onSubmit = async (data: ProfileFormValues) => {
    setIsSaving(true)
    try {
      const updatedProfile = await updateProfile(professional.id, data)

      if (updatedProfile) {
        const newValues: ProfileFormValues = {
          name: updatedProfile.name,
          occupation: updatedProfile.occupation,
          age: updatedProfile.age,
          city: updatedProfile.city,
          state: updatedProfile.state,
          bio: updatedProfile.bio,
          photoUrl: updatedProfile.photoUrl,
          serviceTypes: updatedProfile.serviceTypes,
          specialties: updatedProfile.specialties || [],
          education: updatedProfile.education || [],
          courses: updatedProfile.courses || [],
          availability: updatedProfile.availability,
          phone: updatedProfile.phone,
          instagram: updatedProfile.instagram || '',
          facebook: updatedProfile.facebook || '',
          isVisible: updatedProfile.isVisible,
        }
        form.reset(newValues)

        toast.success('Perfil salvo com sucesso!', {
          description: 'Suas alterações foram gravadas no banco de dados.',
        })
      } else {
        throw new Error('Não foi possível obter os dados atualizados.')
      }
    } catch (error: any) {
      console.error(error)
      toast.error('Erro ao salvar alterações.', {
        description:
          error.message || 'Verifique sua conexão e tente novamente.',
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteAccount = async () => {
    setIsDeleting(true)
    try {
      await deleteAccount()
      toast.success('Conta excluída com sucesso.')
      navigate('/')
    } catch (error: any) {
      console.error(error)
      toast.error('Erro ao excluir conta.', {
        description: error.message || 'Tente novamente mais tarde.',
      })
      setIsDeleting(false)
    }
  }

  const isButtonDisabled = isSaving || !form.formState.isDirty

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 pb-20">
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="basic">Dados Pessoais</TabsTrigger>
            <TabsTrigger value="professional">Profissional</TabsTrigger>
            <TabsTrigger value="contact">Contato & Bio</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-6 animate-fade-in">
            {/* Visibility Toggle */}
            <FormField
              control={form.control}
              name="isVisible"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm bg-muted/20">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base flex items-center gap-2">
                      {field.value ? (
                        <Eye className="w-4 h-4 text-primary" />
                      ) : (
                        <EyeOff className="w-4 h-4 text-muted-foreground" />
                      )}
                      Visibilidade do Perfil
                    </FormLabel>
                    <FormDescription>
                      {field.value
                        ? 'Seu perfil está público e visível nas buscas.'
                        : 'Seu perfil está privado. Ninguém poderá encontrá-lo.'}
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Read-Only Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-muted/30 rounded-lg border border-border/50">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Fingerprint className="w-4 h-4" />
                  ID do Usuário
                </div>
                <Input
                  value={professional.id}
                  disabled
                  readOnly
                  className="bg-muted text-muted-foreground font-mono text-xs"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Mail className="w-4 h-4" />
                  Email
                </div>
                <Input
                  value={professional.email}
                  disabled
                  readOnly
                  className="bg-muted text-muted-foreground"
                />
              </div>
            </div>

            <FormField
              control={form.control}
              name="photoUrl"
              render={({ field }) => (
                <FormItem>
                  <ProfilePhotoUploader
                    value={field.value}
                    onChange={field.onChange}
                    name={form.watch('name')}
                    userId={professional.id}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome Completo</FormLabel>
                    <FormControl>
                      <Input placeholder="Seu nome" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Idade</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Sua idade" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="occupation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Profissão / Título</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Psicanalista Clínico" {...field} />
                  </FormControl>
                  <FormDescription>
                    Como você gostaria de ser identificado.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cidade</FormLabel>
                    <FormControl>
                      <Input placeholder="Sua cidade" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estado (UF)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ex: SP"
                        maxLength={2}
                        className="uppercase"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Card className="border-destructive/30 bg-destructive/5 mt-8">
              <CardHeader>
                <CardTitle className="text-destructive flex items-center gap-2">
                  <Trash2 className="w-5 h-5" />
                  Zona de Perigo
                </CardTitle>
                <CardDescription>
                  Ações irreversíveis para sua conta.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" disabled={isDeleting}>
                      {isDeleting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Excluindo...
                        </>
                      ) : (
                        'Excluir Minha Conta'
                      )}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Você tem certeza absoluta?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta ação não pode ser desfeita. Isso excluirá
                        permanentemente sua conta e removerá seus dados de
                        nossos servidores.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={(e) => {
                          e.preventDefault()
                          handleDeleteAccount()
                        }}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Sim, excluir minha conta
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent
            value="professional"
            className="space-y-8 animate-fade-in"
          >
            <FormField
              control={form.control}
              name="serviceTypes"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel className="text-base">
                      Tipos de Atendimento
                    </FormLabel>
                    <FormDescription>
                      Selecione as modalidades que você atende.
                    </FormDescription>
                  </div>
                  <div className="flex flex-row gap-6">
                    {['Online', 'Presencial'].map((type) => (
                      <FormField
                        key={type}
                        control={form.control}
                        name="serviceTypes"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={type}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(type as any)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([
                                          ...(field.value || []),
                                          type,
                                        ])
                                      : field.onChange(
                                          (field.value || [])?.filter(
                                            (value) => value !== type,
                                          ),
                                        )
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer">
                                {type}
                              </FormLabel>
                            </FormItem>
                          )
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-6">
              <FormField
                control={form.control}
                name="specialties"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold">
                      Especializações
                    </FormLabel>
                    <FormDescription>
                      Adicione suas especialidades (ex: Psicanálise Infantil,
                      Terapia de Casal).
                    </FormDescription>
                    <FormControl>
                      <StringListInput
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Adicionar especialização..."
                        emptyMessage="Nenhuma especialização adicionada."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="education"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold">
                      Formação Acadêmica
                    </FormLabel>
                    <FormDescription>
                      Sua formação acadêmica (Graduação, Pós-graduação,
                      Mestrado, etc).
                    </FormDescription>
                    <FormControl>
                      <StringListInput
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Adicionar formação..."
                        emptyMessage="Nenhuma formação adicionada."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="courses"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold">
                      Cursos e Certificações
                    </FormLabel>
                    <FormDescription>
                      Outros cursos relevantes, workshops e certificações.
                    </FormDescription>
                    <FormControl>
                      <StringListInput
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Adicionar curso..."
                        emptyMessage="Nenhum curso adicionado."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </TabsContent>

          <TabsContent value="contact" className="space-y-6 animate-fade-in">
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Apresentação / Biografia</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Conte um pouco sobre você, sua abordagem e experiência..."
                      className="min-h-[200px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Uma boa apresentação é fundamental para que os pacientes se
                    identifiquem com você.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone / WhatsApp</FormLabel>
                    <FormControl>
                      <Input placeholder="(00) 00000-0000" {...field} />
                    </FormControl>
                    <FormDescription>
                      Este número será usado para o botão de contato.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="availability"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Disponibilidade</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ex: Seg a Sex, 08h às 18h"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="instagram"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Instagram (Link)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://instagram.com/seu.perfil"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="facebook"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Facebook (Link)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://facebook.com/seu.perfil"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </TabsContent>
        </Tabs>

        <div className="fixed bottom-0 left-0 right-0 p-4 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50 flex justify-center md:justify-end md:px-10 shadow-lg animate-in slide-in-from-bottom-5">
          <div className="container max-w-4xl flex justify-end">
            <Button
              type="submit"
              size="lg"
              disabled={isButtonDisabled}
              className="w-full md:w-auto shadow-md"
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando alterações...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Salvar Alterações
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  )
}
