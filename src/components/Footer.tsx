import { Facebook, Instagram, Linkedin, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer
      id="footer"
      className="bg-primary py-12 border-t border-primary/20 text-primary-foreground"
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          <div className="space-y-4">
            <h3 className="font-heading font-bold text-xl text-primary-foreground">
              EscutaPsi
            </h3>
            <p className="text-primary-foreground/80 text-sm font-light leading-relaxed">
              Uma plataforma dedicada a conectar psicanalistas e pacientes
              através da escuta e do cuidado ético.
            </p>
          </div>

          <div>
            <h4 className="font-heading font-bold mb-4 text-primary-foreground text-sm uppercase tracking-wider">
              Links Úteis
            </h4>
            <ul className="space-y-2 text-sm text-primary-foreground/80 font-light">
              <li>
                <Link
                  to="/sobre-nos"
                  className="hover:text-white transition-colors"
                >
                  Sobre Nós
                </Link>
              </li>
              <li>
                <Link
                  to="/termos-de-uso"
                  className="hover:text-white transition-colors"
                >
                  Termos de Uso
                </Link>
              </li>
              <li>
                <Link
                  to="/politica-de-privacidade"
                  className="hover:text-white transition-colors"
                >
                  Política de Privacidade
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-bold mb-4 text-primary-foreground text-sm uppercase tracking-wider">
              Para Profissionais
            </h4>
            <ul className="space-y-2 text-sm text-primary-foreground/80 font-light">
              <li>
                <Link
                  to="/cadastro"
                  className="hover:text-white transition-colors"
                >
                  Cadastre-se
                </Link>
              </li>
              <li>
                <Link
                  to="/entrar"
                  className="hover:text-white transition-colors"
                >
                  Área do Profissional
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-white transition-colors">
                  Central de Ajuda
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-bold mb-4 text-primary-foreground text-sm uppercase tracking-wider">
              Contato & Social
            </h4>
            <div className="flex space-x-4 mb-6">
              <a
                href="#"
                className="text-primary-foreground/70 hover:text-white transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-primary-foreground/70 hover:text-white transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-primary-foreground/70 hover:text-white transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
            <div className="flex items-center gap-2 text-xs text-primary-foreground/70 bg-white/10 p-2 rounded border border-white/10">
              <ShieldCheck className="w-4 h-4 text-primary-foreground" />
              <span>Ambiente seguro e verificado.</span>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 mt-12 pt-8 text-center text-xs text-primary-foreground/60 font-light">
          <p>
            &copy; {new Date().getFullYear()} EscutaPsi. Todos os direitos
            reservados.
          </p>
          <div className="mt-2 text-[10px] opacity-70 max-w-2xl mx-auto">
            Aviso de Segurança: Este site não oferece tratamento para situações
            de emergência. Em caso de crise suicida, ligue 188 (CVV) ou procure
            o hospital mais próximo.
          </div>
        </div>
      </div>
    </footer>
  )
}
