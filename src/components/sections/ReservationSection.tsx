import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { ReservationConfig } from '@/types'
import { supabase } from '@/lib/supabase'
import { SectionWrapper, SectionHeader } from '@/components/ui/SectionWrapper'
import { Button } from '@/components/ui/Button'
import { CalendarDays, Clock, Users, CheckCircle } from 'lucide-react'

interface ReservationProps {
  reservation: ReservationConfig
}

interface ReservationFields {
  name: string; email: string; phone: string
  date: string; time: string; guests: string; notes: string
}

const initialFields: ReservationFields = {
  name: '', email: '', phone: '', date: '', time: '', guests: '2', notes: '',
}

const timeSlots = [
  '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
  '20:00', '20:30', '21:00', '21:30', '22:00', '22:30',
]

export function ReservationSection({ reservation }: ReservationProps) {
  const { t } = useTranslation()
  const [fields, setFields] = useState<ReservationFields>(initialFields)
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => setFields((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    try {
      const { error } = await supabase.from('reservations').insert([{
        name: fields.name,
        email: fields.email,
        phone: fields.phone,
        date: fields.date,
        time: fields.time,
        guests: fields.guests,
        notes: fields.notes || null,
        status: 'pending',
      }])
      if (error) throw error
      setStatus('success')
      setFields(initialFields)
    } catch {
      setStatus('error')
    }
  }

  const inputClass = 'w-full border border-neutral-200 rounded-brand px-4 py-3 font-body text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-400 transition'
  const labelClass = 'font-body text-sm text-neutral-700 block mb-1'

  if (reservation.provider !== 'custom' && reservation.embedUrl) {
    return (
      <SectionWrapper id="reservas" bg="primary">
        <SectionHeader title={t('reservation.title', { defaultValue: reservation.title ?? '' })} />
        <iframe
          src={reservation.embedUrl}
          className="w-full h-[600px] rounded-brand border-0"
          title={t('reservation.bookingSystem')}
          loading="lazy"
        />
      </SectionWrapper>
    )
  }

  if (status === 'success') {
    return (
      <SectionWrapper id="reservas" bg="primary">
        <div className="text-center py-16">
          <CheckCircle className="mx-auto text-accent-400 mb-4" size={56} strokeWidth={1.5} />
          <h2 className="font-display text-3xl text-neutral-900 mb-4">
            {t('reservation.successTitle')}
          </h2>
          <p className="font-body text-neutral-600 mb-8">
            {t('reservation.successText')}
          </p>
          <Button variant="outline" onClick={() => setStatus('idle')}>
            {t('reservation.another')}
          </Button>
        </div>
      </SectionWrapper>
    )
  }

  return (
    <SectionWrapper id="reservas" bg="primary">
      <SectionHeader title={reservation.title ?? t('reservation.title')} />

      <div className="max-w-2xl mx-auto bg-white rounded-brand shadow-sm p-8">
        <form onSubmit={handleSubmit} className="space-y-6">

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>{t('reservation.name')}{t('reservation.required')}</label>
              <input
                name="name" value={fields.name} onChange={handleChange} required
                placeholder={t('reservation.namePlaceholder')}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>{t('reservation.phone')}{t('reservation.required')}</label>
              <input
                name="phone" type="tel" value={fields.phone} onChange={handleChange} required
                placeholder={t('reservation.phonePlaceholder')}
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>{t('reservation.email')}{t('reservation.required')}</label>
            <input
              name="email" type="email" value={fields.email} onChange={handleChange} required
              placeholder={t('reservation.emailPlaceholder')}
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className={`${labelClass} flex items-center gap-1`}>
                <CalendarDays size={14} /> {t('reservation.date')}{t('reservation.required')}
              </label>
              <input
                name="date" type="date" value={fields.date} onChange={handleChange} required
                min={new Date().toISOString().split('T')[0]}
                className={inputClass}
              />
            </div>
            <div>
              <label className={`${labelClass} flex items-center gap-1`}>
                <Clock size={14} /> {t('reservation.time')}{t('reservation.required')}
              </label>
              <select
                name="time" value={fields.time} onChange={handleChange} required
                className={inputClass}
              >
                <option value="">{t('reservation.selectTime')}</option>
                {timeSlots.map((slot) => <option key={slot} value={slot}>{slot}</option>)}
              </select>
            </div>
            <div>
              <label className={`${labelClass} flex items-center gap-1`}>
                <Users size={14} /> {t('reservation.guests')}{t('reservation.required')}
              </label>
              <select
                name="guests" value={fields.guests} onChange={handleChange}
                className={inputClass}
              >
                {[1,2,3,4,5,6,7,8,9,10].map((n) => (
                  <option key={n} value={String(n)}>
                    {n} {n === 1 ? t('reservation.person') : t('reservation.people')}
                  </option>
                ))}
                <option value="mas">{t('reservation.moreGuests')}</option>
              </select>
            </div>
          </div>

          <div>
            <label className={labelClass}>{t('reservation.notes')}</label>
            <textarea
              name="notes" value={fields.notes} onChange={handleChange} rows={3}
              placeholder={t('reservation.notesPlaceholder')}
              className={`${inputClass} resize-none`}
            />
          </div>

          {status === 'error' && (
            <p className="text-red-600 font-body text-sm text-center">
              {t('contact.error')}
            </p>
          )}

          <Button type="submit" size="lg" className="w-full" disabled={status === 'sending'}>
            {status === 'sending' ? t('reservation.sending') : t('reservation.submit')}
          </Button>
        </form>
      </div>
    </SectionWrapper>
  )
}
