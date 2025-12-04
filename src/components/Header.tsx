import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, UserCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useProfessionalStore } from '@/stores/useProfessionalStore'
import { cn } from '@/lib/utils'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from '@/components/ui/sheet'

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const location = useLocation()
  const { isAuthenticated, currentProfessional, logout } =
    useProfessionalStore()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { name: 'Como Funciona', href: '/#como-funciona' },
    { name: 'Para Profissionais', href: '/#para-profissionais' },
    { name: 'Contato', href: '/#footer' },
  ]

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-white/90 backdrop-blur-md shadow-sm h-[60px] md:h-[72px]'
          : 'bg-transparent h-[60px] md:h-[72px]',
      )}
    >
      <div className="container mx-auto px-4 h-full flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-lg group-hover:scale-105 transition-transform">
            P
          </div>
          <span className="text-xl font-heading font-bold text-foreground">
            Psicanálise<span className="text-primary">BR</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-foreground hover:text-primary transition-colors relative after:content-[''] after:absolute after:left-0 after:bottom-[-4px] after:w-0 after:h-[2px] after:bg-primary after:transition-all hover:after:w-full"
            >
              {link.name}
            </a>
          ))}

          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <Link to="/painel/perfil">
                <Button variant="ghost" className="gap-2">
                  <UserCircle className="w-5 h-5" />
                  {currentProfessional?.name}
                </Button>
              </Link>
              <Button variant="outline" onClick={logout} className="text-xs">
                Sair
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/entrar">
                <Button
                  variant="ghost"
                  className="text-primary hover:text-primary/80 hover:bg-primary/10"
                >
                  Entrar
                </Button>
              </Link>
              <Link to="/cadastro">
                <Button className="bg-primary hover:bg-primary/90 text-white">
                  Cadastre-se
                </Button>
              </Link>
            </div>
          )}
        </nav>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <SheetTitle className="sr-only">Menu de Navegação</SheetTitle>
              <div className="flex flex-col gap-8 mt-8">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    className="text-lg font-medium text-foreground hover:text-primary transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.name}
                  </a>
                ))}
                <div className="h-px bg-border my-2" />
                {isAuthenticated ? (
                  <>
                    <Link
                      to="/painel/perfil"
                      className="text-lg font-medium text-foreground hover:text-primary"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Meu Painel
                    </Link>
                    <Button
                      variant="outline"
                      onClick={() => {
                        logout()
                        setIsMobileMenuOpen(false)
                      }}
                    >
                      Sair
                    </Button>
                  </>
                ) : (
                  <div className="flex flex-col gap-4">
                    <Link
                      to="/entrar"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Button variant="outline" className="w-full">
                        Entrar
                      </Button>
                    </Link>
                    <Link
                      to="/cadastro"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Button className="w-full bg-primary hover:bg-primary/90">
                        Cadastre-se
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
