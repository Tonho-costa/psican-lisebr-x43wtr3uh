import { useEffect } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  FileText,
  LogOut,
  Home,
  Menu,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { useProfessionalStore } from '@/stores/useProfessionalStore'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Submissões', href: '/admin/submissoes', icon: ClipboardList },
  { label: 'Perfis', href: '/admin/perfis', icon: Users },
  { label: 'Logs do Sistema', href: '/admin/logs', icon: FileText },
]

export function AdminLayout() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { logout, currentProfessional } = useProfessionalStore()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  const handleLogout = async () => {
    await logout()
    navigate('/')
    toast.success('Logout realizado com sucesso.')
  }

  const NavContent = () => (
    <div className="flex flex-col h-full py-6">
      <div className="px-6 mb-8">
        <h1 className="text-2xl font-heading font-bold text-primary">
          Admin<span className="font-light italic">Panel</span>
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Gerenciamento EscutaPSI
        </p>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            className={cn(
              'flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-md transition-all',
              pathname === item.href
                ? 'bg-primary text-primary-foreground shadow-md'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground',
            )}
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="px-4 mt-auto space-y-2 border-t pt-6">
        <Link to="/">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-muted-foreground"
          >
            <Home className="w-5 h-5" />
            Voltar ao Site
          </Button>
        </Link>
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <LogOut className="w-5 h-5" />
          Sair
        </Button>
      </div>

      <div className="px-6 mt-6">
        <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg border border-border">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
            {currentProfessional?.name?.[0]}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-medium truncate">
              {currentProfessional?.name}
            </p>
            <p className="text-xs text-muted-foreground">Administrador</p>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex min-h-screen bg-muted/20">
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 bg-card border-r border-border fixed inset-y-0 z-30">
        <NavContent />
      </aside>

      {/* Main Content */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        <header className="md:hidden h-16 bg-card border-b border-border flex items-center justify-between px-4 sticky top-0 z-20">
          <h1 className="font-heading font-bold text-lg text-primary">
            Admin Panel
          </h1>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-64">
              <SheetHeader className="sr-only">
                <SheetTitle>Menu Admin</SheetTitle>
              </SheetHeader>
              <NavContent />
            </SheetContent>
          </Sheet>
        </header>

        <main className="flex-1 p-4 md:p-8 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
