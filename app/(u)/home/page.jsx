'use client';

import { useContext, useEffect, useState } from 'react';

import CreatePost from '@/components/CreatePost';
import Tweet from '@/components/Tweet';

import { NavContext } from '@/contexts/NavBarContext';

import Navigation from '@/components/Navigation';

const Page = () => {
  const { setFocusHome, setFocusSearch, setFocusNotif, setFocusDM } = useContext(NavContext);
  
  useEffect(()=>{
    setFocusDM(false);
    setFocusHome(true);
    setFocusSearch(false);
    setFocusNotif(false);
  })
    
  const [shouldCreate, setShouldCreate] = useState(false);

  const [tweetsArray, setTweetsArray] = useState()

  //"if user scrolls down, '+' icon background turns transparent, if user scrolls up, it becomes opaque"      
  const [scrollArray, setScrollArray] = useState([0, 0]); 

  useEffect(()=>{
    const handleScroll = () => {
      setScrollArray([scrollArray[1], window.scrollY])
    }
    
    window.addEventListener('scroll', handleScroll)

    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrollArray])

  const fetchTweets = async () => {
    const response = await fetch('/api/tweets')
    if(response.ok){
      const result = await response.json()
      
      if (Array.isArray(result)) {
        setTweetsArray([...result])
      } 
      else {
        console.error('Invalid response:', result)
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
    <div className='w-full max-w-[700px] min-w-[280px] min-h-screen relative'>
        <Navigation />

        <CreatePost shouldCreate={shouldCreate} setShouldCreate={setShouldCreate} tweetsArray={tweetsArray} setTweetsArray={setTweetsArray} fetchTweets={fetchTweets} />

        <main>
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
                />
              )
            }
            
            <div className='h-20'>{/* Just to add empty space underneath the last tweet */}</div>
        </main>

       <div 
            className={`z-20 fixed right-1/9 bottom-1/6 ${(scrollArray[1]>scrollArray[0])?'bg-gray-800/50 border':'bg-gradient-to-br from-gray-900/85 to-blue-300'} rounded-[50%] p-4 px-7 shadow-gray-700 shadow-lg/50
                    hover:scale-120 hover:cursor-pointer active:scale-130 duration-400`}
            onClick={()=>setShouldCreate(true)}
            title='Post tweet?'
            id='plus-icon-container'
       >
            <div className='relative w-3 h-9 bg-gray-200 rounded-xs'>
                <div className='absolute w-9 h-3 bg-gray-200 -left-3 top-2.5 rounded-xs'></div>
            </div>
       </div>
    </div>
  )
}

export default Page;