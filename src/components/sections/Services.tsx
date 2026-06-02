import { icons } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { ServicesConfig } from '@/types'
import { SectionWrapper, SectionHeader } from '@/components/ui/SectionWrapper'

interface ServicesProps {
  services: ServicesConfig
}

function DynamicIcon({ name, size = 28 }: { name: string; size?: number }) {
  const Icon = icons[name as keyof typeof icons]
  if (!Icon) return null
  return <Icon size={size} strokeWidth={1.5} />
}

export function Services({ services }: ServicesProps) {
  const { t } = useTranslation()

  return (
    <SectionWrapper id="servicios" bg="neutral">
      <SectionHeader
        title={t('services.title', { defaultValue: services.title })}
        subtitle={services.subtitle ? t('services.subtitle', { defaultValue: services.subtitle }) : undefined}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {services.items.map((item) => (
          <div
            key={item.icon}
            className="bg-white rounded-brand p-6 shadow-sm hover:shadow-md transition-shadow duration-300 group"
          >
            <div className="text-primary-600 mb-4 group-hover:text-accent-400 transition-colors duration-300">
              <DynamicIcon name={item.icon} />
            </div>
            <h3 className="font-display text-lg text-neutral-900 mb-2">
              {t(`services.${item.icon}.title`, { defaultValue: item.title })}
            </h3>
            <p className="font-body text-sm text-neutral-600 leading-relaxed">
              {t(`services.${item.icon}.description`, { defaultValue: item.description })}
            </p>
          </div>
        ))}
      </div>
    </SectionWrapper>
  )
}
