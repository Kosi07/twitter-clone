'use client';

import { useState } from 'react';

import Image from 'next/image';
import twitterBird from '@/public/twitter-bird.png';
import profileIcon from '@/public/profile.png';
import createPostIcon from '@/public/plus.png'

import NavBar from '@/components/NavBar';
import CreatePost from '@/components/CreatePost';
import Tweet from '@/components/Tweet';

import { tweets } from '@/app/api/db';

const page = () => {
    
  const [shouldCreate, setShouldCreate] = useState(false);

  const [tweetsArray, setTweetsArray] = useState([...tweets]);

  return (
    <div className='w-full max-w-[700px] min-w-[280px] min-h-screen relative'>
        <header
             className='w-[100%] flex justify-between border-b border-b-gray-300 p-2 mb-4 rounded-xl sticky top-2 backdrop-blur-lg bg-gray-100/5'
        >
                <Image 
                    alt='user profile icon'
                    className='hover:cursor-pointer'
                    src={profileIcon}
                    width={40}
                    height={45}
                />

                <Image
                    alt='twitter bird' 
                    className='fill-blue-400 hover:cursor-pointer'
                    src={twitterBird}
                    width={40}
                    height={45}
                />
        </header>

        <CreatePost shouldCreate={shouldCreate} setShouldCreate={setShouldCreate} tweetsArray={tweetsArray} setTweetsArray={setTweetsArray} />

        <main>
            {tweetsArray.map((tweet, index)=> <Tweet key={`tweet${index}`} username={tweet.username} handle={tweet.handle} time={tweet.time} timeDetails={tweet.timeDetails} tweetText={tweet.tweetText} commentCounter={tweet.commentCounter} likeCounter={tweet.likeCounter}/>)}
        </main>

       <Image 
            alt=''
            className='z-20 fixed right-1/9 bottom-1/6 bg-blue-400 rounded-[50%] p-1 shadow-lg'
            src={createPostIcon}
            width={50}
            height={50}
            onClick={()=>setShouldCreate(true)}
       />

        <div
            className='w-full flex justify-center fixed bottom-0 left-1 right-1 bg-gray-50 h-25 border-t border-t-gray-400 p-2 rounded-xl'
        >
            <NavBar />
        </div>
    </div>
  )
}

export default page;