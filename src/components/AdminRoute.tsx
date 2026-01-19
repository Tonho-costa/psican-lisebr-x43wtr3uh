import { useEffect } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { useProfessionalStore } from '@/stores/useProfessionalStore'
import { Loader2 } from 'lucide-react'

export function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useAuth()
  const {
    currentProfessional,
    isLoading: profileLoading,
    fetchCurrentProfile,
  } = useProfessionalStore()
  const location = useLocation()

  useEffect(() => {
    if (user && !currentProfessional && !profileLoading) {
      fetchCurrentProfile(user.id)
    }
  }, [user, currentProfessional, profileLoading, fetchCurrentProfile])

  if (authLoading || (user && !currentProfessional && profileLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
          <p className="text-muted-foreground">Verificando permissões...</p>
        </div>
      </div>
    )
  }

  // Not logged in
  if (!user) {
    return <Navigate to="/entrar" state={{ from: location }} replace />
  }

  // Logged in but not admin
  if (currentProfessional && currentProfessional.role !== 'admin') {
    return <Navigate to="/" replace />
  }

  // Authorized
  return <>{children}</>
}
