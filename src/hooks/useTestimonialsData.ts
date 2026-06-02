import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { TestimonialItem } from '@/types'

interface RawTestimonial {
  id: string
  author: string
  role: string | null
  text: string
  rating: number | null
  avatar: string | null
}

export function useTestimonialsData(fallback: TestimonialItem[] = []) {
  const [items, setItems] = useState<TestimonialItem[]>(fallback)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('testimonials')
      .select('id, author, role, text, rating, avatar')
      .eq('published', true)
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (!error && data && data.length > 0) {
          setItems(
            (data as RawTestimonial[]).map((row) => ({
              author: row.author,
              role: row.role ?? undefined,
              text: row.text,
              rating: row.rating ?? undefined,
              avatar: row.avatar ?? undefined,
            }))
          )
        }
        setLoading(false)
      })
  }, [])

  return { items, loading }
}
