import { useState, useRef, useEffect, useCallback } from 'react'
import { Camera, Upload, Image as ImageIcon, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface ProfilePhotoUploaderProps {
  currentPhotoUrl?: string
  onPhotoChange: (base64: string) => void
  className?: string
}

export function ProfilePhotoUploader({
  currentPhotoUrl,
  onPhotoChange,
  className,
}: ProfilePhotoUploaderProps) {
  const [preview, setPreview] = useState<string | null>(currentPhotoUrl || null)
  const [isCameraOpen, setIsCameraOpen] = useState(false)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // cleanup stream on unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [stream])

  // Update preview if currentPhotoUrl changes externally
  useEffect(() => {
    if (currentPhotoUrl) {
      setPreview(currentPhotoUrl)
    }
  }, [currentPhotoUrl])

  const processImage = (
    source: HTMLImageElement | HTMLVideoElement,
    width: number,
    height: number,
  ) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    // Set max dimensions (e.g., 400x400 for profile pics)
    const MAX_SIZE = 400
    let newWidth = width
    let newHeight = height

    if (width > height) {
      if (width > MAX_SIZE) {
        newHeight *= MAX_SIZE / width
        newWidth = MAX_SIZE
      }
    } else {
      if (height > MAX_SIZE) {
        newWidth *= MAX_SIZE / height
        newHeight = MAX_SIZE
      }
    }

    canvas.width = newWidth
    canvas.height = newHeight

    if (ctx) {
      ctx.drawImage(source, 0, 0, newWidth, newHeight)
      const base64 = canvas.toDataURL('image/jpeg', 0.85)
      setPreview(base64)
      onPhotoChange(base64)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('Por favor, selecione um arquivo de imagem válido.')
      return
    }

    setIsLoading(true)
    const reader = new FileReader()
    reader.onload = (event) => {
      const img = new Image()
      img.onload = () => {
        processImage(img, img.width, img.height)
        setIsLoading(false)
        toast.success('Foto carregada com sucesso!')
      }
      img.src = event.target?.result as string
    }
    reader.readAsDataURL(file)
  }

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      })
      setStream(mediaStream)
      setIsCameraOpen(true)
      // Small delay to ensure video element is mounted
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream
        }
      }, 100)
    } catch (err) {
      console.error('Error accessing camera:', err)
      toast.error(
        'Não foi possível acessar a câmera. Verifique as permissões do seu navegador.',
      )
    }
  }

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      setStream(null)
    }
    setIsCameraOpen(false)
  }, [stream])

  const takePhoto = () => {
    if (videoRef.current) {
      processImage(
        videoRef.current,
        videoRef.current.videoWidth,
        videoRef.current.videoHeight,
      )
      stopCamera()
      toast.success('Foto capturada com sucesso!')
    }
  }

  const handleContainerClick = () => {
    if (!isLoading) {
      fileInputRef.current?.click()
    }
  }

  return (
    <div className={cn('flex flex-col items-center gap-4', className)}>
      <div
        className="relative group cursor-pointer"
        onClick={handleContainerClick}
      >
        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-background shadow-xl bg-muted flex items-center justify-center transition-all group-hover:border-primary/20">
          {preview ? (
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <ImageIcon className="w-12 h-12 text-muted-foreground opacity-50" />
          )}
          {isLoading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
              <Loader2 className="w-8 h-8 text-white animate-spin" />
            </div>
          )}
        </div>

        {/* Quick edit overlay - visible on hover for desktop, accessible via buttons for mobile */}
        <div className="absolute inset-0 rounded-full bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <Upload className="w-8 h-8 text-white drop-shadow-md" />
        </div>
      </div>

      <div className="flex gap-2 w-full justify-center">
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
        />
        <Button
          type="button"
          variant="outline"
          size="sm" // Kept sm but increased touch area via gap and margin
          className="h-9"
          onClick={(e) => {
            e.stopPropagation()
            fileInputRef.current?.click()
          }}
          disabled={isLoading}
        >
          <Upload className="w-4 h-4 mr-2" />
          Upload
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-9"
          onClick={(e) => {
            e.stopPropagation()
            startCamera()
          }}
          disabled={isLoading}
        >
          <Camera className="w-4 h-4 mr-2" />
          Câmera
        </Button>
      </div>

      <Dialog
        open={isCameraOpen}
        onOpenChange={(open) => !open && stopCamera()}
      >
        <DialogContent className="sm:max-w-md w-[95vw] max-h-[90vh] flex flex-col p-4">
          <DialogHeader>
            <DialogTitle>Tirar Foto</DialogTitle>
            <DialogDescription>
              Ajuste sua posição e clique em capturar.
            </DialogDescription>
          </DialogHeader>
          <div className="flex-grow flex items-center justify-center bg-black rounded-lg overflow-hidden relative min-h-[250px]">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-contain"
            />
          </div>
          <DialogFooter className="flex flex-row justify-between gap-2 mt-4 sm:justify-end">
            <Button
              variant="ghost"
              onClick={stopCamera}
              className="flex-1 sm:flex-none"
            >
              Cancelar
            </Button>
            <Button onClick={takePhoto} className="flex-1 sm:flex-none">
              <Camera className="w-4 h-4 mr-2" />
              Capturar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
