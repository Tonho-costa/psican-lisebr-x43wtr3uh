import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Search,
  CheckCircle2,
  Users,
  MessageCircle,
  BookOpen,
  FileQuestion,
  Phone,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useProfessionalStore } from '@/stores/useProfessionalStore'
import { ProfessionalCard } from '@/components/ProfessionalCard'

export default function Index() {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const { professionals } = useProfessionalStore()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    navigate(`/busca?q=${encodeURIComponent(searchTerm)}`)
  }

  const featuredProfessionals = professionals.slice(0, 3)

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 bg-gradient-to-b from-muted/50 to-background overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-heading font-bold text-foreground mb-6 animate-fade-in-up">
              Encontre o Apoio Psicanalítico Ideal para Você
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl animate-fade-in-up delay-100">
              Conectando você a profissionais qualificados e acolhedores em todo
              o Brasil. Inicie sua jornada de autoconhecimento hoje.
            </p>

            <form
              onSubmit={handleSearch}
              className="w-full max-w-2xl relative animate-fade-in-up delay-200"
            >
              <div className="relative flex items-center">
                <Search className="absolute left-4 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Buscar profissionais por cidade, especialidade ou nome..."
                  className="w-full h-14 pl-12 pr-36 rounded-xl shadow-elevation border-transparent focus:border-primary text-base"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button
                  type="submit"
                  className="absolute right-2 h-10 px-6 rounded-lg bg-primary hover:bg-primary/90 text-white font-semibold transition-all"
                >
                  Buscar
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Background Illustration Overlay */}
        <div className="absolute top-1/2 right-0 -translate-y-1/2 opacity-10 pointer-events-none hidden xl:block">
          <img
            src="https://img.usecurling.com/i?q=brain&color=green&shape=outline"
            alt="Abstract Brain"
            className="w-[600px] h-[600px]"
          />
        </div>
      </section>

      {/* How It Works */}
      <section id="como-funciona" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-heading font-bold text-foreground mb-4">
              Como Funciona
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Simplificamos o processo para que você possa focar no que
              realmente importa: o seu bem-estar.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl mx-auto">
            <div className="flex flex-col items-center text-center p-6 rounded-xl hover:bg-muted/30 transition-colors">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6 text-primary">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-3">1. Busque</h3>
              <p className="text-muted-foreground">
                Utilize nossos filtros para encontrar profissionais por
                especialidade, localização ou tipo de atendimento.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 rounded-xl hover:bg-muted/30 transition-colors">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6 text-primary">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-3">2. Conecte-se</h3>
              <p className="text-muted-foreground">
                Analise os perfis, leia sobre a formação e experiência, e
                escolha o profissional que mais lhe agrada.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 rounded-xl hover:bg-muted/30 transition-colors">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6 text-primary">
                <MessageCircle className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-3">3. Inicie</h3>
              <p className="text-muted-foreground">
                Entre em contato diretamente via WhatsApp para agendar sua
                primeira sessão.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Professionals */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold text-foreground mb-4">
              Profissionais em Destaque
            </h2>
            <p className="text-muted-foreground">
              Conheça alguns dos psicanalistas disponíveis em nossa plataforma.
            </p>
          </div>

          {featuredProfessionals.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {featuredProfessionals.map((pro) => (
                <ProfessionalCard key={pro.id} professional={pro} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg mb-6">
                Ainda não temos profissionais em destaque. Seja o primeiro!
              </p>
              <Button size="lg" onClick={() => navigate('/cadastro')}>
                Cadastre-se como Profissional
              </Button>
            </div>
          )}

          {featuredProfessionals.length > 0 && (
            <div className="text-center mt-12">
              <Button
                variant="outline"
                size="lg"
                className="border-primary text-primary hover:bg-primary hover:text-white"
                onClick={() => navigate('/busca')}
              >
                Ver Todos os Profissionais
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Useful Links Section */}
      <section id="links-uteis" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold text-foreground mb-4">
              Links Úteis
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Acesse conteúdos e recursos selecionados para apoiar sua busca por
              bem-estar.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <a
              href="#"
              className="flex flex-col items-center text-center p-8 rounded-xl bg-muted/20 hover:bg-muted/40 border border-transparent hover:border-primary/20 transition-all duration-300 group"
            >
              <div className="w-14 h-14 rounded-full bg-white shadow-sm flex items-center justify-center mb-4 text-primary group-hover:scale-110 transition-transform">
                <BookOpen className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold mb-2 text-foreground group-hover:text-primary transition-colors">
                O que é Psicanálise?
              </h3>
              <p className="text-sm text-muted-foreground">
                Descubra como essa abordagem terapêutica pode ajudar no seu
                autoconhecimento e saúde mental.
              </p>
            </a>

            <a
              href="#"
              className="flex flex-col items-center text-center p-8 rounded-xl bg-muted/20 hover:bg-muted/40 border border-transparent hover:border-primary/20 transition-all duration-300 group"
            >
              <div className="w-14 h-14 rounded-full bg-white shadow-sm flex items-center justify-center mb-4 text-primary group-hover:scale-110 transition-transform">
                <FileQuestion className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold mb-2 text-foreground group-hover:text-primary transition-colors">
                Dúvidas Frequentes
              </h3>
              <p className="text-sm text-muted-foreground">
                Entenda como funcionam as sessões, sigilo profissional e duração
                do tratamento.
              </p>
            </a>

            <a
              href="https://www.cvv.org.br"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center text-center p-8 rounded-xl bg-muted/20 hover:bg-muted/40 border border-transparent hover:border-primary/20 transition-all duration-300 group"
            >
              <div className="w-14 h-14 rounded-full bg-white shadow-sm flex items-center justify-center mb-4 text-destructive group-hover:scale-110 transition-transform">
                <Phone className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold mb-2 text-foreground group-hover:text-destructive transition-colors">
                Precisa de Ajuda Urgente?
              </h3>
              <p className="text-sm text-muted-foreground">
                O CVV realiza apoio emocional e prevenção do suicídio, atendendo
                gratuitamente pelo telefone 188.
              </p>
            </a>
          </div>
        </div>
      </section>

      {/* For Professionals CTA */}
      <section
        id="para-profissionais"
        className="py-20 bg-primary text-white overflow-hidden relative"
      >
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12 max-w-6xl mx-auto">
            <div className="md:w-1/2 space-y-6">
              <h2 className="text-3xl md:text-4xl font-heading font-bold">
                Seja Encontrado. Cadastre seu Perfil.
              </h2>
              <p className="text-primary-foreground/90 text-lg">
                Junte-se a nossa rede de profissionais e expanda sua clínica.
                Oferecemos uma plataforma dedicada e profissional para você se
                conectar com novos pacientes.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-accent" />
                  <span>Perfil personalizado com foto e biografia</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-accent" />
                  <span>Divulgação de especialidades e formação</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-accent" />
                  <span>Contato direto via WhatsApp sem intermediários</span>
                </li>
              </ul>
              <Button
                size="lg"
                className="bg-white text-primary hover:bg-accent hover:text-primary font-bold mt-4"
                onClick={() => navigate('/cadastro')}
              >
                Cadastre-se Agora
              </Button>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="relative w-80 h-80 md:w-96 md:h-96 bg-white/10 rounded-full p-8 backdrop-blur-sm border border-white/20 shadow-2xl flex items-center justify-center animate-float">
                <img
                  src="https://img.usecurling.com/i?q=psychology&color=white&shape=lineal-color"
                  alt="Psychology Symbol"
                  className="w-48 h-48 opacity-90 drop-shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
