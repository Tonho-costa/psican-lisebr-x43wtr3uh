import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Professional } from '@/stores/useProfessionalStore'
import { toast } from 'sonner'
import { StringListInput } from './StringListInput'

const profileSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  occupation: z.string().min(2, 'Profissão é obrigatória'),
  age: z.coerce.number().min(18, 'Deve ser maior de 18 anos'),
  city: z.string().min(2, 'Cidade é obrigatória'),
  state: z.string().length(2, 'Use a sigla do estado (ex: SP)'),
  phone: z.string().min(10, 'Telefone inválido'),
  availability: z.string().optional(),
  bio: z.string().max(1000, 'Biografia muito longa').optional(),
  serviceTypes: z
    .array(z.enum(['Online', 'Presencial']))
    .min(1, 'Selecione pelo menos um tipo'),
  specialties: z
    .array(z.string())
    .min(1, 'Adicione pelo menos uma especialidade'),
  education: z.array(z.string()),
  courses: z.array(z.string()),
})

type ProfileFormValues = z.infer<typeof profileSchema>

interface ProfileFormProps {
  professional: Professional
  onSubmit: (data: Partial<Professional>) => Promise<void>
}

export function ProfileForm({ professional, onSubmit }: ProfileFormProps) {
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: professional.name,
      occupation: professional.occupation,
      age: professional.age,
      city: professional.city,
      state: professional.state,
      phone: professional.phone,
      availability: professional.availability || '',
      bio: professional.bio || '',
      serviceTypes: professional.serviceTypes,
      specialties: professional.specialties,
      education: professional.education,
      courses: professional.courses,
    },
  })

  const handleSubmit = async (data: ProfileFormValues) => {
    const toastId = toast.loading('Salvando alterações...')
    try {
      await onSubmit(data)
      toast.success('Perfil atualizado com sucesso!', { id: toastId })
    } catch (error) {
      console.error(error)
      toast.error('Erro ao salvar alterações', { id: toastId })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome Completo</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="occupation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Profissão (ex: Psicólogo Clínico)</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <FormField
            control={form.control}
            name="age"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Idade</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem className="col-span-2 md:col-span-1">
                <FormLabel>WhatsApp</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="(11) 99999-9999" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cidade</FormLabel>
                <FormControl>
                  <Input {...field} />
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
                <FormLabel>Estado</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="UF"
                    maxLength={2}
                    className="uppercase"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sobre mim</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  className="min-h-[100px]"
                  placeholder="Conte um pouco sobre sua abordagem e experiência..."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <FormLabel>Tipos de Atendimento</FormLabel>
          <div className="flex gap-4">
            <FormField
              control={form.control}
              name="serviceTypes"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value?.includes('Online')}
                      onCheckedChange={(checked) => {
                        const current = field.value || []
                        const updated = checked
                          ? [...current, 'Online']
                          : current.filter((val) => val !== 'Online')
                        field.onChange(updated)
                      }}
                    />
                  </FormControl>
                  <FormLabel className="font-normal cursor-pointer">
                    Online
                  </FormLabel>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="serviceTypes"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value?.includes('Presencial')}
                      onCheckedChange={(checked) => {
                        const current = field.value || []
                        const updated = checked
                          ? [...current, 'Presencial']
                          : current.filter((val) => val !== 'Presencial')
                        field.onChange(updated)
                      }}
                    />
                  </FormControl>
                  <FormLabel className="font-normal cursor-pointer">
                    Presencial
                  </FormLabel>
                </FormItem>
              )}
            />
          </div>
          <FormMessage>
            {form.formState.errors.serviceTypes?.message}
          </FormMessage>
        </div>

        <FormField
          control={form.control}
          name="availability"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Disponibilidade (Opcional)</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Ex: Seg a Sex, 08h às 18h" />
              </FormControl>
              <FormDescription>
                Breve descrição dos seus horários de atendimento.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <FormField
            control={form.control}
            name="specialties"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Especialidades</FormLabel>
                <FormControl>
                  <StringListInput
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Adicionar especialidade (ex: Ansiedade)"
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
                <FormLabel>Formação Acadêmica</FormLabel>
                <FormControl>
                  <StringListInput
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Adicionar formação (ex: Bacharelado em Psicologia - USP)"
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
                <FormLabel>Cursos Complementares</FormLabel>
                <FormControl>
                  <StringListInput
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Adicionar curso"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
        </Button>
      </form>
    </Form>
  )
}
