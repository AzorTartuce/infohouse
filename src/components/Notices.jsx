import { useState } from 'react'
import { useRealtimeTable } from '../hooks/useRealtimeTable'

export default function Notices({ familyId, me, members }) {
  const { rows: notices, loading, insert, remove: removeRows } = useRealtimeTable('notices', familyId, 'created_at', false)
  const [text, setText] = useState('')

  const nameOf = (id) => members.find((m) => m.id === id)?.name || 'Alguém'

  async function add(e) {
    e.preventDefault()
    const t = text.trim()
    if (!t) return
    setText('')
    await insert({ family_id: familyId, text: t, author_id: me.id })
  }

  const remove = (n) => removeRows(n.id)

  return (
    <div className="space-y-4">
      <form onSubmit={add} className="flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Deixe um recado para a casa…"
          className="min-w-0 flex-1 rounded-xl border border-stone-300 bg-white p-3"
        />
        <button className="rounded-xl bg-amber-500 px-4 font-semibold text-white">Fixar</button>
      </form>

      {loading && <p className="text-stone-500">Carregando…</p>}
      {!loading && !notices.length && <p className="text-center text-stone-500">Nenhum aviso no mural.</p>}

      <ul className="grid gap-3 sm:grid-cols-2">
        {notices.map((n) => (
          <li key={n.id} className="relative rounded-lg bg-yellow-200 p-4 shadow">
            <p className="whitespace-pre-wrap pr-4">{n.text}</p>
            <p className="mt-2 text-xs text-stone-600">
              {nameOf(n.author_id)} · {new Date(n.created_at).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}
            </p>
            <button onClick={() => remove(n)} aria-label="Remover" className="absolute right-2 top-2 text-stone-500 hover:text-red-600">✕</button>
          </li>
        ))}
      </ul>
    </div>
  )
}
