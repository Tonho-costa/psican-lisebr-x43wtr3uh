import { supabase } from '@/lib/supabase/client'

/**
 * Helper function to convert any image file to PNG format.
 * This ensures consistency and avoids format-related upload errors.
 */
export const convertToPng = (file: File): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()

    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d')

      if (!ctx) {
        URL.revokeObjectURL(url)
        reject(new Error('Falha ao obter contexto do canvas.'))
        return
      }

      // Draw image on canvas
      ctx.drawImage(img, 0, 0)

      // Convert to PNG Blob
      canvas.toBlob(
        (blob) => {
          URL.revokeObjectURL(url)
          if (blob) {
            resolve(blob)
          } else {
            reject(new Error('Falha ao converter imagem para PNG.'))
          }
        },
        'image/png',
        1.0,
      )
    }

    img.onerror = (error) => {
      URL.revokeObjectURL(url)
      reject(error)
    }

    img.src = url
  })
}

export const storageService = {
  /**
   * Uploads an avatar image directly to Supabase Storage.
   * Automatically converts the image to PNG before uploading.
   * Returns the public URL of the uploaded image.
   */
  async uploadAvatar(
    userId: string,
    file: File,
  ): Promise<{ url: string | null; error: any }> {
    try {
      // 1. Initial Validation (Client side check)
      if (!file.type.startsWith('image/')) {
        throw new Error('O arquivo deve ser uma imagem válida (JPG, PNG, etc).')
      }

      // 2. Convert Image to PNG
      // This solves issues with file types not matching extensions or
      // Supabase policies requiring specific formats.
      const pngBlob = await convertToPng(file)

      // 3. Size Validation (Post-conversion)
      // Check if converted file is within limits (e.g. 5MB)
      const maxSize = 5 * 1024 * 1024
      if (pngBlob.size > maxSize) {
        throw new Error(
          'A imagem processada excede o limite de 5MB. Tente uma imagem menor.',
        )
      }

      // 4. Prepare file name
      // Always use .png extension since we converted it
      const fileName = `avatars/${userId}.png`

      // 5. Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, pngBlob, {
          upsert: true,
          contentType: 'image/png',
          cacheControl: '3600',
        })

      if (uploadError) {
        throw uploadError
      }

      // 6. Get Public URL
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
