import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { LayoutDashboard, Users, FileText, Shield } from 'lucide-react'

export function AdminSidebar() {
  const location = useLocation()

  const links = [
    { href: '/admin', label: 'Visão Geral', icon: LayoutDashboard },
    { href: '/admin/profissionais', label: 'Profissionais', icon: Users },
    { href: '/admin/logs', label: 'Logs de Auditoria', icon: FileText },
  ]

  return (
    <div className="w-64 bg-card border-r border-border h-[calc(100vh-60px)] md:h-[calc(100vh-72px)] sticky top-[60px] md:top-[72px] hidden md:block p-4">
      <div className="flex items-center gap-2 mb-8 px-2 text-primary">
        <Shield className="w-6 h-6" />
        <span className="font-heading font-bold text-lg">Administração</span>
      </div>
      <nav className="space-y-1">
        {links.map((link) => {
          const Icon = link.icon
          const isActive =
            location.pathname === link.href ||
            (link.href !== '/admin' && location.pathname.startsWith(link.href))

          return (
            <Link
              key={link.href}
              to={link.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
              )}
            >
              <Icon className="w-4 h-4" />
              {link.label}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
