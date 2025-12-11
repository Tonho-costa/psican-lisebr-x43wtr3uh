import { Building2, Target, Heart, Users } from 'lucide-react'

export default function About() {
  return (
    <div className="flex flex-col min-h-[80vh]">
      {/* Hero Section */}
      <section className="bg-muted/30 py-16 md:py-24">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-6">
            Nossa Missão é Democratizar a Psicanálise
          </h1>
          <p className="text-xl text-muted-foreground">
            Conectamos profissionais qualificados a pessoas em busca de
            autoconhecimento, criando pontes para uma saúde mental mais
            acessível e humana.
          </p>
        </div>
      </section>

      {/* Values Grid */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="flex flex-col items-center text-center p-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Target className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold font-heading">Propósito</h3>
              <p className="text-muted-foreground">
                Facilitar o encontro entre analistas e analisandos, removendo
                barreiras geográficas e simplificando o processo de agendamento.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Heart className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold font-heading">Acolhimento</h3>
              <p className="text-muted-foreground">
                Valorizamos a escuta qualificada e o respeito à singularidade de
                cada indivíduo, princípios fundamentais da psicanálise.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold font-heading">Comunidade</h3>
              <p className="text-muted-foreground">
                Fomentamos uma rede de profissionais éticos e comprometidos com
                a qualidade clínica e o desenvolvimento contínuo.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12 max-w-5xl mx-auto">
            <div className="md:w-1/2">
              <div className="rounded-2xl overflow-hidden shadow-xl">
                <img
                  src="https://img.usecurling.com/p/600/400?q=meeting%20therapy&color=gray"
                  alt="Sessão de terapia"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="md:w-1/2 space-y-6">
              <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-wider">
                <Building2 className="w-4 h-4" />
                <span>Sobre a Plataforma</span>
              </div>
              <h2 className="text-3xl font-heading font-bold">
                Mais que um diretório, um espaço de encontro
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                A EscutaPSI nasceu da necessidade de organizar e facilitar o
                acesso a serviços psicanalíticos de qualidade no Brasil.
                Entendemos que encontrar o profissional certo é o primeiro passo
                fundamental para um tratamento eficaz.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Nossa plataforma oferece ferramentas para que profissionais
                possam expor suas especialidades, formação e abordagem de forma
                clara, permitindo que pacientes tomem decisões informadas e
                sintam-se seguros desde o primeiro contato.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
