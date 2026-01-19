import { supabase } from '@/lib/supabase/client'

/**
 * Helper function to resize image and convert to PNG.
 * Constraints: Max 512x512, PNG format, 0.8 quality (requested, though PNG is lossless in many implementations).
 */
async function resizeImage(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (event) => {
      const img = new Image()
      img.onload = () => {
        let width = img.naturalWidth
        let height = img.naturalHeight
        const maxDim = 512

        // Resize logic: Fit within maxDim x maxDim maintaining aspect ratio
        if (width > maxDim || height > maxDim) {
          const ratio = Math.min(maxDim / width, maxDim / height)
          width = Math.round(width * ratio)
          height = Math.round(height * ratio)
        }

        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height

        const ctx = canvas.getContext('2d')
        if (!ctx) {
          reject(new Error('Falha ao processar imagem (Contexto inválido)'))
          return
        }

        // Draw image onto canvas
        ctx.drawImage(img, 0, 0, width, height)

        // Convert to PNG Blob with 0.8 quality
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob)
            } else {
              reject(new Error('Falha ao processar imagem'))
            }
          },
          'image/png',
          0.8,
        )
      }

      img.onerror = () =>
        reject(new Error('Falha ao carregar imagem para conversão'))
      img.src = event.target?.result as string
    }

    reader.onerror = () => reject(new Error('Falha ao ler arquivo'))
    reader.readAsDataURL(file)
  })
}

export const storageService = {
  /**
   * Uploads an avatar image directly to Supabase Storage.
   *
   * Process:
   * 1. Checks authentication.
   * 2. Resizes the image to max 512x512 PNG.
   * 3. Validates processed size (< 2MB).
   * 4. Uploads to 'avatars' bucket with name '[userId].png'.
   * 5. Updates the 'profiles' table with the new avatar URL.
   */
  async uploadAvatar(
    userId: string,
    file: File,
  ): Promise<{ url: string | null; error: any }> {
    try {
      // 1. Authentication Check
      // We also check session to ensure the user is really authenticated in the client context
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!userId || !session) {
        throw new Error('Usuário não autenticado')
      }

      // 2. Resize to PNG (Max 512x512, Quality 0.8)
      const processedBlob = await resizeImage(file)

      // 3. Validate Processed Size (Max 2MB)
      const maxSizeBytes = 2 * 1024 * 1024 // 2MB
      if (processedBlob.size > maxSizeBytes) {
        throw new Error('Imagem muito grande após processamento')
      }

      // Define path: [user.id].png
      const fileName = `${userId}.png`

      // 4. Upload to Storage
      // Using upsert: true handles both initial upload and updates
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, processedBlob, {
          contentType: 'image/png',
          upsert: true,
          cacheControl: '3600', // 1 hour cache
        })

      if (uploadError) {
        console.error('Supabase Storage Upload Error:', uploadError)
        // Handle specific RLS errors
        if (
          uploadError.message.includes('row-level security') ||
          (uploadError as any).statusCode === '403'
        ) {
          throw new Error(
            'Permissão negada. Você não tem permissão para alterar esta foto.',
          )
        }
        throw new Error('Falha ao enviar imagem para o armazenamento')
      }

      // 5. Get Public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from('avatars').getPublicUrl(fileName)

      if (!publicUrl) {
        throw new Error('Falha ao obter URL pública da imagem.')
      }

      // Add timestamp to prevent caching issues immediately after upload
      const finalUrl = `${publicUrl}?t=${new Date().getTime()}`

      // 6. Update Profile in Database
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: finalUrl })
        .eq('id', userId)

      if (updateError) {
        console.error('Database Update Error:', updateError)
        throw new Error(
          'Imagem enviada, mas falha ao atualizar o perfil no banco de dados.',
        )
      }

      return { url: finalUrl, error: null }
    } catch (error: any) {
      console.error('Storage Service Error:', error)
      return { url: null, error }
    }
  },
}
