import { useState } from 'react'
import { ChevronLeft, ChevronRight, Clock, MessageCircle, Mail, Info } from 'lucide-react'

function DemoNotice({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full text-center">
        <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Info size={22} className="text-amber-600" />
        </div>
        <h3 className="font-semibold text-gray-900 mb-2">Proyecto de demostración</h3>
        <p className="text-sm text-gray-500 mb-5">Esta es una web de ejemplo. Para solicitar una web real, contacta con <span className="font-medium text-gray-700">Solimar&Co.</span></p>
        <a href="mailto:solimarcoweb@gmail.com" className="block w-full bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium py-2.5 rounded-xl transition-colors mb-2">
          solimarcoweb@gmail.com
        </a>
        <button onClick={onClose} className="text-sm text-gray-400 hover:text-gray-600 transition-colors">Cerrar</button>
      </div>
    </div>
  )
}
import type { Appointment } from './mockData'

interface Props {
  appointments: Appointment[]
  onConfirm: (id: string) => void
  onCancel:  (id: string) => void
}

const STATUS_COLOR: Record<string, string> = {
  pending:   'bg-amber-100 border-amber-300 text-amber-800',
  confirmed: 'bg-emerald-100 border-emerald-300 text-emerald-800',
  cancelled: 'bg-red-100 border-red-200 text-red-500 opacity-50',
  completed: 'bg-neutral-100 border-neutral-300 text-neutral-500',
}

const HOURS = Array.from({ length: 12 }, (_, i) => `${String(i + 9).padStart(2, '0')}:00`)
const DAY_NAMES = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

function getWeekDates(baseMonday: Date): Date[] {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(baseMonday); d.setDate(baseMonday.getDate() + i); return d
  })
}

function getMonday(d: Date): Date {
  const date = new Date(d)
  const day = date.getDay()
  const diff = day === 0 ? -6 : 1 - day
  date.setDate(date.getDate() + diff)
  date.setHours(0, 0, 0, 0)
  return date
}

function toDateStr(d: Date) { return d.toISOString().split('T')[0] }

function timeToRow(time: string): number {
  const [h, m] = time.split(':').map(Number)
  return (h - 9) * 2 + (m >= 30 ? 1 : 0)  // cada fila = 30min
}

function durationToRows(minutes: number): number {
  return Math.ceil(minutes / 30)
}

export function AppointmentsCalendar({ appointments, onConfirm, onCancel }: Props) {
  const [monday, setMonday] = useState(() => getMonday(new Date()))
  const [selected, setSelected] = useState<Appointment | null>(null)
  const [showDemo, setShowDemo] = useState(false)
  const weekDates = getWeekDates(monday)

  const prevWeek = () => { const d = new Date(monday); d.setDate(d.getDate() - 7); setMonday(d) }
  const nextWeek = () => { const d = new Date(monday); d.setDate(d.getDate() + 7); setMonday(d) }
  const thisWeek = () => setMonday(getMonday(new Date()))

  const totalRows = 24  // 12h × 2 (cada fila = 30min)

  return (
    <div className="space-y-4">
      {/* Cabecera de navegación */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button onClick={prevWeek} className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"><ChevronLeft size={18} /></button>
          <span className="text-sm font-medium text-neutral-700">
            {weekDates[0].toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })} — {weekDates[6].toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}
          </span>
          <button onClick={nextWeek} className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"><ChevronRight size={18} /></button>
        </div>
        <button onClick={thisWeek} className="text-xs text-primary-600 hover:text-primary-700 font-medium border border-primary-200 px-3 py-1.5 rounded-lg transition-colors">
          Esta semana
        </button>
      </div>

      {/* Grid */}
      <div className="overflow-x-auto">
        <div className="min-w-[700px]">
          {/* Header días */}
          <div className="grid grid-cols-8 gap-px bg-neutral-200 rounded-t-xl overflow-hidden">
            <div className="bg-white py-3" />
            {weekDates.map((d, i) => {
              const isToday = toDateStr(d) === toDateStr(new Date())
              return (
                <div key={i} className={`bg-white py-3 text-center ${isToday ? 'bg-primary-50' : ''}`}>
                  <p className={`text-xs font-medium ${isToday ? 'text-primary-600' : 'text-neutral-400'}`}>{DAY_NAMES[d.getDay()]}</p>
                  <p className={`text-sm font-bold ${isToday ? 'text-primary-600' : 'text-neutral-900'}`}>{d.getDate()}</p>
                </div>
              )
            })}
          </div>

          {/* Body */}
          <div className="grid grid-cols-8 gap-px bg-neutral-200">
            {/* Columna de horas */}
            <div className="bg-white">
              {HOURS.map(h => (
                <div key={h} className="h-14 flex items-start pt-1 px-2">
                  <span className="text-xs text-neutral-400">{h}</span>
                </div>
              ))}
            </div>

            {/* Columnas de días */}
            {weekDates.map((date, di) => {
              const dateStr = toDateStr(date)
              const dayAppts = appointments.filter(a => a.date === dateStr && a.status !== 'cancelled')
              const isToday = dateStr === toDateStr(new Date())

              return (
                <div key={di} className={`relative bg-white ${isToday ? 'bg-primary-50/30' : ''}`} style={{ height: `${totalRows * 28}px` }}>
                  {/* Líneas de hora */}
                  {HOURS.map((_, hi) => (
                    <div key={hi} className="absolute w-full border-t border-neutral-100" style={{ top: `${hi * 56}px` }} />
                  ))}

                  {/* Bloques de cita */}
                  {dayAppts.map(a => {
                    const row = timeToRow(a.time)
                    const rows = durationToRows(a.duration)
                    const top = row * 28
                    const height = rows * 28 - 2

                    return (
                      <button
                        key={a.id}
                        onClick={() => setSelected(a)}
                        style={{ top: `${top}px`, height: `${height}px` }}
                        className={`absolute left-0.5 right-0.5 rounded-lg border text-left px-1.5 py-1 overflow-hidden hover:shadow-md transition-shadow ${STATUS_COLOR[a.status]}`}
                      >
                        <p className="text-xs font-semibold leading-tight truncate">{a.time} {a.clientName}</p>
                        {height > 36 && <p className="text-xs leading-tight truncate opacity-75">{a.service}</p>}
                      </button>
                    )
                  })}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Panel detalle de cita seleccionada */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full" onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-neutral-900">{selected.clientName}</h3>
                <p className="text-sm text-neutral-500">{selected.service}</p>
              </div>
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${STATUS_COLOR[selected.status]}`}>
                {{ pending: 'Pendiente', confirmed: 'Confirmada', cancelled: 'Cancelada', completed: 'Completada' }[selected.status]}
              </span>
            </div>

            <div className="space-y-2 mb-5 text-sm text-neutral-600">
              <p className="flex items-center gap-2"><Clock size={14} className="text-primary-600" />
                {new Date(selected.date+'T12:00').toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })} · {selected.time} ({selected.duration} min)
              </p>
              <p className="flex items-center gap-2">
                {selected.confirmVia === 'whatsapp'
                  ? <><MessageCircle size={14} className="text-emerald-500" />{selected.phone}</>
                  : <><Mail size={14} className="text-primary-500" />{selected.email}</>
                }
              </p>
              {selected.notes && <p className="italic text-neutral-400 text-xs">"{selected.notes}"</p>}
            </div>

            {selected.status === 'pending' && (
              <div className="flex gap-2">
                <button onClick={() => { onConfirm(selected.id); setSelected(null) }}
                  className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium py-2.5 rounded-xl transition-colors">
                  Confirmar
                </button>
                <button onClick={() => { onCancel(selected.id); setSelected(null) }}
                  className="flex-1 border border-red-200 text-red-500 hover:bg-red-50 text-sm font-medium py-2.5 rounded-xl transition-colors">
                  Cancelar
                </button>
              </div>
            )}
            {selected.status === 'confirmed' && selected.confirmVia === 'whatsapp' && (
              <button onClick={() => setShowDemo(true)}
                className="flex items-center justify-center gap-2 w-full bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium py-2.5 rounded-xl transition-colors">
                <MessageCircle size={15} /> Contactar por WhatsApp
              </button>
            )}
            <button onClick={() => setSelected(null)} className="w-full mt-2 text-sm text-neutral-400 hover:text-neutral-600 transition-colors py-1">Cerrar</button>
          </div>
        </div>
      )}
      {showDemo && <DemoNotice onClose={() => setShowDemo(false)} />}
    </div>
  )
}
