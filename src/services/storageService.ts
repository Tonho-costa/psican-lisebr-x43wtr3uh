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
        canvas.width = img.width
        canvas.height = img.height

        const ctx = canvas.getContext('2d')
        if (!ctx) {
          reject(new Error('Failed to get canvas context'))
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
              reject(new Error('Failed to convert image to PNG'))
            }
          },
          'image/png',
          1.0, // Quality (1.0 = Max)
        )
      }

      img.onerror = () =>
        reject(new Error('Failed to load image for conversion'))
      img.src = event.target?.result as string
    }

    reader.onerror = () => reject(new Error('Failed to read file'))
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
   * 3. Uploads to 'avatars' bucket with name '{userId}.png'.
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

      // Define path: Strict naming convention {uid}.png
      const fileName = `${userId}.png`
      const filePath = fileName // Root of the bucket

      // 3. Upload to Storage (Direct Client Upload)
      // Browser automatically handles Content-Type for FormData, but here we use Supabase SDK
      // which uses Blob, so we can specify contentType.
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, pngBlob, {
          contentType: 'image/png',
          upsert: true, // Replace if exists
        })

      if (uploadError) {
        console.error('Supabase Storage Upload Error:', uploadError)
        throw new Error('Falha ao enviar imagem para o armazenamento.')
      }

      // 4. Get Public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from('avatars').getPublicUrl(filePath)

      if (!publicUrl) {
        throw new Error('Falha ao obter URL pública da imagem.')
      }

      // Add timestamp to prevent caching issues immediately after upload
      const finalUrl = `${publicUrl}?t=${new Date().getTime()}`

      // 5. Update Profile in Database
      // We perform this update here to ensure consistency
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: finalUrl })
        .eq('id', userId)

      if (updateError) {
        console.error('Database Update Error:', updateError)
        throw new Error('Imagem enviada, mas falha ao atualizar perfil.')
      }

      return { url: finalUrl, error: null }
    } catch (error: any) {
      console.error('Storage Service Error:', error)
      return { url: null, error }
    }
  },
}
