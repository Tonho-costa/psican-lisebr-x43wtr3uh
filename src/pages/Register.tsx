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
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { useProfessionalStore } from '@/stores/useProfessionalStore'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { ProfilePhotoUploader } from '@/components/ProfilePhotoUploader'

// Validation Schemas for each step
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
})

const step3Schema = z.object({
  education: z.string().min(5, 'Informe sua formação principal'),
  specialties: z.string().min(3, 'Informe pelo menos uma especialidade'),
})

const step4Schema = z.object({
  serviceTypes: z
    .array(z.enum(['Online', 'Presencial']))
    .min(1, 'Selecione pelo menos um tipo de atendimento'),
  availability: z.string().min(5, 'Informe sua disponibilidade'),
  phone: z.string().min(10, 'Informe um número de WhatsApp válido com DDD'),
  instagram: z.string().optional(),
  facebook: z.string().optional(),
})

// Combine for full type
type RegistrationData = z.infer<typeof step1Schema> &
  z.infer<typeof step2Schema> &
  z.infer<typeof step3Schema> &
  z.infer<typeof step4Schema>

export default function Register() {
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<Partial<RegistrationData>>({})
  const [photoUrl, setPhotoUrl] = useState<string>('')
  const navigate = useNavigate()
  const registerStore = useProfessionalStore((state) => state.register)

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
  } = useForm<z.infer<typeof step2Schema>>({
    resolver: zodResolver(step2Schema),
    defaultValues: formData,
  })
  const {
    register: registerStep3,
    handleSubmit: handleSubmitStep3,
    formState: { errors: errorsStep3 },
  } = useForm<z.infer<typeof step3Schema>>({
    resolver: zodResolver(step3Schema),
    defaultValues: formData,
  })
  const {
    register: registerStep4,
    handleSubmit: handleSubmitStep4,
    formState: { errors: errorsStep4 },
    setValue,
    watch,
  } = useForm<z.infer<typeof step4Schema>>({
    resolver: zodResolver(step4Schema),
    defaultValues: {
      serviceTypes: [],
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
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const randomGender = Math.random() > 0.5 ? 'male' : 'female'
    const fallbackPhoto = `https://img.usecurling.com/ppl/medium?gender=${randomGender}&seed=${Math.random()}`

    // Transform strings to arrays where needed
    const finalData = {
      ...data,
      education: data.education.split('\n').filter(Boolean),
      specialties: data.specialties
        .split(',')
        .map((s: string) => s.trim())
        .filter(Boolean),
      courses: [], // Default empty
      photoUrl: photoUrl || fallbackPhoto,
    }

    registerStore(finalData)
    setIsLoading(false)
    toast.success('Cadastro realizado com sucesso!')
    navigate('/painel/perfil')
  }

  const steps = [
    { num: 1, title: 'Acesso' },
    { num: 2, title: 'Pessoal' },
    { num: 3, title: 'Acadêmico' },
    { num: 4, title: 'Atendimento' },
  ]

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
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
                  'w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all',
                  step >= s.num
                    ? 'bg-primary border-primary text-white'
                    : 'bg-background border-muted text-muted-foreground',
                )}
              >
                {step > s.num ? <Check className="w-5 h-5" /> : s.num}
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
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="education">Formação (uma por linha)</Label>
                <Textarea
                  id="education"
                  placeholder="Graduação em Psicologia - USP&#10;Mestrado em Psicanálise..."
                  className="h-32"
                  {...registerStep3('education')}
                />
                {errorsStep3.education && (
                  <p className="text-sm text-destructive">
                    {errorsStep3.education.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="specialties">
                  Especialidades (separadas por vírgula)
                </Label>
                <Input
                  id="specialties"
                  placeholder="Ansiedade, Depressão, Luto..."
                  {...registerStep3('specialties')}
                />
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
                <Label>Foto de Perfil</Label>
                <div className="flex justify-center p-4 border rounded-lg bg-muted/10">
                  <ProfilePhotoUploader
                    onPhotoChange={setPhotoUrl}
                    currentPhotoUrl={photoUrl}
                  />
                </div>
                <p className="text-xs text-muted-foreground text-center">
                  Adicione uma foto profissional para transmitir confiança aos
                  pacientes.
                </p>
              </div>

              <div className="space-y-3">
                <Label>Tipos de Atendimento</Label>
                <div className="flex flex-col gap-2">
                  {/* Manually handling checkboxes because react-hook-form array handling with simple checkboxes can be tricky */}
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="srv-online"
                      onCheckedChange={(checked) => {
                        const current = watch('serviceTypes') || []
                        if (checked)
                          setValue('serviceTypes', [...current, 'Online'])
                        else
                          setValue(
                            'serviceTypes',
                            current.filter((t) => t !== 'Online'),
                          )
                      }}
                    />
                    <label htmlFor="srv-online" className="text-sm">
                      Online
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="srv-presencial"
                      onCheckedChange={(checked) => {
                        const current = watch('serviceTypes') || []
                        if (checked)
                          setValue('serviceTypes', [...current, 'Presencial'])
                        else
                          setValue(
                            'serviceTypes',
                            current.filter((t) => t !== 'Presencial'),
                          )
                      }}
                    />
                    <label htmlFor="srv-presencial" className="text-sm">
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
                <Label htmlFor="availability">Disponibilidade/Horários</Label>
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
                <Label htmlFor="instagram">Instagram (Opcional)</Label>
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
                <Label htmlFor="facebook">Facebook (Opcional)</Label>
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
