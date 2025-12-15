import { useRef, useState, useCallback } from 'react'
import { Circle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { toast } from 'sonner'

interface CameraCaptureProps {
  isOpen: boolean
  onClose: () => void
  onCapture: (file: File) => void
}

export function CameraCapture({
  isOpen,
  onClose,
  onCapture,
}: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [isStreaming, setIsStreaming] = useState(false)

  const startCamera = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: 512, height: 512 },
      })
      setStream(mediaStream)
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
        videoRef.current.play()
        setIsStreaming(true)
      }
    } catch (err) {
      console.error('Error accessing camera:', err)
      toast.error('Erro ao acessar a câmera. Verifique as permissões.')
      onClose()
    }
  }, [onClose])

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      setStream(null)
      setIsStreaming(false)
    }
  }, [stream])

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current
      const context = canvas.getContext('2d')

      if (context) {
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        context.drawImage(video, 0, 0, canvas.width, canvas.height)

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const file = new File([blob], 'camera-capture.jpg', {
                type: 'image/jpeg',
              })
              onCapture(file)
              handleClose()
            }
          },
          'image/jpeg',
          0.9,
        )
      }
    }
  }

  const handleClose = () => {
    stopCamera()
    onClose()
  }

  // Handle dialog open/close lifecycle
  if (isOpen && !isStreaming) {
    startCamera()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Tirar Foto</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="relative w-full aspect-square bg-black rounded-lg overflow-hidden flex items-center justify-center">
            <video
              ref={videoRef}
              className="w-full h-full object-cover mirror"
              playsInline
              muted
              style={{ transform: 'scaleX(-1)' }}
            />
            <canvas ref={canvasRef} className="hidden" />
            {!isStreaming && (
              <RefreshCw className="w-8 h-8 text-white animate-spin" />
            )}
          </div>
        </div>
        <DialogFooter className="sm:justify-center">
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button
            onClick={handleCapture}
            disabled={!isStreaming}
            className="bg-red-500 hover:bg-red-600 rounded-full w-12 h-12 p-0 flex items-center justify-center"
          >
            <Circle className="w-8 h-8 fill-current text-white" />
            <span className="sr-only">Capturar</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
