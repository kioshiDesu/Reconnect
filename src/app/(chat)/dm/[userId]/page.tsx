// daychat/src/app/(chat)/dm/[userId]/page.tsx
import { DirectMessage } from '@/components/chat/DirectMessage'

interface PageProps {
  params: Promise<{ userId: string }>
}

export default async function DirectMessagePage({ params }: PageProps) {
  const { userId } = await params

  return (
    <div className="flex flex-col h-screen">
      <DirectMessage userId={userId} />
    </div>
  )
}
