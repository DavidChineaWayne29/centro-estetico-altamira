import { useState } from 'react'
import { Plus, Pencil, Trash2, X, Check, ToggleLeft, ToggleRight, Clock, Euro } from 'lucide-react'
import type { ClinicServiceAdmin } from './mockData'

interface Props { initialServices: ClinicServiceAdmin[] }

const CATEGORIES = ['Facial', 'Láser', 'Corporal', 'Masaje', 'Uñas', 'Otro']
const EMPTY: Omit<ClinicServiceAdmin, 'id'> = { name: '', category: 'Facial', duration: 60, price: 0, active: true }

export function ServicesManager({ initialServices }: Props) {
  const [services, setServices] = useState<ClinicServiceAdmin[]>(initialServices)
  const [editing, setEditing] = useState<ClinicServiceAdmin | null>(null)
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState(EMPTY)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [toast, setToast] = useState('')

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2500) }
  const closeForm = () => { setCreating(false); setEditing(null) }

  const openCreate = () => { setForm(EMPTY); setCreating(true); setEditing(null) }
  const openEdit = (s: ClinicServiceAdmin) => { setForm({ name: s.name, category: s.category, duration: s.duration, price: s.price, active: s.active }); setEditing(s); setCreating(false) }

  const handleSave = () => {
    if (!form.name.trim() || form.price <= 0) return
    if (creating) {
      const newS: ClinicServiceAdmin = { ...form, id: Date.now().toString() }
      setServices(ss => [...ss, newS]); showToast('Tratamiento creado')
    } else if (editing) {
      setServices(ss => ss.map(s => s.id === editing.id ? { ...s, ...form } : s)); showToast('Tratamiento actualizado')
    }
    closeForm()
  }

  const toggleActive = (id: string) => setServices(ss => ss.map(s => s.id === id ? { ...s, active: !s.active } : s))
  const handleDelete = (id: string) => { setServices(ss => ss.filter(s => s.id !== id)); showToast('Tratamiento eliminado'); setDeleteId(null) }

  const inputCls = 'w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400'
  const grouped = CATEGORIES.map(cat => ({ cat, items: services.filter(s => s.category === cat) })).filter(g => g.items.length > 0)

  return (
    <div className="relative">
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-emerald-50 text-emerald-700 border border-emerald-200 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2 shadow-lg">
          <Check size={15} /> {toast}
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-neutral-900">Tratamientos</h2>
          <p className="text-sm text-neutral-500">{services.filter(s => s.active).length} activos · {services.length} totales</p>
        </div>
        <button onClick={openCreate} className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors">
          <Plus size={16} /> Añadir tratamiento
        </button>
      </div>

      {/* Formulario */}
      {(creating || editing) && (
        <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-neutral-900">{creating ? 'Nuevo tratamiento' : 'Editar tratamiento'}</h3>
            <button onClick={closeForm} className="text-neutral-400 hover:text-neutral-600"><X size={18} /></button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="text-xs text-neutral-500 block mb-1">Nombre *</label>
              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Nombre del tratamiento" className={inputCls} />
            </div>
            <div>
              <label className="text-xs text-neutral-500 block mb-1">Categoría</label>
              <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className={inputCls}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-neutral-500 block mb-1">Duración (minutos)</label>
              <input type="number" min={15} step={15} value={form.duration} onChange={e => setForm(f => ({ ...f, duration: +e.target.value }))} className={inputCls} />
            </div>
            <div>
              <label className="text-xs text-neutral-500 block mb-1">Precio (€) *</label>
              <input type="number" min={0} value={form.price} onChange={e => setForm(f => ({ ...f, price: +e.target.value }))} className={inputCls} />
            </div>
            <div className="flex items-end">
              <button onClick={() => setForm(f => ({ ...f, active: !f.active }))}
                className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm border transition-colors ${form.active ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-neutral-100 border-neutral-200 text-neutral-500'}`}>
                {form.active ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                {form.active ? 'Activo' : 'Inactivo'}
              </button>
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button onClick={closeForm} className="px-4 py-2 text-sm text-neutral-500 hover:text-neutral-700 transition-colors">Cancelar</button>
            <button onClick={handleSave} disabled={!form.name.trim() || form.price <= 0}
              className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-40 text-white text-sm font-medium px-5 py-2 rounded-xl transition-colors">
              <Check size={15} /> Guardar
            </button>
          </div>
        </div>
      )}

      {/* Lista agrupada por categoría */}
      <div className="space-y-6">
        {grouped.map(({ cat, items }) => (
          <div key={cat}>
            <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">{cat}</h3>
            <div className="space-y-2">
              {items.map(s => (
                <div key={s.id} className={`flex items-center gap-4 bg-white border rounded-xl p-4 transition-opacity ${!s.active ? 'opacity-60' : ''}`}>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-neutral-900 text-sm">{s.name}</p>
                      {!s.active && <span className="text-xs bg-neutral-100 text-neutral-400 px-2 py-0.5 rounded-full">Inactivo</span>}
                    </div>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-xs text-neutral-400 flex items-center gap-1"><Clock size={11} />{s.duration} min</span>
                      <span className="text-xs text-primary-600 font-semibold flex items-center gap-0.5"><Euro size={11} />{s.price}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => toggleActive(s.id)} title={s.active ? 'Desactivar' : 'Activar'} className="p-2 text-neutral-400 hover:text-neutral-600 rounded-lg hover:bg-neutral-50 transition-colors">
                      {s.active ? <ToggleRight size={18} className="text-emerald-500" /> : <ToggleLeft size={18} />}
                    </button>
                    <button onClick={() => openEdit(s)} className="p-2 text-neutral-400 hover:text-primary-600 rounded-lg hover:bg-neutral-50 transition-colors"><Pencil size={15} /></button>
                    <button onClick={() => setDeleteId(s.id)} className="p-2 text-neutral-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"><Trash2 size={15} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full">
            <h3 className="font-semibold text-neutral-900 mb-2">¿Eliminar tratamiento?</h3>
            <p className="text-sm text-neutral-500 mb-6">Esta acción no se puede deshacer.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 px-4 py-2 text-sm text-neutral-600 border border-neutral-200 rounded-xl hover:bg-neutral-50 transition-colors">Cancelar</button>
              <button onClick={() => handleDelete(deleteId)} className="flex-1 px-4 py-2 text-sm text-white bg-red-500 hover:bg-red-600 rounded-xl font-medium transition-colors">Eliminar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
