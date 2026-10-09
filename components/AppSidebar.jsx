'use client'

import Link from "next/link"
import { authClient } from '@/lib/client-side-auth-client';
import { Bell, Bookmark, CircleUserRound, Compass, Home, PenLine, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

function NavItem({ icon: Icon, label, active = false, badge }) {
  return (
    <Link href={`/${label.toLowerCase()}`} className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${active ? 'bg-foreground text-background' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'}`}>
      <Icon className='size-[18px]' strokeWidth={active ? 2.2 : 1.8} />
      <span>{label}</span>
      {badge && <span className={`ml-auto text-[11px] ${active ? 'text-background/60' : 'text-muted-foreground'}`}>{badge}</span>}
    </Link>
  )
}

const navigation = [
  { href: '/home', label: 'Home', icon: Home },
  { href: '/discover', label: 'Discover', icon: Compass },
  { href: '/notifications', label: 'Notifications', icon: Bell, badge: '3' },
  { href: '/bookmarks', label: 'Bookmarks', icon: Bookmark },
]

const AppSidebar = () => {
    const pathname = usePathname()

    const {data:session } = authClient.useSession()
    
      const [name, setName] = useState('')
      const [handle, setHandle] = useState('')
      const [profilePic, setProfilePic] = useState('')
    
      useEffect(() => {
        if (!session?.user) return;
    
        setName(session.user.name ?? "");
        setHandle(session.user.handle ?? "");
        setProfilePic(session.user.image ?? "");
      }, [session])

  return (
    <aside className="sticky top-0 hidden h-screen w-[304px] shrink-0 flex-col justify-between border-r border-border/70 px-5 py-7 lg:flex">
          <div>
            <div className="mb-12 flex items-center gap-2 px-3">
              <Link href='/home' className="flex items-center gap-2.5" aria-label="Twitt3r home">
                <span className="grid size-8 place-items-center rounded-[10px] bg-[#242321] text-sm font-semibold tracking-tight text-white">t</span>
                <span className="text-[15px] font-semibold tracking-[-0.03em]">twitt3r</span>
              </Link>
            </div>
            {session?
              <>
              <nav aria-label="Primary navigation" className="flex flex-col gap-1">
                {navigation.map(({ href, label, icon: Icon, badge }) => {
                    const active = pathname.startsWith(href)
                    return <Link key={label} href={href} className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${active ? 'bg-foreground text-background' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'}`}><Icon className="size-[18px]" strokeWidth={active ? 2.2 : 1.8} /><span>{label}</span>{badge && <span className={`ml-auto text-[11px] ${active ? 'text-background/60' : 'text-muted-foreground'}`}>{badge}</span>}</Link>
                })}
        </nav>
              <button className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-foreground px-4 py-3 text-sm font-medium text-background transition-transform hover:scale-[1.02]">
                <PenLine className="size-4" /> 
                Create post
              </button>
              </>
            :
              <NavItem icon={Home} label="Home" active />
            }
          </div>
          <div className="flex items-center gap-3 border-t border-border/70 px-3 pt-5">
            {profilePic?
              <Link href={`/users/${handle}`}>
                <img src={profilePic} id='Avatar' className='bg-[#d9e0ea] text-[#40546e] grid shrink-0 place-items-center rounded-full text-xs font-semibold tracking-tight size-9' />
              </Link>
              :
              <CircleUserRound className='size-9'/>
            }
            {session?  
              <>          
                <Link href={`/users/${handle}`} className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">
                    {name}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">@{handle}</p>
                </Link>
                <Link href='/settings'>
                  <Settings className="size-4 text-muted-foreground" />
                </Link>
              </>
            :
              <Link href='/sign-in' className='w-full p-2 rounded-2xl hover:bg-black/5 duration-200'>Sign In</Link>
            }
          </div>
        </aside>
  )
}

export default AppSidebar