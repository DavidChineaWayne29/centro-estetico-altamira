import { useState } from 'react'
import type { MenuConfig } from '@/types'
import { SectionWrapper, SectionHeader } from '@/components/ui/SectionWrapper'

interface MenuSectionProps {
  menu: MenuConfig
}

export function MenuSection({ menu }: MenuSectionProps) {
  const categories = [...new Set(menu.items.map((i) => i.category))]
  const [activeCategory, setActiveCategory] = useState(categories[0] ?? '')

  const filtered = menu.items.filter((i) => i.category === activeCategory)

  return (
    <SectionWrapper id="menu" bg="white">
      <SectionHeader title={menu.title ?? 'Nuestra carta'} />

      {/* Category tabs */}
      <div className="flex flex-wrap gap-2 justify-center mb-10">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`font-body text-sm px-5 py-2 rounded-full border transition-colors duration-200 ${
              activeCategory === cat
                ? 'bg-primary-600 text-white border-primary-600'
                : 'bg-white text-neutral-600 border-neutral-200 hover:border-primary-400 hover:text-primary-600'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Menu items grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((item) => (
          <div
            key={`${item.category}-${item.name}`}
            className="flex justify-between items-start gap-4 pb-6 border-b border-neutral-100 last:border-0"
          >
            <div className="flex-1">
              <div className="flex items-start gap-2">
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-brand flex-shrink-0"
                  />
                )}
                <div>
                  <p className="font-display text-neutral-900 text-base">{item.name}</p>
                  {item.description && (
                    <p className="font-body text-sm text-neutral-500 mt-1 leading-relaxed">
                      {item.description}
                    </p>
                  )}
                  {item.allergens && item.allergens.length > 0 && (
                    <p className="font-body text-xs text-neutral-400 mt-1">
                      Alérgenos: {item.allergens.join(', ')}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <span className="font-display text-primary-600 text-base whitespace-nowrap flex-shrink-0">
              {item.price}
            </span>
          </div>
        ))}
      </div>
    </SectionWrapper>
  )
}
