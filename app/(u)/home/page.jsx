'use client';

import { useContext, useEffect, useRef, useState } from 'react';

import Tweet from '@/components/Tweet';

import { NavContext } from '@/contexts/NavBarContext';

import { Bell, Bookmark, CircleUserRound, Compass, FaceSlightlySmilingPlus, Home, ImageIcon, PenLine, Search, Settings, Sparkles, Users } from 'lucide-react';
import Link from 'next/link'
import { authClient } from '@/lib/client-side-auth-client';


function NavItem({ icon: Icon, label, active = false, badge }) {
  return (
    <button className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${active ? 'bg-foreground text-background' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'}`}>
      <Icon className='size-[18px]' strokeWidth={active ? 2.2 : 1.8} />
      <span>{label}</span>
      {badge && <span className={`ml-auto text-[11px] ${active ? 'text-background/60' : 'text-muted-foreground'}`}>{badge}</span>}
    </button>
  )
}

function Avatar({ initials, tone, size = 'size-10' }) {
  return <div className={`grid ${size} shrink-0 place-items-center rounded-full text-xs font-semibold tracking-tight ${tone}`}>{initials}</div>
}

const Page = () => {
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

  const [tweetsArray, setTweetsArray] = useState([])

  const [activeTab, setActiveTab] = useState('For you')
  const [draft, setDraft] = useState('')

  const time = new Date()
  // 1. Get the full month name (e.g., "October")
  const day = time.toLocaleDateString('default', { weekday: 'long' })
  const fullMonth = time.toLocaleString('default', { month: 'long' })
  const date = time.getDate()
  const year = time.getFullYear()

  const textAreaRef = useRef(null)
  
  useEffect(() => {
    const pause = setTimeout(() => {
      textAreaRef.current?.focus()
    }, 100)
    return ()=>clearTimeout(pause)
  }, [])

  const [isScrollingDown, setIsScrollingDown] = useState(false)
  const previousScrollY = useRef(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      setIsScrollingDown(currentScrollY > previousScrollY.current && currentScrollY > 24)
      previousScrollY.current = currentScrollY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const focusComposer = () => {
    document.querySelector('textarea[aria-label="Create a post"]')?.focus()
  }

  const fetchTweets = async () => {
    const response = await fetch('/api/tweets')
    if(response.ok){
      const result = await response.json()
      
      if (Array.isArray(result)) {
        setTweetsArray([...result])
      } 
      else {
        console.error('Invalid response:')
      }

    } 
    else{
    console.error('Failed to fetch tweets')
    }
  }

  useEffect(()=>{
    fetchTweets()
  }, [])

  return (
    <main className='min-w-[280px] min-h-screen bg-background'>
      <div className='mx-auto flex max-w-[1280px]'>
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
                <NavItem icon={Home} label="Home" active />
                <NavItem icon={Compass} label="Discover" />
                <NavItem icon={Bell} label="Notifications" badge="3" />
                <NavItem icon={Bookmark} label="Bookmarks" />
                <NavItem icon={Users} label="People" />
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

        <section className="w-full max-w-[624px] border-x border-border/70 px-4 pb-10 sm:px-8">
          <header className="sticky top-0 z-10 -mx-4 border-b border-border/70 bg-background/90 px-4 backdrop-blur-md sm:-mx-8 sm:px-8">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center gap-2 lg:hidden">
                <Link href='/home' className="flex items-center gap-2.5" aria-label="Twitt3r home">
                  <span className="grid size-8 place-items-center rounded-[10px] bg-[#242321] text-sm font-semibold tracking-tight text-white">t</span>
                  <span className="text-[15px] font-semibold tracking-[-0.03em]">twitt3r</span>
                </Link>
              </div>
              {session?
                <>
                <div className="hidden items-center gap-1 rounded-xl bg-secondary p-1 sm:flex">
                  <button onClick={() => setActiveTab('For you')} className={`rounded-lg px-4 py-1.5 text-xs font-medium transition-colors ${activeTab === 'For you' ? 'bg-background shadow-sm' : 'text-muted-foreground'}`}>
                    For you
                  </button>
                  <button onClick={() => setActiveTab('Following')} className={`rounded-lg px-4 py-1.5 text-xs font-medium transition-colors ${activeTab === 'Following' ? 'bg-background shadow-sm' : 'text-muted-foreground'}`}>
                    Following
                  </button>
                </div>
                <button aria-label="Search" className="rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-foreground">
                  <Search className="size-[18px]" />
                </button>
                </>
                :
                <Link href='/sign-in' className='hidden flex-row gap-5 sm:flex'>
                  You're not signed in...
                </Link>
              }
            </div>

            {/* For phone */}
            {session &&
            <>
              <div className="flex gap-1 pb-2 sm:hidden">
                <button onClick={() => setActiveTab('For you')} className={`flex-1 border-b-2 py-2 text-xs font-medium ${activeTab === 'For you' ? 'border-foreground text-foreground' : 'border-transparent text-muted-foreground'}`}>
                  For you
                </button>
                <button onClick={() => setActiveTab('Following')} className={`flex-1 border-b-2 py-2 text-xs font-medium ${activeTab === 'Following' ? 'border-foreground text-foreground' : 'border-transparent text-muted-foreground'}`}>
                  Following
                </button>
              </div>
            </>
            }
          </header>

          <div className="py-7">
            <div className="mb-7">
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                {day},{' '}{fullMonth}{' '}{date}{' '}{'·'}{' '}{year}
              </p>
              <h1 className="mt-2 text-2xl font-semibold tracking-[-0.045em] sm:text-3xl">
                A little space for good ideas
              </h1>
            </div>
            <div className="mb-6 rounded-2xl border border-border/80 bg-card p-4 shadow-[0_6px_24px_rgba(47,43,36,0.035)] sm:p-5">
              <div className="flex gap-3">
                {profilePic?
                  <img src={profilePic} id='Avatar' className='bg-[#d9e0ea] text-[#40546e] grid shrink-0 place-items-center rounded-full text-xs font-semibold tracking-tight size-9' />
                  :
                  <CircleUserRound className='size-9'/>
                }
                <textarea 
                  value={draft} 
                  ref={textAreaRef}
                  onChange={(e) => setDraft(e.target.value)} 
                  placeholder="Share something thoughtful..." 
                  aria-label="Create a post" 
                  rows={2} 
                  maxLength={180}
                  className="min-h-14 flex-1 resize-none bg-transparent pt-1 text-sm leading-6 outline-none placeholder:text-muted-foreground/70" 
                />
              </div>
              <div className="mt-3 flex items-center border-t border-border/70 pt-3">
                <button aria-label="Add image" className="rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-foreground">
                  <ImageIcon className="size-4" />
                </button>
                <button aria-label="Add emoji" className="rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-foreground">
                  <FaceSlightlySmilingPlus className='size-4' />
                </button>
                {session?
                  <button onClick={() => { if (draft.trim()) { setDraft('') } }} disabled={!draft.trim()} 
                    className="ml-auto rounded-lg bg-foreground px-4 py-2 text-xs font-medium text-background transition-opacity disabled:cursor-not-allowed disabled:opacity-35"
                  >
                    Post
                  </button>
                :
                  <Link href='/sign-in' className='ml-auto rounded-lg bg-foreground px-4 py-2 text-xs font-medium text-background'>Sign In</Link>
                }
              </div>
            </div>

            <div className="flex flex-col gap-4">
              {tweetsArray && tweetsArray.length>0 && 
                tweetsArray.map((tweet)=> 
                  <Tweet 
                    key={`${tweet._id}`} 
                    id={tweet._id} 
                    username={tweet.username} 
                    handle={tweet.handle} 
                    profilePic={tweet.profilePic} 
                    createdAt={new Date(tweet.createdAt)} 
                    tweetText={tweet.tweetText} 
                    commentCounter={tweet.commentCounter} 
                    likeCounter={tweet.likeCounter} 
                    imgSrc={tweet.imgSrc}
                    isLiked={tweet.isLiked}
                  />
                )
              }
            </div>
          </div>
        </section>

        <aside className="hidden w-[352px] shrink-0 space-y-6 px-6 py-24 xl:block">
          {session &&
            <>
            <div className="rounded-2xl border border-border/70 bg-card p-5">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold">
                  People to follow
                </h2>
                <button className="text-xs text-muted-foreground hover:text-foreground">
                  See all
                </button>
              </div>
              <div className="mt-5 flex flex-col gap-4">
                {[['SA','Samira Ali','@samira','bg-[#eadfdb] text-[#754d42]'],['TW','Theo Wang','@theow','bg-[#dbe5e8] text-[#45616a]'],['RP','Rae Patel','@raep','bg-[#e7e4d4] text-[#69603a]']].map(([initials, name, handle, tone]) => <div key={handle} className="flex items-center gap-3"><div className={`${tone} size-9 grid shrink-0 place-items-center rounded-full text-xs font-semibold tracking-tight`}>{initials}</div><div className="min-w-0 flex-1"><p className="truncate text-xs font-semibold">{name}</p><p className="truncate text-xs text-muted-foreground">{handle}</p></div><button className="rounded-lg border border-border px-2.5 py-1 text-[11px] font-medium hover:bg-secondary">Follow</button></div>)}
              </div>
            </div>
            <div className="px-1 text-[11px] leading-5 text-muted-foreground">
              About 
              <span className="px-1">·</span> 
              Community guidelines 
              <span className="px-1">·</span> 
              Privacy<br />© {new Date().getFullYear()}
            </div>
            </>
          }
        </aside>

      </div>

      <button
        onClick={focusComposer}
        aria-label="Create a post"
        className={`fixed bottom-[4.75rem] right-4 z-30 grid size-12 place-items-center rounded-full bg-foreground text-background shadow-[0_8px_24px_rgba(47,43,36,0.18)] transition-opacity duration-300 lg:hidden ${isScrollingDown ? 'opacity-30' : 'opacity-100'}`}
      >
        <PenLine className="size-5" />
      </button>

      <nav aria-label='Mobile navigation' className='fixed inset-x-0 bottom-0 z-20 flex justify-around border-t border-border/80 bg-background/95 px-5 py-3 backdrop-blur-md lg:hidden'>
        <button aria-label="Home" className="text-foreground">
          <Home className="size-5" />
        </button>
        <button aria-label="Discover" className="text-muted-foreground">
          <Compass className="size-5" />
        </button>
        <button aria-label="Create post" className="grid size-9 place-items-center rounded-xl bg-foreground text-background">
          <PenLine className="size-4" />
        </button>
        <button aria-label="Notifications" className="text-muted-foreground">
          <Bell className="size-5" />
        </button>
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

    </main>
  )
}

export default Page;