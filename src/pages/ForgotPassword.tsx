import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2, ChevronLeft, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card'
import { useAuth } from '@/hooks/use-auth'
import { toast } from 'sonner'

const forgotPasswordSchema = z.object({
  email: z.string().email('Digite um email válido'),
})

type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>

export default function ForgotPassword() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const { resetPassword } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  const onSubmit = async (data: ForgotPasswordForm) => {
    setIsLoading(true)
    const { error } = await resetPassword(data.email)
    setIsLoading(false)

    if (!error) {
      setIsSuccess(true)
      toast.success('Email de recuperação enviado!')
    } else {
      console.error(error)
      toast.error('Erro ao enviar email. Verifique se o endereço está correto.')
    }
  }

  return (
    <div className="container mx-auto flex items-center justify-center min-h-[80vh] px-4">
      <Card className="w-full max-w-md shadow-lg border-border">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-heading font-bold text-center">
            Recuperar Senha
          </CardTitle>
          <CardDescription className="text-center">
            Digite seu email para receber um link de redefinição
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isSuccess ? (
            <div className="text-center space-y-4 py-4">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                <Mail className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">Verifique seu email</h3>
                <p className="text-muted-foreground text-sm">
                  Enviamos um link de recuperação para o endereço fornecido. Por
                  favor, verifique sua caixa de entrada e spam.
                </p>
              </div>
              <Button
                variant="outline"
                className="w-full mt-4"
                onClick={() => setIsSuccess(false)}
              >
                Tentar outro email
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  {...register('email')}
                  className={errors.email ? 'border-destructive' : ''}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">
                    {errors.email.message}
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
                  'Enviar Link de Recuperação'
                )}
              </Button>
            </form>
          )}
        </CardContent>
        <CardFooter className="flex justify-center border-t pt-6">
          <Link
            to="/entrar"
            className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Voltar para Login
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
