import { useParams, useNavigate } from 'react-router-dom'
import {
  MapPin,
  Phone,
  Share2,
  GraduationCap,
  Award,
  Calendar,
  Video,
  Users,
  Briefcase,
  Lock,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAuth } from '@/hooks/use-auth'
import { toast } from 'sonner'
import { useEffect, useState } from 'react'
import { WhatsAppIcon, InstagramIcon, FacebookIcon } from '@/components/Icons'
import { profileService } from '@/services/profileService'
import { Professional } from '@/stores/useProfessionalStore'

export default function Profile() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [professional, setProfessional] = useState<Professional | null>(null)
  const [loading, setLoading] = useState(true)

  const isOwner = user?.id === id

  useEffect(() => {
    const loadProfile = async () => {
      if (!id) return
      setLoading(true)
      const { data, error } = await profileService.getProfile(id)
      if (data) {
        setProfessional(data)
      } else if (error) {
        console.error(error)
      }
      setLoading(false)
    }
    loadProfile()
  }, [id])

  // Check visibility
  const isVisible = professional?.isVisible !== false

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        Carregando...
      </div>
    )
  }

  if (!professional) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-2xl font-bold mb-4">Profissional não encontrado</h2>
        <Button onClick={() => navigate('/busca')}>Voltar para a busca</Button>
      </div>
    )
  }

  if (!isVisible && !isOwner) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
          <Lock className="w-8 h-8 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Perfil Privado</h2>
        <p className="text-muted-foreground mb-6">
          Este perfil não está visível publicamente no momento.
        </p>
        <Button onClick={() => navigate('/busca')}>Voltar para a busca</Button>
      </div>
    )
  }

  const handleWhatsApp = () => {
    const cleanPhone = professional.phone.replace(/\D/g, '')
    const message = `Olá, Dr(a). ${professional.name}. Encontrei seu perfil na EscutaPSI e gostaria de mais informações.`
    window.open(
      `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`,
      '_blank',
    )
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    toast.success('Link do perfil copiado para a área de transferência!')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {isOwner && !isVisible && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg mb-6 flex items-center gap-3">
          <Lock className="w-5 h-5" />
          <span className="font-medium">
            Seu perfil está definido como privado e não aparece nas buscas.
          </span>
          <Button
            variant="link"
            className="text-yellow-900 underline ml-auto h-auto p-0"
            onClick={() => navigate('/painel/perfil')}
          >
            Alterar visibilidade
          </Button>
        </div>
      )}

      <div className="bg-white rounded-xl border border-border overflow-hidden shadow-sm">
        <div className="p-6 md:p-10 flex flex-col md:flex-row items-center md:items-start gap-8 bg-gradient-to-b from-muted/30 to-transparent">
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white shadow-md overflow-hidden shrink-0">
            <img
              src={professional.photoUrl}
              alt={professional.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex-grow text-center md:text-left space-y-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground">
                {professional.name}
              </h1>
              {professional.occupation && (
                <div className="flex items-center justify-center md:justify-start gap-2 text-primary font-medium text-lg mt-1">
                  <Briefcase className="w-4 h-4" />
                  <span>{professional.occupation}</span>
                </div>
              )}
              <div className="flex items-center justify-center md:justify-start gap-2 text-muted-foreground mt-2">
                <MapPin className="w-4 h-4" />
                <span>
                  {professional.city}, {professional.state}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap justify-center md:justify-start gap-2">
              {professional.serviceTypes.map((type) => (
                <span
                  key={type}
                  className="px-3 py-1 bg-secondary text-secondary-foreground text-sm rounded-full font-medium flex items-center gap-1"
                >
                  {type === 'Online' ? (
                    <Video className="w-3 h-3" />
                  ) : (
                    <Users className="w-3 h-3" />
                  )}
                  {type}
                </span>
              ))}
              {professional.specialties.map((spec, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full font-medium"
                >
                  {spec}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3 min-w-[200px]">
            {professional.phone && (
              <Button
                onClick={handleWhatsApp}
                className="w-full h-12 bg-[#25D366] hover:bg-[#1da851] text-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105"
              >
                <WhatsAppIcon className="w-5 h-5 mr-2" />
                Conversar no WhatsApp
              </Button>
            )}

            {professional.instagram && (
              <Button
                onClick={() => window.open(professional.instagram, '_blank')}
                className="w-full bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] hover:opacity-90 text-white border-0"
              >
                <InstagramIcon className="w-5 h-5 mr-2" />
                Instagram
              </Button>
            )}

            {professional.facebook && (
              <Button
                onClick={() => window.open(professional.facebook, '_blank')}
                className="w-full bg-[#1877F2] hover:bg-[#1864cc] text-white"
              >
                <FacebookIcon className="w-5 h-5 mr-2" />
                Facebook
              </Button>
            )}

            <Button variant="outline" onClick={handleShare} className="w-full">
              <Share2 className="w-4 h-4 mr-2" />
              Compartilhar Perfil
            </Button>
          </div>
        </div>

        <div className="p-6 md:p-10">
          <Tabs defaultValue="sobre" className="w-full">
            <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto md:mx-0 mb-8">
              <TabsTrigger value="sobre">Sobre Mim</TabsTrigger>
              <TabsTrigger value="formacao">
                Formação e Especializações
              </TabsTrigger>
            </TabsList>

            <TabsContent value="sobre" className="space-y-8 animate-fade-in">
              <div className="space-y-4">
                <h3 className="text-xl font-bold font-heading">Apresentação</h3>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                  {professional.bio}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 rounded-lg border border-border bg-muted/20">
                  <h4 className="font-bold mb-3 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    Disponibilidade
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {professional.availability}
                  </p>
                </div>
                <div className="p-4 rounded-lg border border-border bg-muted/20">
                  <h4 className="font-bold mb-3 flex items-center gap-2">
                    <Phone className="w-5 h-5 text-primary" />
                    Área de Atendimento
                  </h4>
                  <div className="flex gap-3">
                    {professional.serviceTypes.map((type) => (
                      <span
                        key={type}
                        className="text-sm px-2 py-1 bg-white rounded border border-border text-foreground flex items-center gap-1"
                      >
                        {type === 'Online' ? (
                          <Video className="w-3 h-3" />
                        ) : (
                          <Users className="w-3 h-3" />
                        )}
                        {type}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="formacao" className="space-y-8 animate-fade-in">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold font-heading mb-4 flex items-center gap-2">
                    <GraduationCap className="w-6 h-6 text-primary" />
                    Formação Acadêmica
                  </h3>
                  <ul className="space-y-3 pl-2">
                    {professional.education.map((edu, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-3 text-muted-foreground"
                      >
                        <span className="w-2 h-2 mt-2 rounded-full bg-primary shrink-0" />
                        {edu}
                      </li>
                    ))}
                  </ul>
                </div>

                {professional.courses.length > 0 && (
                  <div>
                    <h3 className="text-xl font-bold font-heading mb-4 flex items-center gap-2">
                      <Award className="w-6 h-6 text-primary" />
                      Cursos e Certificações
                    </h3>
                    <ul className="space-y-3 pl-2">
                      {professional.courses.map((course, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-3 text-muted-foreground"
                        >
                          <span className="w-2 h-2 mt-2 rounded-full bg-primary shrink-0" />
                          {course}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
