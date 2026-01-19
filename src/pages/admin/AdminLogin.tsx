import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card'
import { useAuth } from '@/hooks/use-auth'
import { toast } from 'sonner'
import { useProfessionalStore } from '@/stores/useProfessionalStore'
import { supabase } from '@/lib/supabase/client'

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Digite sua senha'),
})

type LoginForm = z.infer<typeof loginSchema>

export default function AdminLogin() {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { signIn } = useAuth()
  const { fetchCurrentProfile } = useProfessionalStore()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true)
    try {
      const { error } = await signIn(data.email, data.password)

      if (error) {
        toast.error('Falha na autenticação', {
          description: 'Verifique suas credenciais e tente novamente.',
        })
      } else {
        // Verify admin role
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (user) {
          const profile = await fetchCurrentProfile(user.id)
          if (profile?.role === 'admin') {
            toast.success('Bem-vindo, Administrador')
            navigate('/admin')
          } else {
            toast.error('Acesso Negado', {
              description: 'Esta área é restrita a administradores.',
            })
            await supabase.auth.signOut()
          }
        }
      }
    } catch (err) {
      console.error(err)
      toast.error('Erro inesperado')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/20 px-4">
      <Card className="w-full max-w-md shadow-lg border-primary/20">
        <CardHeader className="space-y-2 text-center">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-2">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <CardTitle className="text-2xl font-heading font-bold">
            Acesso Administrativo
          </CardTitle>
          <CardDescription>
            Entre com suas credenciais de administrador
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@escutapsi.com"
                {...register('email')}
                className={errors.email ? 'border-destructive' : ''}
              />
              {errors.email && (
                <p className="text-sm text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                {...register('password')}
                className={errors.password ? 'border-destructive' : ''}
              />
              {errors.password && (
                <p className="text-sm text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full font-semibold"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                'Acessar Painel'
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center">
          <p className="text-xs text-muted-foreground text-center">
            Área restrita. O acesso não autorizado é monitorado.
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
