import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  LogOut,
  Shield,
  Menu,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from '@/components/ui/sheet'
import { useProfessionalStore } from '@/stores/useProfessionalStore'
import { cn } from '@/lib/utils'
import { AdminGuard } from '@/components/admin/AdminGuard'

export default function AdminLayout() {
  const { logout, currentProfessional } = useProfessionalStore()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = async () => {
    await logout()
    navigate('/entrar')
  }

  const navItems = [
    {
      label: 'Visão Geral',
      href: '/admin',
      icon: LayoutDashboard,
    },
    {
      label: 'Profissionais e Usuários',
      href: '/admin/profiles',
      icon: Users,
    },
    {
      label: 'Triagem de Candidatos',
      href: '/admin/triage',
      icon: ClipboardList,
    },
  ]

  const NavContent = () => (
    <div className="flex flex-col h-full py-6">
      <div className="px-6 mb-8 flex items-center gap-2 text-primary">
        <Shield className="w-6 h-6" />
        <span className="font-heading font-bold text-xl tracking-tight">
          Admin<span className="font-light">Panel</span>
        </span>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground',
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="px-6 mt-auto">
        <div className="flex items-center gap-3 mb-6 p-3 bg-muted/50 rounded-lg border border-border">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
            {currentProfessional?.name?.[0] || 'A'}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-medium truncate">
              {currentProfessional?.name}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              Administrador
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          className="w-full justify-start gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4" />
          Sair do Sistema
        </Button>
      </div>
    </div>
  )

  return (
    <AdminGuard>
      <div className="min-h-screen bg-muted/20 flex">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-64 bg-background border-r border-border fixed inset-y-0 z-50">
          <NavContent />
        </aside>

        {/* Mobile Sidebar */}
        <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-background border-b border-border h-16 flex items-center px-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-72">
              <SheetTitle className="sr-only">Menu Admin</SheetTitle>
              <NavContent />
            </SheetContent>
          </Sheet>
          <span className="ml-4 font-semibold text-lg">Administração</span>
        </div>

        {/* Main Content */}
        <main className="flex-1 lg:ml-64 p-4 lg:p-8 pt-20 lg:pt-8 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </AdminGuard>
  )
}
