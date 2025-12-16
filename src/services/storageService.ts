import { supabase } from '@/lib/supabase/client'

export const storageService = {
  /**
   * Uploads an avatar image directly to Supabase Storage.
   * Stores the file with its original extension (jpg, png, webp).
   * Returns the public URL of the uploaded image.
   */
  async uploadAvatar(
    userId: string,
    file: File,
  ): Promise<{ url: string | null; error: any }> {
    try {
      // 1. Initial Validation (Client side check)
      // Allow typical web image formats
      if (!file.type.startsWith('image/')) {
        throw new Error(
          'O arquivo deve ser uma imagem válida (JPG, PNG, WEBP).',
        )
      }

      // 2. Size Validation
      const maxSize = 5 * 1024 * 1024 // 5MB
      if (file.size > maxSize) {
        throw new Error(
          'A imagem excede o limite de 5MB. Tente uma imagem menor.',
        )
      }

      // 3. Determine extension
      // Try to get extension from filename first, then fallback to mime type logic
      let extension = file.name.split('.').pop()?.toLowerCase()

      const validExtensions = ['jpg', 'jpeg', 'png', 'webp']

      if (!extension || !validExtensions.includes(extension)) {
        // Fallback mapping based on mime type
        if (file.type === 'image/jpeg') extension = 'jpg'
        else if (file.type === 'image/png') extension = 'png'
        else if (file.type === 'image/webp') extension = 'webp'
        else extension = 'png' // Default to png if unknown but starts with image/
      }

      // Ensure we have a valid extension for the filename
      const fileName = `avatars/${userId}.${extension}`

      // 4. Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, {
          upsert: true,
          contentType: file.type,
          cacheControl: '3600',
        })

      if (uploadError) {
        throw uploadError
      }

      // 5. Get Public URL
      const { data } = supabase.storage.from('avatars').getPublicUrl(fileName)

      if (!data?.publicUrl) {
        throw new Error('Não foi possível obter a URL pública da imagem.')
      }

      // Append timestamp to bust cache since the filename might be reused or replaced
      const publicUrl = `${data.publicUrl}?t=${new Date().getTime()}`

      return { url: publicUrl, error: null }
    } catch (error: any) {
      console.error('Storage Service Error:', error)
      return { url: null, error }
    }
  },
}
