import { useParams, useNavigate } from 'react-router-dom'
import {
  MapPin,
  Phone,
  Share2,
  GraduationCap,
  Award,
  Calendar,
  MessageCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useProfessionalStore } from '@/stores/useProfessionalStore'
import { toast } from 'sonner'
import { useEffect } from 'react'

export default function Profile() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { professionals } = useProfessionalStore()
  const professional = professionals.find((p) => p.id === id)

  useEffect(() => {
    if (!professional) {
      // Should ideally redirect to 404 or showing a not found component
      // For now, let's keep it simple but robust
    }
  }, [professional])

  if (!professional) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-2xl font-bold mb-4">Profissional não encontrado</h2>
        <Button onClick={() => navigate('/busca')}>Voltar para a busca</Button>
      </div>
    )
  }

  const handleWhatsApp = () => {
    const message = `Olá, Dr(a). ${professional.name}. Encontrei seu perfil no PsicanáliseBR e gostaria de mais informações.`
    window.open(
      `https://wa.me/${professional.phone}?text=${encodeURIComponent(message)}`,
      '_blank',
    )
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    toast.success('Link do perfil copiado para a área de transferência!')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-xl border border-border overflow-hidden shadow-sm">
        {/* Profile Header */}
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
              <div className="flex items-center justify-center md:justify-start gap-2 text-muted-foreground mt-2">
                <MapPin className="w-4 h-4" />
                <span>
                  {professional.city}, {professional.state}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap justify-center md:justify-start gap-2">
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
            <Button
              onClick={handleWhatsApp}
              className="w-full h-12 bg-[#25D366] hover:bg-[#1da851] text-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Conversar no WhatsApp
            </Button>
            <Button variant="outline" onClick={handleShare} className="w-full">
              <Share2 className="w-4 h-4 mr-2" />
              Compartilhar Perfil
            </Button>
          </div>
        </div>

        {/* Profile Content */}
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
                        className="text-sm px-2 py-1 bg-white rounded border border-border text-foreground"
                      >
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
