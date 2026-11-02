import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'

// Carrega as linhas de uma tabela da família e as mantém sincronizadas via Realtime.
export function useRealtimeTable(table, familyId, orderBy = 'created_at', ascending = true) {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)

  const sort = useCallback(
    (list) =>
      [...list].sort((a, b) =>
        ascending ? (a[orderBy] > b[orderBy] ? 1 : -1) : a[orderBy] < b[orderBy] ? 1 : -1,
      ),
    [orderBy, ascending],
  )

  useEffect(() => {
    let active = true
    setLoading(true)

    supabase
      .from(table)
      .select('*')
      .eq('family_id', familyId)
      .order(orderBy, { ascending })
      .then(({ data }) => {
        if (!active) return
        setRows(data || [])
        setLoading(false)
      })

    const channel = supabase
      .channel(`${table}:${familyId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table, filter: `family_id=eq.${familyId}` },
        (payload) => {
          setRows((prev) => {
            if (payload.eventType === 'DELETE') return prev.filter((r) => r.id !== payload.old.id)
            const rest = prev.filter((r) => r.id !== payload.new.id)
            return sort([...rest, payload.new])
          })
        },
      )
      .subscribe()

    return () => {
      active = false
      supabase.removeChannel(channel)
    }
  }, [table, familyId, orderBy, ascending, sort])

  // Os eventos DELETE do Realtime não respeitam o filtro por família, então as
  // mutações atualizam a lista local na hora (otimista) e desfazem se o banco recusar.
  const upsertLocal = (row) => setRows((prev) => sort([...prev.filter((r) => r.id !== row.id), row]))

  const insert = async (values) => {
    const { data, error } = await supabase.from(table).insert(values).select().single()
    if (error) console.error(`${table}: erro ao inserir`, error)
    else upsertLocal(data)
    return { data, error }
  }

  const update = async (id, patch) => {
    const before = rows.find((r) => r.id === id)
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)))
    const { error } = await supabase.from(table).update(patch).eq('id', id)
    if (error) {
      console.error(`${table}: erro ao atualizar`, error)
      if (before) upsertLocal(before)
    }
  }

  const remove = async (ids) => {
    const list = Array.isArray(ids) ? ids : [ids]
    const before = rows.filter((r) => list.includes(r.id))
    setRows((prev) => prev.filter((r) => !list.includes(r.id)))
    const { error } = await supabase.from(table).delete().in('id', list)
    if (error) {
      console.error(`${table}: erro ao remover`, error)
      setRows((prev) => sort([...prev, ...before]))
    }
  }

  return { rows, loading, insert, update, remove }
}
