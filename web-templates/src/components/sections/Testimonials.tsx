import { Star } from 'lucide-react'
import type { TestimonialsConfig } from '@/types'
import { SectionWrapper, SectionHeader } from '@/components/ui/SectionWrapper'

interface TestimonialsProps {
  testimonials: TestimonialsConfig
}

export function Testimonials({ testimonials }: TestimonialsProps) {
  return (
    <SectionWrapper id="testimonios" bg="white">
      <SectionHeader title={testimonials.title ?? 'Lo que dicen nuestros clientes'} />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.items.map((t) => (
          <div
            key={t.author}
            className="bg-neutral-50 rounded-brand p-6 border border-neutral-100"
          >
            {/* Stars */}
            {t.rating && (
              <div className="flex gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={i < t.rating! ? 'text-primary-400 fill-primary-400' : 'text-neutral-200 fill-neutral-200'}
                  />
                ))}
              </div>
            )}

            <p className="font-body text-neutral-700 text-sm leading-relaxed mb-6 italic">
              "{t.text}"
            </p>

            <div className="flex items-center gap-3">
              {t.avatar ? (
                <img src={t.avatar} alt={t.author} className="w-10 h-10 rounded-full object-cover" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                  <span className="font-display text-primary-600 text-sm">
                    {t.author.charAt(0)}
                  </span>
                </div>
              )}
              <div>
                <p className="font-display text-sm text-neutral-900">{t.author}</p>
                {t.role && <p className="font-body text-xs text-neutral-400">{t.role}</p>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </SectionWrapper>
  )
}
