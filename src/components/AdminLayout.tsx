import { useState } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  Settings,
  LogOut,
  Menu,
  Shield,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import { useProfessionalStore } from '@/stores/useProfessionalStore'

export function AdminLayout() {
  const { logout, currentProfessional } = useProfessionalStore()
  const navigate = useNavigate()
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  const navItems = [
    {
      label: 'Dashboard',
      href: '/admin',
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      label: 'Usuários',
      href: '/admin/usuarios',
      icon: <Users className="w-5 h-5" />,
    },
    {
      label: 'Configurações',
      href: '/admin/configuracoes',
      icon: <Settings className="w-5 h-5" />,
    },
  ]

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-slate-900 text-slate-100">
      <div className="p-6 border-b border-slate-800 flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
          <Shield className="w-6 h-6" />
        </div>
        <div>
          <h1 className="font-bold text-lg tracking-wide">Admin Panel</h1>
          <p className="text-xs text-slate-400">Gerenciamento</p>
        </div>
      </div>

      <nav className="flex-grow p-4 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            onClick={() => setIsMobileMenuOpen(false)}
            className={cn(
              'flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-200 group',
              location.pathname === item.href
                ? 'bg-primary text-primary-foreground font-medium shadow-md'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white',
            )}
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3 px-4 py-3 mb-2">
          <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold">
            {currentProfessional?.name?.[0] || 'A'}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-medium truncate">
              {currentProfessional?.name}
            </p>
            <p className="text-xs text-slate-500">Administrador</p>
          </div>
        </div>
        <Button
          variant="destructive"
          className="w-full gap-2 justify-start"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4" />
          Sair
        </Button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-50/50 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-72 shrink-0 border-r border-slate-200 shadow-sm fixed inset-y-0 z-40">
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-0 lg:pl-72 transition-all duration-300">
        <header className="h-16 bg-white border-b border-slate-200 px-4 flex items-center justify-between lg:justify-end sticky top-0 z-30 shadow-sm">
          <div className="lg:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="-ml-2">
                  <Menu className="w-6 h-6" />
                  <span className="sr-only">Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-72 border-r-0">
                <SheetTitle className="sr-only">Menu Admin</SheetTitle>
                <SidebarContent />
              </SheetContent>
            </Sheet>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link to="/" target="_blank">
                Ver Site
              </Link>
            </Button>
          </div>
        </header>

        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
