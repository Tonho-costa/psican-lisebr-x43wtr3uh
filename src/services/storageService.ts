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
      // 1. Validation
      if (!file.type.startsWith('image/')) {
        throw new Error('O arquivo deve ser uma imagem válida (JPG, PNG, etc).')
      }

      const maxSize = 5 * 1024 * 1024 // 5MB
      if (file.size > maxSize) {
        throw new Error('A imagem deve ter no máximo 5MB.')
      }

      // 2. Prepare Filename
      const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg'
      // Sanitize extension to avoid weird characters
      const safeExt = fileExt.replace(/[^a-z0-9]/g, '')
      // Use timestamp to ensure uniqueness and bypass cache
      const timestamp = Date.now()
      const fileName = `${userId}/avatar-${timestamp}.${safeExt}`

      // 3. Upload to Supabase
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, {
          upsert: true,
          contentType: file.type,
          cacheControl: '3600', // Cache for 1 hour
        })

      if (uploadError) {
        throw uploadError
      }

      // 4. Get Public URL
      const { data } = supabase.storage.from('avatars').getPublicUrl(fileName)

      if (!data || !data.publicUrl) {
        throw new Error('Não foi possível gerar a URL pública da imagem.')
      }

      // Append timestamp query param to force browser to reload the image
      const publicUrl = `${data.publicUrl}?t=${timestamp}`

      return { url: publicUrl, error: null }
    } catch (error: any) {
      console.error('Storage Service Error:', error)

      let friendlyError = error

      // Handle common Supabase/Network errors
      const errorMessage = error.message || ''

      if (
        errorMessage.includes('Unexpected token') ||
        errorMessage.includes('JSON') ||
        errorMessage.includes('<!DOCTYPE html>') ||
        errorMessage.includes('Failed to fetch') ||
        errorMessage.includes('NetworkError')
      ) {
        friendlyError = new Error(
          'Erro de conexão com o servidor. Verifique sua internet ou tente novamente mais tarde.',
        )
      } else if (
        errorMessage.includes('The object exceeded the maximum allowed size') ||
        error.statusCode === '413'
      ) {
        friendlyError = new Error('A imagem selecionada é muito grande.')
      } else if (
        errorMessage.includes('new row violates row-level security policy')
      ) {
        friendlyError = new Error(
          'Você não tem permissão para fazer upload desta imagem.',
        )
      }

      return { url: null, error: friendlyError }
    }
  },
}
