import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Search,
  Users,
  MessageCircle,
  ArrowRight,
  Leaf,
  Feather,
  BookOpen,
  Check,
  Quote,
  Heart,
  Brain,
  Calendar,
  AlertCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { profileService } from '@/services/profileService'
import { Professional } from '@/stores/useProfessionalStore'
import { ProfessionalCard } from '@/components/ProfessionalCard'

export default function Index() {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    navigate(`/busca?q=${encodeURIComponent(searchTerm)}`)
  }

  return (
    <div className="flex flex-col w-full overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center bg-background overflow-hidden py-20">
        {/* Abstract Descending Organic Lines - Background */}
        <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none z-0">
          <img
            src="https://img.usecurling.com/i?q=abstract%20curved%20lines&shape=outline&color=orange"
            alt="Organic Lines"
            className="absolute -right-20 top-0 w-[800px] h-[800px] object-contain opacity-40 rotate-12"
          />
          <img
            src="https://img.usecurling.com/i?q=fluid%20lines&shape=outline&color=gray"
            alt="Fluid Lines"
            className="absolute -left-40 bottom-0 w-[600px] h-[600px] object-contain opacity-30 -rotate-45"
          />
        </div>

        {/* Minimalist Tree - Symbol of Growth and Structure */}
        <div className="absolute top-10 md:top-20 right-10 md:right-32 opacity-15 pointer-events-none z-0 hidden lg:block animate-float-slow">
          <img
            src="https://img.usecurling.com/i?q=minimalist%20tree&shape=outline&color=green"
            alt="Minimalist Tree"
            className="w-[400px] h-[400px] object-contain"
          />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 text-primary text-sm font-medium animate-fade-in-up">
              <Feather className="w-4 h-4" />
              <span>Acolhimento e Escuta</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-heading font-medium text-foreground tracking-tight leading-[1.1] animate-fade-in-up delay-100">
              Encontre o espaço para <br />
              <span className="text-primary italic">sua interioridade</span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground font-light max-w-2xl mx-auto leading-relaxed animate-fade-in-up delay-200">
              Conectando você a psicanalistas qualificados para uma jornada de
              palavras, significados e autoconhecimento.
            </p>

            <form
              onSubmit={handleSearch}
              className="w-full max-w-xl relative animate-fade-in-up delay-300 mt-8"
            >
              <div className="relative flex items-center group">
                <Search className="absolute left-5 w-5 h-5 text-muted-foreground transition-colors group-focus-within:text-primary" />
                <Input
                  type="text"
                  placeholder="Busque por nome, especialidade ou cidade..."
                  className="w-full h-16 pl-14 pr-16 rounded-full shadow-sm border-primary/20 bg-white/80 backdrop-blur-sm focus:border-primary focus:ring-primary/20 text-lg placeholder:text-muted-foreground/60 transition-all hover:border-primary/40"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button
                  type="submit"
                  size="icon"
                  className="absolute right-2 w-12 h-12 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-md transition-all hover:scale-105"
                >
                  <ArrowRight className="w-5 h-5" />
                  <span className="sr-only">Buscar</span>
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Stylized Roots - Connecting to the next section */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-5xl opacity-20 pointer-events-none z-0">
          <img
            src="https://img.usecurling.com/i?q=tree%20roots&shape=outline&color=black"
            alt="Stylized Roots"
            className="w-full h-[300px] object-cover object-top mask-image-gradient"
            style={{
              maskImage: 'linear-gradient(to bottom, black, transparent)',
              WebkitMaskImage: 'linear-gradient(to bottom, black, transparent)',
            }}
          />
        </div>
      </section>

      {/* NEW SECTION: Como funciona (About EscutaPSI) */}
      <section
        id="como-funciona"
        className="py-24 bg-white relative overflow-hidden"
      >
        <div className="container mx-auto px-4 relative z-10">
          {/* Section Header */}
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-heading font-medium text-foreground">
              Como funciona
            </h2>
            <div className="w-24 h-1 bg-secondary mx-auto rounded-full opacity-60"></div>
            <div className="max-w-3xl mx-auto mt-8 p-6 bg-muted/20 rounded-xl border border-muted/50">
              <h3 className="text-2xl font-heading font-bold text-primary mb-2">
                EscutaPSI
              </h3>
              <div className="flex gap-2 justify-center text-muted-foreground italic text-lg">
                <Quote className="w-5 h-5 shrink-0 rotate-180 opacity-50" />
                <p>
                  Toda vida importa. Sua história importa. Sempre há um caminho
                  possível.
                </p>
                <Quote className="w-5 h-5 shrink-0 opacity-50" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Quem Somos */}
            <div className="bg-background rounded-xl p-8 shadow-sm border border-border/50 hover:shadow-md transition-all duration-300">
              <div className="flex items-center gap-3 mb-4 text-primary">
                <Users className="w-6 h-6" />
                <h3 className="text-2xl font-heading font-bold">Quem Somos</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Acreditamos que cada pessoa carrega uma história única, marcada
                por afetos, desafios, descobertas e possibilidades. A EscutaPSI
                nasce com o propósito de oferecer um espaço seguro, ético e
                acolhedor, onde você possa falar livremente e ser escutado de
                forma profunda e sem julgamentos.
              </p>
            </div>

            {/* Nossa Abordagem */}
            <div className="bg-background rounded-xl p-8 shadow-sm border border-border/50 hover:shadow-md transition-all duration-300">
              <div className="flex items-center gap-3 mb-4 text-primary">
                <Leaf className="w-6 h-6" />
                <h3 className="text-2xl font-heading font-bold">
                  Nossa Abordagem
                </h3>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-4">
                A psicanálise é uma prática que valoriza a palavra, o silêncio e
                o tempo de cada sujeito. Por meio de uma escuta sensível,
                ajudamos você a:
              </p>
              <ul className="space-y-2 mb-6">
                {[
                  'Entrar em contato com conflitos internos;',
                  'Reconhecer padrões que se repetem;',
                  'Compreender emoções e escolhas;',
                  'Construir novos sentidos para a sua vida e sua história.',
                ].map((item, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-muted-foreground"
                  >
                    <Check className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="text-sm font-medium text-foreground bg-primary/5 p-3 rounded-lg border border-primary/10">
                Trabalhamos com responsabilidade clínica, sigilo absoluto e
                compromisso ético.
              </p>
            </div>

            {/* Como Podemos Ajudar */}
            <div className="bg-background rounded-xl p-8 shadow-sm border border-border/50 hover:shadow-md transition-all duration-300 md:col-span-2">
              <div className="flex items-center gap-3 mb-6 text-primary">
                <Brain className="w-6 h-6" />
                <h3 className="text-2xl font-heading font-bold">
                  Como Podemos Ajudar
                </h3>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Oferecemos suporte especializado para questões como:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {[
                  'Ansiedade e preocupação excessiva',
                  'Depressão e tristeza persistente',
                  'Burnout e esgotamento emocional',
                  'Luto e perdas afetivas',
                  'Melancolia, autopunição e sentimentos sem causa aparente',
                  'Distimia e tristeza moderada de longa duração',
                  'Conflitos afetivos, familiares e relacionais',
                  'Autoestima, inseguranças e dificuldades de autoconhecimento',
                  'Pensamentos suicidas e sofrimento intenso',
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-transparent hover:border-primary/20 transition-colors"
                  >
                    <div className="w-2 h-2 rounded-full bg-secondary shrink-0" />
                    <span className="text-sm text-foreground/80">{item}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2 text-sm text-amber-700 bg-amber-50 p-4 rounded-lg border border-amber-200">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span className="font-medium">
                  (Em caso de emergência, ligue 188 ou 190.)
                </span>
              </div>
            </div>

            {/* Nosso Compromisso */}
            <div className="bg-background rounded-xl p-8 shadow-sm border border-border/50 hover:shadow-md transition-all duration-300">
              <div className="flex items-center gap-3 mb-4 text-primary">
                <Heart className="w-6 h-6" />
                <h3 className="text-2xl font-heading font-bold">
                  Nosso Compromisso
                </h3>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Ajudar você a construir um espaço interno mais leve, consciente
                e possível. Acreditamos no cuidado contínuo, na escuta ética e
                no fortalecimento da autonomia para que cada pessoa se torne
                protagonista de sua própria história.
              </p>
            </div>

            {/* Agende seu atendimento */}
            <div className="bg-primary text-primary-foreground rounded-xl p-8 shadow-lg transform md:scale-105 border border-primary flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-4 text-secondary">
                <Calendar className="w-6 h-6 text-white" />
                <h3 className="text-2xl font-heading font-bold text-white">
                  Agende seu atendimento
                </h3>
              </div>
              <p className="text-primary-foreground/90 leading-relaxed mb-8 text-lg">
                Entre em contato para iniciar sua jornada de cuidado e
                transformação.
              </p>
              <Button
                variant="secondary"
                size="lg"
                className="w-full text-white hover:bg-white hover:text-secondary font-bold"
                onClick={() => navigate('/busca')}
              >
                Buscar Profissional
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* The Path of Listening (Formerly "Como funciona") */}
      <section
        id="caminho-da-escuta"
        className="py-24 bg-muted/30 relative overflow-hidden"
      >
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-heading text-foreground mb-6">
              O Caminho da Escuta
            </h2>
            <div className="w-24 h-1 bg-secondary mx-auto mb-6 rounded-full opacity-60"></div>
            <p className="text-xl text-muted-foreground font-light max-w-2xl mx-auto">
              Simplificamos o encontro para que a transferência possa acontecer.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto relative">
            {/* Connection Lines (Desktop) */}
            <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 border-t-2 border-dashed border-primary/20 z-0" />

            {/* Step 1 */}
            <div className="flex flex-col items-center text-center group relative z-10 bg-background p-4 rounded-xl">
              <div className="w-24 h-24 rounded-full bg-background border border-primary/20 flex items-center justify-center mb-8 text-primary transition-all duration-500 group-hover:bg-primary group-hover:text-white shadow-sm">
                <Search className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-heading mb-4 text-foreground">
                1. Busca
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Navegue pelos perfis e encontre o profissional cuja trajetória
                ressoa com a sua demanda.
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center group relative z-10 bg-background p-4 rounded-xl">
              <div className="w-24 h-24 rounded-full bg-background border border-primary/20 flex items-center justify-center mb-8 text-primary transition-all duration-500 group-hover:bg-primary group-hover:text-white shadow-sm">
                <Leaf className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-heading mb-4 text-foreground">
                2. Escolha
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Conheça a formação, especialidades e o estilo de trabalho de
                cada psicanalista.
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center group relative z-10 bg-background p-4 rounded-xl">
              <div className="w-24 h-24 rounded-full bg-background border border-primary/20 flex items-center justify-center mb-8 text-primary transition-all duration-500 group-hover:bg-primary group-hover:text-white shadow-sm">
                <MessageCircle className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-heading mb-4 text-foreground">
                3. Contato
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Inicie o diálogo diretamente. Agende sua sessão e comece seu
                processo de análise.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Professionals */}
      <section className="py-24 bg-white relative">
        {/* Decorative Background Element */}
        <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-muted/30 to-transparent opacity-50" />

        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-4xl font-heading text-foreground mb-4">
                Profissionais em Destaque
              </h2>
              <p className="text-lg text-muted-foreground font-light">
                Analistas selecionados que compõem nossa rede de escuta.
              </p>
            </div>
            <Button
              variant="outline"
              className="border-primary text-primary hover:bg-primary hover:text-white transition-all"
              onClick={() => navigate('/busca')}
            >
              Ver Todos <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : featuredProfessionals.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {featuredProfessionals.map((pro) => (
                <ProfessionalCard key={pro.id} professional={pro} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-muted/20 rounded-xl border border-dashed border-border">
              <p className="text-muted-foreground text-lg mb-6">
                Ainda não temos profissionais em destaque.
              </p>
              <Button onClick={() => navigate('/cadastro')}>
                Cadastre-se como Profissional
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action - For Professionals */}
      <section
        id="para-profissionais"
        className="py-24 bg-primary text-primary-foreground relative overflow-hidden"
      >
        <div className="absolute inset-0 opacity-10">
          <img
            src="https://img.usecurling.com/i?q=texture%20paper&color=white"
            alt="Texture"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-16 max-w-6xl mx-auto">
            <div className="md:w-1/2 space-y-8">
              <h2 className="text-4xl md:text-5xl font-heading font-medium leading-tight">
                Faça parte da nossa <br />
                <span className="text-secondary italic">Rede de Escuta</span>
              </h2>
              <p className="text-lg md:text-xl text-primary-foreground/90 font-light leading-relaxed">
                Oferecemos uma plataforma ética e elegante para que você possa
                apresentar sua prática clínica. Amplie seus horizontes e
                conecte-se com pacientes que buscam profundidade.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button
                  size="lg"
                  className="bg-secondary text-white hover:bg-secondary/90 font-medium px-8 h-14 rounded-full text-lg shadow-lg hover:shadow-xl transition-all"
                  onClick={() => navigate('/cadastro')}
                >
                  Cadastrar Perfil
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-white/10 h-14 rounded-full text-lg"
                  onClick={() => navigate('/sobre-nos')}
                >
                  Saiba Mais
                </Button>
              </div>
            </div>

            <div className="md:w-1/2 flex justify-center">
              <div className="relative w-full max-w-md aspect-square bg-white/5 rounded-full p-12 backdrop-blur-sm border border-white/10 shadow-2xl flex items-center justify-center animate-float">
                <div className="absolute inset-0 border border-white/20 rounded-full scale-90"></div>
                <div className="absolute inset-0 border border-white/10 rounded-full scale-110 opacity-50"></div>
                <Users className="w-32 h-32 text-secondary opacity-90 drop-shadow-2xl" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Library / Content Teaser */}
      <section className="py-24 bg-muted/10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-heading text-foreground mb-4">
              Palavras e Reflexões
            </h2>
            <p className="text-muted-foreground font-light">
              Recursos para aprofundar seu entendimento sobre a psicanálise.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <a
              href="#"
              className="group flex gap-6 p-8 rounded-xl bg-background border border-transparent hover:border-primary/20 transition-all duration-300 hover:shadow-md"
            >
              <div className="shrink-0">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  <BookOpen className="w-6 h-6" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-heading font-bold mb-2 group-hover:text-primary transition-colors">
                  O que é Psicanálise?
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Uma introdução aos conceitos fundamentais: inconsciente,
                  transferência e a cura pela fala. Entenda como essa prática
                  clínica pode transformar vidas.
                </p>
              </div>
            </a>

            <a
              href="#"
              className="group flex gap-6 p-8 rounded-xl bg-background border border-transparent hover:border-primary/20 transition-all duration-300 hover:shadow-md"
            >
              <div className="shrink-0">
                <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-white transition-colors">
                  <Feather className="w-6 h-6" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-heading font-bold mb-2 group-hover:text-secondary transition-colors">
                  Por que fazer análise?
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  A análise não é apenas para tratar sintomas, mas uma
                  investigação sobre o desejo e a própria história. Descubra os
                  benefícios do autoconhecimento.
                </p>
              </div>
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
