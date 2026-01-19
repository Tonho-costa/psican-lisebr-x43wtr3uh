import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  MapPin,
  Video,
  Users,
  ArrowLeft,
  GraduationCap,
  Award,
  Clock,
  Mail,
  Share2,
  CheckCircle2,
  Calendar,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import { profileService } from '@/services/profileService'
import { Professional } from '@/stores/useProfessionalStore'
import { toast } from 'sonner'
import { FacebookIcon, InstagramIcon, WhatsAppIcon } from '@/components/Icons'

export default function Profile() {
  const { id } = useParams<{ id: string }>()
  const [professional, setProfessional] = useState<Professional | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadProfile() {
      if (!id) return
      setLoading(true)
      setError(null)
      try {
        const { data, error } = await profileService.getProfile(id)

        if (error) {
          setError('Não foi possível carregar o perfil.')
        } else {
          setProfessional(data)
        }
      } catch (err) {
        setError('Ocorreu um erro inesperado.')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadProfile()
  }, [id])

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    toast.success('Link copiado para a área de transferência!')
  }

  if (loading) {
    return (
      <div className="container py-10 space-y-8 animate-pulse max-w-6xl mx-auto">
        <div className="flex gap-4">
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid md:grid-cols-12 gap-8">
          <div className="md:col-span-4 lg:col-span-3 space-y-6">
            <Skeleton className="h-[400px] w-full rounded-xl" />
          </div>
          <div className="md:col-span-8 lg:col-span-9 space-y-4">
            <Skeleton className="h-40 w-full rounded-xl" />
            <Skeleton className="h-40 w-full rounded-xl" />
          </div>
        </div>
      </div>
    )
  }

  if (error || !professional) {
    return (
      <div className="container py-20 min-h-[60vh] flex flex-col items-center justify-center text-center space-y-6">
        <div className="w-24 h-24 bg-muted/50 rounded-full flex items-center justify-center animate-fade-in">
          <Users className="w-10 h-10 text-muted-foreground" />
        </div>
        <div className="animate-fade-in delay-100">
          <h2 className="text-2xl font-heading font-bold text-foreground">
            Profissional não encontrado
          </h2>
          <p className="text-muted-foreground mt-2 max-w-md mx-auto">
            O perfil que você procura não existe, foi removido ou está
            temporariamente indisponível.
          </p>
        </div>
        <Link to="/busca" className="animate-fade-in delay-200">
          <Button variant="default" size="lg" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Buscar outros profissionais
          </Button>
        </Link>
      </div>
    )
  }

  // Safe check for phone to avoid crash
  const rawPhone = professional.phone || ''
  const message = `Olá, ${professional.name || 'doutor(a)'}. Encontrei seu perfil na EscutaPSI e gostaria de mais informações sobre atendimento.`
  const whatsappUrl = `https://wa.me/${rawPhone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`
  const telUrl = `tel:${rawPhone.replace(/\D/g, '')}`

  return (
    <div className="container py-8 space-y-6 max-w-6xl animate-fade-in">
      {/* Navigation & Actions */}
      <div className="flex justify-between items-center">
        <Link to="/busca">
          <Button
            variant="ghost"
            className="pl-0 gap-2 hover:bg-transparent hover:text-primary transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Voltar para busca
          </Button>
        </Link>
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={handleShare}
        >
          <Share2 className="w-4 h-4" />
          Compartilhar
        </Button>
      </div>

      <div className="grid md:grid-cols-12 gap-8">
        {/* Sidebar Info */}
        <div className="md:col-span-4 lg:col-span-3 space-y-6">
          <Card className="border-border shadow-md overflow-hidden bg-card">
            <div className="h-28 bg-gradient-to-b from-primary/20 to-primary/5 w-full"></div>
            <CardContent className="pt-0 text-center -mt-14 space-y-5 pb-8 relative z-10">
              <div className="relative w-40 h-40 mx-auto rounded-full p-1.5 bg-background shadow-lg">
                <Avatar className="w-full h-full border-2 border-muted">
                  <AvatarImage
                    src={professional.photoUrl || undefined}
                    className="object-cover"
                    alt={professional.name}
                  />
                  <AvatarFallback className="text-4xl bg-muted text-muted-foreground font-heading">
                    {professional.name?.[0]?.toUpperCase() || '?'}
                  </AvatarFallback>
                </Avatar>
              </div>

              <div>
                <h1 className="text-2xl font-heading font-bold text-foreground leading-tight">
                  {professional.name}
                </h1>
                <p className="text-primary font-medium mt-1 text-lg">
                  {professional.occupation}
                </p>

                <div className="flex flex-col items-center gap-1 mt-3 text-muted-foreground text-sm">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-primary/70" />
                    <span>
                      {professional.city || 'Cidade'},{' '}
                      {professional.state || 'UF'}
                    </span>
                  </div>
                  {professional.age && professional.age > 0 && (
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-primary/70" />
                      <span>{professional.age} anos</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Social Media Links */}
              {(professional.instagram || professional.facebook) && (
                <div className="flex items-center justify-center gap-3 pt-1">
                  {professional.instagram && (
                    <a
                      href={
                        professional.instagram.startsWith('http')
                          ? professional.instagram
                          : `https://instagram.com/${professional.instagram.replace('@', '')}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-[#E1306C] transition-colors p-2 hover:bg-muted/50 rounded-full"
                      title="Instagram"
                    >
                      <InstagramIcon className="w-6 h-6" />
                    </a>
                  )}
                  {professional.facebook && (
                    <a
                      href={
                        professional.facebook.startsWith('http')
                          ? professional.facebook
                          : `https://facebook.com/${professional.facebook}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-[#1877F2] transition-colors p-2 hover:bg-muted/50 rounded-full"
                      title="Facebook"
                    >
                      <FacebookIcon className="w-6 h-6" />
                    </a>
                  )}
                </div>
              )}

              <Separator />

              <div className="pt-2 w-full space-y-3">
                {professional.phone && (
                  <Button
                    className="w-full gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white shadow-sm font-semibold h-12 text-base transition-transform hover:scale-[1.02]"
                    size="lg"
                    asChild
                  >
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <WhatsAppIcon className="w-5 h-5" />
                      Agendar no WhatsApp
                    </a>
                  </Button>
                )}

                {professional.email && (
                  <Button
                    variant="outline"
                    className="w-full gap-2 h-11"
                    asChild
                  >
                    <a href={`mailto:${professional.email}`}>
                      <Mail className="w-4 h-4" />
                      Enviar Email
                    </a>
                  </Button>
                )}

                {professional.phone && (
                  <div className="text-center pt-1">
                    <a
                      href={telUrl}
                      className="text-xs text-muted-foreground hover:text-primary underline decoration-dotted underline-offset-4"
                    >
                      Ligar para {professional.phone}
                    </a>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3 border-b bg-muted/20">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                Disponibilidade
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground font-medium">
                    Modalidade:
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {professional.serviceTypes?.includes('Online') && (
                    <Badge
                      variant="secondary"
                      className="gap-1.5 font-normal px-3 py-1 bg-green-100 text-green-800 hover:bg-green-200 border-transparent"
                    >
                      <Video className="w-3.5 h-3.5" /> Online
                    </Badge>
                  )}
                  {professional.serviceTypes?.includes('Presencial') && (
                    <Badge
                      variant="secondary"
                      className="gap-1.5 font-normal px-3 py-1 bg-blue-100 text-blue-800 hover:bg-blue-200 border-transparent"
                    >
                      <Users className="w-3.5 h-3.5" /> Presencial
                    </Badge>
                  )}
                </div>
              </div>

              {professional.availability && (
                <>
                  <Separator />
                  <div className="text-sm">
                    <span className="text-muted-foreground block mb-2 font-medium">
                      Horários de Atendimento:
                    </span>
                    <p className="font-medium text-foreground bg-muted/30 p-3 rounded-md border border-border/50">
                      {professional.availability}
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Main Content Info */}
        <div className="md:col-span-8 lg:col-span-9 space-y-8">
          {/* Bio Section */}
          <section className="space-y-4">
            <h2 className="text-2xl font-heading font-bold text-primary flex items-center gap-2">
              Sobre
              <div className="h-px bg-primary/20 flex-grow ml-4"></div>
            </h2>
            <Card className="border-border/60 shadow-sm bg-card/50">
              <CardContent className="pt-6">
                <p className="whitespace-pre-wrap leading-relaxed text-muted-foreground text-lg font-light text-justify">
                  {professional.bio ||
                    'Este profissional ainda não adicionou uma biografia.'}
                </p>
              </CardContent>
            </Card>
          </section>

          {/* Specialties Section */}
          <section className="space-y-4">
            <h2 className="text-xl font-heading font-bold text-primary flex items-center gap-2">
              Especialidades e Focos Clínicos
              <div className="h-px bg-primary/20 flex-grow ml-4"></div>
            </h2>
            <div className="bg-background rounded-lg border border-border p-6 shadow-sm">
              <div className="flex flex-wrap gap-2.5">
                {professional.specialties?.length > 0 ? (
                  professional.specialties.map((specialty) => (
                    <Badge
                      key={specialty}
                      variant="outline"
                      className="px-4 py-1.5 text-sm border-primary/20 text-foreground bg-primary/5 hover:bg-primary/10 transition-colors rounded-full"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 mr-2 text-primary" />
                      {specialty}
                    </Badge>
                  ))
                ) : (
                  <span className="text-muted-foreground text-sm italic">
                    Nenhuma especialidade listada.
                  </span>
                )}
              </div>
            </div>
          </section>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-border/60 shadow-sm h-full flex flex-col">
              <CardHeader className="bg-muted/10 border-b border-border/40 pb-4">
                <CardTitle className="text-lg font-heading flex items-center gap-2 text-primary">
                  <GraduationCap className="w-5 h-5" />
                  Formação Acadêmica
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 flex-grow">
                {professional.education && professional.education.length > 0 ? (
                  <ul className="space-y-4">
                    {professional.education.map((edu, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-3 text-sm text-muted-foreground group"
                      >
                        <div className="w-2 h-2 rounded-full bg-primary/40 mt-1.5 shrink-0 group-hover:bg-primary transition-colors" />
                        <span className="leading-relaxed">{edu}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground italic">
                    Informação não disponível.
                  </p>
                )}
              </CardContent>
            </Card>

            <Card className="border-border/60 shadow-sm h-full flex flex-col">
              <CardHeader className="bg-muted/10 border-b border-border/40 pb-4">
                <CardTitle className="text-lg font-heading flex items-center gap-2 text-primary">
                  <Award className="w-5 h-5" />
                  Cursos e Certificações
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 flex-grow">
                {professional.courses && professional.courses.length > 0 ? (
                  <ul className="space-y-4">
                    {professional.courses.map((course, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-3 text-sm text-muted-foreground group"
                      >
                        <div className="w-2 h-2 rounded-full bg-secondary/40 mt-1.5 shrink-0 group-hover:bg-secondary transition-colors" />
                        <span className="leading-relaxed">{course}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground italic">
                    Informação não disponível.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
