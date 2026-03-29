// daychat/src/components/chat/MessageBubble.tsx
import { clsx } from 'clsx'
import type { Message, Profile } from '@/lib/supabase/types'

interface MessageBubbleProps {
  message: Message
  isOwn: boolean
  sender?: Profile
  showAvatar?: boolean
}

export function MessageBubble({
  message,
  isOwn,
  sender,
  showAvatar = true,
}: MessageBubbleProps) {
  const time = new Date(message.created_at).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <div
      className={clsx(
        'flex items-end gap-2 max-w-[85%]',
        isOwn ? 'ml-auto flex-row-reverse' : 'mr-auto'
      )}
    >
      {showAvatar && !isOwn && sender && (
        <div className="flex-shrink-0">
          {sender.avatar_url ? (
            <img
              src={sender.avatar_url}
              alt={sender.username}
              className="h-8 w-8 rounded-full object-cover"
            />
          ) : (
            <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
              <span className="text-gray-600 font-medium text-sm">
                {sender.username.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>
      )}
      <div
        className={clsx(
          'rounded-2xl px-4 py-2',
          isOwn
            ? 'bg-blue-600 text-white rounded-br-md'
            : 'bg-gray-200 text-gray-900 rounded-bl-md'
        )}
      >
        {!isOwn && showAvatar && sender && (
          <p className="text-xs font-medium mb-1 opacity-75">
            {sender.username}
          </p>
        )}
        <p className="text-sm whitespace-pre-wrap break-words">
          {message.content}
        </p>
        <p
          className={clsx(
            'text-xs mt-1',
            isOwn ? 'text-blue-100' : 'text-gray-500'
          )}
        >
          {time}
        </p>
      </div>
    </div>
  )
}
