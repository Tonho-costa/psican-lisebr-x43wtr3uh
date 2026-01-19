import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProfessionalStore } from '@/stores/useProfessionalStore'
import { Loader2 } from 'lucide-react'

interface AdminRouteProps {
  children: React.ReactNode
}

export function AdminRoute({ children }: AdminRouteProps) {
  const { currentProfessional, isLoading, isAuthenticated } =
    useProfessionalStore()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        navigate('/entrar')
      } else if (currentProfessional?.role !== 'admin') {
        navigate('/')
      }
    }
  }, [isLoading, isAuthenticated, currentProfessional, navigate])

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!isAuthenticated || currentProfessional?.role !== 'admin') {
    return null
  }

  return <>{children}</>
}
