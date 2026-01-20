import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
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
  const location = useLocation()
  const { signIn } = useAuth()
  const { fetchCurrentProfile, error: profileError } = useProfessionalStore()

  // Get return url from location state or default to /admin
  const from = location.state?.from?.pathname || '/admin'

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
        console.error('Login Error:', error)

        // Handle specific errors based on Acceptance Criteria
        // This includes "Database error querying schema" and recursion errors
        const isDatabaseError =
          error.message?.includes('Database error') ||
          error.message?.includes('schema') ||
          error.message?.includes('recursion') ||
          (error as any).status === 500 ||
          (error as any).code === '500'

        if (isDatabaseError) {
          toast.error(
            'Erro de sistema (Database/Schema). Por favor, tente novamente em alguns instantes.',
          )
        } else if (
          error.message?.includes('Invalid login credentials') ||
          error.message?.includes('Invalid email or password')
        ) {
          toast.error('Verifique suas credenciais e tente novamente.')
        } else {
          toast.error(
            error.message ||
              'Ocorreu um erro ao realizar o login. Tente novamente.',
          )
        }
        setIsLoading(false)
        return
      }

      // Check user and profile for admin role
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      if (userError || !user) {
        toast.error('Erro ao verificar usuário. Tente fazer login novamente.')
        await supabase.auth.signOut()
        setIsLoading(false)
        return
      }

      // Fetch profile to verify role
      const profile = await fetchCurrentProfile(user.id)

      // Handle profile fetch errors specifically
      const storeError = useProfessionalStore.getState().error
      if (!profile && storeError) {
        const isSchemaError =
          storeError.includes('schema') ||
          storeError.includes('Database error') ||
          storeError.includes('recursion')

        if (isSchemaError) {
          toast.error(
            'Erro crítico ao carregar perfil de administrador. (Database Schema/RLS Error)',
          )
        } else {
          toast.error(`Erro ao carregar perfil: ${storeError}`)
        }
        await supabase.auth.signOut()
        setIsLoading(false)
        return
      }

      if (profile?.role === 'admin') {
        toast.success('Bem-vindo ao Painel Administrativo')
        navigate(from, { replace: true })
      } else {
        toast.error('Acesso Negado. Área restrita a administradores.')
        await supabase.auth.signOut()
        setIsLoading(false)
      }
    } catch (err: any) {
      console.error('Unexpected error:', err)
      toast.error('Ocorreu um erro inesperado. Tente novamente.')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/20 px-4">
      <Card className="w-full max-w-md shadow-lg border-primary/20 animate-in fade-in zoom-in-95 duration-300">
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
                disabled={isLoading}
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
                disabled={isLoading}
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
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verificando...
                </>
              ) : (
                'Entrar'
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
