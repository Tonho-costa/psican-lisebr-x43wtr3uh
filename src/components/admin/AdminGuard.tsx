import { ReactNode, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProfessionalStore } from '@/stores/useProfessionalStore'
import { Loader2 } from 'lucide-react'

interface AdminGuardProps {
  children: ReactNode
}

export function AdminGuard({ children }: AdminGuardProps) {
  const { currentProfessional, isLoading, isAuthenticated } =
    useProfessionalStore()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        navigate('/entrar')
        return
      }

      // Check for admin role
      if (currentProfessional?.role !== 'admin') {
        navigate('/') // Redirect unauthorized users to home
      }
    }
  }, [isLoading, isAuthenticated, currentProfessional, navigate])

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  // Double check render safety
  if (!currentProfessional || currentProfessional.role !== 'admin') {
    return null
  }

  return <>{children}</>
}
