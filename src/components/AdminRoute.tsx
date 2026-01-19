import { ReactNode, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { useProfessionalStore } from '@/stores/useProfessionalStore'
import { toast } from 'sonner'

interface AdminRouteProps {
  children: ReactNode
}

export const AdminRoute = ({ children }: AdminRouteProps) => {
  const { user, loading: authLoading } = useAuth()
  const {
    currentProfessional,
    fetchCurrentProfile,
    isLoading: isProfileLoading,
  } = useProfessionalStore()

  useEffect(() => {
    if (user && !currentProfessional) {
      fetchCurrentProfile(user.id)
    }
  }, [user, currentProfessional, fetchCurrentProfile])

  // Show loading while checking auth or fetching profile
  if (authLoading || (user && !currentProfessional && isProfileLoading)) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  // Not authenticated -> Redirect to login
  if (!user) {
    return <Navigate to="/entrar" replace />
  }

  // Authenticated but not admin -> Redirect to home
  if (currentProfessional && currentProfessional.role !== 'admin') {
    toast.error('Acesso não autorizado', {
      description: 'Você não tem permissão para acessar esta área.',
    })
    return <Navigate to="/" replace />
  }

  // If we have a user but fetch failed or returned null (and not loading), it's safer to redirect
  if (!isProfileLoading && !currentProfessional) {
    return <Navigate to="/" replace />
  }

  // Access granted
  return <>{children}</>
}
