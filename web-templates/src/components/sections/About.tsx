import type { AboutConfig } from '@/types'
import { SectionWrapper } from '@/components/ui/SectionWrapper'

interface AboutProps {
  about: AboutConfig
}

export function About({ about }: AboutProps) {
  return (
    <SectionWrapper id="nosotros" bg="white">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

        {/* Imagen */}
        {about.image && (
          <div className="relative h-80 lg:h-96 rounded-brand overflow-hidden order-2 lg:order-1">
            <img
              src={about.image}
              alt={about.title}
              className="w-full h-full object-cover"
            />
            {/* Decorative accent */}
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-primary-100 rounded-brand -z-10" />
          </div>
        )}

        {/* Texto */}
        <div className={about.image ? 'order-1 lg:order-2' : 'lg:col-span-2 max-w-3xl'}>
          <h2 className="font-display text-3xl sm:text-4xl text-neutral-900 mb-6">
            {about.title}
          </h2>
          <p className="font-body text-neutral-600 text-lg leading-relaxed mb-8">
            {about.body}
          </p>

          {/* Equipo */}
          {about.team && about.team.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-8">
              {about.team.map((member) => (
                <div key={member.name} className="text-center">
                  {member.image && (
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-20 h-20 rounded-full object-cover mx-auto mb-3"
                    />
                  )}
                  <p className="font-display text-sm text-neutral-900">{member.name}</p>
                  <p className="font-body text-xs text-neutral-500">{member.role}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </SectionWrapper>
  )
}
