import { useState } from 'react'
import { configured } from './lib/supabase'
import { loadSession, saveSession } from './lib/session'
import Login from './components/Login'
import Dashboard from './components/Dashboard'

export default function App() {
  const [session, setSession] = useState(loadSession)

  if (!configured) {
    return (
      <div className="mx-auto max-w-md p-6 text-center">
        <h1 className="text-xl font-bold">Configuração pendente</h1>
        <p className="mt-2 text-stone-600">
          Crie um arquivo <code>.env</code> com <code>VITE_SUPABASE_URL</code> e{' '}
          <code>VITE_SUPABASE_ANON_KEY</code> (veja <code>.env.example</code>) e reinicie o servidor.
        </p>
      </div>
    )
  }

  const update = (s) => {
    saveSession(s)
    setSession(s)
  }

  return session ? (
    <Dashboard session={session} onLeave={() => update(null)} />
  ) : (
    <Login onDone={update} />
  )
}
