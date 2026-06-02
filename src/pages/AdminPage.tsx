import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { LayoutDashboard, CalendarDays, List, Clock, Sparkles, MessageSquare, LogOut, Menu, X } from 'lucide-react'
import type { User } from '@supabase/supabase-js'

import { AppointmentsDashboard } from '@/components/admin/clinic/AppointmentsDashboard'
import { AppointmentsCalendar }  from '@/components/admin/clinic/AppointmentsCalendar'
import { ScheduleManager }       from '@/components/admin/clinic/ScheduleManager'
import { ServicesManager }       from '@/components/admin/clinic/ServicesManager'
import { MessagesManager }       from '@/components/admin/MessagesManager'

import {
  MOCK_APPOINTMENTS,
  MOCK_SCHEDULE,
  MOCK_SERVICES_ADMIN,
  type Appointment,
} from '@/components/admin/clinic/mockData'

type Tab = 'dashboard' | 'calendar' | 'appointments' | 'schedule' | 'services' | 'messages'

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'dashboard',    label: 'Inicio',       icon: <LayoutDashboard size={18} /> },
  { id: 'calendar',     label: 'Calendario',   icon: <CalendarDays size={18} /> },
  { id: 'appointments', label: 'Citas',        icon: <List size={18} /> },
  { id: 'schedule',     label: 'Horarios',     icon: <Clock size={18} /> },
  { id: 'services',     label: 'Tratamientos', icon: <Sparkles size={18} /> },
  { id: 'messages',     label: 'Mensajes',     icon: <MessageSquare size={18} /> },
]

const STATUS_STYLE: Record<string, string> = {
  pending:   'bg-amber-50 text-amber-700 border-amber-200',
  confirmed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  cancelled: 'bg-red-50 text-red-400 border-red-200',
  completed: 'bg-neutral-100 text-neutral-500 border-neutral-200',
}
const STATUS_LABEL: Record<string, string> = {
  pending: 'Pendiente', confirmed: 'Confirmada', cancelled: 'Cancelada', completed: 'Completada',
}

function AppointmentsListView({ appointments, onConfirm, onCancel }: {
  appointments: Appointment[]
  onConfirm: (id: string) => void
  onCancel:  (id: string) => void
}) {
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterDate,   setFilterDate]   = useState('')
  const [search,       setSearch]       = useState('')

  const filtered = appointments.filter(a => {
    if (filterStatus !== 'all' && a.status !== filterStatus) return false
    if (filterDate && a.date !== filterDate) return false
    if (search && !a.clientName.toLowerCase().includes(search.toLowerCase()) && !a.service.toLowerCase().includes(search.toLowerCase())) return false
    return true
  }).sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`))

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar cliente o tratamiento..."
          className="border border-neutral-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 flex-1 min-w-48" />
        <input type="date" value={filterDate} onChange={e => setFilterDate(e.target.value)}
          className="border border-neutral-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400" />
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
          className="border border-neutral-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 bg-white">
          <option value="all">Todos los estados</option>
          <option value="pending">Pendiente</option>
          <option value="confirmed">Confirmada</option>
          <option value="cancelled">Cancelada</option>
        </select>
        {(filterStatus !== 'all' || filterDate || search) && (
          <button onClick={() => { setFilterStatus('all'); setFilterDate(''); setSearch('') }}
            className="text-sm text-neutral-400 hover:text-neutral-600 px-2 transition-colors">
            Limpiar
          </button>
        )}
      </div>
      <p className="text-xs text-neutral-400">{filtered.length} citas</p>
      <div className="space-y-2">
        {filtered.map(a => (
          <div key={a.id} className={`bg-white border border-neutral-200 rounded-xl p-4 flex flex-wrap items-center gap-4 ${a.status === 'cancelled' ? 'opacity-60' : ''}`}>
            <div className="min-w-[70px]">
              <p className="text-xs text-neutral-400">{new Date(a.date+'T12:00').toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}</p>
              <p className="text-sm font-bold text-primary-600">{a.time}</p>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-neutral-900 text-sm">{a.clientName}</p>
              <p className="text-xs text-neutral-500">{a.service} · {a.duration} min</p>
              {a.notes && <p className="text-xs text-neutral-400 italic">"{a.notes}"</p>}
            </div>
            <div className="text-xs text-neutral-400">{a.confirmVia === 'whatsapp' ? a.phone : a.email}</div>
            <div className="flex items-center gap-2 ml-auto">
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${STATUS_STYLE[a.status]}`}>{STATUS_LABEL[a.status]}</span>
              {a.status === 'pending' && (
                <>
                  <button onClick={() => onConfirm(a.id)} className="text-xs bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1.5 rounded-lg font-medium transition-colors">Confirmar</button>
                  <button onClick={() => onCancel(a.id)} className="text-xs border border-red-200 text-red-400 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors">Cancelar</button>
                </>
              )}
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-neutral-400 text-sm">No hay citas con estos filtros</div>
        )}
      </div>
    </div>
  )
}

export function AdminPage() {
  const [user, setUser]         = useState<User | null>(null)
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [loading, setLoading]   = useState(true)
  const [tab, setTab]           = useState<Tab>('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [appointments, setAppointments] = useState<Appointment[]>(MOCK_APPOINTMENTS)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null)
      setLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError('')
    // Demo — cualquier credencial válida entra
    if (email && password) {
      setUser({ id: 'demo', email } as unknown as User)
      setLoading(false)
    }
  }

  const handleLogout = () => setUser(null)
  const confirmAppointment = (id: string) => setAppointments(as => as.map(a => a.id === id ? { ...a, status: 'confirmed' as const } : a))
  const cancelAppointment  = (id: string) => setAppointments(as => as.map(a => a.id === id ? { ...a, status: 'cancelled' as const } : a))

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50">
      <p className="text-neutral-400 text-sm">Cargando...</p>
    </div>
  )

  if (!user) return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-8 w-full max-w-sm">
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <Sparkles size={22} className="text-primary-600" />
          </div>
          <h1 className="text-xl font-semibold text-neutral-900">Centro Altamira</h1>
          <p className="text-sm text-neutral-400 mt-1">Panel de administración</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs text-neutral-500 block mb-1.5">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="admin@centroaltamira.es"
              className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400" />
          </div>
          <div>
            <label className="text-xs text-neutral-500 block mb-1.5">Contraseña</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••"
              className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400" />
          </div>
          {loginError && <p className="text-sm text-red-500">{loginError}</p>}
          <button type="submit" className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-xl text-sm font-medium transition-colors">
            Iniciar sesión
          </button>
          <p className="text-xs text-neutral-400 text-center">Demo: cualquier email y contraseña</p>
        </form>
      </div>
    </div>
  )

  const pending = appointments.filter(a => a.status === 'pending').length

  return (
    <div className="min-h-screen bg-neutral-50 flex">
      {/* Sidebar desktop */}
      <aside className="hidden lg:flex flex-col w-56 bg-white border-r border-neutral-200 fixed top-0 left-0 h-full z-30">
        <div className="px-5 py-5 border-b border-neutral-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-primary-100 rounded-xl flex items-center justify-center">
              <Sparkles size={15} className="text-primary-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-neutral-900">Altamira</p>
              <p className="text-xs text-neutral-400">Panel admin</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors relative ${tab === t.id ? 'bg-primary-50 text-primary-700 font-medium' : 'text-neutral-500 hover:text-neutral-800 hover:bg-neutral-50'}`}>
              <span className={tab === t.id ? 'text-primary-600' : ''}>{t.icon}</span>
              {t.label}
              {t.id === 'appointments' && pending > 0 && (
                <span className="ml-auto text-xs bg-amber-400 text-white font-bold w-5 h-5 rounded-full flex items-center justify-center">{pending}</span>
              )}
            </button>
          ))}
        </nav>
        <div className="px-3 py-4 border-t border-neutral-100">
          <p className="text-xs text-neutral-400 px-3 mb-2 truncate">{email}</p>
          <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-neutral-500 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors">
            <LogOut size={16} /> Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Sidebar móvil drawer */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
          <aside className="relative w-56 bg-white h-full flex flex-col z-50 shadow-xl">
            <div className="px-5 py-5 border-b border-neutral-100 flex items-center justify-between">
              <p className="font-semibold text-neutral-900 text-sm">Altamira Admin</p>
              <button onClick={() => setSidebarOpen(false)}><X size={18} className="text-neutral-400" /></button>
            </div>
            <nav className="flex-1 px-3 py-4 space-y-0.5">
              {TABS.map(t => (
                <button key={t.id} onClick={() => { setTab(t.id); setSidebarOpen(false) }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${tab === t.id ? 'bg-primary-50 text-primary-700 font-medium' : 'text-neutral-500 hover:bg-neutral-50'}`}>
                  {t.icon} {t.label}
                  {t.id === 'appointments' && pending > 0 && (
                    <span className="ml-auto text-xs bg-amber-400 text-white font-bold w-5 h-5 rounded-full flex items-center justify-center">{pending}</span>
                  )}
                </button>
              ))}
            </nav>
          </aside>
        </div>
      )}

      {/* Contenido principal */}
      <div className="flex-1 lg:ml-56 flex flex-col min-h-screen">
        <header className="bg-white border-b border-neutral-200 px-4 sm:px-6 h-14 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-neutral-500 hover:text-neutral-700 p-1">
              <Menu size={20} />
            </button>
            <p className="text-sm font-semibold text-neutral-900">{TABS.find(t => t.id === tab)?.label}</p>
          </div>
          {pending > 0 && tab !== 'appointments' && (
            <button onClick={() => setTab('appointments')}
              className="text-xs bg-amber-50 text-amber-700 border border-amber-200 px-3 py-1.5 rounded-full font-medium hover:bg-amber-100 transition-colors">
              {pending} citas pendientes
            </button>
          )}
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-5xl w-full mx-auto">
          {tab === 'dashboard'    && <AppointmentsDashboard appointments={appointments} onConfirm={confirmAppointment} onCancel={cancelAppointment} />}
          {tab === 'calendar'     && <AppointmentsCalendar  appointments={appointments} onConfirm={confirmAppointment} onCancel={cancelAppointment} />}
          {tab === 'appointments' && <AppointmentsListView  appointments={appointments} onConfirm={confirmAppointment} onCancel={cancelAppointment} />}
          {tab === 'schedule'     && <ScheduleManager initialSchedule={MOCK_SCHEDULE} />}
          {tab === 'services'     && <ServicesManager initialServices={MOCK_SERVICES_ADMIN} />}
          {tab === 'messages'     && <MessagesManager />}
        </main>
      </div>
    </div>
  )
}
