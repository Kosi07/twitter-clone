'use client';

import { useEffect, useState } from 'react';

import Image from 'next/image';
import twitterBird from '@/public/twitter-bird.png';
import profileIcon from '@/public/profile.png';
import createPostIcon from '@/public/plus.png'

import NavBar from '@/components/NavBar';
import CreatePost from '@/components/CreatePost';
import Tweet from '@/components/Tweet';

import { tweets } from '@/app/dummyData/dummyData';
import Aside from '@/components/Aside';

const Page = () => {
    
  const [shouldCreate, setShouldCreate] = useState(false);

  const [tweetsArray, setTweetsArray] = useState([...tweets]);

  const [currentScrollY, setCurrentScrollY] = useState(window.scrollY);  //Trying to implement "if user scrolls down, '+' icon turns transparent, if user scrolls up, it becomes opaque"
  const [lastScrollY, setLastScrollY] = useState(0);

  const [array, setArray] = useState([lastScrollY, currentScrollY]);
  
  useEffect(()=>{  //Understand the code inside. Don't really understand why useEffect is here. Claude just said it's better that way?...
    window.addEventListener('scroll', ()=>{
        setArray([currentScrollY, window.scrollY]);
        setCurrentScrollY(window.scrollY);
        
        console.log(currentScrollY);
    })
  },[])

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
                    className='hover:cursor-pointer'
                    src={twitterBird}
                    width={40}
                    height={45}
                />
        </header>

        <CreatePost shouldCreate={shouldCreate} setShouldCreate={setShouldCreate} tweetsArray={tweetsArray} setTweetsArray={setTweetsArray} />

        <Aside />

        <main>
            {tweetsArray.map((tweet)=> <Tweet key={tweet.handle+''+tweet.timeDetails} username={tweet.username} handle={tweet.handle} time={tweet.time} timeDetails={tweet.timeDetails} tweetText={tweet.tweetText} commentCounter={tweet.commentCounter} likeCounter={tweet.likeCounter} imgSrcs={tweet.imgSrcs}/>)}
        </main>

       <div 
            className={`z-20 fixed right-1/9 bottom-1/6 ${(array[1]>array[0])?'bg-gray-800/50 border':'bg-gradient-to-br from-gray-900/85 to-blue-300'} rounded-[50%] p-4 px-7 shadow-gray-700 shadow-lg/50
                    hover:scale-120 hover:cursor-pointer active:scale-130 duration-400`}
            onClick={()=>setShouldCreate(true)}
            title='Post tweet?'
            id='plus-icon-container'
       >
            <div className='relative w-3 h-9 bg-gray-200 rounded-xs'>
                <div className='absolute w-9 h-3 bg-gray-200 -left-3 top-2.5 rounded-xs'></div>
            </div>
       </div>

        <div
            className='w-full flex justify-center fixed bottom-0 left-1 right-1 bg-gray-50 h-14 border-t border-t-gray-400 p-2 rounded-xl'
        >
            <NavBar />
        </div>
    </div>
  )
}

export default Page;