import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { AdminProfileForm } from './AdminProfileForm'
import { Database } from '@/lib/supabase/types'
import { adminService } from '@/services/adminService'
import { toast } from 'sonner'
import { useState } from 'react'

type Profile = Database['public']['Tables']['profiles']['Row']

interface EditProfileSheetProps {
  profile: Profile | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onProfileUpdated: () => void
}

export function EditProfileSheet({
  profile,
  open,
  onOpenChange,
  onProfileUpdated,
}: EditProfileSheetProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (data: any) => {
    if (!profile) return

    setIsSubmitting(true)
    try {
      const { error } = await adminService.updateProfile(profile.id, data)

      if (error) {
        toast.error('Erro ao atualizar perfil', {
          description: error.message,
        })
      } else {
        toast.success('Perfil atualizado com sucesso!')
        onProfileUpdated()
        onOpenChange(false)
      }
    } catch (error) {
      toast.error('Erro inesperado ao atualizar perfil')
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        className="w-[100%] sm:max-w-xl overflow-y-auto"
        side="right"
      >
        <SheetHeader className="mb-6">
          <SheetTitle>Editar Perfil Profissional</SheetTitle>
          <SheetDescription>
            Faça alterações nos dados do profissional. As mudanças serão
            refletidas imediatamente.
          </SheetDescription>
        </SheetHeader>

        {profile && (
          <AdminProfileForm
            profile={profile}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        )}
      </SheetContent>
    </Sheet>
  )
}
