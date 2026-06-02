import { useState } from 'react'
import { supabase } from '@/lib/supabase'

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

export function useContactForm(): UseContactFormReturn {
  const [fields, setFields] = useState<FormFields>(initialFields)
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFields((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    try {
      const { error } = await supabase.from('contact_messages').insert([{
        name: fields.name,
        email: fields.email,
        phone: fields.phone || null,
        message: fields.message,
        read: false,
      }])
      if (error) throw error
      setStatus('success')
      setFields(initialFields)
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
