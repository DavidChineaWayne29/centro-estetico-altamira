import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { supabase } from '@/lib/supabase'
import { Pencil, Trash2, Plus, X, Check, Leaf, ChevronDown, ChevronUp, Tag, Languages, Loader2 } from 'lucide-react'

interface MenuItem {
  id: string
  name: string
  description: string | null
  price: string
  allergens: string[] | null
  image: string | null
  category_id: string
  sort_order: number
  category_name?: string
}

interface Category {
  id: string
  name: string
}

const emptyForm = {
  id: '',
  name: '',
  description: '',
  description_en: '',
  price: '',
  allergens: '',
  image: '',
  category_id: '',
}

export function MenuManager() {
  const { t } = useTranslation()
  const [items, setItems] = useState<MenuItem[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [form, setForm] = useState(emptyForm)
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [translating, setTranslating] = useState(false)
  const [autoTranslated, setAutoTranslated] = useState(false)

  // Category management state
  const [showCatPanel, setShowCatPanel] = useState(false)
  const [newCatName, setNewCatName] = useState('')
  const [catSaving, setCatSaving] = useState(false)
  const [catError, setCatError] = useState('')

  // Auto-translate description ES → EN with 900ms debounce
  useEffect(() => {
    if (!editing) return
    const text = form.description.trim()
    if (!text) {
      setAutoTranslated(false)
      return
    }
    const timer = setTimeout(async () => {
      setTranslating(true)
      try {
        const res = await fetch(
          `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=es|en`
        )
        const data = await res.json()
        if (data.responseStatus === 200 && data.responseData?.translatedText) {
          setForm((f) => ({ ...f, description_en: data.responseData.translatedText }))
          setAutoTranslated(true)
        }
      } catch {
        // silently ignore network errors
      } finally {
        setTranslating(false)
      }
    }, 900)
    return () => clearTimeout(timer)
  }, [form.description, editing])

  const fetchData = async () => {
    const [{ data: cats, error: catErr }, { data: menuItems, error: itemErr }] =
      await Promise.all([
        supabase.from('menu_categories').select('id, name').order('sort_order'),
        supabase
          .from('menu_items')
          .select('*, menu_categories!inner(name)')
          .order('sort_order'),
      ])

    if (catErr) console.error('Error cargando categorías:', catErr)
    if (itemErr) console.error('Error cargando platos:', itemErr)

    const loadedCats = cats ?? []
    setCategories(loadedCats)
    setItems(
      (menuItems ?? []).map((i: any) => ({
        ...i,
        category_name: i.menu_categories?.name ?? '',
      }))
    )
    // If no category selected yet, pick the first
    setForm((prev) =>
      prev.category_id === '' && loadedCats.length > 0
        ? { ...prev, category_id: loadedCats[0].id }
        : prev
    )
    setLoading(false)
  }

  useEffect(() => { fetchData() }, [])

  // ── Category management ─────────────────────────────────────────────────

  const handleAddCategory = async () => {
    const name = newCatName.trim()
    if (!name) return
    setCatError('')
    setCatSaving(true)
    const { error } = await supabase
      .from('menu_categories')
      .insert([{ name, sort_order: categories.length }])
    setCatSaving(false)
    if (error) {
      setCatError('Error al guardar. Revisa los permisos en Supabase.')
      return
    }
    setNewCatName('')
    fetchData()
  }

  const handleDeleteCategory = async (id: string) => {
    const hasItems = items.some((i) => i.category_id === id)
    if (hasItems) {
      alert('Elimina primero los platos de esta categoría.')
      return
    }
    if (!confirm('¿Eliminar esta categoría?')) return
    await supabase.from('menu_categories').delete().eq('id', id)
    fetchData()
  }

  // ── Dish form ───────────────────────────────────────────────────────────

  const openAdd = () => {
    setSaveError('')
    setAutoTranslated(false)
    setForm({ ...emptyForm, category_id: categories[0]?.id ?? '' })
    setEditing(true)
  }

  const openEdit = (item: MenuItem) => {
    setSaveError('')
    setAutoTranslated(false)
    setForm({
      id: item.id,
      name: item.name,
      description: item.description ?? '',
      description_en: (item as any).description_en ?? '',
      price: item.price,
      allergens: item.allergens?.join(', ') ?? '',
      image: item.image ?? '',
      category_id: item.category_id,
    })
    setEditing(true)
  }

  const handleSave = async () => {
    if (!form.name.trim() || !form.price.trim()) {
      setSaveError('El nombre y el precio son obligatorios.')
      return
    }
    if (!form.category_id) {
      setSaveError('Selecciona una categoría. Si no hay ninguna, créala primero arriba.')
      return
    }
    setSaveError('')
    setSaving(true)

    const payload = {
      name: form.name.trim(),
      description: form.description.trim() || null,
      description_en: form.description_en.trim() || null,
      price: form.price.trim(),
      allergens: form.allergens
        ? form.allergens.split(',').map((s) => s.trim()).filter(Boolean)
        : null,
      image: form.image.trim() || null,
      category_id: form.category_id,
    }

    const { error } = form.id
      ? await supabase.from('menu_items').update(payload).eq('id', form.id)
      : await supabase.from('menu_items').insert([payload])

    setSaving(false)
    if (error) {
      setSaveError(`Error: ${error.message}. Verifica los permisos RLS en Supabase.`)
      return
    }
    setEditing(false)
    setForm(emptyForm)
    fetchData()
  }

  const handleDelete = async (id: string) => {
    if (!confirm(t('admin.menu.confirmDelete'))) return
    await supabase.from('menu_items').delete().eq('id', id)
    fetchData()
  }

  const inputClass =
    'w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 bg-white'
  const labelClass = 'block text-xs font-body text-neutral-600 mb-1'

  if (loading) return <p className="text-neutral-500 text-sm">{t('common.loading')}</p>

  const grouped = categories.reduce<Record<string, MenuItem[]>>((acc, cat) => {
    acc[cat.name] = items.filter((i) => i.category_id === cat.id)
    return acc
  }, {})

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-wrap gap-3 justify-between items-center">
        <h2 className="font-display text-xl text-neutral-900">{t('admin.tabs.menu')}</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setShowCatPanel((v) => !v)}
            className="flex items-center gap-2 border border-neutral-200 text-neutral-600 px-3 py-2 rounded-lg text-sm hover:bg-neutral-50 transition-colors"
          >
            <Tag size={15} />
            Categorías
            {showCatPanel ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          </button>
          <button
            onClick={openAdd}
            disabled={categories.length === 0}
            title={categories.length === 0 ? 'Crea una categoría primero' : ''}
            className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-primary-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Plus size={16} />
            {t('admin.menu.addItem')}
          </button>
        </div>
      </div>

      {/* No categories warning */}
      {categories.length === 0 && !showCatPanel && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm font-body text-amber-800 flex items-start gap-3">
          <span className="text-lg leading-none">⚠️</span>
          <div>
            <p className="font-semibold mb-1">No hay categorías</p>
            <p>Antes de añadir platos necesitas crear al menos una categoría (ej: "Entrantes", "Principales", "Postres").
              Pulsa el botón <strong>Categorías</strong> arriba para crearlas.
            </p>
          </div>
        </div>
      )}

      {/* Category manager panel */}
      {showCatPanel && (
        <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-5 space-y-4">
          <h3 className="font-display text-base text-neutral-800">Gestionar categorías</h3>

          {/* Add category */}
          <div className="flex gap-2">
            <input
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleAddCategory() }}
              placeholder='Ej: "Entrantes", "Principales", "Postres"'
              className={`${inputClass} flex-1`}
            />
            <button
              onClick={handleAddCategory}
              disabled={catSaving || !newCatName.trim()}
              className="flex items-center gap-1 bg-primary-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-primary-800 transition-colors disabled:opacity-40"
            >
              <Plus size={15} />
              Añadir
            </button>
          </div>
          {catError && (
            <p className="text-red-600 text-xs font-body bg-red-50 border border-red-200 rounded px-3 py-2">
              {catError}
            </p>
          )}

          {/* Existing categories */}
          {categories.length === 0 ? (
            <p className="text-sm text-neutral-400 italic">Aún no hay categorías</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <span
                  key={cat.id}
                  className="inline-flex items-center gap-2 bg-white border border-neutral-200 rounded-full px-3 py-1 text-sm font-body text-neutral-700"
                >
                  {cat.name}
                  <button
                    onClick={() => handleDeleteCategory(cat.id)}
                    className="text-neutral-300 hover:text-red-500 transition-colors"
                    aria-label="Eliminar categoría"
                  >
                    <X size={13} />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Dish form */}
      {editing && (
        <div className="bg-white border border-neutral-200 rounded-xl shadow-sm p-6 space-y-4">
          <h3 className="font-display text-base text-neutral-800">
            {form.id ? t('admin.menu.editItem') : t('admin.menu.addItem')}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>{t('admin.menu.category')}</label>
              <select
                value={form.category_id}
                onChange={(e) => setForm((f) => ({ ...f, category_id: e.target.value }))}
                className={inputClass}
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>{t('admin.menu.name')} *</label>
              <input
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder={t('admin.menu.namePlaceholder')}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>{t('admin.menu.price')} *</label>
              <input
                value={form.price}
                onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                placeholder={t('admin.menu.pricePlaceholder')}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>{t('admin.menu.allergens')}</label>
              <input
                value={form.allergens}
                onChange={(e) => setForm((f) => ({ ...f, allergens: e.target.value }))}
                placeholder={t('admin.menu.allergensPlaceholder')}
                className={inputClass}
              />
            </div>
            {/* Descriptions side by side */}
            <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>
                  🇪🇸 {t('admin.menu.description')}
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => {
                    setAutoTranslated(false)
                    setForm((f) => ({ ...f, description: e.target.value }))
                  }}
                  placeholder={t('admin.menu.descPlaceholder')}
                  rows={3}
                  className={`${inputClass} resize-none`}
                />
              </div>
              <div>
                <label className={`${labelClass} flex items-center justify-between`}>
                  <span>🇬🇧 Description (EN)</span>
                  {translating && (
                    <span className="flex items-center gap-1 text-primary-500 text-xs font-normal">
                      <Loader2 size={11} className="animate-spin" />
                      Traduciendo...
                    </span>
                  )}
                  {!translating && autoTranslated && (
                    <span className="flex items-center gap-1 text-green-600 text-xs font-normal">
                      <Languages size={11} />
                      Auto-traducido
                    </span>
                  )}
                </label>
                <textarea
                  value={form.description_en}
                  onChange={(e) => {
                    setAutoTranslated(false)
                    setForm((f) => ({ ...f, description_en: e.target.value }))
                  }}
                  placeholder="Se rellena automáticamente al escribir en español..."
                  rows={3}
                  className={`${inputClass} resize-none ${translating ? 'opacity-60' : ''}`}
                />
              </div>
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass}>URL de imagen (opcional)</label>
              <input
                value={form.image}
                onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
                placeholder="https://images.unsplash.com/..."
                className={inputClass}
              />
              {form.image && (
                <img
                  src={form.image}
                  alt="Preview"
                  className="mt-2 h-24 w-full object-cover rounded-lg border border-neutral-200"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                />
              )}
            </div>
          </div>

          <p className="font-body text-xs text-neutral-400 flex items-center gap-1">
            <Leaf size={11} className="text-green-600" />
            Escribe "vegetariano" o "vegano" en alérgenos para mostrar el icono de planta en la carta
          </p>

          {saveError && (
            <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm font-body text-red-700">
              {saveError}
            </div>
          )}

          <div className="flex gap-3 pt-1">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 bg-primary-600 text-white px-5 py-2 rounded-lg text-sm hover:bg-primary-800 transition-colors disabled:opacity-50"
            >
              <Check size={15} />
              {saving ? 'Guardando...' : t('admin.menu.save')}
            </button>
            <button
              onClick={() => { setEditing(false); setForm(emptyForm); setSaveError('') }}
              className="flex items-center gap-2 border border-neutral-200 text-neutral-600 px-5 py-2 rounded-lg text-sm hover:bg-neutral-50 transition-colors"
            >
              <X size={15} />
              {t('admin.menu.cancel')}
            </button>
          </div>
        </div>
      )}

      {/* Items by category */}
      {Object.keys(grouped).length === 0 && !loading ? (
        <div className="text-center py-12 text-neutral-400 border-2 border-dashed border-neutral-200 rounded-xl">
          <p className="font-display text-lg mb-2">{t('admin.menu.noItems')}</p>
          <p className="font-body text-sm">
            {categories.length === 0
              ? 'Primero crea categorías con el botón "Categorías"'
              : 'Añade el primer plato con el botón de arriba'}
          </p>
        </div>
      ) : (
        Object.entries(grouped).map(([catName, catItems]) => (
          <div key={catName}>
            <h3 className="font-display text-xs uppercase tracking-widest text-neutral-400 border-b border-neutral-100 pb-2 mb-3">
              {catName} <span className="text-neutral-300">({catItems.length})</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {catItems.length === 0 ? (
                <p className="text-neutral-400 text-sm italic col-span-2">Sin platos en esta categoría</p>
              ) : (
                catItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 bg-white border border-neutral-100 rounded-xl p-3 hover:border-neutral-200 transition-colors"
                  >
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-neutral-100 rounded-lg flex-shrink-0 flex items-center justify-center text-2xl">
                        🍽
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-body text-sm text-neutral-900 font-medium truncate">{item.name}</p>
                      {item.description && (
                        <p className="font-body text-xs text-neutral-400 truncate mt-0.5">{item.description}</p>
                      )}
                      <p className="font-display text-sm text-primary-600 mt-1">{item.price}</p>
                    </div>
                    <div className="flex flex-col gap-1 flex-shrink-0">
                      <button
                        onClick={() => openEdit(item)}
                        className="p-1.5 text-neutral-300 hover:text-primary-600 transition-colors"
                        aria-label={t('admin.menu.editItem')}
                        title="Editar"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 text-neutral-300 hover:text-red-500 transition-colors"
                        aria-label={t('admin.menu.delete')}
                        title="Eliminar"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ))
      )}
    </div>
  )
}
