import { useState } from 'react'
import { X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { GalleryConfig } from '@/types'
import { useGalleryData } from '@/hooks/useGalleryData'
import { SectionWrapper, SectionHeader } from '@/components/ui/SectionWrapper'

interface GalleryProps {
  gallery: GalleryConfig
}

export function Gallery({ gallery }: GalleryProps) {
  const { t } = useTranslation()
  const { images } = useGalleryData(gallery.images)
  const [lightbox, setLightbox] = useState<number | null>(null)

  return (
    <SectionWrapper id="galeria" bg="neutral">
      <SectionHeader
        title={t('gallery.title', { defaultValue: gallery.title })}
        subtitle={gallery.subtitle ? t('gallery.subtitle', { defaultValue: gallery.subtitle }) : undefined}
      />

      <div className="columns-2 md:columns-3 gap-4 space-y-4">
        {images.map((img, i) => (
          <button
            key={img.src}
            onClick={() => setLightbox(i)}
            className="block w-full break-inside-avoid rounded-brand overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 group"
          >
            <img
              src={img.src}
              alt={img.alt}
              loading="lazy"
              className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </button>
        ))}
      </div>

      {lightbox !== null && (
        <div
          className="fixed inset-0 z-50 bg-neutral-900/90 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            onClick={() => setLightbox(null)}
            className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
            aria-label={t('gallery.close')}
          >
            <X size={32} />
          </button>
          <img
            src={images[lightbox].src}
            alt={images[lightbox].alt}
            className="max-w-full max-h-[90vh] object-contain rounded-brand"
            onClick={(e) => e.stopPropagation()}
          />
          {images[lightbox].caption && (
            <p className="absolute bottom-8 text-white/70 font-body text-sm">
              {images[lightbox].caption}
            </p>
          )}
        </div>
      )}
    </SectionWrapper>
  )
}
