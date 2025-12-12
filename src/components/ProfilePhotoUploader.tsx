import { useState, useRef } from 'react'
import { User, Upload, Camera, ImageIcon, Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { CameraCapture } from '@/components/CameraCapture'
import { storageService } from '@/services/storageService'
import { profileService } from '@/services/profileService'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface ProfilePhotoUploaderProps {
  value: string
  onChange: (value: string) => void
  onFileChange?: (file: File) => void
  name?: string
  userId?: string // If provided, enables immediate upload mode
}

export function ProfilePhotoUploader({
  value,
  onChange,
  onFileChange,
  name,
  userId,
}: ProfilePhotoUploaderProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [showCamera, setShowCamera] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileProcess = async (file: File) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Por favor, selecione um arquivo de imagem válido.')
      return
    }

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('A imagem deve ter no máximo 5MB.')
      return
    }

    // Mode 1: Immediate Upload (Dashboard)
    if (userId) {
      setIsLoading(true)
      try {
        const { url, error } = await storageService.uploadAvatar(userId, file)

        if (error || !url) throw error

        // Update Profile in DB
        const { error: dbError } = await profileService.updateProfile(userId, {
          photoUrl: url,
        })

        if (dbError) throw dbError

        onChange(url)
        toast.success('Foto de perfil atualizada com sucesso!')
      } catch (error: any) {
        console.error(error)
        toast.error(
          'Erro ao atualizar foto: ' + (error.message || 'Erro desconhecido'),
        )
      } finally {
        setIsLoading(false)
      }
    }
    // Mode 2: Deferred Upload (Register)
    else {
      const previewUrl = URL.createObjectURL(file)
      onChange(previewUrl)
      if (onFileChange) {
        onFileChange(file)
      }
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileProcess(file)
    }
    // Reset input value to allow selecting same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="flex flex-col md:flex-row gap-6 items-center md:items-start p-4 border rounded-lg bg-card shadow-sm">
      <div className="relative group">
        <Avatar className="w-32 h-32 border-4 border-background shadow-sm shrink-0">
          {isLoading ? (
            <div className="flex w-full h-full items-center justify-center bg-muted">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <>
              <AvatarImage src={value} className="object-cover" />
              <AvatarFallback className="bg-muted text-muted-foreground text-3xl">
                {name ? (
                  name.charAt(0).toUpperCase()
                ) : (
                  <User className="w-12 h-12" />
                )}
              </AvatarFallback>
            </>
          )}
        </Avatar>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="secondary"
              size="icon"
              className="absolute bottom-0 right-0 rounded-full shadow-md opacity-90 hover:opacity-100"
              disabled={isLoading}
            >
              <Camera className="w-4 h-4" />
              <span className="sr-only">Alterar foto</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => fileInputRef.current?.click()}>
              <Upload className="w-4 h-4 mr-2" />
              Carregar do dispositivo
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setShowCamera(true)}>
              <Camera className="w-4 h-4 mr-2" />
              Tirar foto
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex-1 w-full space-y-4">
        <div className="space-y-1 text-center md:text-left">
          <Label className="text-base">Foto de Perfil</Label>
          <p className="text-sm text-muted-foreground">
            Escolha uma foto profissional. Isso ajuda a construir confiança com
            seus pacientes.
          </p>
        </div>

        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleFileSelect}
        />

        {/* URL Fallback Input (Optional, kept for backward compatibility if needed) */}
        {!userId && (
          <div className="relative max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <ImageIcon className="h-4 w-4 text-muted-foreground" />
            </div>
            <Input
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Ou cole uma URL de imagem..."
              className="pl-9 text-sm"
            />
          </div>
        )}
      </div>

      <CameraCapture
        isOpen={showCamera}
        onClose={() => setShowCamera(false)}
        onCapture={handleFileProcess}
      />
    </div>
  )
}
