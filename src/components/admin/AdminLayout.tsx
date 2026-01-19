import { useState } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  LogOut,
  Menu,
  X,
  ShieldCheck,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useProfessionalStore } from '@/stores/useProfessionalStore'
import { cn } from '@/lib/utils'

export default function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { logout, currentProfessional } = useProfessionalStore()

  const handleLogout = async () => {
    await logout()
    navigate('/entrar')
  }

  const navItems = [
    {
      label: 'Visão Geral',
      href: '/admin',
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      label: 'Usuários',
      href: '/admin/usuarios',
      icon: <Users className="w-5 h-5" />,
    },
  ]

  return (
    <div className="min-h-screen bg-muted/10 flex flex-col md:flex-row font-body">
      {/* Mobile Header */}
      <div className="md:hidden bg-background border-b p-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2 font-heading font-bold text-primary">
          <ShieldCheck className="w-6 h-6" />
          <span>Admin Portal</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </Button>
      </div>

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 w-64 bg-card border-r border-border transform transition-transform duration-200 ease-in-out md:translate-x-0 md:static md:h-screen sticky top-0',
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="h-full flex flex-col">
          <div className="p-6 border-b border-border hidden md:flex items-center gap-2 font-heading font-bold text-xl text-primary">
            <ShieldCheck className="w-6 h-6" />
            <span>Admin Portal</span>
          </div>

          <div className="flex-1 py-6 px-4 space-y-2">
            {navItems.map((item) => {
              const isActive =
                location.pathname === item.href ||
                (item.href !== '/admin' &&
                  location.pathname.startsWith(item.href))
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setIsSidebarOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                  )}
                >
                  {item.icon}
                  {item.label}
                </Link>
              )
            })}
          </div>

          <div className="p-4 border-t border-border">
            <div className="mb-4 px-4">
              <p className="text-xs text-muted-foreground">Logado como</p>
              <p className="font-medium truncate">
                {currentProfessional?.name}
              </p>
            </div>
            <Button
              variant="outline"
              className="w-full justify-start gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4" />
              Sair
            </Button>
            <div className="mt-2 text-center">
              <Link to="/" className="text-xs text-primary hover:underline">
                Voltar ao site
              </Link>
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}
