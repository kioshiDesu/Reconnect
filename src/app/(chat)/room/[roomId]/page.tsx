// daychat/src/app/(chat)/room/[roomId]/page.tsx
import { ChatRoom } from '@/components/chat/ChatRoom'

interface PageProps {
  params: Promise<{ roomId: string }>
}

export default async function ChatRoomPage({ params }: PageProps) {
  const { roomId } = await params

  return (
    <div className="flex flex-col h-screen">
      <ChatRoom roomId={roomId} />
    </div>
  )
}
