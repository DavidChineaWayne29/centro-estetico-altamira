import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { supabase } from '@/lib/supabase'
import { MailOpen, Mail } from 'lucide-react'

interface ContactMessage {
  id: string
  name: string
  email: string
  phone: string | null
  message: string
  read: boolean
  created_at: string
}

export function MessagesManager() {
  const { t } = useTranslation()
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<string | null>(null)

  const fetchData = async () => {
    const { data } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false })
    setMessages((data ?? []) as ContactMessage[])
    setLoading(false)
  }

  useEffect(() => { fetchData() }, [])

  const markRead = async (id: string) => {
    await supabase.from('contact_messages').update({ read: true }).eq('id', id)
    setMessages((prev) => prev.map((m) => m.id === id ? { ...m, read: true } : m))
  }

  const toggleExpand = (id: string) => {
    setExpanded((prev) => (prev === id ? null : id))
    const msg = messages.find((m) => m.id === id)
    if (msg && !msg.read) markRead(id)
  }

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })

  if (loading) return <p className="text-neutral-500 text-sm">{t('common.loading')}</p>

  return (
    <div className="space-y-4">
      <h2 className="font-display text-xl text-neutral-900">{t('admin.tabs.messages')}</h2>

      {messages.length === 0 ? (
        <p className="text-neutral-500 text-sm">{t('admin.messages.noData')}</p>
      ) : (
        <div className="space-y-2">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`border rounded-lg overflow-hidden transition-all ${
                msg.read ? 'border-neutral-100 bg-white' : 'border-primary-200 bg-primary-50'
              }`}
            >
              <button
                onClick={() => toggleExpand(msg.id)}
                className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-neutral-50 transition-colors"
              >
                <span className={msg.read ? 'text-neutral-300' : 'text-primary-600'}>
                  {msg.read ? <MailOpen size={18} /> : <Mail size={18} />}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`font-body text-sm ${msg.read ? 'text-neutral-700' : 'text-neutral-900 font-semibold'}`}>
                      {msg.name}
                    </span>
                    <span className="font-body text-xs text-neutral-400 truncate hidden sm:inline">
                      {msg.email}
                    </span>
                  </div>
                  <p className="font-body text-xs text-neutral-500 truncate mt-0.5">{msg.message}</p>
                </div>
                <span className="font-body text-xs text-neutral-400 whitespace-nowrap hidden sm:block">
                  {formatDate(msg.created_at)}
                </span>
              </button>

              {expanded === msg.id && (
                <div className="px-4 pb-4 border-t border-neutral-100 pt-3 space-y-2">
                  <div className="flex flex-wrap gap-4 text-xs text-neutral-500">
                    <span><strong>{t('admin.messages.email')}:</strong> <a href={`mailto:${msg.email}`} className="text-primary-600 hover:underline">{msg.email}</a></span>
                    {msg.phone && <span><strong>{t('admin.reservations.phone')}:</strong> {msg.phone}</span>}
                    <span><strong>{t('admin.messages.date')}:</strong> {formatDate(msg.created_at)}</span>
                  </div>
                  <p className="font-body text-sm text-neutral-700 leading-relaxed whitespace-pre-wrap">
                    {msg.message}
                  </p>
                  {!msg.read && (
                    <button
                      onClick={() => markRead(msg.id)}
                      className="text-xs text-primary-600 hover:text-primary-800 transition-colors"
                    >
                      {t('admin.messages.markRead')}
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
