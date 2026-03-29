// daychat/src/components/chat/ChatList.tsx
'use client'

import { useEffect, useState, useMemo } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/lib/hooks/useAuth'
import { Avatar } from '@/components/ui/Avatar'
import type { Message, Profile } from '@/lib/supabase/types'

interface ChatItem {
  id: string
  type: 'room' | 'dm'
  name: string
  avatarUrl?: string | null
  lastMessage?: Message
  unreadCount: number
  status?: Profile['status']
}

interface RoomWithMessages {
  id: string
  name: string
  messages: Array<{
    id: string
    content: string
    created_at: string
    sender_id: string
  }>
}

interface DMWithProfile {
  id: string
  content: string
  created_at: string
  sender_id: string
  recipient_id: string
  room_id: string | null
  read_at: string | null
  profiles: Profile | null
}

export function ChatList() {
  const [chats, setChats] = useState<ChatItem[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const supabase = useMemo(() => createClient(), [])

  useEffect(() => {
    if (!user) return

    const fetchChats = async () => {
      // Fetch rooms
      const { data: rooms, error: roomsError } = await supabase
        .from('rooms')
        .select(`
          id,
          name,
          room_members!inner(user_id),
          messages (
            id,
            content,
            created_at,
            sender_id
          )
        `)
        .eq('room_members.user_id', user.id)
        .order('created_at', { foreignTable: 'messages', ascending: false })
        .limit(1, { foreignTable: 'messages' })

      if (roomsError) {
        console.error('Error fetching rooms:', roomsError)
        return
      }

      // Fetch direct messages
      const { data: dms, error: dmsError } = await supabase
        .from('messages')
        .select(`
          id,
          content,
          created_at,
          sender_id,
          recipient_id,
          profiles:profiles_id (
            id,
            username,
            avatar_url,
            status
          )
        `)
        .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
        .order('created_at', { ascending: false })

      if (dmsError) {
        console.error('Error fetching DMs:', dmsError)
        return
      }

      // Process and combine results
      const chatItems: ChatItem[] = []

      if (rooms) {
        chatItems.push(
          ...rooms.map((room: RoomWithMessages) => ({
            id: room.id,
            type: 'room' as const,
            name: room.name,
            lastMessage: room.messages?.[0] as Message | undefined,
            unreadCount: 0,
          }))
        )
      }

      // Group DMs by other participant
      if (dms) {
        const dmMap = new Map<string, ChatItem>()

        dms.forEach((dm: DMWithProfile) => {
          const otherUserId = dm.sender_id === user.id ? dm.recipient_id : dm.sender_id
          const otherUser = dm.profiles

          if (!dmMap.has(otherUserId)) {
            dmMap.set(otherUserId, {
              id: otherUserId,
              type: 'dm' as const,
              name: otherUser?.username || 'Unknown',
              avatarUrl: otherUser?.avatar_url,
              status: otherUser?.status,
              lastMessage: dm as Message,
              unreadCount: dm.recipient_id === user.id && !dm.read_at ? 1 : 0,
            })
          }
        })

        chatItems.push(...Array.from(dmMap.values()))
      }

      // Sort by last message date
      chatItems.sort((a, b) => {
        const aDate = a.lastMessage?.created_at || ''
        const bDate = b.lastMessage?.created_at || ''
        return bDate.localeCompare(aDate)
      })

      setChats(chatItems)
      setLoading(false)
    }

    fetchChats()
  }, [user, supabase])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    )
  }

  if (chats.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500">
        <p>No chats yet</p>
        <p className="text-sm mt-2">Start a conversation!</p>
      </div>
    )
  }

  return (
    <div className="divide-y divide-gray-100">
      {chats.map((chat) => (
        <Link
          key={`${chat.type}-${chat.id}`}
          href={chat.type === 'room' ? `/room/${chat.id}` : `/dm/${chat.id}`}
          className="flex items-center gap-3 p-4 hover:bg-gray-50 active:bg-gray-100 transition-colors"
        >
          <Avatar
            src={chat.avatarUrl}
            alt={chat.name}
            status={chat.status}
            showStatus={chat.type === 'dm'}
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 truncate">{chat.name}</h3>
              {chat.unreadCount > 0 && (
                <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-0.5">
                  {chat.unreadCount}
                </span>
              )}
            </div>
            {chat.lastMessage && (
              <p className="text-sm text-gray-500 truncate">
                {chat.lastMessage.content}
              </p>
            )}
          </div>
        </Link>
      ))}
    </div>
  )
}
