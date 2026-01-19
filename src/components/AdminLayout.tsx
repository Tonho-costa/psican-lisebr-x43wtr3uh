import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  FileText,
  ClipboardList,
  LogOut,
  ArrowLeft,
  ShieldCheck,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useProfessionalStore } from '@/stores/useProfessionalStore'
import { cn } from '@/lib/utils'

export function AdminLayout() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { logout, currentProfessional } = useProfessionalStore()

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Triagem', href: '/admin/triagem', icon: ClipboardList },
    { name: 'Logs', href: '/admin/logs', icon: FileText },
  ]

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card hidden md:flex flex-col">
        <div className="p-6 border-b border-border">
          <Link
            to="/admin"
            className="flex items-center gap-2 text-primary font-heading font-bold text-xl"
          >
            <ShieldCheck className="w-6 h-6" />
            <span>
              Admin<span className="font-light italic">Panel</span>
            </span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-colors',
                pathname === item.href
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground',
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-border space-y-4">
          <Link to="/">
            <Button variant="outline" className="w-full gap-2 justify-start">
              <ArrowLeft className="w-4 h-4" /> Voltar ao Site
            </Button>
          </Link>
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">
              {currentProfessional?.name?.[0]}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium truncate">
                {currentProfessional?.name}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                Administrador
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            className="w-full gap-2 text-destructive hover:text-destructive hover:bg-destructive/10 justify-start"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4" /> Sair
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6 md:hidden">
          <span className="font-heading font-bold text-lg">Admin Panel</span>
          {/* Mobile menu trigger could go here */}
        </header>
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
