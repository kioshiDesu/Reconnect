// daychat/src/app/(chat)/page.tsx
import { Header } from '@/components/layout/Header'
import { ChatList } from '@/components/chat/ChatList'

export default function HomePage() {
  return (
    <>
      <Header title="Chats" showNewChatButton />
      <div className="flex-1 overflow-y-auto">
        <ChatList />
      </div>
    </>
  )
}
