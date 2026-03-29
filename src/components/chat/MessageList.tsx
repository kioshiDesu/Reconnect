// daychat/src/components/chat/MessageList.tsx
import { useRef, useEffect } from 'react'
import { MessageBubble } from './MessageBubble'
import type { Message, Profile } from '@/lib/supabase/types'

interface MessageListProps {
  messages: Message[]
  currentUserId: string
  profiles: Map<string, Profile>
}

export function MessageList({ messages, currentUserId, profiles }: MessageListProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight
    }
  }, [messages])

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        <p>No messages yet. Say hello!</p>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto p-4 space-y-4"
    >
      {messages.map((message, index) => {
        const isOwn = message.sender_id === currentUserId
        const sender = profiles.get(message.sender_id)
        const showAvatar =
          index === 0 ||
          messages[index - 1]?.sender_id !== message.sender_id

        return (
          <MessageBubble
            key={message.id}
            message={message}
            isOwn={isOwn}
            sender={sender}
            showAvatar={showAvatar}
          />
        )
      })}
    </div>
  )
}
