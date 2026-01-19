import { useEffect, useState } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { useProfessionalStore } from '@/stores/useProfessionalStore'
import { profileService } from '@/services/profileService'
import { toast } from 'sonner'

export function AdminRoute() {
  const { user, loading: authLoading } = useAuth()
  const { currentProfessional, setCurrentProfessional } = useProfessionalStore()
  const [isChecking, setIsChecking] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const verifyRole = async () => {
      if (authLoading) return

      if (!user) {
        setIsChecking(false)
        return
      }

      // If we have the professional data and it matches current user
      if (currentProfessional && currentProfessional.id === user.id) {
        if (currentProfessional.role === 'admin') {
          setIsAdmin(true)
        }
        setIsChecking(false)
        return
      }

      // Fetch profile if not in store
      try {
        const { data, error } = await profileService.getProfile(user.id)
        if (data && !error) {
          setCurrentProfessional(data)
          if (data.role === 'admin') {
            setIsAdmin(true)
          }
        }
      } catch (error) {
        console.error('Error verifying admin role:', error)
      } finally {
        setIsChecking(false)
      }
    }

    verifyRole()
  }, [user, authLoading, currentProfessional, setCurrentProfessional])

  if (authLoading || isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/entrar" state={{ from: location }} replace />
  }

  if (!isAdmin) {
    toast.error('Acesso negado', {
      description:
        'Você não tem permissão de administrador para acessar esta página.',
    })
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
