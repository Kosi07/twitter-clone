'use client'

import { Bell, CircleUserRound, Compass, Home, Settings } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { authClient } from '@/lib/client-side-auth-client'
import { usePathname } from "next/navigation"

const MobileNav = () => {
    const pathname = usePathname()

    const navItems = [
        {title: 'home', icon: Home},
        {title: 'discover', icon: Compass},
        {title: 'notifications', icon: Bell},
        {title: 'settings', icon: Settings}
    ]

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
    <nav aria-label='Mobile navigation' className='fixed inset-x-0 bottom-0 z-20 flex justify-around border-t border-border/80 bg-background/95 px-5 py-3 backdrop-blur-md lg:hidden'>
        {navItems.map((navItem) => 
            <button key={navItem.title} aria-label={navItem.title}><Link href={`/${navItem.title}`}><navItem.icon className='size-5' strokeWidth={pathname === `/${navItem.title}` ? 2.2 : 1.8} /></Link></button>
        )}
        
        <button aria-label="Profile" className="text-muted-foreground">
          {profilePic?
            <Link href={`/users/${handle}`}>
              <img src={profilePic} id='Avatar' className='bg-[#d9e0ea] text-[#40546e] grid shrink-0 place-items-center rounded-full text-xs font-semibold tracking-tight size-5' />
            </Link>
            :
            <Link href='/sign-in'>
              <CircleUserRound className='size-5'/>
            </Link>
          }
        </button>
      </nav>
  )
}

export default MobileNav