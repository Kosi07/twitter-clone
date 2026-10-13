'use client'

import { signOut } from '@/lib/client-side-auth-client'

import Link from 'next/link'
import { ArrowLeft, Bell, ChevronRight, LogOut, Lock, UserRound } from 'lucide-react'
import { useEffect, useState } from 'react'
import { authClient } from '@/lib/client-side-auth-client'

function SettingRow({ icon: Icon, label, detail, destructive = false }) {
  return (
    <button className="flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-secondary/60 sm:px-6">
      <Icon className={`size-[18px] ${destructive ? 'text-red-700' : 'text-muted-foreground'}`} strokeWidth={1.8} />
      <span className="min-w-0 flex-1">
        <span className={`block text-sm font-medium ${destructive ? 'text-red-700' : ''}`}>{label}</span>
        <span className="mt-0.5 block text-xs text-muted-foreground">{detail}</span>
      </span>
      <ChevronRight className="size-4 text-muted-foreground/70" />
    </button>
  )
}

export default function SettingsPage() {
  const {data:session } = authClient.useSession()
  
  const [handle, setHandle] = useState('')

  useEffect(() => {
    if (!session?.user) return;
      
    setHandle(session.user.handle ?? "")
  }, [session])

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen max-w-[1280px]">

        <section className="w-full max-w-[624px] border-x border-border/70 px-4 pb-24 sm:px-8 lg:pb-10">
          <header className="sticky top-0 z-10 -mx-4 border-b border-border/70 bg-background/90 px-4 backdrop-blur-md sm:-mx-8 sm:px-8">
            <div className="flex h-16 items-center gap-3"><Link href="/" aria-label="Back to home" className="rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-foreground"><ArrowLeft className="size-[18px]" /></Link><h1 className="text-base font-semibold tracking-[-0.02em]">Settings</h1></div>
          </header>

          <div className="py-8 sm:py-10">
            <div className="mb-8"><p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">Your space</p><h2 className="mt-2 text-3xl font-semibold tracking-[-0.045em]">Account settings</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">Manage your profile, privacy, and how you experience twitt3r.</p></div>

            <section className="overflow-hidden rounded-2xl border border-border/80 bg-card shadow-[0_6px_24px_rgba(47,43,36,0.035)]" aria-labelledby="account-heading">
              <h3 id="account-heading" className="border-b border-border/70 px-5 py-4 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground sm:px-6">Account</h3>
              <div className="divide-y divide-border/70">
                <SettingRow icon={UserRound} label="Profile" detail="Update your name, handle, and photo" />
                <SettingRow icon={Lock} label="Privacy and safety" detail="Control who can see and interact with you" />
                <SettingRow icon={Bell} label="Notifications" detail="Choose what you want to hear about" /></div>
            </section>

            <section className="mt-5 overflow-hidden rounded-2xl border border-border/80 bg-card shadow-[0_6px_24px_rgba(47,43,36,0.035)]" aria-labelledby="session-heading">
                <h3 id="session-heading" className="border-b border-border/70 px-5 py-4 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground sm:px-6">Session</h3>
                <div className="divide-y divide-border/70">
                    <button className='w-full' onClick={()=>signOut()}>
                        <SettingRow icon={LogOut} label="Log out" detail={`Sign out of @${handle} on this device`} destructive />
                    </button>
                </div>
            </section>
            <p className="mt-6 px-1 text-[11px] leading-5 text-muted-foreground">twitt3r keeps things simple. You can always come back and change these choices later.</p>
          </div>
        </section>

        <aside className="hidden w-[352px] shrink-0 px-6 py-24 xl:block"><div className="rounded-2xl border border-border/70 bg-card p-5"><p className="text-sm font-semibold">A quieter social space</p><p className="mt-2 text-xs leading-5 text-muted-foreground">Thoughtful defaults, fewer distractions, and room for the things worth sharing.</p></div></aside>
      </div>

    </main>
  )
}
