import { useState } from 'react'
import { MessageCircle, Mail, Clock, CalendarDays, CheckCircle2, XCircle, AlertCircle, Info } from 'lucide-react'
import type { Appointment } from './mockData'

interface Props {
  appointments: Appointment[]
  onConfirm: (id: string) => void
  onCancel:  (id: string) => void
}

function DemoNotice({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full text-center">
        <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Info size={22} className="text-amber-600" />
        </div>
        <h3 className="font-semibold text-gray-900 mb-2">Proyecto de demostración</h3>
        <p className="text-sm text-gray-500 mb-5">Esta es una web de ejemplo. Para solicitar una web real, contacta con <span className="font-medium text-gray-700">Solimar&Co.</span></p>
        <a href="mailto:solimarcoweb@gmail.com" className="block w-full bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium py-2.5 rounded-xl transition-colors mb-2">
          solimarcoweb@gmail.com
        </a>
        <button onClick={onClose} className="text-sm text-gray-400 hover:text-gray-600 transition-colors">Cerrar</button>
      </div>
    </div>
  )
}

const STATUS_STYLE: Record<string, string> = {
  pending:   'bg-amber-50 text-amber-700 border-amber-200',
  confirmed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  cancelled: 'bg-red-50 text-red-500 border-red-200',
  completed: 'bg-neutral-100 text-neutral-500 border-neutral-200',
}
const STATUS_LABEL: Record<string, string> = {
  pending: 'Pendiente', confirmed: 'Confirmada', cancelled: 'Cancelada', completed: 'Completada',
}

function StatCard({ label, value, sub, color }: { label: string; value: number; sub?: string; color: string }) {
  return (
    <div className="bg-white rounded-2xl border border-neutral-200 p-5">
      <p className="text-sm text-neutral-500 mb-1">{label}</p>
      <p className={`text-3xl font-bold ${color}`}>{value}</p>
      {sub && <p className="text-xs text-neutral-400 mt-1">{sub}</p>}
    </div>
  )
}

export function AppointmentsDashboard({ appointments, onConfirm, onCancel }: Props) {
  const [showDemo, setShowDemo] = useState(false)
  const todayStr = new Date().toISOString().split('T')[0]
  const todayCitas = appointments.filter(a => a.date === todayStr && a.status !== 'cancelled')
  const pending    = appointments.filter(a => a.status === 'pending').length
  const confirmed  = appointments.filter(a => a.status === 'confirmed').length
  const thisWeek   = appointments.filter(a => {
    const d = new Date(a.date); const now = new Date()
    const start = new Date(now); start.setDate(now.getDate() - now.getDay() + 1)
    const end   = new Date(start); end.setDate(start.getDate() + 6)
    return d >= start && d <= end && a.status !== 'cancelled'
  }).length

  const handleWhatsApp = (_a: Appointment, _action: 'confirm' | 'cancel') => {
    setShowDemo(true)
  }

  return (
    <>
    {showDemo && <DemoNotice onClose={() => setShowDemo(false)} />}
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Hoy" value={todayCitas.length} sub="citas activas" color="text-primary-600" />
        <StatCard label="Esta semana" value={thisWeek} sub="citas totales" color="text-neutral-800" />
        <StatCard label="Pendientes" value={pending} sub="por confirmar" color="text-amber-600" />
        <StatCard label="Confirmadas" value={confirmed} sub="próximas" color="text-emerald-600" />
      </div>

      {/* Citas de hoy */}
      <div>
        <h3 className="font-semibold text-neutral-900 mb-3 flex items-center gap-2">
          <CalendarDays size={18} className="text-primary-600" />
          Citas de hoy — {new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
        </h3>

        {todayCitas.length === 0 ? (
          <div className="text-center py-10 border-2 border-dashed border-neutral-200 rounded-2xl text-neutral-400 text-sm">
            No hay citas para hoy
          </div>
        ) : (
          <div className="space-y-3">
            {todayCitas.sort((a, b) => a.time.localeCompare(b.time)).map(a => (
              <div key={a.id} className="bg-white border border-neutral-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center gap-4">
                {/* Hora */}
                <div className="flex-shrink-0 w-16 text-center">
                  <p className="text-lg font-bold text-primary-600">{a.time}</p>
                  <p className="text-xs text-neutral-400 flex items-center justify-center gap-0.5"><Clock size={10} />{a.duration}m</p>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-neutral-900 text-sm">{a.clientName}</p>
                  <p className="text-xs text-neutral-500">{a.service}</p>
                  {a.notes && <p className="text-xs text-neutral-400 italic mt-0.5">"{a.notes}"</p>}
                </div>

                {/* Contacto */}
                <div className="flex-shrink-0 text-xs text-neutral-400 flex items-center gap-1">
                  {a.confirmVia === 'whatsapp'
                    ? <><MessageCircle size={12} className="text-emerald-500" />{a.phone}</>
                    : <><Mail size={12} className="text-primary-500" />{a.email}</>
                  }
                </div>

                {/* Estado + acciones */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${STATUS_STYLE[a.status]}`}>
                    {STATUS_LABEL[a.status]}
                  </span>
                  {a.status === 'pending' && (
                    <>
                      <button onClick={() => { onConfirm(a.id); if (a.confirmVia === 'whatsapp') handleWhatsApp(a, 'confirm') }}
                        title="Confirmar" className="p-1.5 text-emerald-500 hover:bg-emerald-50 rounded-lg transition-colors">
                        <CheckCircle2 size={18} />
                      </button>
                      <button onClick={() => { onCancel(a.id); if (a.confirmVia === 'whatsapp') handleWhatsApp(a, 'cancel') }}
                        title="Cancelar" className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition-colors">
                        <XCircle size={18} />
                      </button>
                    </>
                  )}
                  {a.status === 'confirmed' && a.confirmVia === 'whatsapp' && (
                    <a href={`https://wa.me/${a.phone.replace(/\D/g,'')}`} target="_blank" rel="noreferrer"
                      title="Abrir WhatsApp" className="p-1.5 text-emerald-500 hover:bg-emerald-50 rounded-lg transition-colors">
                      <MessageCircle size={16} />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Próximas pendientes */}
      {pending > 0 && (
        <div>
          <h3 className="font-semibold text-neutral-900 mb-3 flex items-center gap-2">
            <AlertCircle size={18} className="text-amber-500" />
            Pendientes de confirmar ({pending})
          </h3>
          <div className="space-y-2">
            {appointments
              .filter(a => a.status === 'pending' && a.date > todayStr)
              .sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`))
              .slice(0, 5)
              .map(a => (
                <div key={a.id} className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-center gap-4">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-neutral-900">{a.clientName}</p>
                    <p className="text-xs text-neutral-500">{a.service} · {new Date(a.date+'T12:00').toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' })} {a.time}</p>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => { onConfirm(a.id); if (a.confirmVia === 'whatsapp') handleWhatsApp(a, 'confirm') }}
                      className="text-xs bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1.5 rounded-lg font-medium transition-colors">
                      Confirmar
                    </button>
                    <button onClick={() => { onCancel(a.id); if (a.confirmVia === 'whatsapp') handleWhatsApp(a, 'cancel') }}
                      className="text-xs text-red-400 hover:bg-red-50 px-2 py-1.5 rounded-lg transition-colors">
                      Cancelar
                    </button>
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      )}
    </div>
    </>
  )
}
