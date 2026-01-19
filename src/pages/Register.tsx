import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Loader2,
  Check,
  ChevronRight,
  ChevronLeft,
  Instagram,
  Facebook,
  ClipboardCheck,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useAuth } from '@/hooks/use-auth'
import { profileService } from '@/services/profileService'
import { storageService } from '@/services/storageService'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { ProfilePhotoUploader } from '@/components/ProfilePhotoUploader'
import { TermsOfAgreement } from '@/components/TermsOfAgreement'

// Validation Schemas
const step1Schema = z
  .object({
    email: z.string().email('Email inválido'),
    password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
    confirmPassword: z.string().min(6, 'Confirme sua senha'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não conferem',
    path: ['confirmPassword'],
  })

const step2Schema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  occupation: z.string().min(2, 'Ocupação é obrigatória'),
  age: z.coerce.number().min(18, 'Deve ser maior de 18 anos'),
  city: z.string().min(2, 'Cidade obrigatória'),
  state: z.string().length(2, 'Use a sigla do estado (ex: SP)'),
  bio: z
    .string()
    .min(20, 'Escreva uma apresentação de pelo menos 20 caracteres'),
  crpStatus: z.enum(['Sim', 'Não', 'Não se aplica'], {
    required_error: 'Selecione uma opção sobre o CRP',
  }),
})

const step3Schema = z.object({
  education: z.string().min(5, 'Informe sua formação principal'),
  specialties: z.string().min(3, 'Informe pelo menos uma especialidade'),
  educationLevel: z.string().min(1, 'Selecione o nível de formação'),
  educationLevelOther: z.string().optional(),
  theoreticalApproach: z.string().min(1, 'Selecione a abordagem'),
  theoreticalApproachOther: z.string().optional(),
  experienceLevel: z.string().min(1, 'Selecione o tempo de experiência'),
})

const step4Schema = z.object({
  serviceTypes: z
    .array(z.enum(['Online', 'Presencial']))
    .min(1, 'Selecione pelo menos um tipo de atendimento'),
  availability: z.string().min(5, 'Informe sua disponibilidade'),
  networkAvailability: z.enum(['1 a 3', '4 a 6', '7 ou mais'], {
    required_error: 'Selecione a disponibilidade para a rede',
  }),
  phone: z.string().min(10, 'Informe um número de WhatsApp válido com DDD'),
  instagram: z.string().optional(),
  facebook: z.string().optional(),
  acceptsSocialValue: z.enum(['Sim', 'Não'], {
    required_error: 'Confirme se aceita o valor social',
  }),
  agreesToEthics: z.enum(['Sim', 'Não'], {
    required_error: 'Confirme se concorda com os princípios éticos',
  }),
  termsAccepted: z.literal(true, {
    errorMap: () => ({
      message: 'Você deve aceitar os termos para continuar',
    }),
  }),
})

type RegistrationData = z.infer<typeof step1Schema> &
  z.infer<typeof step2Schema> &
  z.infer<typeof step3Schema> &
  z.infer<typeof step4Schema>

export default function Register() {
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [formData, setFormData] = useState<Partial<RegistrationData>>({})
  const [photoUrl, setPhotoUrl] = useState<string>('')
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const { signUp } = useAuth()

  const {
    register: registerStep1,
    handleSubmit: handleSubmitStep1,
    formState: { errors: errorsStep1 },
  } = useForm<z.infer<typeof step1Schema>>({
    resolver: zodResolver(step1Schema),
    defaultValues: formData,
  })
  const {
    register: registerStep2,
    handleSubmit: handleSubmitStep2,
    formState: { errors: errorsStep2 },
    setValue: setValueStep2,
    watch: watchStep2,
  } = useForm<z.infer<typeof step2Schema>>({
    resolver: zodResolver(step2Schema),
    defaultValues: formData,
  })
  const {
    register: registerStep3,
    handleSubmit: handleSubmitStep3,
    formState: { errors: errorsStep3 },
    setValue: setValueStep3,
    watch: watchStep3,
  } = useForm<z.infer<typeof step3Schema>>({
    resolver: zodResolver(step3Schema),
    defaultValues: {
      educationLevel: '',
      theoreticalApproach: '',
      experienceLevel: '',
      ...formData,
    },
  })
  const {
    register: registerStep4,
    handleSubmit: handleSubmitStep4,
    formState: { errors: errorsStep4 },
    setValue: setValueStep4,
    watch: watchStep4,
  } = useForm<z.infer<typeof step4Schema>>({
    resolver: zodResolver(step4Schema),
    defaultValues: {
      serviceTypes: [],
      networkAvailability: undefined,
      acceptsSocialValue: undefined,
      agreesToEthics: undefined,
      termsAccepted: undefined,
      ...formData,
    },
  })

  const onStepSubmit = (data: any) => {
    setFormData((prev) => ({ ...prev, ...data }))
    if (step < 4) {
      setStep((prev) => prev + 1)
      window.scrollTo(0, 0)
    } else {
      handleFinalSubmit({ ...formData, ...data })
    }
  }

  const handleFinalSubmit = async (data: any) => {
    setIsLoading(true)
    try {
      // Determines initial photo URL (fallback or preview)
      const randomGender = Math.random() > 0.5 ? 'male' : 'female'
      const fallbackPhoto = `https://img.usecurling.com/ppl/medium?gender=${randomGender}&seed=${Math.random()}`
      let finalPhotoUrl = photoUrl || fallbackPhoto

      // 1. Sign Up user via Supabase Auth
      const { data: authData, error: authError } = await signUp(
        data.email,
        data.password,
        {
          full_name: data.name,
          avatar_url: finalPhotoUrl,
        },
      )

      if (authError) {
        toast.error('Erro ao criar conta: ' + authError.message)
        setIsLoading(false)
        return
      }

      if (authData.user) {
        // 2. Upload Avatar if file exists
        if (avatarFile) {
          const { url: uploadedUrl, error: uploadError } =
            await storageService.uploadAvatar(authData.user.id, avatarFile)
          if (!uploadError && uploadedUrl) {
            finalPhotoUrl = uploadedUrl
          } else {
            console.error('Error uploading initial avatar:', uploadError)
            toast.warning(
              'Conta criada, mas houve um erro ao salvar a foto de perfil.',
            )
          }
        }

        // Process combined fields
        const finalEducationLevel =
          data.educationLevel === 'Outra'
            ? data.educationLevelOther
            : data.educationLevel
        const finalApproach =
          data.theoreticalApproach === 'Outra'
            ? data.theoreticalApproachOther
            : data.theoreticalApproach

        // 3. Update the automatically created profile with extra details
        const finalData = {
          occupation: data.occupation,
          age: data.age,
          city: data.city,
          state: data.state,
          bio: data.bio,
          photoUrl: finalPhotoUrl,
          education: data.education.split('\n').filter(Boolean),
          specialties: data.specialties
            .split(',')
            .map((s: string) => s.trim())
            .filter(Boolean),
          serviceTypes: data.serviceTypes,
          availability: data.availability,
          phone: data.phone,
          instagram: data.instagram,
          facebook: data.facebook,
          courses: [],
          // Screening Fields
          crpStatus: data.crpStatus,
          educationLevel: finalEducationLevel,
          theoreticalApproach: finalApproach,
          experienceLevel: data.experienceLevel,
          networkAvailability: data.networkAvailability,
          acceptsSocialValue: data.acceptsSocialValue === 'Sim',
          agreesToEthics: data.agreesToEthics === 'Sim',
          isVisible: false, // Hidden until approved
        }

        const { error: profileError } = await profileService.updateProfile(
          authData.user.id,
          finalData,
        )

        if (profileError) {
          console.error('Error updating profile details:', profileError)
          toast.warning(
            'Houve um erro ao salvar os detalhes do perfil. Entre em contato com o suporte.',
          )
        } else {
          setIsSuccess(true)
          toast.success('Cadastro de triagem enviado com sucesso!')
          window.scrollTo(0, 0)
        }
      }
    } catch (error: any) {
      toast.error('Ocorreu um erro inesperado.')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const steps = [
    { num: 1, title: 'Acesso' },
    { num: 2, title: 'Pessoal' },
    { num: 3, title: 'Acadêmico' },
    { num: 4, title: 'Atendimento' },
  ]

  if (isSuccess) {
    return (
      <div className="container mx-auto px-4 py-20 max-w-2xl text-center space-y-8 animate-fade-in">
        <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <ClipboardCheck className="w-12 h-12" />
        </div>
        <h1 className="text-3xl font-heading font-bold text-primary">
          Cadastro de Triagem Enviado!
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed max-w-lg mx-auto">
          Agradecemos seu interesse em fazer parte da Rede EscutaPsi. Seus dados
          foram recebidos com segurança e estão passando por nossa análise
          interna.
        </p>
        <p className="text-muted-foreground">
          Em breve entraremos em contato através do email ou WhatsApp informados
          para dar prosseguimento ao seu credenciamento.
        </p>
        <div className="pt-8">
          <Button
            variant="outline"
            onClick={() => (window.location.href = '/')}
          >
            Voltar para a Página Inicial
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 max-w-2xl">
      {/* Screening Header */}
      <div className="mb-10 text-center space-y-4">
        <h1 className="text-3xl font-heading font-bold text-primary">
          Cadastro de Triagem – Rede EscutaPsi
        </h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Este formulário tem como finalidade realizar a triagem inicial de
          profissionais interessados em compor nossa rede. Preencha os dados
          abaixo para que possamos conhecer seu perfil e alinhar propósitos.
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center relative">
          <div className="absolute left-0 right-0 top-1/2 h-1 bg-muted -z-10" />
          <div
            className="absolute left-0 top-1/2 h-1 bg-primary -z-10 transition-all duration-300"
            style={{ width: `${((step - 1) / 3) * 100}%` }}
          />
          {steps.map((s) => (
            <div
              key={s.num}
              className="flex flex-col items-center gap-2 bg-background px-2"
            >
              <div
                className={cn(
                  'w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all',
                  step >= s.num
                    ? 'bg-primary border-primary text-white'
                    : 'bg-background border-muted text-muted-foreground',
                )}
              >
                {step > s.num ? (
                  <Check className="w-4 h-4 sm:w-5 sm:h-5" />
                ) : (
                  s.num
                )}
              </div>
              <span
                className={cn(
                  'text-xs font-medium hidden sm:block',
                  step >= s.num ? 'text-primary' : 'text-muted-foreground',
                )}
              >
                {s.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      <Card className="border-border shadow-md">
        <CardHeader>
          <CardTitle>{steps[step - 1].title}</CardTitle>
          <CardDescription>
            Preencha as informações abaixo para continuar.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === 1 && (
            <form
              id="step1"
              onSubmit={handleSubmitStep1(onStepSubmit)}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" {...registerStep1('email')} />
                {errorsStep1.email && (
                  <p className="text-sm text-destructive">
                    {errorsStep1.email.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  {...registerStep1('password')}
                />
                {errorsStep1.password && (
                  <p className="text-sm text-destructive">
                    {errorsStep1.password.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  {...registerStep1('confirmPassword')}
                />
                {errorsStep1.confirmPassword && (
                  <p className="text-sm text-destructive">
                    {errorsStep1.confirmPassword.message}
                  </p>
                )}
              </div>
            </form>
          )}

          {step === 2 && (
            <form
              id="step2"
              onSubmit={handleSubmitStep2(onStepSubmit)}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo</Label>
                <Input id="name" {...registerStep2('name')} />
                {errorsStep2.name && (
                  <p className="text-sm text-destructive">
                    {errorsStep2.name.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="occupation">Ocupação</Label>
                <Input
                  id="occupation"
                  placeholder="Ex: Psicanalista, Psicólogo Clínico..."
                  {...registerStep2('occupation')}
                />
                {errorsStep2.occupation && (
                  <p className="text-sm text-destructive">
                    {errorsStep2.occupation.message}
                  </p>
                )}
              </div>

              <div className="space-y-2 pt-2">
                <Label>Possui registro no CRP ativo?</Label>
                <RadioGroup
                  onValueChange={(val) =>
                    setValueStep2('crpStatus', val as any)
                  }
                  defaultValue={watchStep2('crpStatus')}
                  className="flex flex-col space-y-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Sim" id="crp-sim" />
                    <Label htmlFor="crp-sim" className="font-normal">
                      Sim
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Não" id="crp-nao" />
                    <Label htmlFor="crp-nao" className="font-normal">
                      Não
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Não se aplica" id="crp-na" />
                    <Label htmlFor="crp-na" className="font-normal">
                      Não se aplica (Psicanalista sem CRP)
                    </Label>
                  </div>
                </RadioGroup>
                {errorsStep2.crpStatus && (
                  <p className="text-sm text-destructive">
                    {errorsStep2.crpStatus.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="age">Idade</Label>
                  <Input id="age" type="number" {...registerStep2('age')} />
                  {errorsStep2.age && (
                    <p className="text-sm text-destructive">
                      {errorsStep2.age.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">Estado (UF)</Label>
                  <Input
                    id="state"
                    placeholder="SP"
                    maxLength={2}
                    className="uppercase"
                    {...registerStep2('state')}
                  />
                  {errorsStep2.state && (
                    <p className="text-sm text-destructive">
                      {errorsStep2.state.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">Cidade</Label>
                <Input id="city" {...registerStep2('city')} />
                {errorsStep2.city && (
                  <p className="text-sm text-destructive">
                    {errorsStep2.city.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Apresentação (Bio)</Label>
                <Textarea
                  id="bio"
                  placeholder="Fale um pouco sobre você e sua abordagem..."
                  className="h-24"
                  {...registerStep2('bio')}
                />
                {errorsStep2.bio && (
                  <p className="text-sm text-destructive">
                    {errorsStep2.bio.message}
                  </p>
                )}
              </div>
            </form>
          )}

          {step === 3 && (
            <form
              id="step3"
              onSubmit={handleSubmitStep3(onStepSubmit)}
              className="space-y-6"
            >
              <div className="space-y-3">
                <Label>Nível de Formação / Categoria</Label>
                <RadioGroup
                  onValueChange={(val) =>
                    setValueStep3('educationLevel', val as string)
                  }
                  defaultValue={watchStep3('educationLevel')}
                  className="space-y-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Psicologia" id="ed-psi" />
                    <Label htmlFor="ed-psi" className="font-normal">
                      Psicologia (Graduação)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Psicanálise" id="ed-psica" />
                    <Label htmlFor="ed-psica" className="font-normal">
                      Psicanálise (Formação Livre/Instituto)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Ambos" id="ed-ambos" />
                    <Label htmlFor="ed-ambos" className="font-normal">
                      Ambos
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Outra" id="ed-outra" />
                    <Label htmlFor="ed-outra" className="font-normal">
                      Outra
                    </Label>
                  </div>
                </RadioGroup>
                {watchStep3('educationLevel') === 'Outra' && (
                  <Input
                    placeholder="Especifique sua formação"
                    className="mt-2"
                    {...registerStep3('educationLevelOther')}
                  />
                )}
                {errorsStep3.educationLevel && (
                  <p className="text-sm text-destructive">
                    {errorsStep3.educationLevel.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="education">
                  Detalhes da Formação (uma por linha)
                </Label>
                <Textarea
                  id="education"
                  placeholder="Graduação em Psicologia - USP&#10;Mestrado em Psicanálise..."
                  className="h-24"
                  {...registerStep3('education')}
                />
                {errorsStep3.education && (
                  <p className="text-sm text-destructive">
                    {errorsStep3.education.message}
                  </p>
                )}
              </div>

              <div className="space-y-3">
                <Label>Abordagem Teórica Principal</Label>
                <RadioGroup
                  onValueChange={(val) =>
                    setValueStep3('theoreticalApproach', val as string)
                  }
                  defaultValue={watchStep3('theoreticalApproach')}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-2"
                >
                  {[
                    'Psicanálise',
                    'TCC (Cognitivo Comportamental)',
                    'Humanista / ACP',
                    'Sistêmica',
                    'Fenomenológica',
                    'Outra',
                  ].map((approach) => (
                    <div
                      key={approach}
                      className="flex items-center space-x-2 space-y-0"
                    >
                      <RadioGroupItem value={approach} id={`ap-${approach}`} />
                      <Label htmlFor={`ap-${approach}`} className="font-normal">
                        {approach}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
                {watchStep3('theoreticalApproach') === 'Outra' && (
                  <Input
                    placeholder="Qual sua abordagem?"
                    className="mt-2"
                    {...registerStep3('theoreticalApproachOther')}
                  />
                )}
                {errorsStep3.theoreticalApproach && (
                  <p className="text-sm text-destructive">
                    {errorsStep3.theoreticalApproach.message}
                  </p>
                )}
              </div>

              <div className="space-y-3">
                <Label>Tempo de Experiência Clínica</Label>
                <RadioGroup
                  onValueChange={(val) =>
                    setValueStep3('experienceLevel', val as string)
                  }
                  defaultValue={watchStep3('experienceLevel')}
                  className="space-y-1"
                >
                  {[
                    'Iniciante (em formação ou recém-formado)',
                    'Até 1 ano',
                    'De 1 a 3 anos',
                    'Mais de 3 anos',
                  ].map((exp) => (
                    <div key={exp} className="flex items-center space-x-2">
                      <RadioGroupItem value={exp} id={`exp-${exp}`} />
                      <Label htmlFor={`exp-${exp}`} className="font-normal">
                        {exp}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
                {errorsStep3.experienceLevel && (
                  <p className="text-sm text-destructive">
                    {errorsStep3.experienceLevel.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="specialties">
                  Especialidades / Temas de Interesse
                </Label>
                <Input
                  id="specialties"
                  placeholder="Ansiedade, Depressão, Luto..."
                  {...registerStep3('specialties')}
                />
                <p className="text-xs text-muted-foreground">
                  Separe por vírgulas
                </p>
                {errorsStep3.specialties && (
                  <p className="text-sm text-destructive">
                    {errorsStep3.specialties.message}
                  </p>
                )}
              </div>
            </form>
          )}

          {step === 4 && (
            <form
              id="step4"
              onSubmit={handleSubmitStep4(onStepSubmit)}
              className="space-y-6"
            >
              <div className="space-y-3">
                <ProfilePhotoUploader
                  value={photoUrl}
                  onChange={setPhotoUrl}
                  onFileChange={setAvatarFile}
                  name={watchStep2('name') || ''}
                />
              </div>

              <div className="space-y-3">
                <Label>Tipos de Atendimento</Label>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center space-x-2 p-2 rounded border hover:bg-muted/10 transition-colors">
                    <Checkbox
                      id="srv-online"
                      onCheckedChange={(checked) => {
                        const current = watchStep4('serviceTypes') || []
                        if (checked)
                          setValueStep4('serviceTypes', [...current, 'Online'])
                        else
                          setValueStep4(
                            'serviceTypes',
                            current.filter((t) => t !== 'Online'),
                          )
                      }}
                    />
                    <label
                      htmlFor="srv-online"
                      className="text-sm flex-grow cursor-pointer py-1"
                    >
                      Online
                    </label>
                  </div>
                  <div className="flex items-center space-x-2 p-2 rounded border hover:bg-muted/10 transition-colors">
                    <Checkbox
                      id="srv-presencial"
                      onCheckedChange={(checked) => {
                        const current = watchStep4('serviceTypes') || []
                        if (checked)
                          setValueStep4('serviceTypes', [
                            ...current,
                            'Presencial',
                          ])
                        else
                          setValueStep4(
                            'serviceTypes',
                            current.filter((t) => t !== 'Presencial'),
                          )
                      }}
                    />
                    <label
                      htmlFor="srv-presencial"
                      className="text-sm flex-grow cursor-pointer py-1"
                    >
                      Presencial
                    </label>
                  </div>
                </div>
                {errorsStep4.serviceTypes && (
                  <p className="text-sm text-destructive">
                    {errorsStep4.serviceTypes.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="availability">
                  Disponibilidade (Descrição de Horários)
                </Label>
                <Textarea
                  id="availability"
                  placeholder="Ex: Segunda a Sexta, das 14h às 20h"
                  {...registerStep4('availability')}
                />
                {errorsStep4.availability && (
                  <p className="text-sm text-destructive">
                    {errorsStep4.availability.message}
                  </p>
                )}
              </div>

              <div className="space-y-3">
                <Label>Disponibilidade Semanal (Vagas para a Rede)</Label>
                <RadioGroup
                  onValueChange={(val) =>
                    setValueStep4('networkAvailability', val as any)
                  }
                  defaultValue={watchStep4('networkAvailability')}
                  className="flex flex-row space-x-4"
                >
                  {['1 a 3', '4 a 6', '7 ou mais'].map((opt) => (
                    <div key={opt} className="flex items-center space-x-2">
                      <RadioGroupItem value={opt} id={`nav-${opt}`} />
                      <Label htmlFor={`nav-${opt}`} className="font-normal">
                        {opt}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
                {errorsStep4.networkAvailability && (
                  <p className="text-sm text-destructive">
                    {errorsStep4.networkAvailability.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">WhatsApp (DDD + Número)</Label>
                <Input
                  id="phone"
                  placeholder="11999999999"
                  {...registerStep4('phone')}
                />
                <p className="text-xs text-muted-foreground">Apenas números</p>
                {errorsStep4.phone && (
                  <p className="text-sm text-destructive">
                    {errorsStep4.phone.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="instagram">Instagram (Link Perfil)</Label>
                <div className="relative">
                  <Instagram className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="instagram"
                    placeholder="https://instagram.com/seu.perfil"
                    className="pl-9"
                    {...registerStep4('instagram')}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="facebook">Facebook (Link Perfil)</Label>
                <div className="relative">
                  <Facebook className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="facebook"
                    placeholder="https://facebook.com/seu.perfil"
                    className="pl-9"
                    {...registerStep4('facebook')}
                  />
                </div>
              </div>

              <div className="pt-4 border-t space-y-6">
                <div className="space-y-3">
                  <Label>
                    Aceita atender por Valor Social (acordado com paciente)?
                  </Label>
                  <RadioGroup
                    onValueChange={(val) =>
                      setValueStep4('acceptsSocialValue', val as any)
                    }
                    defaultValue={watchStep4('acceptsSocialValue')}
                    className="flex space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Sim" id="social-sim" />
                      <Label htmlFor="social-sim" className="font-normal">
                        Sim
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Não" id="social-nao" />
                      <Label htmlFor="social-nao" className="font-normal">
                        Não
                      </Label>
                    </div>
                  </RadioGroup>
                  {errorsStep4.acceptsSocialValue && (
                    <p className="text-sm text-destructive">
                      {errorsStep4.acceptsSocialValue.message}
                    </p>
                  )}
                </div>

                <div className="space-y-3">
                  <Label>
                    Declara estar de acordo com os Princípios Éticos da
                    profissão?
                  </Label>
                  <RadioGroup
                    onValueChange={(val) =>
                      setValueStep4('agreesToEthics', val as any)
                    }
                    defaultValue={watchStep4('agreesToEthics')}
                    className="flex space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Sim" id="ethics-sim" />
                      <Label htmlFor="ethics-sim" className="font-normal">
                        Sim
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Não" id="ethics-nao" />
                      <Label htmlFor="ethics-nao" className="font-normal">
                        Não
                      </Label>
                    </div>
                  </RadioGroup>
                  {errorsStep4.agreesToEthics && (
                    <p className="text-sm text-destructive">
                      {errorsStep4.agreesToEthics.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Terms of Agreement Section */}
              <div className="space-y-4 pt-4 border-t">
                <Label>Termo de Adesão</Label>
                <ScrollArea className="h-[200px] w-full rounded-md border p-4 bg-muted/20">
                  <TermsOfAgreement />
                </ScrollArea>
                <div className="flex items-start space-x-2 pt-2">
                  <Checkbox
                    id="termsAccepted"
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setValueStep4('termsAccepted', true, {
                          shouldValidate: true,
                        })
                      } else {
                        setValueStep4(
                          'termsAccepted',
                          undefined as unknown as true,
                          {
                            shouldValidate: true,
                          },
                        )
                      }
                    }}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <label
                      htmlFor="termsAccepted"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      Li e concordo com o Termo de Adesão à Rede EscutaPsi
                    </label>
                    {errorsStep4.termsAccepted && (
                      <p className="text-sm text-destructive">
                        {errorsStep4.termsAccepted.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </form>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => setStep((prev) => prev - 1)}
            disabled={step === 1 || isLoading}
          >
            <ChevronLeft className="w-4 h-4 mr-2" /> Voltar
          </Button>

          <Button
            type="submit"
            form={`step${step}`}
            disabled={isLoading}
            className="min-w-[120px]"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : step === 4 ? (
              'Finalizar'
            ) : (
              <>
                Próximo <ChevronRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
