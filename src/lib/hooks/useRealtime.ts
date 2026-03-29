'use client'

import { useEffect, useState, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Message, Profile } from '@/lib/supabase/types'

interface UseRealtimeOptions<T> {
  table: string
  filter?: string
  initialData: T[]
  onChange?: (data: T[]) => void
}

function hasId(item: unknown): item is { id: string } {
  return typeof item === 'object' && item !== null && 'id' in item
}

export function useRealtime<T>({ table, filter, initialData, onChange }: UseRealtimeOptions<T>) {
  const [data, setData] = useState<T[]>(initialData)
  const supabase = useMemo(() => createClient(), [])

  useEffect(() => {
    const channel = supabase
      .channel(`${table}-channel`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table,
          filter,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setData((prev) => [...prev, payload.new as T])
          } else if (payload.eventType === 'UPDATE') {
            setData((prev) =>
              prev.map((item) =>
                hasId(item) && hasId(payload.new) && item.id === payload.new.id
                  ? (payload.new as T)
                  : item
              )
            )
          } else if (payload.eventType === 'DELETE') {
            setData((prev) =>
              prev.filter((item) => hasId(item) && hasId(payload.old) && item.id !== payload.old.id)
            )
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, table, filter])

  useEffect(() => {
    onChange?.(data)
  }, [data, onChange])

  return { data, setData }
}

// Specialized hooks for common use cases
export function useRealtimeMessages(roomId?: string, recipientId?: string) {
  const [messages, setMessages] = useState<Message[]>([])
  const supabase = useMemo(() => createClient(), [])

  useEffect(() => {
    // Fetch initial messages
    const fetchMessages = async () => {
      let query = supabase.from('messages').select('*')
      
      if (roomId) {
        query = query.eq('room_id', roomId)
      } else if (recipientId) {
        query = query.or(`recipient_id.eq.${recipientId},sender_id.eq.${recipientId}`)
      }
      
      const { data, error } = await query.order('created_at', { ascending: true })
      
      if (error) console.error('Error fetching messages:', error)
      else setMessages(data ?? [])
    }

    fetchMessages()

    // Subscribe to realtime updates
    const channel = supabase
      .channel(`messages-${roomId || recipientId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: roomId ? `room_id=eq.${roomId}` : `recipient_id=eq.${recipientId}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message])
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, roomId, recipientId])

  return { messages, setMessages }
}

export function useRealtimePresence(roomId: string) {
  const [presenceState, setPresenceState] = useState<Record<string, Profile[]>>({})
  const supabase = useMemo(() => createClient(), [])

  useEffect(() => {
    const channel = supabase.channel(`presence-${roomId}`, {
      config: {
        presence: {
          key: roomId,
        },
      },
    })

    channel.on('presence', { event: 'sync' }, () => {
      const state = channel.presenceState()
      setPresenceState(state as unknown as Record<string, Profile[]>)
    })

    channel.subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        await channel.track({
          online_at: new Date().toISOString(),
        })
      }
    })

    return () => {
      channel.unsubscribe()
    }
  }, [supabase, roomId])

  return { presenceState }
}
