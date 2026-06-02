import { useState } from 'react'
import type { ReservationConfig } from '@/types'
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
  const [fields, setFields] = useState<ReservationFields>(initialFields)
  const [status, setStatus] = useState<'idle' | 'sending' | 'success'>('idle')

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => setFields((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    // Simula envío — conectar con tu backend o Formspree
    await new Promise((r) => setTimeout(r, 1200))
    setStatus('success')
  }

  // Si usa embed externo (Reservio, etc.)
  if (reservation.provider !== 'custom' && reservation.embedUrl) {
    return (
      <SectionWrapper id="reservas" bg="primary">
        <SectionHeader title={reservation.title ?? 'Reserva tu mesa'} />
        <iframe
          src={reservation.embedUrl}
          className="w-full h-[600px] rounded-brand border-0"
          title="Sistema de reservas"
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
          <h2 className="font-display text-3xl text-neutral-900 mb-4">¡Reserva recibida!</h2>
          <p className="font-body text-neutral-600 mb-8">
            Te confirmaremos por email o teléfono en menos de 2 horas.
          </p>
          <Button variant="outline" onClick={() => setStatus('idle')}>
            Hacer otra reserva
          </Button>
        </div>
      </SectionWrapper>
    )
  }

  return (
    <SectionWrapper id="reservas" bg="primary">
      <SectionHeader title={reservation.title ?? 'Reserva tu mesa'} />

      <div className="max-w-2xl mx-auto bg-white rounded-brand shadow-sm p-8">
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Name + phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-body text-sm text-neutral-700 block mb-1">Nombre *</label>
              <input
                name="name" value={fields.name} onChange={handleChange} required
                placeholder="Tu nombre"
                className="w-full border border-neutral-200 rounded-brand px-4 py-3 font-body text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-400 transition"
              />
            </div>
            <div>
              <label className="font-body text-sm text-neutral-700 block mb-1">Teléfono *</label>
              <input
                name="phone" type="tel" value={fields.phone} onChange={handleChange} required
                placeholder="+34 600 000 000"
                className="w-full border border-neutral-200 rounded-brand px-4 py-3 font-body text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-400 transition"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="font-body text-sm text-neutral-700 block mb-1">Email *</label>
            <input
              name="email" type="email" value={fields.email} onChange={handleChange} required
              placeholder="tu@email.com"
              className="w-full border border-neutral-200 rounded-brand px-4 py-3 font-body text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-400 transition"
            />
          </div>

          {/* Date + time + guests */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="font-body text-sm text-neutral-700 flex items-center gap-1 mb-1">
                <CalendarDays size={14} /> Fecha *
              </label>
              <input
                name="date" type="date" value={fields.date} onChange={handleChange} required
                min={new Date().toISOString().split('T')[0]}
                className="w-full border border-neutral-200 rounded-brand px-4 py-3 font-body text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-400 transition"
              />
            </div>
            <div>
              <label className="font-body text-sm text-neutral-700 flex items-center gap-1 mb-1">
                <Clock size={14} /> Hora *
              </label>
              <select
                name="time" value={fields.time} onChange={handleChange} required
                className="w-full border border-neutral-200 rounded-brand px-4 py-3 font-body text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-400 transition"
              >
                <option value="">Selecciona</option>
                {timeSlots.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="font-body text-sm text-neutral-700 flex items-center gap-1 mb-1">
                <Users size={14} /> Comensales *
              </label>
              <select
                name="guests" value={fields.guests} onChange={handleChange}
                className="w-full border border-neutral-200 rounded-brand px-4 py-3 font-body text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-400 transition"
              >
                {[1,2,3,4,5,6,7,8,9,10].map((n) => (
                  <option key={n} value={String(n)}>{n} {n === 1 ? 'persona' : 'personas'}</option>
                ))}
                <option value="mas">Más de 10 (grupos)</option>
              </select>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="font-body text-sm text-neutral-700 block mb-1">
              Notas o peticiones especiales
            </label>
            <textarea
              name="notes" value={fields.notes} onChange={handleChange} rows={3}
              placeholder="Alergias, celebraciones, silla para bebé..."
              className="w-full border border-neutral-200 rounded-brand px-4 py-3 font-body text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-400 transition resize-none"
            />
          </div>

          <Button type="submit" size="lg" className="w-full" disabled={status === 'sending'}>
            {status === 'sending' ? 'Enviando...' : 'Confirmar reserva'}
          </Button>
        </form>
      </div>
    </SectionWrapper>
  )
}
