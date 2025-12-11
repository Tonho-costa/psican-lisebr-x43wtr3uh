import { Facebook, Instagram, Linkedin } from 'lucide-react'
import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer id="footer" className="bg-muted py-12 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="font-heading font-bold text-xl">EscutaPSI</h3>
            <p className="text-muted-foreground text-sm">
              Conectando profissionais e pacientes em busca de bem-estar e
              autoconhecimento.
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-4 text-foreground">Links Úteis</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/sobre-nos" className="hover:text-primary">
                  Sobre Nós
                </Link>
              </li>
              <li>
                <Link to="/termos-de-uso" className="hover:text-primary">
                  Termos de Uso
                </Link>
              </li>
              <li>
                <Link
                  to="/politica-de-privacidade"
                  className="hover:text-primary"
                >
                  Política de Privacidade
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4 text-foreground">
              Para Profissionais
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/cadastro" className="hover:text-primary">
                  Cadastre-se
                </Link>
              </li>
              <li>
                <Link to="/entrar" className="hover:text-primary">
                  Área do Profissional
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-primary">
                  Ajuda
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4 text-foreground">Siga-nos</h4>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors hover:scale-110 transform duration-200"
              >
                <Facebook className="w-6 h-6" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors hover:scale-110 transform duration-200"
              >
                <Instagram className="w-6 h-6" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors hover:scale-110 transform duration-200"
              >
                <Linkedin className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} EscutaPSI. Todos os direitos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
