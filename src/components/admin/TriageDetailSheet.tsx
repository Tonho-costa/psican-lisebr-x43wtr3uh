import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { TriageSubmission } from '@/services/triageService'
import { User, FileText, CheckCircle, XCircle } from 'lucide-react'

interface TriageDetailSheetProps {
  submission: TriageSubmission | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onApprove: (sub: TriageSubmission) => void
  onReject: (sub: TriageSubmission) => void
}

export function TriageDetailSheet({
  submission,
  open,
  onOpenChange,
  onApprove,
  onReject,
}: TriageDetailSheetProps) {
  if (!submission) return null

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Análise de Triagem</SheetTitle>
          <SheetDescription>
            Revise os dados submetidos pelo profissional.
          </SheetDescription>
        </SheetHeader>

        <div className="py-6 space-y-6">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <User className="h-8 w-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold">{submission.full_name}</h3>
              <p className="text-sm text-muted-foreground">
                {submission.email}
              </p>
              <Badge variant="outline" className="mt-1">
                {submission.crp_status}
              </Badge>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">
                  Telefone
                </h4>
                <p>{submission.phone}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">
                  Modalidade
                </h4>
                <p>{submission.service_mode}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">
                  Abordagem
                </h4>
                <p>{submission.theoretical_approach}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">
                  Experiência
                </h4>
                <p>{submission.experience_level}</p>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-muted-foreground">
                Formação
              </h4>
              <p>{submission.education}</p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-muted-foreground">
                Disponibilidade
              </h4>
              <p>{submission.weekly_availability}</p>
            </div>

            <div className="bg-muted p-4 rounded-lg space-y-2">
              <div className="flex items-center gap-2 text-sm">
                {submission.accepts_social_value ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-500" />
                )}
                <span>Aceita valor social</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                {submission.agrees_to_ethics ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-500" />
                )}
                <span>Concorda com Ética</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                {submission.agrees_to_terms ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-500" />
                )}
                <span>Concorda com Termos</span>
              </div>
            </div>

            {submission.profile_url && (
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">
                  Link do Perfil
                </h4>
                <a
                  href={submission.profile_url}
                  target="_blank"
                  className="text-primary hover:underline truncate block"
                >
                  {submission.profile_url}
                </a>
              </div>
            )}
          </div>
        </div>

        <SheetFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="destructive"
            onClick={() => onReject(submission)}
            className="w-full sm:w-auto"
          >
            Rejeitar
          </Button>
          <Button
            onClick={() => onApprove(submission)}
            className="w-full sm:w-auto bg-green-600 hover:bg-green-700"
          >
            Aprovar
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
