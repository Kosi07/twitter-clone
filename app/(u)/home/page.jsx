'use client';

import { useContext, useEffect, useState } from 'react';

import CreatePost from '@/components/CreatePost';
import Tweet from '@/components/Tweet';
import PostIcon from '@/components/PostIcon'

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

  const [tweetsArray, setTweetsArray] = useState([])

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

        <PostIcon setShouldCreate={setShouldCreate}/>
    </div>
  )
}

export default Page;