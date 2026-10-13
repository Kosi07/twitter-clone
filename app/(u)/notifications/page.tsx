'use client'

import Link from 'next/link'
import { Bell, Check, Heart, MessageCircle, UserPlus } from 'lucide-react'

const notifications = [
  { icon: Heart, tone: 'bg-[#eadfdb] text-[#754d42]', title: 'Samira Ali liked your post', detail: 'The best interfaces feel quiet.', time: '8 min', unread: true },
  { icon: MessageCircle, tone: 'bg-[#dce8e2] text-[#315348]', title: 'Theo Wang commented on your post', detail: '“This is exactly the kind of clarity I look for.”', time: '24 min', unread: true },
  { icon: UserPlus, tone: 'bg-[#e7e4d4] text-[#69603a]', title: 'Rae Patel started following you', detail: '@raep', time: '1 hr', unread: true },
  { icon: Heart, tone: 'bg-[#e4dfeb] text-[#665077]', title: 'Maya Chen liked your post', detail: 'A small ritual that has changed my mornings.', time: '3 hr', unread: false },
]

export default function NotificationsPage() {
  return (
    <main className="min-h-screen bg-background">
      <section className="mx-auto w-full max-w-[624px] border-x border-border/70 px-4 pb-10 sm:px-8">
        <header className="sticky top-0 z-10 -mx-4 border-b border-border/70 bg-background/90 px-4 backdrop-blur-md sm:-mx-8 sm:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="size-5" />
              <h1 className="text-lg font-semibold tracking-[-0.04em]">Notifications</h1>
            </div>
            <button className="rounded-lg px-2 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">Mark all read</button>
          </div>
        </header>

        <div className="py-7">
          <div className="mb-7">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">Your activity</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.045em] sm:text-3xl">Stay in the loop</h2>
          </div>

          <div className="overflow-hidden rounded-2xl border border-border/80 bg-card shadow-[0_6px_24px_rgba(47,43,36,0.035)]">
            {notifications.map(({ icon: Icon, tone, title, detail, time, unread }, index) => (
              <Link key={`${title}-${time}`} href="/" className={`flex gap-3 p-5 transition-colors hover:bg-secondary/50 sm:p-6 ${index < notifications.length - 1 ? 'border-b border-border/70' : ''}`}>
                <div className={`grid size-10 shrink-0 place-items-center rounded-full ${tone}`}><Icon className="size-4" /></div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-semibold tracking-[-0.01em]">{title}</p>
                    <span className="shrink-0 text-xs text-muted-foreground">{time}</span>
                  </div>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">{detail}</p>
                </div>
                {unread && <span aria-label="Unread" className="mt-1 size-2 shrink-0 rounded-full bg-foreground" />}
              </Link>
            ))}
          </div>

          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground"><Check className="size-3.5" /> You&apos;re all caught up</div>
        </div>
      </section>
    </main>
  )
}
