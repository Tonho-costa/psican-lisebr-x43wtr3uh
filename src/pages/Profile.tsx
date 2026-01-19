import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  MapPin,
  Video,
  Users,
  Phone,
  ArrowLeft,
  GraduationCap,
  Award,
  Clock,
  Mail,
  Share2,
  CheckCircle2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import { profileService } from '@/services/profileService'
import { Professional } from '@/stores/useProfessionalStore'
import { toast } from 'sonner'

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
      <div className="container py-10 space-y-8 animate-pulse">
        <div className="flex gap-4">
          <Skeleton className="h-10 w-24" />
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <Skeleton className="h-[400px] md:col-span-1 rounded-xl" />
          <div className="md:col-span-2 space-y-4">
            <Skeleton className="h-40 w-full rounded-xl" />
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
        <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center">
          <Users className="w-10 h-10 text-muted-foreground" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            Profissional não encontrado
          </h2>
          <p className="text-muted-foreground mt-2">
            O perfil que você procura não existe ou foi removido.
          </p>
        </div>
        <Link to="/busca">
          <Button variant="default">Buscar outros profissionais</Button>
        </Link>
      </div>
    )
  }

  // Safe check for phone to avoid crash
  const rawPhone = professional.phone || ''
  const message = `Olá, ${professional.name || 'doutor(a)'}. Encontrei seu perfil na EscutaPSI e gostaria de mais informações sobre atendimento.`
  const whatsappUrl = `https://wa.me/${rawPhone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`

  return (
    <div className="container py-8 space-y-6 max-w-6xl">
      <div className="flex justify-between items-center">
        <Link to="/busca">
          <Button
            variant="ghost"
            className="pl-0 gap-2 hover:bg-transparent hover:text-primary"
          >
            <ArrowLeft className="w-4 h-4" /> Voltar para busca
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
          <Card className="border-border shadow-md overflow-hidden">
            <div className="h-24 bg-primary/10 w-full"></div>
            <CardContent className="pt-0 text-center -mt-12 space-y-4 pb-8">
              <div className="relative w-36 h-36 mx-auto rounded-full p-1 bg-background shadow-sm">
                <Avatar className="w-full h-full border-2 border-muted">
                  <AvatarImage
                    src={professional.photoUrl || undefined}
                    className="object-cover"
                    alt={professional.name}
                  />
                  <AvatarFallback className="text-3xl bg-muted text-muted-foreground">
                    {professional.name?.[0] || '?'}
                  </AvatarFallback>
                </Avatar>
              </div>

              <div>
                <h1 className="text-xl font-heading font-bold text-foreground">
                  {professional.name}
                </h1>
                <p className="text-primary font-medium mt-1">
                  {professional.occupation}
                </p>
                <div className="flex items-center justify-center gap-1 mt-2 text-muted-foreground text-sm">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>
                    {professional.city || 'Cidade'},{' '}
                    {professional.state || 'UF'}
                  </span>
                </div>
              </div>

              <div className="pt-2 w-full space-y-3">
                {professional.phone && (
                  <Button
                    className="w-full gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white shadow-sm font-semibold"
                    size="lg"
                    asChild
                  >
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Phone className="w-4 h-4" />
                      WhatsApp
                    </a>
                  </Button>
                )}
                {professional.email && (
                  <Button variant="outline" className="w-full gap-2" asChild>
                    <a href={`mailto:${professional.email}`}>
                      <Mail className="w-4 h-4" />
                      Enviar Email
                    </a>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                Disponibilidade
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Modalidade:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {professional.serviceTypes?.includes('Online') && (
                    <Badge variant="secondary" className="gap-1 font-normal">
                      <Video className="w-3 h-3" /> Online
                    </Badge>
                  )}
                  {professional.serviceTypes?.includes('Presencial') && (
                    <Badge variant="secondary" className="gap-1 font-normal">
                      <Users className="w-3 h-3" /> Presencial
                    </Badge>
                  )}
                </div>
              </div>

              {professional.availability && (
                <>
                  <Separator />
                  <div className="text-sm">
                    <span className="text-muted-foreground block mb-1">
                      Horários:
                    </span>
                    <p className="font-medium text-foreground">
                      {professional.availability}
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Main Content Info */}
        <div className="md:col-span-8 lg:col-span-9 space-y-6">
          <Card className="border-border shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl font-heading">Sobre</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap leading-relaxed text-muted-foreground text-lg font-light">
                {professional.bio ||
                  'Este profissional ainda não adicionou uma biografia.'}
              </p>
            </CardContent>
          </Card>

          <Card className="border-border shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl font-heading">
                Especialidades e Focos Clínicos
              </CardTitle>
              <CardDescription>
                Áreas de atuação e temas de trabalho
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {professional.specialties?.length > 0 ? (
                  professional.specialties.map((specialty) => (
                    <Badge
                      key={specialty}
                      variant="outline"
                      className="px-3 py-1 text-sm border-primary/20 text-foreground bg-primary/5 hover:bg-primary/10 transition-colors"
                    >
                      <CheckCircle2 className="w-3 h-3 mr-1.5 text-primary" />
                      {specialty}
                    </Badge>
                  ))
                ) : (
                  <span className="text-muted-foreground text-sm italic">
                    Nenhuma especialidade listada.
                  </span>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-border shadow-sm h-full">
              <CardHeader>
                <CardTitle className="text-lg font-heading flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-primary" />
                  Formação Acadêmica
                </CardTitle>
              </CardHeader>
              <CardContent>
                {professional.education && professional.education.length > 0 ? (
                  <ul className="space-y-3">
                    {professional.education.map((edu, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-sm text-muted-foreground"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-primary/40 mt-1.5 shrink-0" />
                        <span>{edu}</span>
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

            <Card className="border-border shadow-sm h-full">
              <CardHeader>
                <CardTitle className="text-lg font-heading flex items-center gap-2">
                  <Award className="w-5 h-5 text-primary" />
                  Cursos e Certificações
                </CardTitle>
              </CardHeader>
              <CardContent>
                {professional.courses && professional.courses.length > 0 ? (
                  <ul className="space-y-3">
                    {professional.courses.map((course, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-sm text-muted-foreground"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-secondary/40 mt-1.5 shrink-0" />
                        <span>{course}</span>
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
