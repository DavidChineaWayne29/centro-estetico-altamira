import { useState } from 'react'
import { Check, ToggleLeft, ToggleRight } from 'lucide-react'
import type { DaySchedule } from './mockData'

interface Props { initialSchedule: DaySchedule[] }

const HOURS_OPTIONS = Array.from({ length: 24 }, (_, i) =>
  `${String(i).padStart(2, '0')}:00`
)

export function ScheduleManager({ initialSchedule }: Props) {
  const [schedule, setSchedule] = useState<DaySchedule[]>(initialSchedule)
  const [saved, setSaved] = useState(false)

  const update = (day: number, patch: Partial<DaySchedule>) => {
    setSchedule(s => s.map(d => d.day === day ? { ...d, ...patch } : d))
    setSaved(false)
  }

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const selectCls = 'border border-neutral-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 bg-white'

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-neutral-900">Horario de apertura</h2>
          <p className="text-sm text-neutral-500">Configura los días y horas disponibles para citas</p>
        </div>
        <button onClick={handleSave}
          className={`inline-flex items-center gap-2 px-5 py-2 text-sm font-medium rounded-xl transition-all ${saved ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-primary-600 hover:bg-primary-700 text-white'}`}>
          {saved ? <><Check size={15} /> Guardado</> : 'Guardar cambios'}
        </button>
      </div>

      <div className="space-y-3">
        {schedule.map(day => (
          <div key={day.day} className={`bg-white border rounded-2xl p-5 transition-opacity ${!day.open ? 'opacity-60' : ''}`}>
            <div className="flex flex-wrap items-center gap-4">
              {/* Toggle día */}
              <button onClick={() => update(day.day, { open: !day.open })}
                className="flex items-center gap-2 min-w-[110px]">
                {day.open
                  ? <ToggleRight size={26} className="text-primary-600" />
                  : <ToggleLeft  size={26} className="text-neutral-300" />
                }
                <span className={`text-sm font-semibold w-20 ${day.open ? 'text-neutral-900' : 'text-neutral-400'}`}>{day.name}</span>
              </button>

              {day.open ? (
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-neutral-500">Apertura</span>
                    <select value={day.start} onChange={e => update(day.day, { start: e.target.value })} className={selectCls}>
                      {HOURS_OPTIONS.filter(h => h < day.end).map(h => <option key={h} value={h}>{h}</option>)}
                    </select>
                  </div>
                  <span className="text-neutral-300">—</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-neutral-500">Cierre</span>
                    <select value={day.end} onChange={e => update(day.day, { end: e.target.value })} className={selectCls}>
                      {HOURS_OPTIONS.filter(h => h > day.start).map(h => <option key={h} value={h}>{h}</option>)}
                    </select>
                  </div>
                  <div className="flex items-center gap-2 ml-4 pl-4 border-l border-neutral-200">
                    <span className="text-xs text-neutral-400">
                      {(() => {
                        const [sh, sm] = day.start.split(':').map(Number)
                        const [eh, em] = day.end.split(':').map(Number)
                        const mins = (eh * 60 + em) - (sh * 60 + sm)
                        return `${Math.floor(mins / 60)}h${mins % 60 ? ` ${mins % 60}min` : ''} de horario`
                      })()}
                    </span>
                  </div>
                </div>
              ) : (
                <span className="text-sm text-neutral-400 italic">Cerrado</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Info slots */}
      <div className="bg-primary-50 border border-primary-100 rounded-xl p-4">
        <p className="text-sm text-primary-700 font-medium mb-1">¿Cómo se generan los huecos?</p>
        <p className="text-xs text-primary-600 leading-relaxed">
          Los huecos disponibles se generan automáticamente cada 30 minutos dentro del horario configurado.
          Cuando un cliente reserva, el hueco queda bloqueado para ese día y hora.
        </p>
      </div>
    </div>
  )
}
