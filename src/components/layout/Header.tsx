// daychat/src/components/layout/Header.tsx
'use client'

import { useAuth } from '@/lib/hooks/useAuth'
import { Button } from '@/components/ui/Button'
import { Avatar } from '@/components/ui/Avatar'

interface HeaderProps {
  title: string
  showNewChatButton?: boolean
  onNewChat?: () => void
}

export function Header({ title, showNewChatButton, onNewChat }: HeaderProps) {
  const { user, signOut } = useAuth()

  return (
    <header className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white">
      <h1 className="text-xl font-bold text-gray-900">{title}</h1>
      <div className="flex items-center gap-2">
        {showNewChatButton && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onNewChat}
            aria-label="New chat"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
          </Button>
        )}
        {user && (
          <button onClick={() => signOut()} aria-label="Sign out" className="ml-2">
            <Avatar src={user.avatar_url} alt={user.username} size="sm" />
          </button>
        )}
      </div>
    </header>
  )
}
