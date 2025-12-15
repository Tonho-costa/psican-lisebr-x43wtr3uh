import { supabase } from '@/lib/supabase/client'

export const storageService = {
  /**
   * Uploads an avatar image to Supabase Storage.
   * Returns the public URL of the uploaded image.
   */
  async uploadAvatar(
    userId: string,
    file: File,
  ): Promise<{ url: string | null; error: any }> {
    try {
      const fileExt = file.name.split('.').pop()
      // Using timestamp to avoid browser caching issues
      const fileName = `${userId}/avatar-${Date.now()}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, {
          upsert: true,
          contentType: file.type,
        })

      if (uploadError) {
        throw uploadError
      }

      const { data } = supabase.storage.from('avatars').getPublicUrl(fileName)

      return { url: data.publicUrl, error: null }
    } catch (error: any) {
      console.error('Error uploading avatar:', error)

      // Sanitize common technical errors (like HTML response for 404/500)
      if (
        error.message &&
        (error.message.includes('Unexpected token') ||
          error.message.includes('JSON'))
      ) {
        return {
          url: null,
          error: new Error(
            'Erro de conexão com o servidor. Por favor, tente novamente.',
          ),
        }
      }

      return { url: null, error }
    }
  },
}
