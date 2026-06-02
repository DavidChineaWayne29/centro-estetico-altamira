import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { X, Leaf, AlertTriangle, Sprout } from 'lucide-react'
import type { MenuConfig, MenuItem } from '@/types'
import { useMenuData } from '@/hooks/useMenuData'
import { SectionWrapper, SectionHeader } from '@/components/ui/SectionWrapper'

// Labels that indicate dietary preference (not allergens)
const DIETARY_LABELS = ['vegetariano', 'vegano', 'sin gluten', 'sin lactosa', 'singluten', 'sinlactosa']

function splitItem(item: MenuItem) {
  const dietary: string[] = []
  const allergens: string[] = []
  ;(item.allergens ?? []).forEach((a) => {
    if (DIETARY_LABELS.includes(a.toLowerCase().replace(/\s+/g, ''))) {
      dietary.push(a)
    } else {
      allergens.push(a)
    }
  })
  return { dietary, allergens }
}

// Normalise a label to a lookup key (remove spaces/accents-safe lowercase)
function toKey(s: string) { return s.toLowerCase().replace(/[\s-]/g, '') }

function DietaryBadge({ label }: { label: string }) {
  const { t } = useTranslation()
  const isVegan = label.toLowerCase().includes('vegano') || label.toLowerCase().includes('vegan')
  const translated = t(`dietary.${toKey(label)}`, { defaultValue: label })
  return (
    <span className="inline-flex items-center gap-1 text-xs font-body px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-200">
      {isVegan ? <Sprout size={11} /> : <Leaf size={11} />}
      {translated}
    </span>
  )
}

function AllergenBadge({ label }: { label: string }) {
  const { t } = useTranslation()
  const translated = t(`allergenMap.${toKey(label)}`, { defaultValue: label })
  return (
    <span className="inline-flex items-center gap-1 text-xs font-body px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
      <AlertTriangle size={11} />
      {translated}
    </span>
  )
}

// ── Modal ─────────────────────────────────────────────────────────────────────

interface ModalProps {
  item: MenuItem
  onClose: () => void
}

function DishModal({ item, onClose }: ModalProps) {
  const { t } = useTranslation()
  const { dietary, allergens } = splitItem(item)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-neutral-900/70 backdrop-blur-sm" />

      {/* Panel */}
      <div
        className="relative w-full sm:max-w-lg bg-white rounded-t-2xl sm:rounded-2xl overflow-hidden shadow-2xl max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image */}
        <div className="relative h-56 sm:h-72 flex-shrink-0 overflow-hidden bg-neutral-100">
          {item.image ? (
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
              <span className="font-display text-4xl text-primary-400">🍽</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          {/* Price overlay */}
          <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full">
            <span className="font-display text-primary-600 font-semibold text-lg">{item.price}</span>
          </div>
          <button
            onClick={onClose}
            className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-neutral-700 hover:text-neutral-900 rounded-full p-1.5 transition-colors"
            aria-label={t('gallery.close')}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6 flex-1">
          <span className="inline-block font-body text-xs text-primary-600 uppercase tracking-wider mb-2">
            {t(`menuCategories.${item.category}`, { defaultValue: item.category })}
          </span>
          <h3 className="font-display text-2xl text-neutral-900 mb-3">{item.name}</h3>

          {item.description && (
            <p className="font-body text-neutral-600 leading-relaxed mb-6">
              {item.description}
            </p>
          )}

          {/* Dietary */}
          {dietary.length > 0 && (
            <div className="mb-4">
              <div className="flex flex-wrap gap-2">
                {dietary.map((d) => <DietaryBadge key={d} label={d} />)}
              </div>
            </div>
          )}

          {/* Allergens */}
          {allergens.length > 0 && (
            <div>
              <p className="font-body text-xs text-neutral-400 uppercase tracking-wider mb-2">
                {t('menu.allergens')}
              </p>
              <div className="flex flex-wrap gap-2">
                {allergens.map((a) => <AllergenBadge key={a} label={a} />)}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Card ──────────────────────────────────────────────────────────────────────

interface CardProps {
  item: MenuItem
  onClick: () => void
}

function DishCard({ item, onClick }: CardProps) {
  const { t } = useTranslation()
  const { dietary } = splitItem(item)

  return (
    <button
      onClick={onClick}
      className="group text-left bg-white rounded-xl overflow-hidden shadow-sm border border-neutral-100 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col"
    >
      {/* Image */}
      <div className="relative h-44 sm:h-48 overflow-hidden bg-neutral-100 flex-shrink-0">
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center">
            <span className="text-4xl">🍽</span>
          </div>
        )}
        {/* Category badge */}
        <div className="absolute top-3 left-3">
          <span className="bg-white/90 backdrop-blur-sm font-body text-xs text-neutral-600 px-2 py-0.5 rounded-full">
            {t(`menuCategories.${item.category}`, { defaultValue: item.category })}
          </span>
        </div>
        {/* Dietary icons top-right */}
        {dietary.length > 0 && (
          <div className="absolute top-3 right-3 flex gap-1">
            {dietary.map((d) => (
              <span
                key={d}
                title={d}
                className="bg-green-500 text-white rounded-full p-1"
              >
                {d.toLowerCase().includes('vegano') ? <Sprout size={12} /> : <Leaf size={12} />}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-display text-base text-neutral-900 leading-snug mb-1 group-hover:text-primary-600 transition-colors">
          {item.name}
        </h3>
        {item.description && (
          <p className="font-body text-sm text-neutral-500 leading-relaxed line-clamp-2 flex-1">
            {item.description}
          </p>
        )}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-neutral-100">
          <span className="font-display text-primary-600 text-lg font-semibold">{item.price}</span>
          <span className="font-body text-xs text-neutral-400 group-hover:text-primary-500 transition-colors">
            {t('menu.seeMore')} →
          </span>
        </div>
      </div>
    </button>
  )
}

// ── Section ───────────────────────────────────────────────────────────────────

interface MenuSectionProps {
  menu: MenuConfig
}

export function MenuSection({ menu }: MenuSectionProps) {
  const { t } = useTranslation()
  const { items } = useMenuData(menu.items)
  // Raw category names from DB (in Spanish); we translate them for display only
  const rawCategories = [...new Set(items.map((i) => i.category))]
  const categories = [t('menu.all'), ...rawCategories]
  const [activeCategory, setActiveCategory] = useState('')
  const [selected, setSelected] = useState<MenuItem | null>(null)

  const allLabel = t('menu.all')
  const currentCat = activeCategory || allLabel
  const filtered = currentCat === allLabel
    ? items
    : items.filter((i) => i.category === currentCat)

  const handleClose = useCallback(() => setSelected(null), [])

  return (
    <SectionWrapper id="menu" bg="neutral">
      <SectionHeader title={menu.title ?? t('menu.title')} />

      {/* Category tabs */}
      {categories.length > 1 && (
        <div className="flex flex-wrap gap-2 justify-center mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`font-body text-sm px-5 py-2 rounded-full border transition-all duration-200 ${
                currentCat === cat
                  ? 'bg-primary-600 text-white border-primary-600 shadow-sm'
                  : 'bg-white text-neutral-600 border-neutral-200 hover:border-primary-400 hover:text-primary-600'
              }`}
            >
              {t(`menuCategories.${cat}`, { defaultValue: cat })}
            </button>
          ))}
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((item) => (
          <DishCard
            key={`${item.category}-${item.name}`}
            item={item}
            onClick={() => setSelected(item)}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-4 mt-10 pt-6 border-t border-neutral-200">
        <span className="inline-flex items-center gap-1.5 font-body text-xs text-neutral-500">
          <span className="bg-green-500 rounded-full p-0.5 text-white"><Leaf size={10} /></span>
          Vegetariano
        </span>
        <span className="inline-flex items-center gap-1.5 font-body text-xs text-neutral-500">
          <span className="bg-green-500 rounded-full p-0.5 text-white"><Sprout size={10} /></span>
          Vegano
        </span>
        <span className="inline-flex items-center gap-1.5 font-body text-xs text-neutral-500">
          <AlertTriangle size={12} className="text-amber-500" />
          {t('menu.allergens')}
        </span>
      </div>

      {/* Modal */}
      {selected && <DishModal item={selected} onClose={handleClose} />}
    </SectionWrapper>
  )
}
