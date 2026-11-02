import { useState } from 'react'
import { useRealtimeTable } from '../hooks/useRealtimeTable'
import Shopping from './Shopping'
import Tasks from './Tasks'
import Notices from './Notices'

const TABS = [
  { id: 'compras', label: '🛒 Compras' },
  { id: 'tarefas', label: '🧹 Tarefas' },
  { id: 'avisos', label: '📌 Avisos' },
]

export default function Dashboard({ session, onLeave }) {
  const { family, member } = session
  const [tab, setTab] = useState('compras')
  const { rows: members } = useRealtimeTable('members', family.id)

  const props = { familyId: family.id, me: member, members }

  return (
    <div className="mx-auto flex min-h-screen max-w-2xl flex-col">
      <header className="flex items-center justify-between p-4">
        <div>
          <h1 className="text-lg font-bold">🏠 {family.code}</h1>
          <p className="text-sm text-stone-600">Olá, {member.name}</p>
        </div>
        <div className="flex gap-3 text-sm text-stone-500 underline">
          <button onClick={onLeave}>Sair / trocar pessoa</button>
        </div>
      </header>

      <nav className="sticky top-0 z-10 flex border-b border-stone-200 bg-amber-50">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 p-3 text-sm font-medium ${tab === t.id ? 'border-b-2 border-amber-500 text-amber-700' : 'text-stone-500'}`}
          >
            {t.label}
          </button>
        ))}
      </nav>

      <main className="flex-1 p-4">
        {tab === 'compras' && <Shopping {...props} />}
        {tab === 'tarefas' && <Tasks {...props} />}
        {tab === 'avisos' && <Notices {...props} />}
      </main>
    </div>
  )
}
