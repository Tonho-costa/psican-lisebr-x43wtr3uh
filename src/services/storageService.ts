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

      if (error) {
        // Try to extract detailed error message from response if available
        let detailedMessage = error.message
        if (error instanceof Error && 'context' in (error as any)) {
          // Sometimes supabase-js puts the response body in context
        }

        // If the edge function returns a JSON error object, invoke might wrap it
        if (typeof error === 'object' && error !== null && 'error' in error) {
          detailedMessage = (error as any).error
        }

        console.error('Edge Function Error:', error)
        throw new Error(
          detailedMessage || 'Falha ao processar upload no servidor.',
        )
      }

      if (!data?.url) {
        throw new Error('Resposta inválida do servidor: URL não encontrada.')
      }

      return { url: data.url, error: null }
    } catch (error: any) {
      console.error('Storage Service Error:', error)

      let friendlyError = error

      // Handle common Supabase/Network errors
      const errorMessage = error.message || ''

      if (
        errorMessage.includes('Failed to fetch') ||
        errorMessage.includes('NetworkError') ||
        errorMessage.includes('Failed to send a request')
      ) {
        friendlyError = new Error(
          'Erro de conexão com o servidor. Verifique se o Edge Function "upload-avatar" está implantado e online.',
        )
      } else if (error.status === 413) {
        friendlyError = new Error('A imagem selecionada é muito grande.')
      }

      return { url: null, error: friendlyError }
    }
  },
}
