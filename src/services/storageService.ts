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
    } catch (error) {
      console.error('Error uploading avatar:', error)
      return { url: null, error }
    }
  },
}
