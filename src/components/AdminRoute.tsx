import { useEffect, useRef } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { useProfessionalStore } from '@/stores/useProfessionalStore'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface AdminRouteProps {
  children: React.ReactNode
}

export function AdminRoute({ children }: AdminRouteProps) {
  const { user, loading: authLoading } = useAuth()
  const {
    currentProfessional,
    fetchCurrentProfile,
    error: profileError,
    isLoading: profileLoading,
  } = useProfessionalStore()
  const location = useLocation()
  const hasNotified = useRef(false)
  const isFetchingRef = useRef(false)

  // Trigger profile fetch if user exists but profile is missing
  useEffect(() => {
    if (
      user &&
      !currentProfessional &&
      !profileError &&
      !isFetchingRef.current &&
      !profileLoading
    ) {
      isFetchingRef.current = true
      fetchCurrentProfile(user.id).finally(() => {
        isFetchingRef.current = false
      })
    }
  }, [
    user,
    currentProfessional,
    profileError,
    fetchCurrentProfile,
    profileLoading,
  ])

  // Reset notification ref on location change
  useEffect(() => {
    hasNotified.current = false
  }, [location.pathname])

  // Determine if we are in a loading state
  const isLoading =
    authLoading ||
    (!!user && !currentProfessional && !profileError) ||
    profileLoading

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-muted-foreground animate-pulse">
          Verificando permissões...
        </p>
      </div>
    )
  }

  // Case 1: Not Authenticated
  if (!user) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />
  }

  // Case 2: Authenticated but Profile Error (Fetch failed)
  if (profileError) {
    if (!hasNotified.current) {
      toast.error(
        'Erro ao verificar permissões de administrador. ' + profileError,
      )
      hasNotified.current = true
    }
    return <Navigate to="/" replace />
  }

  // Case 3: Authenticated but not Admin
  if (!currentProfessional || currentProfessional.role !== 'admin') {
    if (!hasNotified.current) {
      toast.error('Acesso não autorizado. Área restrita a administradores.')
      hasNotified.current = true
    }
    return <Navigate to="/" replace />
  }

  // Case 4: Authorized
  return <>{children}</>
}
