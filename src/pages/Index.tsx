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
  Lightbulb,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { profileService } from '@/services/profileService'
import { Professional } from '@/stores/useProfessionalStore'
import { ProfessionalCard } from '@/components/ProfessionalCard'
import { Separator } from '@/components/ui/separator'

export default function Index() {
  const navigate = useNavigate()
  const [featuredProfessionals, setFeaturedProfessionals] = useState<
    Professional[]
  >([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadFeatured = async () => {
      let { data } = await profileService.getFeaturedProfiles()
      if (!data || data.length === 0) {
        const { data: allData } = await profileService.getAllProfiles()
        if (allData) {
          data = allData.slice(0, 3)
        }
      }
      setFeaturedProfessionals(data || [])
      setLoading(false)
    }
    loadFeatured()
  }, [])

  return (
    <div className="flex flex-col w-full overflow-x-hidden font-body text-graphite bg-ice">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center bg-gradient-to-b from-ice to-white overflow-hidden py-20">
        <div className="absolute top-0 right-0 w-full h-full opacity-5 pointer-events-none z-0">
          <img
            src="https://img.usecurling.com/i?q=abstract%20minimalist%20lines&shape=outline&color=gray"
            alt="Organic Lines"
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] object-contain opacity-40"
          />
        </div>

        <div className="container mx-auto px-4 relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-8 animate-fade-in-up">
            <h1 className="text-6xl md:text-8xl font-heading font-medium text-graphite tracking-tight leading-[1] relative">
              Escuta<span className="text-primary italic">Psi</span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground font-light max-w-lg leading-relaxed font-serif italic">
              "Quando alguém te escuta, algo em você se reorganiza."
            </p>

            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-white rounded-full px-10 h-14 text-lg shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
              onClick={() => navigate('/busca')}
            >
              Agendar Atendimento
            </Button>
          </div>

          <div className="hidden md:flex justify-center items-center animate-fade-in-up delay-200">
            <div className="relative w-[400px] h-[500px] bg-moss/20 rounded-full blur-3xl absolute -z-10"></div>
            <img
              src="https://img.usecurling.com/i?q=serene%20face%20outline&shape=outline&color=gray"
              alt="Minimalist Illustration"
              className="w-[400px] h-[500px] object-contain opacity-80"
            />
          </div>
        </div>
      </section>

      {/* Quem Somos Section */}
      <section id="quem-somos" className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-16 max-w-6xl mx-auto">
            <div className="md:w-1/2 relative">
              <div className="border border-[#DDE5E5] p-8 md:p-12 rounded-sm relative z-10 bg-white/80 backdrop-blur-sm">
                <h2 className="text-4xl font-heading font-medium mb-6 text-graphite">
                  Quem Somos
                </h2>
                <div className="w-16 h-0.5 bg-primary/40 mb-8"></div>
                <p className="text-muted-foreground leading-relaxed text-lg font-light">
                  A EscutaPsi nasce do desejo de criar pontes. Somos um coletivo
                  dedicado à psicanálise e à saúde mental, acreditando que a
                  fala tem poder curativo. Oferecemos um espaço seguro onde sua
                  história é recebida com ética e profundidade.
                </p>
                <div className="mt-6 flex items-center gap-2 text-primary font-medium italic">
                  <Leaf className="w-5 h-5" />
                  <span>Acolhimento e Ética</span>
                </div>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <img
                src="https://img.usecurling.com/i?q=organic%20shapes%20lines&shape=outline&color=green"
                alt="Illustration"
                className="w-full max-w-md object-contain opacity-70"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Nossa Abordagem Section */}
      <section id="abordagem" className="py-24 bg-sand/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-heading font-medium text-graphite">
                Nossa Abordagem
              </h2>
              <div className="w-24 h-0.5 bg-primary/40 mx-auto mt-4"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="prose prose-lg text-muted-foreground">
                <p>
                  A psicanálise é uma prática clínica que aposta na
                  singularidade de cada sujeito. Não buscamos apenas eliminar
                  sintomas, mas compreender suas raízes na história de vida de
                  cada um.
                </p>
                <p>
                  Trabalhamos com o tempo de cada pessoa, respeitando seus
                  silêncios e suas palavras, em um processo de construção
                  conjunta.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-white border border-sand flex items-center justify-center text-primary shrink-0">
                    <Ear className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-xl mb-2">
                      Escuta Qualificada
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      Atenção flutuante que capta o não-dito e os sentidos
                      ocultos da fala.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-white border border-sand flex items-center justify-center text-primary shrink-0">
                    <Brain className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-xl mb-2">
                      Inconsciente
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      Investigação dos processos psíquicos que escapam à
                      consciência.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-white border border-sand flex items-center justify-center text-primary shrink-0">
                    <Heart className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-xl mb-2">
                      Transferência
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      O vínculo de confiança que possibilita o trabalho
                      analítico.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Como Podemos Ajudar Section */}
      <section id="como-ajudamos" className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-heading font-medium text-graphite">
              Como Podemos Ajudar
            </h2>
            <p className="text-muted-foreground mt-4 font-light">
              Suporte especializado para diversas questões do sofrimento humano.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: <Feather className="w-8 h-8" />,
                title: 'Angústia e Ansiedade',
                desc: 'Espaço para elaborar medos, preocupações excessivas e sensações de desamparo.',
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: 'Conflitos Relacionais',
                desc: 'Compreensão de padrões repetitivos em relacionamentos familiares e amorosos.',
              },
              {
                icon: <Lightbulb className="w-8 h-8" />,
                title: 'Autoconhecimento',
                desc: 'Uma jornada para descobrir desejos próprios e construir novos caminhos de vida.',
              },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-white border border-gray-100 rounded-xl p-8 hover:shadow-lg transition-all duration-300 flex flex-col items-center text-center group"
              >
                <div className="mb-6 text-primary/80 group-hover:text-primary transition-colors">
                  {item.icon}
                </div>
                <h3 className="text-xl font-heading font-bold mb-4">
                  {item.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-2 text-sm text-amber-700 bg-amber-50 px-4 py-2 rounded-full border border-amber-100">
              <AlertCircle className="w-4 h-4" />
              <span>
                Em caso de emergência, procure ajuda imediatamente. Ligue 188.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Nosso Compromisso Section */}
      <section className="py-20 bg-ice">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <Quote className="w-8 h-8 text-primary/30 mx-auto mb-6 rotate-180" />
          <h2 className="text-3xl md:text-5xl font-heading font-medium text-graphite leading-tight mb-8">
            "Nosso compromisso é com a ética do desejo e a dignidade de cada
            sujeito que nos procura."
          </h2>
          <div className="w-16 h-1 bg-primary mx-auto rounded-full opacity-60"></div>
        </div>
      </section>

      {/* Agende Seu Atendimento Section (Includes Featured List functionality) */}
      <section
        id="agende"
        className="py-24 bg-moss/30 relative overflow-hidden"
      >
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col items-center text-center space-y-8 mb-16">
            <h2 className="text-4xl md:text-5xl font-heading font-medium text-graphite">
              Agende Seu Atendimento
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl font-light">
              Dê o primeiro passo. Encontre o profissional ideal para sua
              jornada.
            </p>
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-white rounded-full px-12 h-16 text-xl shadow-xl transition-transform hover:scale-105"
              onClick={() => navigate('/busca')}
            >
              Entrar em Contato
            </Button>
          </div>

          {/* Featured Professionals - Kept for functionality */}
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
                className="text-primary hover:text-primary/80"
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
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 max-w-6xl mx-auto">
            <div className="space-y-6">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
                <BookOpen className="w-6 h-6" />
              </div>
              <h2 className="text-3xl font-heading font-medium">
                O que é Psicanálise?
              </h2>
              <p className="text-muted-foreground leading-relaxed text-lg">
                Criada por Sigmund Freud, a psicanálise é um método de
                investigação da mente humana e de tratamento dos sofrimentos
                psíquicos. Ela parte do princípio de que muitos dos nossos
                comportamentos e sentimentos são determinados por processos
                inconscientes.
              </p>
              <p className="text-muted-foreground leading-relaxed text-lg">
                Através da "cura pela fala", o analista ajuda o paciente a
                trazer à tona esses conteúdos, permitindo novas formas de lidar
                com o sofrimento.
              </p>
            </div>

            <div className="space-y-6">
              <div className="w-12 h-12 bg-sand rounded-full flex items-center justify-center text-graphite mb-4">
                <Check className="w-6 h-6" />
              </div>
              <h2 className="text-3xl font-heading font-medium">
                Por que fazer Análise?
              </h2>
              <ul className="space-y-4">
                {[
                  'Para lidar melhor com a angústia e sintomas persistentes.',
                  'Para entender repetições em sua vida pessoal e profissional.',
                  'Para fortalecer a autonomia diante das próprias escolhas.',
                  'Para transformar a relação consigo mesmo e com os outros.',
                ].map((item, idx) => (
                  <li
                    key={idx}
                    className="flex gap-4 items-start text-muted-foreground text-lg"
                  >
                    <span className="w-2 h-2 mt-2.5 rounded-full bg-primary shrink-0"></span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Rede de Escuta (Call to Professionals) */}
      <section id="rede-escuta" className="py-24 bg-sand/40">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12 max-w-5xl mx-auto bg-white p-10 md:p-16 rounded-2xl shadow-sm border border-sand">
            <div className="md:w-1/2 space-y-6">
              <div className="inline-flex p-3 bg-primary/10 rounded-full text-primary mb-2">
                <MessageCircle className="w-8 h-8" />
              </div>
              <h2 className="text-4xl font-heading font-medium text-graphite">
                Faça Parte da Nossa Rede de Escuta
              </h2>
              <p className="text-xl font-serif italic text-muted-foreground">
                "Se você é psicanalista, junte-se à nossa rede de escuta."
              </p>
              <p className="text-muted-foreground font-light">
                Oferecemos uma plataforma elegante e ética para você divulgar
                seu trabalho e conectar-se com novos pacientes.
              </p>
            </div>
            <div className="md:w-1/2 flex flex-col items-center md:items-end gap-4">
              <Button
                size="lg"
                className="w-full md:w-auto bg-primary hover:bg-primary/90 text-white rounded-full px-8 h-14 text-lg"
                onClick={() => navigate('/cadastro')}
              >
                Cadastrar Perfil Profissional
              </Button>
              <Button
                variant="link"
                className="text-muted-foreground hover:text-primary"
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
