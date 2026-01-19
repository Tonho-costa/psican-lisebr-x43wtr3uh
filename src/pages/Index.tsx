import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  Leaf,
  Feather,
  BookOpen,
  Check,
  Quote,
  MessageCircle,
  Brain,
  Ear,
  Users,
  AlertCircle,
  Heart,
  Sparkles,
  Activity,
  Shield,
  LifeBuoy,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { profileService } from '@/services/profileService'
import { Professional } from '@/stores/useProfessionalStore'
import { ProfessionalCard } from '@/components/ProfessionalCard'

export default function Index() {
  const navigate = useNavigate()
  const [featuredProfessionals, setFeaturedProfessionals] = useState<
    Professional[]
  >([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadFeatured = async () => {
      // Fetch only visible and featured professionals
      const { data } = await profileService.getFeaturedProfiles()
      setFeaturedProfessionals(data || [])
      setLoading(false)
    }
    loadFeatured()
  }, [])

  return (
    <div className="flex flex-col w-full overflow-x-hidden font-body text-foreground bg-background">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center bg-background overflow-hidden py-20">
        <div className="absolute top-0 right-0 w-full h-full opacity-5 pointer-events-none z-0">
          <img
            src="https://img.usecurling.com/i?q=abstract%20minimalist%20lines&shape=outline&color=gray"
            alt="Organic Lines"
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] object-contain opacity-40"
          />
        </div>

        <div className="container mx-auto px-4 relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-8 animate-fade-in-up">
            <h1 className="font-heading font-medium text-primary tracking-tight leading-[1] relative text-4xl">
              Escuta<span className="italic font-light">Psi</span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground font-light max-w-lg leading-relaxed font-heading italic">
              “Quando alguém te escuta, algo em você se reorganiza.”
            </p>

            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-10 h-14 text-lg shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 normal-case"
              onClick={() => navigate('/busca')}
            >
              Agendar Atendimento
            </Button>
          </div>

          <div className="hidden md:flex justify-center items-center animate-fade-in-up delay-200">
            <div className="relative w-[400px] h-[500px] bg-secondary/10 rounded-full blur-3xl absolute -z-10"></div>
            <img
              src="https://img.usecurling.com/i?q=serene%20face%20outline&shape=outline&color=gray"
              alt="Minimalist Illustration"
              className="w-[400px] h-[500px] object-contain opacity-80"
            />
          </div>
        </div>
      </section>

      {/* Quem Somos Section */}
      <section id="quem-somos" className="py-24 bg-white/50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-16 max-w-6xl mx-auto">
            <div className="md:w-1/2 relative">
              <div className="border border-border p-8 md:p-12 rounded-sm relative z-10 bg-background/80 backdrop-blur-sm">
                <h2 className="text-[28px] font-heading font-medium mb-6 text-primary">
                  Quem Somos
                </h2>
                <div className="w-16 h-0.5 bg-secondary/40 mb-8"></div>
                <p className="text-muted-foreground leading-relaxed text-base font-light">
                  EscutaPsi é uma clínica social que oferece atendimento
                  psicológico acessível, ético e humanizado. Acreditamos que
                  cada pessoa carrega uma história única, marcada por afetos,
                  escolhas, desafios e possibilidades. Nosso propósito é
                  oferecer um ambiente seguro e acolhedor — um espaço onde seja
                  possível falar livremente e ser escutado de forma profunda,
                  com respeito e sem julgamentos.
                </p>
                <div className="mt-6 flex items-center gap-2 text-secondary font-medium italic">
                  <Leaf className="w-5 h-5" />
                  <span>Acolhimento e Ética</span>
                </div>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <img
                src="https://img.usecurling.com/i?q=organic%20shapes%20lines&shape=outline&color=gray"
                alt="Illustration"
                className="w-full max-w-md object-contain opacity-70"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Nossa Abordagem Section */}
      <section id="abordagem" className="py-24 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-[28px] font-heading font-medium text-primary">
                Nossa Abordagem
              </h2>
              <div className="w-24 h-0.5 bg-secondary/40 mx-auto mt-4"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="prose prose-lg text-muted-foreground font-light">
                <p>
                  A psicanálise é uma prática que valoriza a palavra, o silêncio
                  e o tempo singular de cada sujeito. Por meio de uma escuta
                  sensível, buscamos ajudar você a:
                </p>
                <ul className="space-y-4 mt-6">
                  {[
                    'Entrar em contato com conflitos internos;',
                    'Reconhecer padrões que se repetem;',
                    'Compreender emoções e escolhas;',
                    'Construir novos sentidos para sua vida e sua história.',
                  ].map((item, index) => (
                    <li key={index} className="flex gap-3 items-start">
                      <div className="w-1.5 h-1.5 mt-2.5 rounded-full bg-primary shrink-0"></div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-background/50 p-8 rounded-xl border border-border/50 shadow-sm space-y-6">
                <div className="flex items-center gap-4 text-primary">
                  <Shield className="w-8 h-8" />
                  <h3 className="font-heading font-bold text-xl">
                    Prática Responsável
                  </h3>
                </div>
                <p className="text-muted-foreground font-light leading-relaxed">
                  Toda a prática é sustentada por responsabilidade clínica,
                  sigilo absoluto e compromisso ético.
                </p>
                <div className="grid grid-cols-3 gap-4 pt-4">
                  <div className="flex flex-col items-center gap-2 p-3 bg-white rounded border border-border/30 text-center">
                    <Ear className="w-5 h-5 text-secondary" />
                    <span className="text-xs text-muted-foreground">
                      Escuta
                    </span>
                  </div>
                  <div className="flex flex-col items-center gap-2 p-3 bg-white rounded border border-border/30 text-center">
                    <Brain className="w-5 h-5 text-secondary" />
                    <span className="text-xs text-muted-foreground">
                      Análise
                    </span>
                  </div>
                  <div className="flex flex-col items-center gap-2 p-3 bg-white rounded border border-border/30 text-center">
                    <Heart className="w-5 h-5 text-secondary" />
                    <span className="text-xs text-muted-foreground">
                      Acolher
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Como Podemos Ajudar Section */}
      <section id="como-ajudamos" className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-[28px] font-heading font-medium text-primary">
              Como Podemos Ajudar
            </h2>
            <p className="text-muted-foreground mt-4 font-light text-lg">
              Oferecemos suporte para questões como:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              {
                icon: <Feather className="w-5 h-5" />,
                text: 'Ansiedade e preocupação excessiva',
              },
              {
                icon: <CloudRain className="w-5 h-5" />,
                text: 'Depressão e tristeza persistente',
              },
              {
                icon: <BatteryLow className="w-5 h-5" />,
                text: 'Burnout e esgotamento emocional',
              },
              {
                icon: <HeartCrack className="w-5 h-5" />,
                text: 'Luto e perdas afetivas',
              },
              {
                icon: <CloudFog className="w-5 h-5" />,
                text: 'Melancolia e sentimentos sem causa aparente',
              },
              {
                icon: <Activity className="w-5 h-5" />,
                text: 'Distimia e tristeza contínua',
              },
              {
                icon: <Users className="w-5 h-5" />,
                text: 'Conflitos afetivos, familiares e relacionais',
              },
              {
                icon: <Sparkles className="w-5 h-5" />,
                text: 'Baixa autoestima, inseguranças e dificuldades de autoconhecimento',
              },
              {
                icon: <LifeBuoy className="w-5 h-5" />,
                text: 'Pensamentos suicidas e sofrimento intenso',
              },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-card border border-border/50 rounded-lg p-6 hover:shadow-md transition-all duration-300 flex items-start gap-4 group"
              >
                <div className="mt-1 text-primary group-hover:text-secondary transition-colors shrink-0">
                  {item.icon}
                </div>
                <p className="text-muted-foreground text-sm font-light leading-relaxed">
                  {item.text}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-2 text-sm text-secondary bg-secondary/10 px-6 py-3 rounded-full border border-secondary/20">
              <AlertCircle className="w-4 h-4" />
              <span>(Em caso de emergência, procure ajuda imediatamente.)</span>
            </div>
          </div>
        </div>
      </section>

      {/* Nosso Compromisso Section */}
      <section className="py-20 bg-muted/10">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <Quote className="w-8 h-8 text-primary/30 mx-auto mb-6 rotate-180" />
          <h2 className="text-2xl md:text-3xl font-body font-normal text-primary leading-tight mb-8">
            Sustentar uma escuta ética, responsável e atenta ao que emerge no
            percurso clínico. Nosso compromisso é ajudar você a construir um
            espaço interno mais leve, consciente e possível — fortalecendo
            autonomia, elaboração e presença na própria história.
          </h2>
          <div className="w-16 h-1 bg-primary mx-auto rounded-full opacity-60"></div>
        </div>
      </section>

      {/* Agende Seu Atendimento Section */}
      <section
        id="agende"
        className="py-24 bg-secondary/10 relative overflow-hidden"
      >
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col items-center text-center space-y-8 mb-16">
            <h2 className="text-[28px] md:text-4xl font-heading font-medium text-primary">
              Agende Seu Atendimento
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl font-light">
              Entre em contato e dê início à sua jornada de cuidado, escuta e
              transformação.
            </p>

            <Card className="w-full max-w-[340px] bg-background/60 backdrop-blur-md border-primary/20 shadow-md animate-fade-in-up">
              <CardHeader className="pb-2 pt-6">
                <CardTitle className="text-xl font-heading font-medium text-primary">
                  Valores de consultas
                </CardTitle>
                <CardDescription className="text-muted-foreground font-light">
                  Tempo de consulta 50 a 60 min.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center px-1">
                    <span className="text-muted-foreground font-light">
                      1 sessão
                    </span>
                    <span className="font-medium text-primary">R$60,00</span>
                  </div>
                  <div className="h-px bg-primary/10 w-full"></div>
                  <div className="flex justify-between items-center px-1">
                    <span className="text-muted-foreground font-light">
                      2 sessões
                    </span>
                    <span className="font-medium text-primary">R$110,00</span>
                  </div>
                  <div className="h-px bg-primary/10 w-full"></div>
                  <div className="flex justify-between items-center px-1">
                    <span className="text-muted-foreground font-light">
                      4 sessões
                    </span>
                    <span className="font-medium text-primary underline decoration-primary/30 underline-offset-4">
                      R$200,00
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-12 h-16 text-xl shadow-xl transition-transform hover:scale-105 normal-case"
              onClick={() => navigate('/busca')}
            >
              Entrar em Contato
            </Button>
          </div>

          <div className="mt-16">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-px bg-primary/20 flex-grow"></div>
              <span className="text-sm uppercase tracking-widest text-muted-foreground font-medium">
                Profissionais em Destaque
              </span>
              <div className="h-px bg-primary/20 flex-grow"></div>
            </div>

            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
              </div>
            ) : featuredProfessionals.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {featuredProfessionals.map((pro) => (
                  <ProfessionalCard
                    key={pro.id}
                    professional={pro}
                    className="bg-white border-white/50 shadow-sm hover:shadow-xl"
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-10 bg-white/50 rounded-xl border border-dashed border-primary/20">
                <p className="text-muted-foreground">
                  Ainda não temos profissionais em destaque.
                </p>
              </div>
            )}

            <div className="text-center mt-8">
              <Button
                variant="link"
                className="text-primary hover:text-primary/80 lowercase"
                onClick={() => navigate('/busca')}
              >
                Ver todos os profissionais{' '}
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* O que é Psicanálise / Por que fazer */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 max-w-6xl mx-auto">
            <div className="space-y-6">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
                <BookOpen className="w-6 h-6" />
              </div>
              <h2 className="text-[28px] font-heading font-medium text-primary">
                O que é Psicanálise?
              </h2>
              <p className="text-muted-foreground leading-relaxed text-base font-light">
                A psicanálise é uma prática clínica fundada na escuta e na
                investigação do inconsciente — lugar onde habitam desejos,
                conflitos, memórias e modos de existir que nem sempre
                reconhecemos de imediato. Ela compreende que aquilo que nos
                afeta hoje está ligado à nossa história e à forma singular como
                cada sujeito constrói sentido para o que vive. A psicanálise não
                oferece respostas prontas; ela acompanha cada pessoa em seu
                próprio processo de compreensão e transformação.
              </p>
            </div>

            <div className="space-y-6">
              <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center text-secondary mb-4">
                <Check className="w-6 h-6" />
              </div>
              <h2 className="text-[28px] font-heading font-medium text-primary">
                Por que Fazer Análise?
              </h2>
              <p className="text-muted-foreground leading-relaxed text-base font-light">
                Fazer análise é um gesto de cuidado consigo. É a oportunidade de
                compreender sentimentos, reconhecer padrões, elaborar dores e
                encontrar novas possibilidades para viver aquilo que se
                apresenta como difícil — ou simplesmente aprofundar o próprio
                conhecimento de si.
              </p>
              <p className="text-muted-foreground leading-relaxed text-base font-light">
                A transformação começa no instante em que você decide falar.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Rede de Escuta (Call to Professionals) */}
      <section id="rede-escuta" className="py-24 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12 max-w-5xl mx-auto bg-card p-10 md:p-16 rounded-2xl shadow-sm border border-border">
            <div className="md:w-1/2 space-y-6">
              <div className="inline-flex p-3 bg-primary/10 rounded-full text-primary mb-2">
                <MessageCircle className="w-8 h-8" />
              </div>
              <h2 className="text-[28px] font-heading font-medium text-primary">
                Faça Parte da Nossa Rede de Escuta
              </h2>
              <p className="text-muted-foreground font-light leading-relaxed">
                Se você deseja contribuir com essa transformação social,
                convidamos você a integrar a EscutaPsi. Participe de uma rede
                comprometida em ampliar o acesso ao cuidado clínico e em
                sustentar um trabalho ético, responsável e acolhedor. Venha
                fazer parte dessa iniciativa e ajudar a construir pontes para
                que mais pessoas encontrem um espaço de escuta e elaboração.
              </p>
            </div>
            <div className="md:w-1/2 flex flex-col items-center md:items-end gap-4">
              <Button
                size="lg"
                className="w-full md:w-auto bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8 h-14 text-lg normal-case"
                onClick={() => navigate('/cadastro')}
              >
                Cadastrar Perfil Profissional
              </Button>
              <Button
                variant="link"
                className="text-muted-foreground hover:text-primary lowercase"
                onClick={() => navigate('/sobre-nos')}
              >
                Saiba mais sobre a plataforma
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

// Additional icons for the new features list
function CloudRain(props: React.ComponentProps<'svg'>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
      <path d="M16 14v6" />
      <path d="M8 14v6" />
      <path d="M12 16v6" />
    </svg>
  )
}

function BatteryLow(props: React.ComponentProps<'svg'>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="16" height="10" x="2" y="7" rx="2" ry="2" />
      <line x1="22" x2="22" y1="11" y2="13" />
      <line x1="6" x2="6" y1="11" y2="13" />
    </svg>
  )
}

function HeartCrack(props: React.ComponentProps<'svg'>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 14c1.49-1.28 3.6-2.34 4.57-4.56.93-2.15.79-4.83-.52-6.49-1.63-2.07-5.37-2.33-7.53-.15L12 6l-3.52-3.2C6.31 1.07 2.57 1.33.94 3.4.78 3.58.63 3.77.5 3.97" />
      <path d="M11.66 18H5a2 2 0 0 1-2-2V9" />
      <path d="m3 9 2.45-1.45" />
      <path d="M12 6 6.5 12.3c-.66.75-.27 2.15.69 2.5l1.64.58c.86.3 1.25 1.32.78 2.03L9.5 18" />
      <path d="M22 22 2 2" />
    </svg>
  )
}

function CloudFog(props: React.ComponentProps<'svg'>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
      <path d="M16 17H7" />
      <path d="M17 21H9" />
    </svg>
  )
}
