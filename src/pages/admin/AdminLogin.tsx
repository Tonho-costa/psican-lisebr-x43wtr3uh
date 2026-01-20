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
  const { signIn, signOut } = useAuth()
  const { fetchCurrentProfile } = useProfessionalStore()

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
      // 1. Authenticate with Supabase Auth
      const { error: signInError } = await signIn(data.email, data.password)

      if (signInError) {
        console.error('Sign In Error:', signInError)
        // Specific error handling for Database/Recursion errors
        if (
          signInError.message?.includes('Database error') ||
          (signInError as any).status === 500
        ) {
          toast.error(
            'Erro de sistema (Database). Possível falha de configuração ou recursividade.',
          )
        } else if (
          signInError.message?.includes('Invalid login credentials') ||
          signInError.message?.includes('Invalid email or password')
        ) {
          toast.error('Email ou senha incorretos.')
        } else {
          toast.error('Falha no login: ' + signInError.message)
        }
        setIsLoading(false)
        return
      }

      // 2. Verify Session validity
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      if (userError || !user) {
        toast.error('Sessão inválida. Tente novamente.')
        await signOut()
        setIsLoading(false)
        return
      }

      // 3. Fetch Profile (Critical step where RLS recursion usually occurs)
      const profile = await fetchCurrentProfile(user.id)
      const storeError = useProfessionalStore.getState().error

      if (!profile) {
        if (
          storeError?.includes('Recursividade') ||
          storeError?.includes('Database')
        ) {
          toast.error(
            'Erro Crítico: O sistema detectou um problema de recursividade nas permissões (RLS). Contate o suporte técnico.',
          )
        } else {
          toast.error(storeError || 'Perfil de administrador não encontrado.')
        }
        await signOut()
        setIsLoading(false)
        return
      }

      // 4. Verify Admin Role
      if (profile.role === 'admin') {
        toast.success('Login administrativo realizado com sucesso.')
        navigate(from, { replace: true })
      } else {
        toast.error(
          'Acesso Negado: Esta conta não possui privilégios de administrador.',
        )
        await signOut()
      }
    } catch (err: any) {
      console.error('Unexpected admin login error:', err)
      toast.error('Ocorreu um erro inesperado. Tente novamente.')
      await signOut()
    } finally {
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
            Portal Administrativo
          </CardTitle>
          <CardDescription>
            Entre com suas credenciais de segurança
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Corporativo</Label>
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
              <Label htmlFor="password">Senha de Acesso</Label>
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
                  Autenticando...
                </>
              ) : (
                'Acessar Painel'
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center">
          <p className="text-xs text-muted-foreground text-center">
            Monitoramento de segurança ativo. Todos os acessos são registrados.
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
