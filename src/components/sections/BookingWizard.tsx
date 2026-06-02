import { useState } from 'react'
import { Check, ChevronRight, ChevronLeft, MessageCircle, Mail, Clock, Euro } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { SectionWrapper, SectionHeader } from '@/components/ui/SectionWrapper'

// ─── Mock data ────────────────────────────────────────────────────────────────

export interface ClinicService {
  id: string
  name: string
  duration: number  // minutos
  price: number
  description: string
  category: string
}

export interface TimeSlot {
  time: string   // "10:00"
  available: boolean
}

// Servicios mock — se reemplaza con Supabase
export const MOCK_SERVICES: ClinicService[] = [
  { id: '1', name: 'Limpieza facial profunda',   duration: 60,  price: 55,  description: 'Limpieza completa con extracción y mascarilla hidratante.',         category: 'Facial' },
  { id: '2', name: 'Tratamiento antiedad',        duration: 75,  price: 80,  description: 'Protocolo completo con radiofrecuencia y mesoterapia vitamínica.',   category: 'Facial' },
  { id: '3', name: 'Hidratación intensiva',       duration: 45,  price: 45,  description: 'Ácido hialurónico + vitamina C. Piel luminosa desde la 1ª sesión.', category: 'Facial' },
  { id: '4', name: 'Depilación láser — piernas',  duration: 45,  price: 90,  description: 'Láser diodo de última generación. Apto para todos los fototipos.',   category: 'Láser' },
  { id: '5', name: 'Depilación láser — axilas',   duration: 20,  price: 35,  description: 'Sesión rápida y efectiva. Resultados desde la primera sesión.',      category: 'Láser' },
  { id: '6', name: 'Tratamiento reductor',        duration: 60,  price: 70,  description: 'Cavitación + presoterapia. Resultados visibles en pocas sesiones.',  category: 'Corporal' },
  { id: '7', name: 'Masaje relajante',            duration: 60,  price: 50,  description: 'Masaje de cuerpo completo con aceites esenciales. Desconexión total.', category: 'Masaje' },
  { id: '8', name: 'Drenaje linfático',           duration: 60,  price: 55,  description: 'Técnica manual para eliminar toxinas y reducir la retención.',       category: 'Masaje' },
]

// Genera slots de 9:00 a 19:00 cada 30 min (simplificado)
function generateSlots(date: Date, bookedTimes: string[]): TimeSlot[] {
  const slots: TimeSlot[] = []
  const day = date.getDay() // 0=dom, 6=sab
  if (day === 0) return [] // domingo cerrado
  const endHour = day === 6 ? 14 : 20
  for (let h = 9; h < endHour; h++) {
    for (const m of [0, 30]) {
      if (h === endHour - 1 && m === 30) continue
      const time = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
      slots.push({ time, available: !bookedTimes.includes(time) })
    }
  }
  return slots
}

// Citas ya reservadas (mock)
const BOOKED: Record<string, string[]> = {
  [new Date(Date.now() + 86400000).toDateString()]: ['10:00', '11:00', '15:30'],
  [new Date(Date.now() + 172800000).toDateString()]: ['09:00', '10:30', '12:00', '16:00'],
}

// ─── Step components ──────────────────────────────────────────────────────────

function StepIndicator({ current, total }: { current: number; total: number }) {
  const labels = ['Tratamiento', 'Fecha', 'Hora', 'Tus datos']
  return (
    <div className="flex items-center justify-center mb-10 gap-0">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className="flex items-center">
          <div className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
              i < current ? 'bg-primary-600 text-white'
              : i === current ? 'bg-primary-600 text-white ring-4 ring-primary-100'
              : 'bg-neutral-200 text-neutral-400'
            }`}>
              {i < current ? <Check size={14} /> : i + 1}
            </div>
            <span className={`text-xs mt-1.5 hidden sm:block ${i === current ? 'text-primary-600 font-medium' : 'text-neutral-400'}`}>
              {labels[i]}
            </span>
          </div>
          {i < total - 1 && (
            <div className={`w-12 sm:w-20 h-0.5 mx-1 mb-4 transition-colors ${i < current ? 'bg-primary-600' : 'bg-neutral-200'}`} />
          )}
        </div>
      ))}
    </div>
  )
}

// ─── Main wizard ──────────────────────────────────────────────────────────────

interface BookingForm {
  service: ClinicService | null
  date: Date | null
  time: string
  name: string
  phone: string
  email: string
  notes: string
  confirmVia: 'whatsapp' | 'email'
}

const EMPTY_FORM: BookingForm = {
  service: null, date: null, time: '', name: '', phone: '', email: '', notes: '', confirmVia: 'whatsapp',
}

// Fecha mínima = mañana
function minDate() {
  const d = new Date(); d.setDate(d.getDate() + 1); return d
}
function toInputDate(d: Date) {
  return d.toISOString().split('T')[0]
}
function isSunday(d: Date) { return d.getDay() === 0 }

export function BookingWizard() {
  const { t } = useTranslation()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState<BookingForm>(EMPTY_FORM)
  const [done, setDone] = useState(false)
  const [catFilter, setCatFilter] = useState('Todos')

  const categories = ['Todos', ...Array.from(new Set(MOCK_SERVICES.map(s => s.category)))]
  const filtered = catFilter === 'Todos' ? MOCK_SERVICES : MOCK_SERVICES.filter(s => s.category === catFilter)

  const slots = form.date ? generateSlots(form.date, BOOKED[form.date.toDateString()] ?? []) : []

  const handleSubmit = () => {
    if (form.confirmVia === 'whatsapp' && form.phone) {
      const msg = encodeURIComponent(
        `Hola, quiero solicitar una cita:\n• Tratamiento: ${form.service?.name}\n• Fecha: ${form.date?.toLocaleDateString('es-ES')}\n• Hora: ${form.time}\n• Nombre: ${form.name}`
      )
      window.open(`https://wa.me/34600456789?text=${msg}`, '_blank')
    }
    setDone(true)
  }

  const inputCls = 'w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all'

  if (done) {
    return (
      <SectionWrapper id="cita" bg="neutral">
        <div className="max-w-md mx-auto text-center py-8">
          <div className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check size={36} className="text-primary-600" />
          </div>
          <h3 className="font-display text-2xl text-neutral-900 mb-3">{t('booking.successTitle')}</h3>
          <p className="text-neutral-500 mb-2">{t('booking.successText')}</p>
          <div className="bg-white rounded-2xl border border-neutral-200 p-5 text-left mt-6 mb-8 space-y-2">
            <p className="text-sm"><span className="font-medium text-neutral-700">Tratamiento:</span> <span className="text-neutral-500">{form.service?.name}</span></p>
            <p className="text-sm"><span className="font-medium text-neutral-700">Fecha:</span> <span className="text-neutral-500">{form.date?.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}</span></p>
            <p className="text-sm"><span className="font-medium text-neutral-700">Hora:</span> <span className="text-neutral-500">{form.time}</span></p>
            <p className="text-sm"><span className="font-medium text-neutral-700">Confirmación vía:</span> <span className="text-neutral-500">{form.confirmVia === 'whatsapp' ? `WhatsApp (${form.phone})` : `Email (${form.email})`}</span></p>
          </div>
          <button onClick={() => { setDone(false); setStep(0); setForm(EMPTY_FORM) }}
            className="text-primary-600 hover:text-primary-700 text-sm font-medium transition-colors">
            {t('booking.another')}
          </button>
        </div>
      </SectionWrapper>
    )
  }

  return (
    <SectionWrapper id="cita" bg="neutral">
      <SectionHeader
        title={t('booking.title', { defaultValue: 'Pide tu cita' })}
        subtitle={t('booking.subtitle', { defaultValue: 'Online, rápido y sin esperas' })}
      />

      <div className="max-w-2xl mx-auto">
        <StepIndicator current={step} total={4} />

        {/* ── PASO 1: Tratamiento ── */}
        {step === 0 && (
          <div>
            <div className="flex flex-wrap gap-2 justify-center mb-6">
              {categories.map(cat => (
                <button key={cat} onClick={() => setCatFilter(cat)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${catFilter === cat ? 'bg-primary-600 text-white' : 'bg-white text-neutral-500 border border-neutral-200 hover:border-primary-300'}`}>
                  {cat}
                </button>
              ))}
            </div>
            <div className="space-y-3">
              {filtered.map(service => (
                <button key={service.id} onClick={() => { setForm(f => ({ ...f, service, time: '', date: null })); setStep(1) }}
                  className={`w-full text-left bg-white border rounded-2xl p-5 hover:border-primary-400 hover:shadow-sm transition-all group ${form.service?.id === service.id ? 'border-primary-500 ring-1 ring-primary-400' : 'border-neutral-200'}`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs bg-primary-50 text-primary-700 px-2 py-0.5 rounded-full font-medium">{service.category}</span>
                      </div>
                      <p className="font-semibold text-neutral-900 text-sm mb-1">{service.name}</p>
                      <p className="text-xs text-neutral-500 leading-relaxed">{service.description}</p>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <p className="font-bold text-primary-600 text-base">{service.price} €</p>
                      <p className="text-xs text-neutral-400 flex items-center gap-1 justify-end mt-0.5"><Clock size={11} />{service.duration} min</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── PASO 2: Fecha ── */}
        {step === 1 && (
          <div className="text-center">
            <div className="bg-white border border-neutral-200 rounded-2xl p-8 max-w-sm mx-auto">
              {form.service && (
                <div className="mb-6 pb-4 border-b border-neutral-100 flex items-center justify-between text-sm">
                  <span className="font-medium text-neutral-700">{form.service.name}</span>
                  <span className="text-primary-600 font-bold">{form.service.price} €</span>
                </div>
              )}
              <label className="block text-sm font-medium text-neutral-700 mb-3">Elige una fecha</label>
              <input
                type="date"
                min={toInputDate(minDate())}
                value={form.date ? toInputDate(form.date) : ''}
                onChange={e => {
                  const d = new Date(e.target.value + 'T12:00:00')
                  if (!isSunday(d)) setForm(f => ({ ...f, date: d, time: '' }))
                }}
                className={`${inputCls} text-center`}
              />
              {form.date && isSunday(form.date) && (
                <p className="text-xs text-red-500 mt-2">Los domingos estamos cerradas</p>
              )}
              {form.date && !isSunday(form.date) && (
                <p className="text-xs text-neutral-400 mt-2">
                  {form.date.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
                </p>
              )}
            </div>
            <div className="flex gap-3 justify-center mt-6">
              <button onClick={() => setStep(0)} className="flex items-center gap-1 px-5 py-2.5 text-sm text-neutral-500 hover:text-neutral-700 border border-neutral-200 rounded-xl transition-colors">
                <ChevronLeft size={16} /> Atrás
              </button>
              <button onClick={() => setStep(2)} disabled={!form.date || isSunday(form.date!)}
                className="flex items-center gap-1 px-6 py-2.5 text-sm bg-primary-600 hover:bg-primary-700 disabled:opacity-40 text-white rounded-xl font-medium transition-colors">
                Siguiente <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* ── PASO 3: Hora ── */}
        {step === 2 && (
          <div>
            <div className="bg-white border border-neutral-200 rounded-2xl p-6">
              <p className="text-sm font-medium text-neutral-700 mb-4">
                {form.date?.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
              </p>
              {slots.length === 0 ? (
                <p className="text-sm text-neutral-400 text-center py-6">{t('booking.noSlots')}</p>
              ) : (
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {slots.map(slot => (
                    <button key={slot.time} disabled={!slot.available}
                      onClick={() => setForm(f => ({ ...f, time: slot.time }))}
                      className={`py-2 text-sm rounded-xl border font-medium transition-all ${
                        !slot.available ? 'bg-neutral-100 text-neutral-300 border-neutral-100 cursor-not-allowed line-through'
                        : form.time === slot.time ? 'bg-primary-600 text-white border-primary-600 shadow-sm'
                        : 'bg-white text-neutral-700 border-neutral-200 hover:border-primary-400'
                      }`}>
                      {slot.time}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="flex gap-3 justify-center mt-6">
              <button onClick={() => setStep(1)} className="flex items-center gap-1 px-5 py-2.5 text-sm text-neutral-500 hover:text-neutral-700 border border-neutral-200 rounded-xl transition-colors">
                <ChevronLeft size={16} /> Atrás
              </button>
              <button onClick={() => setStep(3)} disabled={!form.time}
                className="flex items-center gap-1 px-6 py-2.5 text-sm bg-primary-600 hover:bg-primary-700 disabled:opacity-40 text-white rounded-xl font-medium transition-colors">
                Siguiente <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* ── PASO 4: Datos del cliente ── */}
        {step === 3 && (
          <div>
            {/* Resumen */}
            <div className="bg-primary-50 border border-primary-100 rounded-2xl p-4 mb-6 flex flex-wrap gap-4 text-sm">
              <span className="flex items-center gap-1.5 text-primary-700"><Clock size={14} /> {form.service?.name}</span>
              <span className="text-primary-400">·</span>
              <span className="text-primary-700">{form.date?.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}</span>
              <span className="text-primary-400">·</span>
              <span className="text-primary-700">{form.time}</span>
              <span className="text-primary-400">·</span>
              <span className="flex items-center gap-1 text-primary-700 font-semibold"><Euro size={13} />{form.service?.price}</span>
            </div>

            <div className="bg-white border border-neutral-200 rounded-2xl p-6 space-y-4">
              <div>
                <label className="text-xs text-neutral-500 block mb-1.5">Nombre completo *</label>
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Tu nombre" className={inputCls} />
              </div>

              {/* Canal de confirmación */}
              <div>
                <label className="text-xs text-neutral-500 block mb-2">¿Cómo prefieres la confirmación? *</label>
                <div className="grid grid-cols-2 gap-3">
                  <button type="button" onClick={() => setForm(f => ({ ...f, confirmVia: 'whatsapp' }))}
                    className={`flex items-center justify-center gap-2 py-3 rounded-xl border text-sm font-medium transition-all ${form.confirmVia === 'whatsapp' ? 'bg-emerald-50 border-emerald-400 text-emerald-700' : 'bg-white border-neutral-200 text-neutral-500 hover:border-neutral-300'}`}>
                    <MessageCircle size={16} /> WhatsApp
                  </button>
                  <button type="button" onClick={() => setForm(f => ({ ...f, confirmVia: 'email' }))}
                    className={`flex items-center justify-center gap-2 py-3 rounded-xl border text-sm font-medium transition-all ${form.confirmVia === 'email' ? 'bg-primary-50 border-primary-400 text-primary-700' : 'bg-white border-neutral-200 text-neutral-500 hover:border-neutral-300'}`}>
                    <Mail size={16} /> Email
                  </button>
                </div>
              </div>

              {form.confirmVia === 'whatsapp' && (
                <div>
                  <label className="text-xs text-neutral-500 block mb-1.5">Teléfono (WhatsApp) *</label>
                  <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+34 600 000 000" className={inputCls} />
                </div>
              )}
              {form.confirmVia === 'email' && (
                <div>
                  <label className="text-xs text-neutral-500 block mb-1.5">Email *</label>
                  <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="tu@email.com" className={inputCls} />
                </div>
              )}

              <div>
                <label className="text-xs text-neutral-500 block mb-1.5">Notas especiales</label>
                <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                  rows={2} placeholder="Alguna preferencia o necesidad especial..." className={`${inputCls} resize-none`} />
              </div>
            </div>

            <div className="flex gap-3 justify-center mt-6">
              <button onClick={() => setStep(2)} className="flex items-center gap-1 px-5 py-2.5 text-sm text-neutral-500 hover:text-neutral-700 border border-neutral-200 rounded-xl transition-colors">
                <ChevronLeft size={16} /> Atrás
              </button>
              <button
                onClick={handleSubmit}
                disabled={!form.name.trim() || (form.confirmVia === 'whatsapp' ? !form.phone.trim() : !form.email.trim())}
                className="flex items-center gap-2 px-8 py-2.5 text-sm bg-primary-600 hover:bg-primary-700 disabled:opacity-40 text-white rounded-xl font-medium transition-colors">
                <Check size={16} /> Solicitar cita
              </button>
            </div>
          </div>
        )}
      </div>
    </SectionWrapper>
  )
}
