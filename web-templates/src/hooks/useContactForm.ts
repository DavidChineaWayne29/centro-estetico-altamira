import { useState } from 'react'

interface FormFields {
  name: string
  email: string
  phone: string
  message: string
}

interface UseContactFormReturn {
  fields: FormFields
  status: 'idle' | 'sending' | 'success' | 'error'
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  handleSubmit: (e: React.FormEvent) => Promise<void>
  reset: () => void
}

const initialFields: FormFields = {
  name: '', email: '', phone: '', message: '',
}

/**
 * Gestiona el estado y envío del formulario de contacto.
 * El envío usa fetch a Formspree por defecto — cambia el endpoint a tu gusto.
 * Sin dependencias externas más allá de React.
 */
export function useContactForm(endpoint?: string): UseContactFormReturn {
  const [fields, setFields]   = useState<FormFields>(initialFields)
  const [status, setStatus]   = useState<'idle' | 'sending' | 'success' | 'error'>('idle')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFields((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!endpoint) {
      // Sin endpoint configurado: simula éxito en demo
      setStatus('sending')
      await new Promise((r) => setTimeout(r, 1200))
      setStatus('success')
      return
    }
    try {
      setStatus('sending')
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(fields),
      })
      setStatus(res.ok ? 'success' : 'error')
    } catch {
      setStatus('error')
    }
  }

  const reset = () => {
    setFields(initialFields)
    setStatus('idle')
  }

  return { fields, status, handleChange, handleSubmit, reset }
}
