import { supabase } from '@/lib/supabase/client'

export const storageService = {
  /**
   * Uploads an avatar image using the 'update-profile-avatar' Edge Function.
   * The Edge Function handles storage upload and profile database update.
   */
  async uploadAvatar(
    userId: string, // Kept for interface compatibility, but derived from auth in Edge Function
    file: File,
  ): Promise<{ url: string | null; error: any }> {
    try {
      // 1. Initial Validation (Client side check for better UX)
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

      // 3. Prepare FormData for Edge Function
      const formData = new FormData()
      formData.append('file', file)

      // 4. Call Edge Function
      const { data, error } = await supabase.functions.invoke(
        'update-profile-avatar',
        {
          body: formData,
        },
      )

      if (error) {
        throw error
      }

      if (data?.error) {
        throw new Error(data.error)
      }

      if (!data?.url) {
        throw new Error('Falha ao obter URL da imagem.')
      }

      return { url: data.url, error: null }
    } catch (error: any) {
      console.error('Storage Service Error:', error)
      return { url: null, error }
    }
  },
}
