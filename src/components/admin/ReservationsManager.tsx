import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { supabase } from '@/lib/supabase'

interface Reservation {
  id: string
  name: string
  email: string
  phone: string
  date: string
  time: string
  guests: string
  notes: string | null
  status: 'pending' | 'confirmed' | 'cancelled'
  created_at: string
}

const STATUS_COLORS = {
  pending:   'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
}

export function ReservationsManager() {
  const { t } = useTranslation()
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    const { data } = await supabase
      .from('reservations')
      .select('*')
      .order('date', { ascending: false })
      .order('time', { ascending: false })
    setReservations((data ?? []) as Reservation[])
    setLoading(false)
  }

  useEffect(() => { fetchData() }, [])

  const changeStatus = async (id: string, status: Reservation['status']) => {
    await supabase.from('reservations').update({ status }).eq('id', id)
    setReservations((prev) => prev.map((r) => r.id === id ? { ...r, status } : r))
  }

  if (loading) return <p className="text-neutral-500 text-sm">{t('common.loading')}</p>

  return (
    <div className="space-y-4">
      <h2 className="font-display text-xl text-neutral-900">{t('admin.tabs.reservations')}</h2>

      {reservations.length === 0 ? (
        <p className="text-neutral-500 text-sm">{t('admin.reservations.noData')}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-neutral-200 text-left">
                <th className="pb-3 font-body text-xs text-neutral-500 uppercase pr-4">{t('admin.reservations.date')}</th>
                <th className="pb-3 font-body text-xs text-neutral-500 uppercase pr-4">{t('admin.reservations.name')}</th>
                <th className="pb-3 font-body text-xs text-neutral-500 uppercase pr-4 hidden sm:table-cell">{t('admin.reservations.phone')}</th>
                <th className="pb-3 font-body text-xs text-neutral-500 uppercase pr-4">{t('admin.reservations.guests')}</th>
                <th className="pb-3 font-body text-xs text-neutral-500 uppercase pr-4 hidden md:table-cell">{t('admin.reservations.notes')}</th>
                <th className="pb-3 font-body text-xs text-neutral-500 uppercase">{t('admin.reservations.status')}</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((r) => (
                <tr key={r.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                  <td className="py-3 pr-4 font-body text-neutral-700 whitespace-nowrap">
                    {r.date} {r.time}
                  </td>
                  <td className="py-3 pr-4">
                    <p className="font-body text-neutral-900">{r.name}</p>
                    <p className="font-body text-xs text-neutral-400">{r.email}</p>
                  </td>
                  <td className="py-3 pr-4 font-body text-neutral-600 hidden sm:table-cell whitespace-nowrap">
                    {r.phone}
                  </td>
                  <td className="py-3 pr-4 font-body text-neutral-700 text-center">
                    {r.guests}
                  </td>
                  <td className="py-3 pr-4 font-body text-xs text-neutral-500 hidden md:table-cell max-w-xs truncate">
                    {r.notes ?? '—'}
                  </td>
                  <td className="py-3">
                    <select
                      value={r.status}
                      onChange={(e) => changeStatus(r.id, e.target.value as Reservation['status'])}
                      className={`text-xs font-body px-2 py-1 rounded border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-400 ${STATUS_COLORS[r.status]}`}
                    >
                      <option value="pending">{t('admin.reservations.pending')}</option>
                      <option value="confirmed">{t('admin.reservations.confirmed')}</option>
                      <option value="cancelled">{t('admin.reservations.cancelled')}</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
