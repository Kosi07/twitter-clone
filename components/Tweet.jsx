'use client'

import Image from 'next/image';

import { useState } from 'react';
import ImgViewer from './ImgViewer';
import Link from 'next/link';
import { Bookmark, Heart, MessageCircle, MoreHorizontal, Send, CircleUserRound, Check } from 'lucide-react';
import base_url from '@/lib/base_url';

const Tweet = (
    { id, username, handle, profilePic, createdAt, tweetText, commentCounter, likeCounter, imgSrc, isLiked }
  ) => {

  const border_accents = ['border-l-[#bdb0cf]', 'border-l-[#d8bd96]', 'border-l-[#a9c7b9]', 'border-l-[#b8c099]', 'border-l-[#dbc96f]']


  const [liked, setLiked] = useState(isLiked?isLiked:false);

  const [likes, setLikes] = useState(likeCounter);

  const handleLikeButtonClick = async () => {
    // Optimistic update (update UI immediately)
    const newLikedState = !liked;
    setLiked(newLikedState);
    setLikes(prev => newLikedState ? prev + 1 : prev - 1);

    try {
      const response = await fetch('/api/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          tweetId: id,
          action: newLikedState ? 'like' : 'dislike'
        })
      });

      if (!response.ok) {
        // If it fails, revert the UI
        setLiked(!newLikedState);
        setLikes(prev => newLikedState ? prev - 1 : prev + 1);
      }
    } catch (error) {
      console.error('Error liking tweet:', error);
      // Revert on error
      setLiked(!newLikedState);
      setLikes(prev => newLikedState ? prev - 1 : prev + 1);
    }
  };

  function formatTweetDate(date) {
    const currentYear = new Date().getFullYear();
    const tweetYear = date.getFullYear();
    
    const options = { 
      month: 'short',  // "Nov" instead of "November"
      day: 'numeric'   // "11" 
    };
    
    // If same year, just show "Nov 11"
    if (currentYear === tweetYear) {
      return date.toLocaleDateString('en-US', options);
    }
    
    // If different year, show "Nov 11, 2025"
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    const year = date.getFullYear();
  
    return `${year} ${month}`;
  }

  const timeSinceTweet = createdAt && formatTweetDate(createdAt);

  function formatCounter(counter){
    if (counter >= 1000000){ return `${Math.floor(counter/1000000)}M`}
    if (counter >= 1000){ return `${Math.floor(counter/1000)}K`}
    if (counter < 1000){ return counter }
  };

  const newCommentCounter = formatCounter(commentCounter);
  const newLikeCounter = formatCounter(likes)

  const [viewImg, setViewImg] = useState(false)

  const [saved, setSaved] = useState(false)

  const [copied, setCopied] = useState(false)

  return (
    <article
      className={`border-l-2 ${border_accents[Math.round(Math.random()*4)]} rounded-2xl border border-border/80 bg-card p-5 shadow-[0_6px_24px_rgba(47,43,36,0.035)] transition-shadow hover:shadow-[0_10px_30px_rgba(47,43,36,0.07)] sm:p-6`}
      id={id}
    >
        <div className='flex items-start gap-3'>
            <div id='profilePic' className='w-8 h-8 sm:w-9 sm:h-9'>
              {profilePic?
                <img
                  src={profilePic}
                  className='rounded-full'
                  alt='profile picture'
                />
                :
                <CircleUserRound className='w-full h-full'/>
              }
            </div>
            
            <div className='min-w-0 flex-1'>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold tracking-[-0.01em]">{username}</p>
                  <Link href={`/users/${handle}`}>
                    <p className="mt-0.5 text-xs text-muted-foreground">{handle} <span className="px-1">·</span> {timeSinceTweet}</p>
                  </Link>
                </div>
                <button aria-label={`More options for ${username}`} className="rounded-lg p-1 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"><MoreHorizontal className="size-5" /></button>
              </div>
              <Link href={`/tweets/${id}`}>
                <p className='mt-5 max-w-[54ch] text-[15px] leading-7 tracking-[-0.01em] text-foreground/90 line-clamp-5 break-words overflow-ellipsis whitespace-pre-line'
                >
                  {tweetText}
                </p>
              </Link>
              {imgSrc &&
                <div>
                  <div>
                    <Image alt='' onClick={()=>setViewImg(true)} className='max-w-full max-h-80 aspect-[4/5] object-cover rounded-2xl' src={imgSrc} quality={100} width={500} height={500} />

                    <ImgViewer imgSrc={imgSrc} viewImg={viewImg} setViewImg={setViewImg} />
                  </div>
                </div>
              }
              <div className="mt-6 flex flex-wrap items-center gap-1 border-t border-border/70 pt-3">
                <button onClick={() => handleLikeButtonClick()} 
                  aria-label={liked ? 'Unlike post' : 'Like post'} 
                  className={`flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs transition-colors ${liked ? 'text-rose-600' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'}`}
                >
                  <Heart className={`size-4 ${liked ? 'fill-current' : ''}`} /> 
                  {newLikeCounter}
                </button>

                <button aria-label="Comment on post" className="flex items-center rounded-lg transition-colors hover:bg-secondary hover:text-foreground">
                  <Link href={`/tweets/${id}`} className='flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs text-muted-foreground hover:cursor-default'>
                    <MessageCircle className="size-4" />
                    {newCommentCounter}
                  </Link>
                </button>

                <button onClick={() => setSaved(!saved)} 
                  aria-label={saved ? 'Remove bookmark' : 'Bookmark post'} 
                  className={`ml-auto rounded-lg p-1.5 transition-colors ${saved ? 'text-foreground' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'}`}
                >
                  <Bookmark className={`size-4 ${saved ? 'fill-current' : ''}`} />
                </button>

                <button onClick={()=>{
                  navigator.clipboard.writeText(base_url()+'/tweets/'+id);
                  setCopied(true);
                  window.setTimeout(() => setCopied(false), 1800);
                }} 
                  aria-label={copied ? 'Copied link' : 'Share post'} 
                  className={`relative flex h-8 min-w-[75px] items-center justify-center rounded-lg p-1.5 text-xs transition-colors duration-200 hover:bg-secondary hover:text-foreground ${copied ? 'text-foreground' : 'text-muted-foreground'}`}
                >
                  <span className={`absolute inset-0 flex items-center justify-center gap-1.5 transition-all duration-200 ${copied ? 'scale-100 opacity-100' : 'scale-75 opacity-0'}`} aria-hidden={!copied}>
                    <Check className="size-4" />
                    <span>Copied</span>
                  </span>
                  <Send className={`size-4 transition-all duration-200 ${copied ? 'scale-75 opacity-0' : 'scale-100 opacity-100'}`} aria-hidden={copied} />
                </button>
              </div>

            </div>
        </div>
    </article>
  )
}

export default Tweet