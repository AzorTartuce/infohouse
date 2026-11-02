import { useState } from 'react'
import { useRealtimeTable } from '../hooks/useRealtimeTable'

const FREQ = { diaria: 'Diária', semanal: 'Semanal', eventual: 'Eventual' }
const STATUS = { pendente: 'Pendente', andamento: 'Em andamento', concluida: 'Concluída' }
const STATUS_STYLE = {
  pendente: 'bg-stone-200 text-stone-700',
  andamento: 'bg-blue-100 text-blue-700',
  concluida: 'bg-green-100 text-green-700',
}
const NEXT = { pendente: 'andamento', andamento: 'concluida', concluida: 'pendente' }

export default function Tasks({ familyId, me, members }) {
  const { rows: tasks, loading, insert, update, remove: removeRows } = useRealtimeTable('tasks', familyId)
  const [title, setTitle] = useState('')
  const [frequency, setFrequency] = useState('eventual')
  const [assignee, setAssignee] = useState(me.id)
  const [onlyMine, setOnlyMine] = useState(false)

  const nameOf = (id) => members.find((m) => m.id === id)?.name

  async function add(e) {
    e.preventDefault()
    const t = title.trim()
    if (!t) return
    setTitle('')
    await insert({
      family_id: familyId,
      title: t,
      frequency,
      assignee_id: assignee || null,
      created_by: me.id,
    })
  }

  const advance = (task) => {
    const status = NEXT[task.status]
    return update(task.id, { status, completed_by: status === 'concluida' ? me.id : null })
  }
  const remove = (task) => removeRows(task.id)

  const visible = onlyMine ? tasks.filter((t) => t.assignee_id === me.id) : tasks

  return (
    <div className="space-y-4">
      <form onSubmit={add} className="space-y-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Nova tarefa (ex: Tirar o lixo)"
          className="w-full rounded-xl border border-stone-300 bg-white p-3"
        />
        <div className="flex gap-2">
          <select value={assignee} onChange={(e) => setAssignee(e.target.value)} className="min-w-0 flex-1 rounded-xl border border-stone-300 bg-white p-2 text-sm">
            <option value="">Sem responsável</option>
            {members.map((m) => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
          <select value={frequency} onChange={(e) => setFrequency(e.target.value)} className="rounded-xl border border-stone-300 bg-white p-2 text-sm">
            {Object.entries(FREQ).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
          <button className="rounded-xl bg-amber-500 px-4 font-semibold text-white">+</button>
        </div>
      </form>

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={onlyMine} onChange={(e) => setOnlyMine(e.target.checked)} className="accent-amber-500" />
        Só as minhas tarefas
      </label>

      {loading && <p className="text-stone-500">Carregando…</p>}
      {!loading && !visible.length && <p className="text-center text-stone-500">Nenhuma tarefa por aqui.</p>}

      <ul className="space-y-2">
        {visible.map((t) => (
          <li key={t.id} className="flex items-center gap-3 rounded-xl bg-white p-3 shadow-sm">
            <div className="min-w-0 flex-1">
              <p className={t.status === 'concluida' ? 'text-stone-400 line-through' : ''}>{t.title}</p>
              <p className="text-xs text-stone-500">
                {FREQ[t.frequency]} · {nameOf(t.assignee_id) || 'Sem responsável'}
                {t.status === 'concluida' && nameOf(t.completed_by) && ` · feita por ${nameOf(t.completed_by)}`}
              </p>
            </div>
            <button onClick={() => advance(t)} className={`rounded-full px-3 py-1 text-xs font-medium ${STATUS_STYLE[t.status]}`}>
              {STATUS[t.status]}
            </button>
            <button onClick={() => remove(t)} aria-label="Remover" className="text-stone-400 hover:text-red-500">✕</button>
          </li>
        ))}
      </ul>
    </div>
  )
}
