import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Login({ onDone }) {
  const [code, setCode] = useState('')
  const [family, setFamily] = useState(null)
  const [members, setMembers] = useState([])
  const [newName, setNewName] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function enter(e) {
    e.preventDefault()
    const clean = code.trim().toUpperCase()
    if (!clean) return
    setBusy(true)
    setError('')

    let { data: fam, error: err } = await supabase.from('families').select('*').eq('code', clean).maybeSingle()
    if (!err && !fam) {
      // Código novo: cria a família.
      ;({ data: fam, error: err } = await supabase.from('families').insert({ code: clean }).select().single())
    }
    if (err) {
      setError('Não foi possível acessar. Verifique a conexão e o schema do Supabase.')
      setBusy(false)
      return
    }
    const { data: list } = await supabase.from('members').select('*').eq('family_id', fam.id).order('created_at')
    setFamily(fam)
    setMembers(list || [])
    setBusy(false)
  }

  async function addMember(e) {
    e.preventDefault()
    const name = newName.trim()
    if (!name) return
    const { data, error: err } = await supabase
      .from('members')
      .insert({ family_id: family.id, name })
      .select()
      .single()
    if (err) return setError('Esse nome já existe nesta família.')
    choose(data)
  }

  const choose = (member) => onDone({ family, member })

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center p-6">
      <h1 className="text-center text-3xl font-bold">🏠 Organizador Familiar</h1>
      <p className="mt-1 text-center text-stone-600">A geladeira da sua casa na palma da mão</p>

      {!family ? (
        <form onSubmit={enter} className="mt-8 space-y-3">
          <label className="block text-sm font-medium">Código da família</label>
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="ex: FAMILIA-SILVA"
            className="w-full rounded-xl border border-stone-300 bg-white p-3 uppercase"
            autoFocus
          />
          <button disabled={busy} className="w-full rounded-xl bg-amber-500 p-3 font-semibold text-white disabled:opacity-50">
            {busy ? 'Entrando…' : 'Entrar'}
          </button>
          <p className="text-xs text-stone-500">Código novo? Criamos a família automaticamente.</p>
        </form>
      ) : (
        <div className="mt-8 space-y-4">
          <p className="text-center font-medium">Quem é você? <span className="text-stone-500">({family.code})</span></p>
          <div className="grid grid-cols-2 gap-2">
            {members.map((m) => (
              <button key={m.id} onClick={() => choose(m)} className="rounded-xl border border-stone-300 bg-white p-3 font-medium hover:bg-amber-100">
                {m.name}
              </button>
            ))}
          </div>
          <form onSubmit={addMember} className="flex gap-2">
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Novo membro (ex: Mãe, João)"
              className="min-w-0 flex-1 rounded-xl border border-stone-300 bg-white p-3"
            />
            <button className="rounded-xl bg-amber-500 px-4 font-semibold text-white">Adicionar</button>
          </form>
          <button onClick={() => setFamily(null)} className="w-full text-sm text-stone-500 underline">
            Trocar código
          </button>
        </div>
      )}
      {error && <p className="mt-4 text-center text-sm text-red-600">{error}</p>}
    </div>
  )
}
