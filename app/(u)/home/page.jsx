'use client';

import { useEffect, useRef, useState } from 'react';
import { authClient } from '@/lib/client-side-auth-client'

import Tweet from '@/components/Tweet';

import { Bell, CircleUserRound, Compass, FaceSlightlySmilingPlus, Gift, Home, ImageIcon, PenLine, Search } from 'lucide-react';
import Link from 'next/link'
import EmojiPicker from 'emoji-picker-react';

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
  const [openEmoji, setOpenEmoji] = useState(false)

  const fileInputRef = useRef(null)
  const [imgPreviewSrc, setImgPreviewSrc] = useState();

  const [selectedImage, setSelectedImage] = useState()

  const [isPosting, setIsPosting] = useState(false)
  const disabled = (draft.trim()==='' && session) || isPosting? true : false

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

  let newTweet

  async function saveImgToCloudinary(img) {
    try {
      // Create form data with the image
      const formData = new FormData();
      formData.append('image', img);

      // Send to your API route
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      // Get the response
      const data = await response.json();
      
      if (data.success) {
        return data.url; // Return the Cloudinary URL
      } else {
        console.error('Upload failed');
        return null
      }
      
    } 
    catch(err){
      console.error('Error uploading image. Error saving to cloudinary');
      return null
    }
  }

  async function saveToMongoDB(){
    const result = await fetch('/api/tweets', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        newTweet
      })
    })

    return result.ok

  }

  async function tweet(){
    setIsPosting(true)

    if(session){
      let cloudinaryUrl=null

      if(selectedImage){
        cloudinaryUrl = await saveImgToCloudinary(selectedImage)

        if(!cloudinaryUrl){
          alert('Failed to upload image')
          return
        }
      }

      newTweet = {
        tweetText: draft.trim(),
        commentCounter: 0,
        likeCounter: 0,
        ...(cloudinaryUrl && { imgSrc: cloudinaryUrl })
      }

      await saveToMongoDB().then((ok)=> {
        if(ok){
          setDraft('');
          setSelectedImage(undefined);
          setOpenEmoji(false)

          fetchTweets()
        }
        else{
          alert('Failed to save tweet')
        }
      })
    
    }else {
      console.log('Need to be signed in to post');
    }

    setIsPosting(false) 
  }

  const [pplToFollow, setPplToFollow] = useState([])

  useEffect(()=>{
    const getPplToFollow = async() => {
      try{
        const req = await fetch('/api/ppl-to-follow')

        const result = await req.json()
        setPplToFollow(result)
      }catch(err){console.error('Error checking ppl to follow')}
    }

    if(session){
      getPplToFollow()
    }
  }, [session])

  //Refresh the page every 2 minutes
  useEffect(() => {
    const refresh = setTimeout(() => {
      fetchTweets()
    }, 120000)
    return ()=>clearTimeout(refresh)
  }, )

  return (
    <main className='min-w-[280px] min-h-screen bg-background'>
      <div className='mx-auto flex max-w-[1280px]'>
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
                <div className='flex flex-row gap-3'>
                  <button aria-label="Search" className="rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-foreground">
                    <Search className="size-[18px]" />
                  </button>
                  <button aria-label="Gift" className="rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-foreground">
                    <Gift className="size-[18px]" />
                  </button>
                </div>
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
              {selectedImage && 
                <div className="relative mt-4 overflow-hidden rounded-xl border border-border/70">
                  <img src={imgPreviewSrc}
                    className="max-h-72 w-full object-cover" 
                  />
                  <button type="button" 
                    onClick={ ()=> {setImgPreviewSrc('');  setSelectedImage(undefined);} } aria-label="Remove selected image" 
                    className="absolute right-2 top-2 rounded-full bg-foreground/80 px-2.5 py-1 text-xs font-medium text-background backdrop-blur-sm transition-colors hover:bg-foreground"
                  >
                    Remove
                  </button>
                </div>
              }
              <div className="mt-3 flex items-center border-t border-border/70 pt-3">
                <button aria-label="Add image" 
                  onClick={()=>fileInputRef.current?.click()}
                  className="rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-foreground"
                >
                  <ImageIcon className="size-4" />
                  <input 
                    ref={fileInputRef}
                    type='file'
                    className='w-40 border hidden'
                    accept='image/jpeg, image/png, image/webp, image/gif'
                    multiple={false}
                    onChange={(e)=>{
                      console.log('input type file onChange');
                      if(e.target.files){
                        const file = e.target.files[0];
                        console.log('file',file)
                        setSelectedImage(file)

                        setImgPreviewSrc(URL.createObjectURL(file));
                        console.log('objectURL',URL.createObjectURL(file))

                        console.log('e.target.value',e.target.value) // .value is the file name
                        e.target.value=''; //causes onChange to trigger even if the same img is selected immediately after it has been removed.
                      }
                    }}
                  />
                </button>

                <button aria-label="Add emoji" 
                  onClick={()=>setOpenEmoji(prev=>!prev)}
                  className="relative rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-foreground"
                >
                  <FaceSlightlySmilingPlus className='size-4' />
                  {openEmoji &&
                    <div className='absolute z-2 p-2'>
                      <EmojiPicker
                        onEmojiClick={(emojiObject)=>{
                                    setDraft(prev => prev + emojiObject.emoji)
                        }}
                      />
                    </div>
                  }
                </button>
                {session?
                  <button 
                    onClick={() => { 
                      if (draft.trim()){ 
                        tweet()
                        //Clear draft/input
                        setDraft('') 
                      } 
                    }} 
                    disabled={disabled} 
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
                {pplToFollow.length>0 && pplToFollow.map((person) => 
                  <Link href={`/users/${person.handle}`} target='_blank' key={person.handle} className="flex items-center gap-3 hover:bg-black/7 hover:cursor-pointer duration-200 p-2 rounded-xl">
                    <img src={person.image} className={`size-9 grid shrink-0 place-items-center rounded-full text-xs font-semibold tracking-tight`} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-semibold">{person.name}</p>
                      <p className="truncate text-xs text-muted-foreground">{person.handle}</p>
                    </div>
                    <button className="rounded-lg border border-border px-2.5 py-1 text-[11px] font-medium hover:bg-secondary">Follow</button>
                  </Link>
                )}
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