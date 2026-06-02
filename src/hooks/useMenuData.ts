import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import i18n from '@/i18n'
import type { MenuItem } from '@/types'

interface RawMenuItem {
  id: string
  name: string
  description: string | null
  description_en: string | null
  price: string
  allergens: string[] | null
  image: string | null
  menu_categories: { name: string }
}

export function useMenuData(fallback: MenuItem[] = []) {
  const [rawItems, setRawItems] = useState<RawMenuItem[]>([])
  const [lang, setLang] = useState(i18n.language)
  const [loading, setLoading] = useState(true)

  // Subscribe to language changes so descriptions swap without a re-fetch
  useEffect(() => {
    const handler = (newLang: string) => setLang(newLang)
    i18n.on('languageChanged', handler)
    return () => i18n.off('languageChanged', handler)
  }, [])

  // Fetch from Supabase once
  useEffect(() => {
    supabase
      .from('menu_items')
      .select('id, name, description, description_en, price, allergens, image, menu_categories!inner(name)')
      .order('sort_order', { ascending: true })
      .then(({ data, error }) => {
        if (!error && data && data.length > 0) {
          setRawItems(data as unknown as RawMenuItem[])
        }
        setLoading(false)
      })
  }, [])

  // Derive the displayed items: pick description_en when language is EN
  const isEn = lang.startsWith('en')
  const items: MenuItem[] =
    rawItems.length > 0
      ? rawItems.map((row) => ({
          category: row.menu_categories.name,
          name: row.name,
          description: isEn
            ? (row.description_en ?? row.description ?? undefined)
            : (row.description ?? undefined),
          price: row.price,
          allergens: row.allergens ?? undefined,
          image: row.image ?? undefined,
        }))
      : fallback

  return { items, loading }
}
