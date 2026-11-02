import { useState } from 'react'
import { useRealtimeTable } from '../hooks/useRealtimeTable'

const CATEGORIES = ['Hortifrúti', 'Padaria', 'Açougue', 'Laticínios', 'Limpeza', 'Higiene', 'Bebidas', 'Outros']

export default function Shopping({ familyId, me, members }) {
  const { rows: items, loading, insert, update, remove: removeRows } = useRealtimeTable('shopping_items', familyId)
  const [name, setName] = useState('')
  const [category, setCategory] = useState(CATEGORIES[0])

  const nameOf = (id) => members.find((m) => m.id === id)?.name

  async function add(e) {
    e.preventDefault()
    const n = name.trim()
    if (!n) return
    setName('')
    await insert({ family_id: familyId, name: n, category, added_by: me.id })
  }

  const toggle = (item) => update(item.id, { done: !item.done })
  const remove = (item) => removeRows(item.id)
  const clearDone = () => removeRows(items.filter((i) => i.done).map((i) => i.id))

  const groups = CATEGORIES.map((c) => [c, items.filter((i) => i.category === c)]).filter(([, l]) => l.length)
  const hasDone = items.some((i) => i.done)

  return (
    <div className="space-y-4">
      <form onSubmit={add} className="space-y-2">
        <div className="flex gap-2">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="O que está faltando?"
            className="min-w-0 flex-1 rounded-xl border border-stone-300 bg-white p-3"
          />
          <button className="rounded-xl bg-amber-500 px-4 font-semibold text-white">+</button>
        </div>
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full rounded-xl border border-stone-300 bg-white p-2 text-sm">
          {CATEGORIES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </form>

      {loading && <p className="text-stone-500">Carregando…</p>}
      {!loading && !items.length && <p className="text-center text-stone-500">Lista vazia. Nada faltando! 🎉</p>}

      {groups.map(([cat, list]) => (
        <section key={cat}>
          <h2 className="mb-1 text-xs font-bold uppercase tracking-wide text-stone-500">{cat}</h2>
          <ul className="space-y-1">
            {list.map((i) => (
              <li key={i.id} className="flex items-center gap-3 rounded-xl bg-white p-3 shadow-sm">
                <input type="checkbox" checked={i.done} onChange={() => toggle(i)} className="h-5 w-5 accent-amber-500" />
                <span className={`flex-1 ${i.done ? 'text-stone-400 line-through' : ''}`}>
                  {i.name}
                  {nameOf(i.added_by) && <span className="ml-2 text-xs text-stone-400">{nameOf(i.added_by)}</span>}
                </span>
                <button onClick={() => remove(i)} aria-label="Remover" className="text-stone-400 hover:text-red-500">✕</button>
              </li>
            ))}
          </ul>
        </section>
      ))}

      {hasDone && (
        <button onClick={clearDone} className="w-full rounded-xl border border-stone-300 p-2 text-sm text-stone-600">
          Limpar itens marcados
        </button>
      )}
    </div>
  )
}
