import { ShieldAlert } from 'lucide-react'

export function Footer() {
  return (
    <footer
      id="footer"
      className="bg-primary py-12 border-t border-primary/20 text-primary-foreground"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="p-4 bg-white/10 rounded-full border border-white/10">
              <ShieldAlert className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-heading font-bold text-2xl uppercase tracking-wider text-white">
              Aviso de Segurança
            </h3>
          </div>

          <div className="space-y-6 text-lg text-primary-foreground/90 font-light leading-relaxed">
            <p className="font-medium text-xl text-white">
              Atenção: Este site não oferece atendimento imediato a pessoas em
              crise suicida.
            </p>

            <div className="space-y-2">
              <p>
                Em caso de crise, ligue para{' '}
                <span className="font-bold text-white">CVV – 188</span>.
              </p>
              <p>
                Em situações de emergência, procure o hospital mais próximo.
              </p>
            </div>

            <div className="pt-2">
              <p className="mb-4">
                Havendo risco de morte, ligue imediatamente para:
              </p>
              <ul className="space-y-2 font-bold text-white text-xl">
                <li>• SAMU — 192</li>
                <li>• Corpo de Bombeiros — 193</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 text-center text-xs text-primary-foreground/60 font-light">
          <p>
            &copy; {new Date().getFullYear()} EscutaPsi. Todos os direitos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
