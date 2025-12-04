import { Link } from 'react-router-dom'
import { MapPin, Video, Users, Briefcase } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Professional } from '@/stores/useProfessionalStore'
import { cn } from '@/lib/utils'

interface ProfessionalCardProps {
  professional: Professional
  className?: string
}

export function ProfessionalCard({
  professional,
  className,
}: ProfessionalCardProps) {
  return (
    <Card
      className={cn(
        'hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border-border overflow-hidden flex flex-col h-full',
        className,
      )}
    >
      <CardHeader className="pb-4 text-center flex flex-col items-center">
        <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-2 border-muted shadow-sm">
          <img
            src={professional.photoUrl}
            alt={professional.name}
            className="w-full h-full object-cover"
          />
        </div>
        <h3 className="font-heading font-bold text-lg text-foreground leading-tight">
          {professional.name}
        </h3>
        {professional.occupation && (
          <div className="flex items-center text-sm text-primary font-medium mt-1 gap-1">
            <Briefcase className="w-3 h-3" />
            <span>{professional.occupation}</span>
          </div>
        )}
        <div className="flex items-center text-sm text-muted-foreground mt-1 gap-1">
          <MapPin className="w-3 h-3" />
          <span>
            {professional.city}, {professional.state}
          </span>
        </div>
      </CardHeader>
      <CardContent className="flex-grow pb-2 text-center">
        <div className="flex flex-wrap justify-center gap-1 mb-3">
          {professional.specialties.slice(0, 3).map((spec, index) => (
            <span
              key={index}
              className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full"
            >
              {spec}
            </span>
          ))}
          {professional.specialties.length > 3 && (
            <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full">
              +{professional.specialties.length - 3}
            </span>
          )}
        </div>
        <div className="flex items-center justify-center gap-3 text-xs text-muted-foreground mt-2">
          {professional.serviceTypes.includes('Online') && (
            <div className="flex items-center gap-1" title="Atendimento Online">
              <Video className="w-3 h-3" /> <span>Online</span>
            </div>
          )}
          {professional.serviceTypes.includes('Presencial') && (
            <div
              className="flex items-center gap-1"
              title="Atendimento Presencial"
            >
              <Users className="w-3 h-3" /> <span>Presencial</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <Link to={`/perfil/${professional.id}`} className="w-full">
          <Button
            variant="outline"
            className="w-full border-primary text-primary hover:bg-primary hover:text-white"
          >
            Ver Perfil
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
