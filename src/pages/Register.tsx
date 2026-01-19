import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { toast } from 'sonner'
import { triageService } from '@/services/triageService'
import { useAuth } from '@/hooks/use-auth'

const formSchema = z
  .object({
    email: z.string().email('Email inválido'),
    password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
    fullName: z.string().min(3, 'Nome completo é obrigatório'),
    phone: z.string().min(5, 'Telefone/WhatsApp é obrigatório'),
    profileUrl: z.string().optional(),
    serviceMode: z.enum(['Online', 'Presencial', 'Ambos'], {
      required_error: 'Selecione a modalidade de atendimento',
    }),
    education: z.string({ required_error: 'Selecione sua formação' }),
    educationOther: z.string().optional(),
    crpStatus: z.enum(['Sim', 'Não', 'Não se aplica'], {
      required_error: 'Selecione o status do CRP',
    }),
    approach: z.string({ required_error: 'Selecione sua abordagem' }),
    approachOther: z.string().optional(),
    experience: z.string({
      required_error: 'Selecione o tempo de experiência',
    }),
    availability: z.string({ required_error: 'Selecione a disponibilidade' }),
    socialValue: z.enum(['Sim', 'Não'], {
      required_error: 'Este campo é obrigatório',
    }),
    ethicsAgreement: z.enum(['Sim', 'Não'], {
      required_error: 'Este campo é obrigatório',
    }),
    termsAgreement: z.literal(true, {
      errorMap: () => ({
        message: 'Você deve concordar com o Termo de Adesão',
      }),
    }),
  })
  .refine(
    (data) => {
      if (data.education === 'Outra' && !data.educationOther) return false
      return true
    },
    {
      message: 'Por favor, especifique sua formação',
      path: ['educationOther'],
    },
  )
  .refine(
    (data) => {
      if (data.approach === 'Outra' && !data.approachOther) return false
      return true
    },
    {
      message: 'Por favor, especifique sua abordagem',
      path: ['approachOther'],
    },
  )

type FormValues = z.infer<typeof formSchema>

export default function Register() {
  const [isSuccess, setIsSuccess] = useState(false)
  const { signUp, user } = useAuth()
  const navigate = useNavigate()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      fullName: '',
      phone: '',
      profileUrl: '',
      serviceMode: undefined,
      education: undefined,
      educationOther: '',
      crpStatus: undefined,
      approach: undefined,
      approachOther: '',
      experience: undefined,
      availability: undefined,
      socialValue: undefined,
      ethicsAgreement: undefined,
      termsAgreement: false,
    },
  })

  const onSubmit = async (data: FormValues) => {
    try {
      let userId = user?.id

      // If user is not logged in, sign up first
      if (!userId) {
        const { data: authData, error: authError } = await signUp(
          data.email,
          data.password,
          {
            full_name: data.fullName,
          },
        )

        if (authError) {
          toast.error('Erro ao criar conta: ' + authError.message)
          return
        }

        if (authData?.user) {
          userId = authData.user.id
        }
      }

      const finalEducation =
        data.education === 'Outra' ? data.educationOther! : data.education
      const finalApproach =
        data.approach === 'Outra' ? data.approachOther! : data.approach

      const submissionData = {
        full_name: data.fullName,
        email: data.email,
        phone: data.phone,
        profile_url: data.profileUrl,
        service_mode: data.serviceMode,
        education: finalEducation,
        crp_status: data.crpStatus,
        theoretical_approach: finalApproach,
        experience_level: data.experience,
        weekly_availability: data.availability,
        accepts_social_value: data.socialValue === 'Sim',
        agrees_to_ethics: data.ethicsAgreement === 'Sim',
        agrees_to_terms: data.termsAgreement,
        user_id: userId,
        status: 'pending',
      }

      const { error } = await triageService.submitTriage(submissionData)

      if (error) {
        throw error
      }

      setIsSuccess(true)
      window.scrollTo(0, 0)
    } catch (error) {
      console.error('Error submitting triage:', error)
      toast.error('Ocorreu um erro ao enviar o formulário. Tente novamente.')
    }
  }

  if (isSuccess) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center min-h-[70vh]">
        <Card className="w-full max-w-2xl text-center border-primary/20 shadow-lg animate-in fade-in-50 zoom-in-95 duration-300">
          <CardHeader className="space-y-6">
            <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-2">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <CardTitle className="text-3xl font-heading font-bold text-primary">
              Cadastro Recebido!
            </CardTitle>
            <CardDescription className="text-xl text-foreground/80 max-w-lg mx-auto leading-relaxed">
              Sua conta foi criada e seus dados de triagem enviados. Nossa
              equipe analisará seu perfil e você será notificado em breve.
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-12">
            <Button
              onClick={() => navigate('/entrar')}
              className="mt-6 rounded-full px-8"
              variant="outline"
            >
              Ir para o Login
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <Card className="border-border shadow-md">
        <CardHeader className="space-y-4 text-center pb-8 border-b">
          <CardTitle className="text-3xl font-heading font-bold text-primary">
            Cadastro Profissional
          </CardTitle>
          <CardDescription className="text-base max-w-2xl mx-auto">
            Crie sua conta e preencha a triagem para integrar a Rede EscutaPsi.
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {!user && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-primary border-b pb-2">
                    Dados de Acesso
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="seu@email.com"
                              type="email"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Senha</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="******"
                              type="password"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}

              {/* Personal Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-primary border-b pb-2">
                  Dados Pessoais e Contato
                </h3>

                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome completo</FormLabel>
                      <FormControl>
                        <Input placeholder="Seu nome completo" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone / WhatsApp</FormLabel>
                      <FormControl>
                        <Input placeholder="(DDD) 99999-9999" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="profileUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Perfil profissional{' '}
                        <span className="text-muted-foreground font-normal">
                          (Opcional)
                        </span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Instagram, LinkedIn ou Site Pessoal"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Professional Info */}
              <div className="space-y-4 pt-4">
                <h3 className="text-lg font-semibold text-primary border-b pb-2">
                  Atuação Profissional
                </h3>

                <FormField
                  control={form.control}
                  name="serviceMode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Modalidade de atendimento</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-2 mt-2"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="Online" />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">
                              Online
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="Presencial" />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">
                              Presencial
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="Ambos" />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">
                              Ambos
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
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
                      <FormLabel>Formação</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione sua formação" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Psicólogo(a)">
                            Psicólogo(a)
                          </SelectItem>
                          <SelectItem value="Psicanalista">
                            Psicanalista
                          </SelectItem>
                          <SelectItem value="Psicólogo(a) em formação">
                            Psicólogo(a) em formação
                          </SelectItem>
                          <SelectItem value="Psicanalista em formação">
                            Psicanalista em formação
                          </SelectItem>
                          <SelectItem value="Outra">Outra</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {form.watch('education') === 'Outra' && (
                  <FormField
                    control={form.control}
                    name="educationOther"
                    render={({ field }) => (
                      <FormItem className="pl-4 border-l-2 border-muted ml-1">
                        <FormLabel>Especifique sua formação</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Digite sua formação aqui"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="crpStatus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Possui registro profissional (CRP)?</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-2 mt-2"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="Sim" />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">
                              Sim
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="Não" />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">
                              Não
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="Não se aplica" />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">
                              Não se aplica
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="approach"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Abordagem teórica principal</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione sua abordagem" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Psicanálise">
                            Psicanálise
                          </SelectItem>
                          <SelectItem value="TCC">TCC</SelectItem>
                          <SelectItem value="Humanista">Humanista</SelectItem>
                          <SelectItem value="Sistêmica">Sistêmica</SelectItem>
                          <SelectItem value="Fenomenológica">
                            Fenomenológica
                          </SelectItem>
                          <SelectItem value="Outra">Outra</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {form.watch('approach') === 'Outra' && (
                  <FormField
                    control={form.control}
                    name="approachOther"
                    render={({ field }) => (
                      <FormItem className="pl-4 border-l-2 border-muted ml-1">
                        <FormLabel>Especifique sua abordagem</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Digite sua abordagem aqui"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="experience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tempo de experiência clínica</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o tempo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Iniciante">Iniciante</SelectItem>
                          <SelectItem value="Até 1 ano">Até 1 ano</SelectItem>
                          <SelectItem value="De 1 a 3 anos">
                            De 1 a 3 anos
                          </SelectItem>
                          <SelectItem value="Mais de 3 anos">
                            Mais de 3 anos
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="availability"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Disponibilidade média semanal</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a quantidade" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="De 1 a 3 atendimentos">
                            De 1 a 3 atendimentos
                          </SelectItem>
                          <SelectItem value="De 4 a 6 atendimentos">
                            De 4 a 6 atendimentos
                          </SelectItem>
                          <SelectItem value="7 atendimentos ou mais">
                            7 atendimentos ou mais
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="socialValue"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Está disposto(a) a praticar valor social por sessão?
                      </FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-2 mt-2"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="Sim" />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">
                              Sim
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="Não" />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">
                              Não
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Ethics and Terms */}
              <div className="space-y-4 pt-4">
                <h3 className="text-lg font-semibold text-primary border-b pb-2">
                  Ética e Termos
                </h3>

                <FormField
                  control={form.control}
                  name="ethicsAgreement"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Você concorda com os princípios éticos e com os fluxos
                        de atendimento?
                      </FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-2 mt-2"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="Sim" />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">
                              Sim
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="Não" />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">
                              Não
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="termsAgreement"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          Declaro que li e estou de acordo com o Termo de Adesão
                          à Rede EscutaPsi
                        </FormLabel>
                        <FormDescription>
                          <Link
                            to="/termos-de-uso"
                            target="_blank"
                            className="text-primary hover:underline"
                          >
                            Acesse o Termo de Adesão aqui
                          </Link>
                        </FormDescription>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
              </div>

              <div className="pt-6">
                <Button
                  type="submit"
                  size="lg"
                  className="w-full text-lg h-12"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Processando...
                    </>
                  ) : (
                    'Criar Conta e Enviar Cadastro'
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
