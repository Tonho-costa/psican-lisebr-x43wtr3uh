import { useState } from 'react'
import { User, Link as LinkIcon } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface ProfilePhotoUploaderProps {
  value: string
  onChange: (value: string) => void
  name: string
}

export function ProfilePhotoUploader({
  value,
  onChange,
  name,
}: ProfilePhotoUploaderProps) {
  const [error, setError] = useState(false)

  return (
    <div className="flex flex-col md:flex-row gap-6 items-center md:items-start p-4 border rounded-lg bg-card">
      <Avatar className="w-24 h-24 md:w-32 md:h-32 border-4 border-background shadow-sm shrink-0">
        <AvatarImage
          src={value}
          onError={() => setError(true)}
          onLoad={() => setError(false)}
          className="object-cover"
        />
        <AvatarFallback className="bg-muted text-muted-foreground text-2xl">
          {name ? name.charAt(0).toUpperCase() : <User className="w-12 h-12" />}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 w-full space-y-3">
        <div className="space-y-1">
          <Label>Foto de Perfil (URL)</Label>
          <p className="text-xs text-muted-foreground">
            Cole o link direto de uma imagem (ex: LinkedIn, Google Drive
            público).
          </p>
        </div>
        <div className="relative">
          <LinkIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            value={value}
            onChange={(e) => {
              onChange(e.target.value)
              setError(false)
            }}
            placeholder="https://exemplo.com/sua-foto.jpg"
            className="pl-9"
          />
        </div>
        {value && error && (
          <p className="text-xs text-destructive">
            Não foi possível carregar a imagem. Verifique o link.
          </p>
        )}
      </div>
    </div>
  )
}
