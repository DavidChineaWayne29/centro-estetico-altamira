import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { GalleryImage } from '@/types'

interface RawGalleryRow {
  id: string
  src: string
  alt: string
  caption: string | null
}

export function useGalleryData(fallback: GalleryImage[] = []) {
  const [images, setImages] = useState<GalleryImage[]>(fallback)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('gallery')
      .select('id, src, alt, caption')
      .order('sort_order', { ascending: true })
      .then(({ data, error }) => {
        if (!error && data && data.length > 0) {
          setImages(
            (data as RawGalleryRow[]).map((row) => ({
              src: row.src,
              alt: row.alt,
              caption: row.caption ?? undefined,
            }))
          )
        }
        setLoading(false)
      })
  }, [])

  return { images, loading }
}
