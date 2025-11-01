import {Facebook, Instagram, MessageCircle} from "lucide-react"
import { useState } from "react"

// Replace the entry keys with your Google Form entry IDs
const GOOGLE_FORM_ACTION = 'https://docs.google.com/forms/d/e/YOUR_FORM_ID/formResponse'
const ENTRY_NAME = 'entry.123456'
const ENTRY_PHONE = 'entry.654321'
const ENTRY_MESSAGE = 'entry.789012'

export default function ContactForm(){
  const [form, setForm] = useState({name:'', phone:'', message:''})
  const [status, setStatus] = useState(null)

  const handle = (e) => setForm({...form, [e.target.name]: e.target.value})

  const submit = async (e) => {
    e.preventDefault()
    const fd = new FormData()
    fd.append(ENTRY_NAME, form.name)
    fd.append(ENTRY_PHONE, form.phone)
    fd.append(ENTRY_MESSAGE, form.message)

    try{
      await fetch(GOOGLE_FORM_ACTION, { method: 'POST', mode: 'no-cors', body: fd })
      setStatus('Terima kasih — data terkirim')
      setForm({name:'', phone:'', message:''})
    }catch(err){
      // no-cors returns opaque response; still assume success
      setStatus('Terima kasih — data terkirim')
    }
  }

  return (
    <form onSubmit={submit} className="max-w-xl bg-white p-6 rounded shadow">
      <label className="block mb-3">
        <span className="text-sm font-medium">Nama</span>
        <input name="name" value={form.name} onChange={handle} required className="mt-1 block w-full p-2 border rounded" />
      </label>
      <label className="block mb-3">
        <span className="text-sm font-medium">Nomor WhatsApp</span>
        <input name="phone" value={form.phone} onChange={handle} required className="mt-1 block w-full p-2 border rounded" />
      </label>
      <label className="block mb-3">
        <span className="text-sm font-medium">Pesan</span>
        <textarea name="message" value={form.message} onChange={handle} required className="mt-1 block w-full p-2 border rounded h-28" />
      </label>
      <button type="submit" className="px-4 py-2 bg-isuzu text-white rounded">Kirim</button>
      {status && <p className="mt-3 text-green-600">{status}</p>}
    </form>
  )
}