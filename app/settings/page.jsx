'use client'

import { signOut } from '@/lib/client-side-auth-client'

import Link from 'next/link'
import { ArrowLeft, Bell, ChevronRight, Home, LogOut, Lock, Settings as SettingsIcon, UserRound } from 'lucide-react'

function Avatar({ initials, tone, size = 'size-10' }) {
  return <div className={`grid ${size} shrink-0 place-items-center rounded-full text-xs font-semibold tracking-tight ${tone}`}>{initials}</div>
}

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
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen max-w-[1280px]">
        <aside className="sticky top-0 hidden h-screen w-[304px] shrink-0 flex-col justify-between border-r border-border/70 px-5 py-7 lg:flex">
          <div>
            <div className="mb-12 flex items-center gap-2 px-3">
                <Link href='/home' className="flex items-center gap-2.5" aria-label="Twitt3r home">
                    <span className="grid size-8 place-items-center rounded-[10px] bg-[#242321] text-sm font-semibold tracking-tight text-white">t</span>
                    <span className="text-[15px] font-semibold tracking-[-0.03em]">twitt3r</span>
                </Link>
            </div>
            <nav aria-label="Primary navigation" className="flex flex-col gap-1">
              <Link href="/" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"><Home className="size-[18px]" strokeWidth={1.8} />Home</Link>
              <Link href="/" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"><Bell className="size-[18px]" strokeWidth={1.8} />Notifications</Link>
              <Link href="/settings" className="flex items-center gap-3 rounded-xl bg-foreground px-3 py-2.5 text-sm text-background"><SettingsIcon className="size-[18px]" strokeWidth={2.2} />Settings</Link>
            </nav>
          </div>
          <div className="flex items-center gap-3 border-t border-border/70 px-3 pt-5"><Avatar initials="AL" tone="bg-[#d9e0ea] text-[#40546e]" size="size-9" /><div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">Alex Lee</p><p className="truncate text-xs text-muted-foreground">@alexlee</p></div></div>
        </aside>

        <section className="w-full max-w-[624px] border-x border-border/70 px-4 pb-24 sm:px-8 lg:pb-10">
          <header className="sticky top-0 z-10 -mx-4 border-b border-border/70 bg-background/90 px-4 backdrop-blur-md sm:-mx-8 sm:px-8">
            <div className="flex h-16 items-center gap-3"><Link href="/" aria-label="Back to home" className="rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-foreground"><ArrowLeft className="size-[18px]" /></Link><h1 className="text-base font-semibold tracking-[-0.02em]">Settings</h1></div>
          </header>

          <div className="py-8 sm:py-10">
            <div className="mb-8"><p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">Your space</p><h2 className="mt-2 text-3xl font-semibold tracking-[-0.045em]">Account settings</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">Manage your profile, privacy, and how you experience common.</p></div>

            <section className="overflow-hidden rounded-2xl border border-border/80 bg-card shadow-[0_6px_24px_rgba(47,43,36,0.035)]" aria-labelledby="account-heading">
              <h3 id="account-heading" className="border-b border-border/70 px-5 py-4 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground sm:px-6">Account</h3>
              <div className="divide-y divide-border/70"><SettingRow icon={UserRound} label="Profile" detail="Update your name, handle, and photo" /><SettingRow icon={Lock} label="Privacy and safety" detail="Control who can see and interact with you" /><SettingRow icon={Bell} label="Notifications" detail="Choose what you want to hear about" /></div>
            </section>

            <section className="mt-5 overflow-hidden rounded-2xl border border-border/80 bg-card shadow-[0_6px_24px_rgba(47,43,36,0.035)]" aria-labelledby="session-heading">
                <h3 id="session-heading" className="border-b border-border/70 px-5 py-4 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground sm:px-6">Session</h3>
                <div className="divide-y divide-border/70">
                    <button className='w-full' onClick={()=>signOut()}>
                        <SettingRow icon={LogOut} label="Log out" detail="Sign out of @alexlee on this device" destructive />
                    </button>
                </div>
            </section>
            <p className="mt-6 px-1 text-[11px] leading-5 text-muted-foreground">common keeps things simple. You can always come back and change these choices later.</p>
          </div>
        </section>

        <aside className="hidden w-[352px] shrink-0 px-6 py-24 xl:block"><div className="rounded-2xl border border-border/70 bg-card p-5"><p className="text-sm font-semibold">A quieter social space</p><p className="mt-2 text-xs leading-5 text-muted-foreground">Thoughtful defaults, fewer distractions, and room for the things worth sharing.</p></div></aside>
      </div>
      <nav aria-label="Mobile navigation" className="fixed inset-x-0 bottom-0 z-20 flex justify-around border-t border-border/80 bg-background/95 px-5 py-3 backdrop-blur-md lg:hidden"><Link href="/" aria-label="Home" className="text-muted-foreground"><Home className="size-5" /></Link><Link href="/" aria-label="Notifications" className="text-muted-foreground"><Bell className="size-5" /></Link><Link href="/settings" aria-label="Settings" className="text-foreground"><SettingsIcon className="size-5" /></Link><Link href="/" aria-label="Profile" className="text-muted-foreground"><Avatar initials="AL" tone="bg-[#d9e0ea] text-[#40546e]" size="size-5" /></Link></nav>
    </main>
  )
}
