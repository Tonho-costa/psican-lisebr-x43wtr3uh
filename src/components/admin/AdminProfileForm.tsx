import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { StringListInput } from '@/components/StringListInput'
import { Database } from '@/lib/supabase/types'

type Profile = Database['public']['Tables']['profiles']['Row']

const adminProfileSchema = z.object({
  full_name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  occupation: z.string().optional(),
  age: z.coerce.number().optional(),
  city: z.string().optional(),
  state: z.string().max(2).optional(),
  phone: z.string().optional(),
  description: z.string().optional(),
  email: z.string().email().optional(),
  facebook: z.string().optional(),
  instagram: z.string().optional(),
  availability: z.string().optional(),
  service_types: z.array(z.string()).optional(),
  specialties: z.array(z.string()).optional(),
  education: z.array(z.string()).optional(),
  courses: z.array(z.string()).optional(),
})

type AdminProfileFormValues = z.infer<typeof adminProfileSchema>

interface AdminProfileFormProps {
  profile: Profile
  onSubmit: (data: AdminProfileFormValues) => Promise<void>
  isSubmitting?: boolean
}

export function AdminProfileForm({
  profile,
  onSubmit,
  isSubmitting,
}: AdminProfileFormProps) {
  const form = useForm<AdminProfileFormValues>({
    resolver: zodResolver(adminProfileSchema),
    defaultValues: {
      full_name: profile.full_name || '',
      occupation: profile.occupation || '',
      age: profile.age || 0,
      city: profile.city || '',
      state: profile.state || '',
      phone: profile.phone || '',
      description: profile.description || '',
      email: profile.email || '',
      facebook: profile.facebook || '',
      instagram: profile.instagram || '',
      availability: profile.availability || '',
      service_types: profile.service_types || [],
      specialties: profile.specialties || [],
      education: profile.education || [],
      courses: profile.courses || [],
    },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="full_name"
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
                <FormLabel>Ocupação</FormLabel>
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
                <FormLabel>Telefone</FormLabel>
                <FormControl>
                  <Input {...field} />
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
                  <Input {...field} maxLength={2} className="uppercase" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Biografia / Descrição</FormLabel>
              <FormControl>
                <Textarea {...field} className="min-h-[100px]" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} type="email" />
                </FormControl>
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
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="facebook"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Facebook</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="instagram"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Instagram</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <FormLabel>Tipos de Atendimento</FormLabel>
          <div className="flex gap-4">
            <FormField
              control={form.control}
              name="service_types"
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
              name="service_types"
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
        </div>

        <FormField
          control={form.control}
          name="specialties"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Especialidades</FormLabel>
              <FormControl>
                <StringListInput
                  value={field.value || []}
                  onChange={field.onChange}
                  placeholder="Adicionar especialidade..."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="education"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Formação</FormLabel>
                <FormControl>
                  <StringListInput
                    value={field.value || []}
                    onChange={field.onChange}
                    placeholder="Adicionar formação..."
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
                <FormLabel>Cursos</FormLabel>
                <FormControl>
                  <StringListInput
                    value={field.value || []}
                    onChange={field.onChange}
                    placeholder="Adicionar curso..."
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
