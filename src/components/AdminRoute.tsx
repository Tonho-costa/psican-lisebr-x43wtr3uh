import { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { useProfessionalStore } from '@/stores/useProfessionalStore'
import { useAuth } from '@/hooks/use-auth'
import { Loader2 } from 'lucide-react'

export function AdminRoute() {
  const {
    currentProfessional,
    fetchCurrentProfile,
    isLoading: isStoreLoading,
  } = useProfessionalStore()
  const { user, loading: isAuthLoading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (user?.id && !currentProfessional) {
      fetchCurrentProfile(user.id)
    }
  }, [user, currentProfessional, fetchCurrentProfile])

  useEffect(() => {
    // If auth is done and no user, or user is loaded but not admin, redirect
    if (!isAuthLoading && !isStoreLoading) {
      if (!user) {
        navigate('/entrar')
      } else if (currentProfessional && currentProfessional.role !== 'admin') {
        navigate('/')
      }
    }
  }, [user, currentProfessional, isAuthLoading, isStoreLoading, navigate])

  if (isAuthLoading || (user && !currentProfessional) || isStoreLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  // Double check before rendering outlet
  if (!currentProfessional || currentProfessional.role !== 'admin') {
    return null
  }

  return <Outlet />
}
