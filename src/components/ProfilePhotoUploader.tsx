import { useState, useRef } from 'react'
import { User, Upload, Camera, Loader2 } from 'lucide-react'
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
import { useProfessionalStore } from '@/stores/useProfessionalStore'
import { toast } from 'sonner'

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

  // Update local store state to reflect changes immediately
  const { setProfilePhoto } = useProfessionalStore()

  const handleFileProcess = async (file: File) => {
    // Client-side Validation
    if (!file.type.startsWith('image/')) {
      toast.error('Formato inválido', {
        description:
          'Por favor, selecione um arquivo de imagem (JPG, PNG, WEBP).',
      })
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Arquivo muito grande', {
        description: 'A imagem deve ter no máximo 5MB.',
      })
      return
    }

    // Mode 1: Immediate Upload (Dashboard / Profile Edit)
    if (userId) {
      setIsLoading(true)
      const toastId = toast.loading('Processando e enviando foto...', {
        description: 'Convertendo e fazendo upload da sua nova foto de perfil.',
      })

      try {
        // 1. Direct Upload via storageService
        // This now performs direct storage upload and DB update (no edge function)
        const { url, error: uploadError } = await storageService.uploadAvatar(
          userId,
          file,
        )

        if (uploadError) throw uploadError
        if (!url) throw new Error('Falha ao obter URL da imagem.')

        // 2. Update Local Store (DB is already updated by Service)
        setProfilePhoto(url)

        // Notify parent to update local form state if needed
        onChange(url)

        toast.success('Foto atualizada!', {
          id: toastId,
          description: 'Sua foto de perfil foi alterada com sucesso.',
        })
      } catch (error: any) {
        console.error('Upload handler error:', error)
        toast.error('Erro ao atualizar foto', {
          id: toastId,
          description:
            error.message || 'Ocorreu um erro inesperado. Tente novamente.',
        })
      } finally {
        setIsLoading(false)
      }
    }
    // Mode 2: Deferred Upload (Registration Flow)
    else {
      // Create preview
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
    // Reset input value to allow selecting same file again if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="flex flex-col md:flex-row gap-6 items-center md:items-start p-6 border rounded-xl bg-card shadow-sm">
      <div className="relative group">
        <Avatar className="w-32 h-32 border-4 border-background shadow-md shrink-0">
          {isLoading ? (
            <div className="flex w-full h-full items-center justify-center bg-muted">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              <AvatarImage src={value} className="object-cover" />
              <AvatarFallback className="bg-muted text-muted-foreground text-3xl select-none">
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
              className="absolute bottom-0 right-0 rounded-full shadow-lg opacity-90 hover:opacity-100 transition-all hover:scale-105"
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

      <div className="flex-1 w-full space-y-3">
        <div className="space-y-1 text-center md:text-left">
          <Label className="text-lg font-semibold">Foto de Perfil</Label>
          <p className="text-sm text-muted-foreground max-w-sm">
            Escolha uma foto profissional e acolhedora. A imagem será convertida
            para PNG automaticamente.
          </p>
        </div>

        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/jpeg,image/png,image/webp,image/jpg"
          onChange={handleFileSelect}
        />
      </div>

      <CameraCapture
        isOpen={showCamera}
        onClose={() => setShowCamera(false)}
        onCapture={handleFileProcess}
      />
    </div>
  )
}
