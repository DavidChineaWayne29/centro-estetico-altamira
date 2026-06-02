import { MapPin, Phone, Mail, MessageCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { ContactConfig } from '@/types'
import { SectionWrapper, SectionHeader } from '@/components/ui/SectionWrapper'
import { Button } from '@/components/ui/Button'
import { useContactForm } from '@/hooks/useContactForm'

interface ContactProps {
  contact: ContactConfig
}

export function Contact({ contact }: ContactProps) {
  const { t } = useTranslation()
  const { fields, status, handleChange, handleSubmit } = useContactForm()

  const inputClass = 'w-full border border-neutral-200 rounded-brand px-4 py-3 font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 transition'
  const labelClass = 'font-body text-sm text-neutral-700 block mb-1'

  return (
    <SectionWrapper id="contacto" bg="neutral">
      <SectionHeader
        title={t('contact.sectionTitle', { defaultValue: contact.title })}
        subtitle={contact.subtitle}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

        {/* Info */}
        <div className="space-y-6">
          {contact.address && (
            <div className="flex items-start gap-4">
              <div className="text-primary-600 mt-0.5 flex-shrink-0">
                <MapPin size={22} strokeWidth={1.5} />
              </div>
              <div>
                <p className="font-display text-sm text-neutral-900 mb-1">{t('contact.address')}</p>
                <p className="font-body text-neutral-600">{contact.address}</p>
              </div>
            </div>
          )}
          {contact.phone && (
            <div className="flex items-start gap-4">
              <div className="text-primary-600 mt-0.5 flex-shrink-0">
                <Phone size={22} strokeWidth={1.5} />
              </div>
              <div>
                <p className="font-display text-sm text-neutral-900 mb-1">{t('contact.phone')}</p>
                <a
                  href={`tel:${contact.phone}`}
                  className="font-body text-neutral-600 hover:text-primary-600 transition-colors"
                >
                  {contact.phone}
                </a>
              </div>
            </div>
          )}
          {contact.email && (
            <div className="flex items-start gap-4">
              <div className="text-primary-600 mt-0.5 flex-shrink-0">
                <Mail size={22} strokeWidth={1.5} />
              </div>
              <div>
                <p className="font-display text-sm text-neutral-900 mb-1">{t('contact.email')}</p>
                <a
                  href={`mailto:${contact.email}`}
                  className="font-body text-neutral-600 hover:text-primary-600 transition-colors"
                >
                  {contact.email}
                </a>
              </div>
            </div>
          )}
          {contact.whatsapp && (
            <a
              href={`https://wa.me/${contact.whatsapp.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-[#25D366] text-white px-5 py-3 rounded-brand font-body text-sm hover:bg-[#1ebe5d] transition-colors"
            >
              <MessageCircle size={18} />
              {t('contact.whatsapp')}
            </a>
          )}

          {contact.mapEmbedUrl && (
            <div className="mt-6 rounded-brand overflow-hidden h-56">
              <iframe
                src={contact.mapEmbedUrl}
                className="w-full h-full border-0"
                loading="lazy"
                title={t('contact.mapTitle')}
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          )}
        </div>

        {/* Formulario */}
        {contact.showForm && (
          <div className="bg-white rounded-brand p-8 shadow-sm">
            {status === 'success' ? (
              <div className="text-center py-8">
                <p className="font-display text-2xl text-neutral-900 mb-2">{t('contact.successTitle')}</p>
                <p className="font-body text-neutral-600">{t('contact.successText')}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className={labelClass}>{t('contact.name')}{t('contact.required')}</label>
                  <input
                    name="name" value={fields.name} onChange={handleChange} required
                    placeholder={t('contact.namePlaceholder')}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>{t('contact.email')}{t('contact.required')}</label>
                  <input
                    name="email" type="email" value={fields.email} onChange={handleChange} required
                    placeholder={t('contact.emailPlaceholder')}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>{t('contact.message')}{t('contact.required')}</label>
                  <textarea
                    name="message" value={fields.message} onChange={handleChange} required
                    rows={4} placeholder={t('contact.messagePlaceholder')}
                    className={`${inputClass} resize-none`}
                  />
                </div>
                {status === 'error' && (
                  <p className="text-red-600 font-body text-sm">{t('contact.error')}</p>
                )}
                <Button
                  type="submit" size="lg" className="w-full"
                  disabled={status === 'sending'}
                >
                  {status === 'sending' ? t('contact.sending') : t('contact.submit')}
                </Button>
              </form>
            )}
          </div>
        )}
      </div>
    </SectionWrapper>
  )
}
