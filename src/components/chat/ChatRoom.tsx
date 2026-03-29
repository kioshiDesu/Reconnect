// daychat/src/components/chat/ChatRoom.tsx
'use client'

import { useEffect, useState, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/lib/hooks/useAuth'
import { useRealtimeMessages } from '@/lib/hooks/useRealtime'
import { MessageList } from './MessageList'
import { MessageInput } from './MessageInput'
import type { Message, Profile, Room, Database } from '@/lib/supabase/types'

interface ChatRoomProps {
  roomId: string
}

interface MemberWithProfile {
  user_id: string
  profiles: Profile
}

export function ChatRoom({ roomId }: ChatRoomProps) {
  const [room, setRoom] = useState<Room | null>(null)
  const [profiles, setProfiles] = useState<Map<string, Profile>>(new Map())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()
  const supabase = useMemo(() => createClient(), [])
  const { messages, setMessages } = useRealtimeMessages(roomId)

  useEffect(() => {
    const fetchRoom = async () => {
      const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .eq('id', roomId)
        .single()

      if (error || !data) {
        console.error('Error fetching room:', error)
        setError('Failed to load room')
        setLoading(false)
        return
      }

      setRoom(data)

      // Fetch room members
      const { data: members, error: membersError } = await supabase
        .from('room_members')
        .select(`
          user_id,
          profiles:user_id (
            id,
            username,
            avatar_url,
            status
          )
        `)
        .eq('room_id', roomId)

      if (membersError) {
        console.error('Error fetching members:', membersError)
      }

      if (members) {
        const profileMap = new Map<string, Profile>()
        members.forEach((member: MemberWithProfile) => {
          if (member.profiles) {
            profileMap.set(member.profiles.id, member.profiles)
          }
        })
        setProfiles(profileMap)
      }

      setLoading(false)
    }

    fetchRoom()
  }, [supabase, roomId])

  const handleSendMessage = async (content: string) => {
    if (!user) return

    // @ts-expect-error - Supabase generic type resolution issue with insert
    const { error } = await supabase.from('messages').insert({
      room_id: roomId,
      sender_id: user.id,
      content,
    } as Database['public']['Tables']['messages']['Insert'])

    if (error) throw error
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        {error}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    )
  }

  if (!room) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        Room not found
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <MessageList
        messages={messages}
        currentUserId={user?.id || ''}
        profiles={profiles}
      />
      <MessageInput onSend={handleSendMessage} disabled={!user} />
    </div>
  )
}
