import { useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useProfessionalStore } from '@/stores/useProfessionalStore'
import { useAuth } from '@/hooks/use-auth'
import { Loader2 } from 'lucide-react'

export default function AdminRoute() {
  const { user, loading: authLoading } = useAuth()
  const {
    currentProfessional,
    fetchCurrentProfile,
    isLoading: profileLoading,
  } = useProfessionalStore()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    const checkAdmin = async () => {
      if (user && !currentProfessional) {
        await fetchCurrentProfile(user.id)
      }
      setIsChecking(false)
    }

    if (!authLoading) {
      checkAdmin()
    }
  }, [user, currentProfessional, fetchCurrentProfile, authLoading])

  if (
    authLoading ||
    isChecking ||
    (user && !currentProfessional && profileLoading)
  ) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground animate-pulse">
            Verificando permissões...
          </p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/entrar" replace />
  }

  if (currentProfessional?.role !== 'admin') {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
