// daychat/src/components/chat/DirectMessage.tsx
'use client'

import { useEffect, useState, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/lib/hooks/useAuth'
import { useRealtimeMessages } from '@/lib/hooks/useRealtime'
import { MessageList } from './MessageList'
import { MessageInput } from './MessageInput'
import type { Message, Profile, Database } from '@/lib/supabase/types'

interface DirectMessageProps {
  userId: string
}

export function DirectMessage({ userId }: DirectMessageProps) {
  const [recipient, setRecipient] = useState<Profile | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const supabase = useMemo(() => createClient(), [])
  const { messages, setMessages } = useRealtimeMessages(undefined, userId)

  useEffect(() => {
    const fetchRecipient = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error || !data) {
        console.error('Error fetching recipient:', error)
        setError('User not found')
        return
      }

      setRecipient(data)
      setLoading(false)
    }

    fetchRecipient()
  }, [supabase, userId])

  const handleSendMessage = async (content: string) => {
    if (!user) return

    // @ts-expect-error - Supabase generic type resolution issue with insert
    const { error } = await supabase.from('messages').insert({
      recipient_id: userId,
      sender_id: user.id,
      content,
    })

    if (error) throw error
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        {error}
      </div>
    )
  }

  if (!recipient) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        User not found
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <MessageList
        messages={messages}
        currentUserId={user?.id || ''}
        profiles={new Map([[recipient.id, recipient]])}
      />
      <MessageInput onSend={handleSendMessage} disabled={!user} />
    </div>
  )
}
