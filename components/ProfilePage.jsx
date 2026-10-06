'use client'

import { useState } from 'react'
import { MapPin, Bell, Bookmark, Check, Grid2X2, Heart, Link2, MoreHorizontal, Pencil, Plus, Settings, Share2, Sparkles, UserPlus, ArrowLeft } from 'lucide-react'
import Tweet from './Tweet'
import Link from 'next/link'
import base_url from '@/lib/base_url'

const highlights = [
  { label: 'Studio', color: 'bg-[#e9e2d8]', icon: Sparkles },
  { label: 'Travel', color: 'bg-[#dce4df]', icon: Plus },
  { label: 'Notes', color: 'bg-[#e4dfe8]', icon: Pencil },
  { label: 'Mood', color: 'bg-[#eadfda]', icon: Heart },
]

const ProfilePage = ({signedInUserId, userDetailsAndPosts, urProfilePic, isFollowing}) => {

    const [following, setFollowing] = useState(isFollowing)
    const [activeTab, setActiveTab] = useState('posts')

    const [copied, setCopied] = useState(false)

    const {name, _id:profile_id, handle, image:profilePic, followerCount, followingCount, postCount=86, userPosts, bio='Designing quiet spaces and thoughtful objects. Finding beauty in the everyday.', website_link='mayachen.studio', location='Based in Copenhagen'} = userDetailsAndPosts

    function formatCounter(counter){
        if (counter >= 1000000){ return `${(counter/1000000).toFixed(1)}M`}
        if (counter >= 1000){ return `${(counter/1000).toFixed(1)}K`}
        if (counter < 1000){ return counter }
    }

    const [follower_count, setfollower_count] = useState(followerCount) //12400

    const handleFollowBtnClick = async () => {
        //Optimistic update
        const prevFollowing = !following
        setFollowing(prevFollowing)
        setfollower_count(prev => prevFollowing? prev + 1 : prev - 1)

        try {
            const response = await fetch('/api/follow', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                profile_id: profile_id,
                action: prevFollowing ? 'follow' : 'unfollow'
                })
            })

            if (!response?.ok) {
                console.log('Failed to follow')
                // If it fails, revert the UI
                setFollowing(!prevFollowing)
                setfollower_count(prev => prevFollowing? prev - 1 : prev + 1)
            }
        }catch(err) {
            console.error('Error occured when trying to follow user:')
            // Revert on error
            setFollowing(!prevFollowing)
            setfollower_count(prev => prevFollowing? prev - 1 : prev + 1)
        }
    }

    return(
        <main className="min-h-screen bg-[#fafaf9] text-[#242321] min-w-0">
            <nav className="sticky top-0 z-20 border-b border-black/[0.06] bg-[#fafaf9]/90 backdrop-blur-xl">
                <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
                    <div className='flex flex-row gap-3'>
                    <Link href="/" aria-label="Back to feed" className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"><ArrowLeft className="size-5" /></Link>

                    <Link href='/home' className="flex items-center gap-2.5" aria-label="Twitt3r home">
                        <span className="grid size-8 place-items-center rounded-[10px] bg-[#242321] text-sm font-semibold tracking-tight text-white">t</span>
                        <span className="text-[15px] font-semibold tracking-[-0.03em]">twitt3r</span>
                    </Link>
                    </div>
                    <div className="flex items-center gap-1">
                        <button 
                            className="grid size-9 place-items-center rounded-full text-[#77736d] transition hover:bg-black/5 hover:text-[#242321]" 
                            aria-label="Notifications">
                                <Bell size={18} strokeWidth={1.7} />
                        </button>
                        <button 
                            className="grid size-9 place-items-center rounded-full text-[#77736d] transition hover:bg-black/5 hover:text-[#242321]" 
                            aria-label="Settings"
                        >
                            <Settings size={18} strokeWidth={1.7} />
                        </button>
                        {/* If session */}
                        <img src={urProfilePic} alt="Your profile" className={`${urProfilePic? '':'hidden'} ml-2 size-8 rounded-full object-cover`} />
                    </div>
                </div>
            </nav>

            <div className="mx-auto max-w-4xl px-5 pb-20 sm:px-8">
                <section className="pt-10 sm:pt-14">
                    <div className="flex flex-col gap-7 sm:flex-row sm:items-start sm:gap-10">
                        <div className="relative shrink-0 self-start">
                        <img src={profilePic} alt={name} className="size-28 rounded-full object-cover ring-1 ring-black/10 sm:size-36" />
                        <span className="absolute bottom-1 right-1 size-4 rounded-full border-[3px] border-[#fafaf9] bg-[#8fa98d]" aria-label="Online" />
                        </div>
                        <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-3">
                            <h1 className="text-2xl font-semibold tracking-[-0.045em] sm:text-[30px]">{name}</h1>
                            <span className="inline-flex items-center gap-1 rounded-full bg-[#ebe9e5] px-2.5 py-1 text-[11px] font-medium text-[#68655f]"><Check size={12} strokeWidth={2.5} /> Creator</span>
                        </div>
                        <p className="mt-1 text-[14px] text-[#77736d]">@{handle}</p>
                        <p className="mt-4 max-w-lg text-[15px] leading-6 text-[#4f4b45]">{bio}</p>
                        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px] text-[#77736d]">
                            <span className="flex items-center gap-1.5 hover:cursor-pointer"><Link2 size={14} /> {website_link}</span>
                            <span className='flex items-center gap-1.5'><MapPin size={14} /> {location}</span>
                        </div>
                        <div className="mt-6 flex flex-wrap gap-2.5">
                            {signedInUserId && signedInUserId==profile_id?
                                <Link
                                    href='/'
                                    target='_blank'
                                    className={`inline-flex h-10 items-center justify-center gap-2 rounded-full px-5 text-sm font-medium transition bg-[#242321] text-white hover:bg-[#3d3b38] hover:cursor-pointer`}
                                >
                                    Edit Profile
                                </Link>
                            :
                                <button 
                                    onClick={() => handleFollowBtnClick()} 
                                    className={`inline-flex h-10 items-center justify-center gap-2 rounded-full px-5 text-sm font-medium transition ${following ? 'bg-[#ebe9e5] text-[#4f4b45]' : 'bg-[#242321] text-white hover:bg-[#3d3b38] hover:cursor-pointer'}`}
                                >
                                    {following ? <><Check size={15} /> Following</> : <><UserPlus size={15} /> Follow</>}
                                </button>
                            }
                            <button 
                                className={`relative flex min-w-[75px] items-center justify-center rounded-lg p-1.5 text-xs transition-colors duration-200 hover:bg-secondary hover:text-foreground `}                                
                                onClick={()=>{
                                    navigator.clipboard.writeText(base_url()+'/users/'+handle);
                                    setCopied(true);
                                    window.setTimeout(() => setCopied(false), 1800);
                                }}
                            >
                                <span className={`absolute inset-0 flex items-center justify-center gap-1.5 transition-all duration-200 ${copied ? 'scale-100 opacity-100' : 'scale-75 opacity-0'}`} aria-hidden={!copied}>
                                    <Check className="size-6" />
                                    <span>Copied</span>
                                </span>
                                <Share2 size={20} className={`transition-all duration-200 ${copied ? 'scale-75 opacity-0' : 'scale-100 opacity-100'}`} />
                            </button>
                            <button className="grid size-10 place-items-center rounded-full border border-black/10 text-[#55514b] transition hover:bg-black/5" aria-label="More options"><MoreHorizontal size={18} /></button>
                        </div>
                        </div>
                        <div className="hidden gap-7 pt-2 sm:flex">
                            {[[formatCounter(follower_count), 'Followers'], [formatCounter(followingCount), 'Following'], [formatCounter(postCount), 'Posts']].map(([number, label]) => <div key={label} className="text-center"><p className="text-lg font-semibold tracking-[-0.03em]">{number}</p><p className="mt-1 text-xs text-[#8c8880]">{label}</p></div>)}
                        </div>
                    </div>
                        <div className="mt-8 flex justify-between border-y border-black/[0.07] py-4 sm:hidden">
                            {[[formatCounter(follower_count), 'Followers'], [formatCounter(followingCount), 'Following'], [formatCounter(postCount), 'Posts']].map(([number, label]) => <div key={label} className="text-center"><p className="font-semibold">{number}</p><p className="mt-0.5 text-xs text-[#8c8880]">{label}</p></div>)}
                        </div>
                </section>

                <section className="mt-10">
                <div className="mb-5 flex items-center justify-between"><h2 className="text-sm font-semibold tracking-[-0.01em]">Highlights</h2><button className="text-xs font-medium text-[#8c8880] hover:text-[#242321]">See all</button></div>
                <div className="flex gap-5 overflow-x-auto pb-2">
                    {highlights.map(({ label, color, icon: Icon }) => <button key={label} className="group flex w-[68px] shrink-0 flex-col items-center gap-2"><span className={`grid size-[62px] place-items-center rounded-full ${color} transition group-hover:ring-2 group-hover:ring-black/10`}><Icon size={20} strokeWidth={1.4} className="text-[#615d57]" /></span><span className="text-xs text-[#77736d]">{label}</span></button>)}
                    <button className="group flex w-[68px] shrink-0 flex-col items-center gap-2"><span className="grid size-[62px] place-items-center rounded-full border border-dashed border-[#c8c3bb] text-[#99948b] transition group-hover:border-[#242321]"><Plus size={19} strokeWidth={1.5} /></span><span className="text-xs text-[#77736d]">New</span></button>
                </div>
                </section>

                <section className="mt-12">
                <div className="flex items-center gap-7 border-b border-black/[0.08]">
                    {[['posts', Grid2X2, 'Posts'], ['saved', Bookmark, 'Saved']].map(([id, Icon, label]) => <button key={id} onClick={() => setActiveTab(id)} className={`relative flex items-center gap-2 pb-3 text-xs font-medium transition ${activeTab === id ? 'text-[#242321]' : 'text-[#9b968e] hover:text-[#55514b]'}`}><Icon size={15} strokeWidth={1.8} />{label}{activeTab === id && <span className="absolute inset-x-0 -bottom-px h-px bg-[#242321]" />}</button>)}
                </div>
                {activeTab === 'posts' ? 
                    <div className="columns-1 gap-3 sm:columns-2 sm:gap-3 lg:columns-3">
                        {userPosts.map((tweet) => (
                            <div key={tweet._id} className="break-inside-avoid mb-3">
                            <Tweet  
                                key={`${tweet._id}`} 
                                id={tweet._id} 
                                username={name} 
                                handle={handle} 
                                profilePic={profilePic} 
                                createdAt={new Date(tweet.createdAt)} 
                                tweetText={tweet.tweetText} 
                                commentCounter={tweet.commentCounter} 
                                likeCounter={tweet.likeCounter} 
                                imgSrc={tweet.imgSrc}
                                isLiked={tweet.isLiked}
                            />
                            </div>
                        ))}
                    </div>
                    : 
                    <div className="flex min-h-52 flex-col items-center justify-center gap-2 text-center"><Bookmark size={22} className="text-[#aaa59c]" strokeWidth={1.5} /><p className="text-sm text-[#77736d]">Your saved posts will appear here.</p></div>}
                </section>
            </div>
        </main>
    )
}

export default ProfilePage