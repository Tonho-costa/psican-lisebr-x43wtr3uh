import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react'

interface StatusChangeDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (justification: string) => Promise<void>
  title: string
  description: string
  actionLabel: string
  isLoading: boolean
}

export function StatusChangeDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  actionLabel,
  isLoading,
}: StatusChangeDialogProps) {
  const [justification, setJustification] = useState('')
  const [error, setError] = useState('')

  const handleConfirm = async () => {
    if (justification.length < 10) {
      setError('A justificativa deve ter pelo menos 10 caracteres.')
      return
    }
    await onConfirm(justification)
    setJustification('')
    setError('')
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="justification">
              Justificativa Obrigatória
              <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="justification"
              placeholder="Descreva o motivo desta ação administrativa..."
              value={justification}
              onChange={(e) => {
                setJustification(e.target.value)
                setError('')
              }}
              className={error ? 'border-destructive' : ''}
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancelar
          </Button>
          <Button onClick={handleConfirm} disabled={isLoading}>
            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {actionLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
