import { supabase } from '@/lib/supabase/client'

export const storageService = {
  /**
   * Uploads an avatar image using the 'upload-avatar' Edge Function.
   * This handles upload to Supabase Storage and updates the profile in the database.
   */
  async uploadAvatar(
    userId: string,
    file: File,
  ): Promise<{ url: string | null; error: any }> {
    try {
      // 1. Validation (Client-side)
      if (!file.type.startsWith('image/')) {
        throw new Error('O arquivo deve ser uma imagem válida (JPG, PNG, etc).')
      }

      const maxSize = 5 * 1024 * 1024 // 5MB
      if (file.size > maxSize) {
        throw new Error('A imagem deve ter no máximo 5MB.')
      }

      // 2. Prepare Form Data
      const formData = new FormData()
      formData.append('file', file)

      // 3. Invoke Edge Function
      const { data, error } = await supabase.functions.invoke('upload-avatar', {
        body: formData,
      })

      if (error) throw error

      if (!data?.url) {
        throw new Error('Resposta inválida do servidor.')
      }

      return { url: data.url, error: null }
    } catch (error: any) {
      console.error('Storage Service Error:', error)

      let friendlyError = error

      // Handle common Supabase/Network errors
      const errorMessage = error.message || ''

      if (
        errorMessage.includes('Failed to fetch') ||
        errorMessage.includes('NetworkError')
      ) {
        friendlyError = new Error(
          'Erro de conexão com o servidor. Verifique sua internet ou tente novamente mais tarde.',
        )
      } else if (error.status === 413) {
        friendlyError = new Error('A imagem selecionada é muito grande.')
      }

      return { url: null, error: friendlyError }
    }
  },
}
