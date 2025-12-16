import { supabase } from '@/lib/supabase/client'

export const storageService = {
  /**
   * Uploads an avatar image directly to Supabase Storage.
   * Returns the public URL of the uploaded image.
   */
  async uploadAvatar(
    userId: string,
    file: File,
  ): Promise<{ url: string | null; error: any }> {
    try {
      // 1. Validation
      if (!file.type.startsWith('image/')) {
        throw new Error('O arquivo deve ser uma imagem válida (JPG, PNG, etc).')
      }

      const maxSize = 5 * 1024 * 1024 // 5MB
      if (file.size > maxSize) {
        throw new Error('A imagem deve ter no máximo 5MB.')
      }

      // 2. Prepare file name
      // Using fixed path: avatars/{user.id}.png as per requirements
      const fileName = `avatars/${userId}.png`

      // 3. Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, {
          upsert: true,
          contentType: file.type,
        })

      if (uploadError) {
        throw uploadError
      }

      // 4. Get Public URL
      const { data } = supabase.storage.from('avatars').getPublicUrl(fileName)

      if (!data?.publicUrl) {
        throw new Error('Não foi possível obter a URL pública da imagem.')
      }

      // Append timestamp to bust cache since the filename is now static
      const publicUrl = `${data.publicUrl}?t=${new Date().getTime()}`

      return { url: publicUrl, error: null }
    } catch (error: any) {
      console.error('Storage Service Error:', error)
      return { url: null, error }
    }
  },
}
