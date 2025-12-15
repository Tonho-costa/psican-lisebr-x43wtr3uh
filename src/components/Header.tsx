import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Menu, UserCircle, Leaf } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useProfessionalStore } from '@/stores/useProfessionalStore'
import { cn } from '@/lib/utils'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from '@/components/ui/sheet'
import { toast } from 'sonner'

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { isAuthenticated, currentProfessional, logout } =
    useProfessionalStore()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = async () => {
    try {
      await logout()
      setIsMobileMenuOpen(false)
      navigate('/')
      toast.success('Você saiu com sucesso.')
    } catch (error) {
      console.error('Logout error:', error)
      toast.error('Erro ao sair.')
    }
  }

  const navLinks = [
    { name: 'Quem Somos', href: '/#quem-somos' },
    { name: 'Abordagem', href: '/#abordagem' },
    { name: 'Como Ajudamos', href: '/#como-ajudamos' },
    { name: 'Agende', href: '/#agende' },
    { name: 'Rede de Escuta', href: '/#rede-escuta' },
  ]

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    if (href.startsWith('/#') && location.pathname === '/') {
      e.preventDefault()
      const id = href.substring(2)
      const element = document.getElementById(id)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
      setIsMobileMenuOpen(false)
    }
  }

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-primary/10',
        isScrolled
          ? 'bg-background shadow-sm h-[60px] md:h-[72px]'
          : 'bg-background h-[60px] md:h-[72px]',
      )}
    >
      <div className="container mx-auto px-4 h-full flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
            <Leaf className="w-5 h-5" />
          </div>
          <span className="text-xl font-heading font-semibold text-primary tracking-wide">
            Escuta<span className="italic font-light">Psi</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="text-sm font-medium text-primary/80 hover:text-primary transition-colors relative after:content-[''] after:absolute after:left-0 after:bottom-[-4px] after:w-0 after:h-[1px] after:bg-primary after:transition-all hover:after:w-full lowercase"
            >
              {link.name}
            </a>
          ))}

          {isAuthenticated ? (
            <div className="flex items-center gap-4 ml-4 pl-4 border-l border-primary/20">
              <Link to="/painel/perfil">
                <Button
                  variant="ghost"
                  className="gap-2 text-primary/80 hover:text-primary lowercase"
                >
                  <UserCircle className="w-5 h-5" />
                  <span className="max-w-[100px] truncate">
                    {currentProfessional?.name}
                  </span>
                </Button>
              </Link>
              <Button
                variant="outline"
                onClick={handleLogout}
                className="text-xs border-primary/20 hover:bg-primary/5 hover:text-primary lowercase"
              >
                Sair
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-4 ml-4 pl-4 border-l border-primary/20">
              <Link to="/entrar">
                <Button
                  variant="ghost"
                  className="text-primary/80 hover:text-primary hover:bg-transparent lowercase"
                >
                  Entrar
                </Button>
              </Link>
              <Link to="/cadastro">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-6 shadow-sm lowercase">
                  Cadastre-se
                </Button>
              </Link>
            </div>
          )}
        </nav>

        {/* Mobile Menu */}
        <div className="lg:hidden">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-primary">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[300px] sm:w-[400px] bg-background border-l border-primary/10"
            >
              <SheetTitle className="sr-only">Menu de Navegação</SheetTitle>
              <div className="flex flex-col gap-8 mt-8">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    className="text-lg font-medium text-primary hover:text-primary/80 transition-colors lowercase"
                    onClick={(e) => handleNavClick(e, link.href)}
                  >
                    {link.name}
                  </a>
                ))}
                <div className="h-px bg-primary/10 my-2" />
                {isAuthenticated ? (
                  <>
                    <Link
                      to="/painel/perfil"
                      className="text-lg font-medium text-primary hover:text-primary/80 lowercase"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Meu Painel
                    </Link>
                    <Button
                      variant="outline"
                      onClick={handleLogout}
                      className="lowercase"
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
                      <Button variant="outline" className="w-full lowercase">
                        Entrar
                      </Button>
                    </Link>
                    <Link
                      to="/cadastro"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground lowercase">
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
