import { supabase } from '@/lib/supabase/client'

/**
 * Helper function to convert any image file to a PNG Blob.
 * This ensures consistency in file format stored in the bucket.
 */
async function convertToPng(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (event) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        // Use natural dimensions to avoid unintended resizing
        canvas.width = img.naturalWidth
        canvas.height = img.naturalHeight

        const ctx = canvas.getContext('2d')
        if (!ctx) {
          reject(new Error('Falha ao processar imagem (Contexto inválido)'))
          return
        }

        // Draw image onto canvas
        ctx.drawImage(img, 0, 0)

        // Convert to PNG Blob
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob)
            } else {
              reject(new Error('Falha ao converter imagem para PNG'))
            }
          },
          'image/png',
          1.0, // Quality (1.0 = Max)
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
   * 1. Validates file type and size.
   * 2. Converts the image to PNG format.
   * 3. Uploads to 'avatars' bucket with name '{userId}/avatar.png'.
   * 4. Updates the 'profiles' table with the new avatar URL.
   */
  async uploadAvatar(
    userId: string,
    file: File,
  ): Promise<{ url: string | null; error: any }> {
    try {
      // 1. Initial Client-side Validation
      if (!file.type.startsWith('image/')) {
        throw new Error(
          'O arquivo deve ser uma imagem válida (JPG, PNG, WEBP).',
        )
      }

      // 5MB Limit
      const maxSize = 5 * 1024 * 1024
      if (file.size > maxSize) {
        throw new Error(
          'A imagem excede o limite de 5MB. Tente uma imagem menor.',
        )
      }

      // 2. Convert to PNG
      const pngBlob = await convertToPng(file)

      // Define path: Folder structure {uid}/avatar.png
      // This matches the RLS policy: name LIKE (auth.uid() || '/%')
      const filePath = `${userId}/avatar.png`

      // 3. Upload to Storage (Direct Client Upload)
      // Using upsert: true handles both initial upload and updates
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, pngBlob, {
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
        throw new Error(
          'Falha ao enviar imagem para o armazenamento. Tente novamente.',
        )
      }

      // 4. Get Public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from('avatars').getPublicUrl(filePath)

      if (!publicUrl) {
        throw new Error('Falha ao obter URL pública da imagem.')
      }

      // Add timestamp to prevent caching issues immediately after upload
      // This ensures the user sees the new image right away
      const finalUrl = `${publicUrl}?t=${new Date().getTime()}`

      // 5. Update Profile in Database
      // We perform this update here to ensure data consistency
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
