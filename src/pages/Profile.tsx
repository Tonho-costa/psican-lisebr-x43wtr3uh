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
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { profileService } from '@/services/profileService'
import { Professional } from '@/stores/useProfessionalStore'

export default function Profile() {
  const { id } = useParams<{ id: string }>()
  const [professional, setProfessional] = useState<Professional | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadProfile() {
      if (!id) return
      setLoading(true)
      const { data } = await profileService.getProfile(id)
      setProfessional(data)
      setLoading(false)
    }
    loadProfile()
  }, [id])

  if (loading) {
    return (
      <div className="container py-10 space-y-8">
        <Skeleton className="h-12 w-48" />
        <div className="grid md:grid-cols-3 gap-8">
          <Skeleton className="h-96 md:col-span-1" />
          <Skeleton className="h-96 md:col-span-2" />
        </div>
      </div>
    )
  }

  if (!professional) {
    return (
      <div className="container py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold">Profissional não encontrado</h2>
        <Link to="/busca">
          <Button variant="outline">Voltar para busca</Button>
        </Link>
      </div>
    )
  }

  // Updated WhatsApp message without "Dr(a)." prefix
  const message = `Olá, ${professional.name}. Encontrei seu perfil na EscutaPSI e gostaria de mais informações.`
  const whatsappUrl = `https://wa.me/${professional.phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`

  return (
    <div className="container py-8 space-y-6">
      <Link to="/busca">
        <Button variant="ghost" className="pl-0 gap-2">
          <ArrowLeft className="w-4 h-4" /> Voltar
        </Button>
      </Link>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardContent className="pt-6 text-center space-y-4">
              <div className="relative w-32 h-32 mx-auto">
                <Avatar className="w-full h-full border-4 border-muted">
                  <AvatarImage
                    src={professional.photoUrl || undefined}
                    className="object-cover"
                    alt={professional.name}
                  />
                  <AvatarFallback>{professional.name[0]}</AvatarFallback>
                </Avatar>
              </div>

              <div>
                <h1 className="text-xl font-bold">{professional.name}</h1>
                <p className="text-primary font-medium">
                  {professional.occupation}
                </p>
              </div>

              <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm">
                <MapPin className="w-4 h-4" />
                <span>
                  {professional.city}, {professional.state}
                </span>
              </div>

              {professional.phone && (
                <Button
                  className="w-full gap-2 bg-green-600 hover:bg-green-700 text-white"
                  asChild
                >
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Phone className="w-4 h-4" />
                    Contatar via WhatsApp
                  </a>
                </Button>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Atendimento</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {professional.serviceTypes.includes('Online') && (
                <div className="flex items-center gap-2">
                  <Video className="w-4 h-4 text-primary" />
                  <span>Online</span>
                </div>
              )}
              {professional.serviceTypes.includes('Presencial') && (
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" />
                  <span>Presencial</span>
                </div>
              )}
              {professional.availability && (
                <div className="flex items-center gap-2 pt-2 border-t mt-2">
                  <Clock className="w-4 h-4 text-primary" />
                  <span className="text-sm text-muted-foreground">
                    {professional.availability}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Sobre</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap leading-relaxed text-muted-foreground">
                {professional.bio || 'Sem descrição.'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Especialidades</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {professional.specialties.map((specialty) => (
                  <Badge key={specialty} variant="secondary">
                    {specialty}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {(professional.education.length > 0 ||
            professional.courses.length > 0) && (
            <Card>
              <CardHeader>
                <CardTitle>Formação e Cursos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {professional.education.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 font-medium">
                      <GraduationCap className="w-5 h-5 text-primary" />
                      <h3>Formação Acadêmica</h3>
                    </div>
                    <ul className="space-y-2 ml-7 list-disc">
                      {professional.education.map((edu, i) => (
                        <li key={i} className="text-muted-foreground">
                          {edu}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {professional.courses.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 font-medium">
                      <Award className="w-5 h-5 text-primary" />
                      <h3>Cursos Complementares</h3>
                    </div>
                    <ul className="space-y-2 ml-7 list-disc">
                      {professional.courses.map((course, i) => (
                        <li key={i} className="text-muted-foreground">
                          {course}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
