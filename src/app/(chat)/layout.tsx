// daychat/src/app/(chat)/layout.tsx
import { MobileNav } from '@/components/layout/MobileNav'

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col h-screen">
      <main className="flex-1 overflow-hidden">
        {children}
      </main>
      <MobileNav />
    </div>
  )
}
