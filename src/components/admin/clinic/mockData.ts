// ─── Tipos ───────────────────────────────────────────────────────────────────

export type AppointmentStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed'

export interface Appointment {
  id: string
  clientName: string
  phone: string
  email: string
  confirmVia: 'whatsapp' | 'email'
  service: string
  duration: number
  date: string   // 'YYYY-MM-DD'
  time: string   // 'HH:MM'
  status: AppointmentStatus
  notes?: string
}

export interface DaySchedule {
  day: number    // 0=dom … 6=sab
  name: string
  open: boolean
  start: string  // 'HH:MM'
  end: string
}

export interface ClinicServiceAdmin {
  id: string
  name: string
  category: string
  duration: number
  price: number
  active: boolean
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function daysFromNow(n: number) {
  const d = new Date(); d.setDate(d.getDate() + n)
  return d.toISOString().split('T')[0]
}

const today = daysFromNow(0)
const tomorrow = daysFromNow(1)
const d2 = daysFromNow(2)
const d3 = daysFromNow(3)

// ─── Mock appointments ────────────────────────────────────────────────────────

export const MOCK_APPOINTMENTS: Appointment[] = [
  { id: 'a1', clientName: 'Carmen López',    phone: '+34 600 111 222', email: 'carmen@email.com',  confirmVia: 'whatsapp', service: 'Limpieza facial profunda',  duration: 60, date: today,    time: '09:00', status: 'confirmed' },
  { id: 'a2', clientName: 'Sofía Martínez',  phone: '+34 600 333 444', email: 'sofia@email.com',   confirmVia: 'email',    service: 'Tratamiento antiedad',       duration: 75, date: today,    time: '10:30', status: 'pending'   },
  { id: 'a3', clientName: 'Laura Pérez',     phone: '+34 600 555 666', email: 'laura@email.com',   confirmVia: 'whatsapp', service: 'Masaje relajante',           duration: 60, date: today,    time: '12:00', status: 'confirmed' },
  { id: 'a4', clientName: 'Ana García',      phone: '+34 600 777 888', email: 'ana@email.com',     confirmVia: 'whatsapp', service: 'Depilación láser — axilas',  duration: 20, date: today,    time: '16:00', status: 'pending',  notes: 'Primera sesión' },
  { id: 'a5', clientName: 'María Rodríguez', phone: '+34 600 999 000', email: 'maria@email.com',   confirmVia: 'email',    service: 'Hidratación intensiva',      duration: 45, date: today,    time: '17:00', status: 'confirmed' },
  { id: 'a6', clientName: 'Isabel Torres',   phone: '+34 611 111 222', email: 'isabel@email.com',  confirmVia: 'whatsapp', service: 'Drenaje linfático',          duration: 60, date: tomorrow, time: '09:30', status: 'pending'   },
  { id: 'a7', clientName: 'Lucía Fernández', phone: '+34 611 333 444', email: 'lucia@email.com',   confirmVia: 'email',    service: 'Tratamiento reductor',       duration: 60, date: tomorrow, time: '11:00', status: 'confirmed' },
  { id: 'a8', clientName: 'Rosa Díaz',       phone: '+34 611 555 666', email: 'rosa@email.com',    confirmVia: 'whatsapp', service: 'Limpieza facial profunda',  duration: 60, date: tomorrow, time: '15:00', status: 'pending'   },
  { id: 'a9', clientName: 'Elena Moreno',    phone: '+34 611 777 888', email: 'elena@email.com',   confirmVia: 'whatsapp', service: 'Depilación láser — piernas', duration: 45, date: d2,       time: '10:00', status: 'pending'   },
  { id:'a10', clientName: 'Pilar Jiménez',   phone: '+34 611 999 000', email: 'pilar@email.com',   confirmVia: 'email',    service: 'Masaje relajante',           duration: 60, date: d2,       time: '12:30', status: 'confirmed' },
  { id:'a11', clientName: 'Nuria Castro',    phone: '+34 622 111 222', email: 'nuria@email.com',   confirmVia: 'whatsapp', service: 'Tratamiento antiedad',       duration: 75, date: d3,       time: '09:00', status: 'pending'   },
  { id:'a12', clientName: 'Verónica Ruiz',   phone: '+34 622 333 444', email: 'veronica@email.com',confirmVia: 'email',    service: 'Hidratación intensiva',      duration: 45, date: d3,       time: '11:00', status: 'pending'   },
]

// ─── Mock schedule ────────────────────────────────────────────────────────────

export const MOCK_SCHEDULE: DaySchedule[] = [
  { day: 1, name: 'Lunes',     open: true,  start: '09:00', end: '20:00' },
  { day: 2, name: 'Martes',    open: true,  start: '09:00', end: '20:00' },
  { day: 3, name: 'Miércoles', open: true,  start: '09:00', end: '20:00' },
  { day: 4, name: 'Jueves',    open: true,  start: '09:00', end: '20:00' },
  { day: 5, name: 'Viernes',   open: true,  start: '09:00', end: '20:00' },
  { day: 6, name: 'Sábado',    open: true,  start: '09:00', end: '14:00' },
  { day: 0, name: 'Domingo',   open: false, start: '09:00', end: '14:00' },
]

// ─── Mock services ────────────────────────────────────────────────────────────

export const MOCK_SERVICES_ADMIN: ClinicServiceAdmin[] = [
  { id: '1', name: 'Limpieza facial profunda',   category: 'Facial',   duration: 60, price: 55,  active: true  },
  { id: '2', name: 'Tratamiento antiedad',        category: 'Facial',   duration: 75, price: 80,  active: true  },
  { id: '3', name: 'Hidratación intensiva',       category: 'Facial',   duration: 45, price: 45,  active: true  },
  { id: '4', name: 'Depilación láser — piernas',  category: 'Láser',    duration: 45, price: 90,  active: true  },
  { id: '5', name: 'Depilación láser — axilas',   category: 'Láser',    duration: 20, price: 35,  active: true  },
  { id: '6', name: 'Tratamiento reductor',        category: 'Corporal', duration: 60, price: 70,  active: true  },
  { id: '7', name: 'Masaje relajante',            category: 'Masaje',   duration: 60, price: 50,  active: true  },
  { id: '8', name: 'Drenaje linfático',           category: 'Masaje',   duration: 60, price: 55,  active: false },
]
