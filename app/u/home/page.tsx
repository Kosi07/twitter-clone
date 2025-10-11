'use client';

import { useContext, useEffect, useState } from 'react';

import Image, { StaticImageData } from 'next/image';
import twitterBird from '@/public/twitter-bird.png';
import profileIcon from '@/public/profile.png';

import CreatePost from '@/components/CreatePost';
import Tweet from '@/components/Tweet';

import { tweets } from '@/lib/dummyData';
import Aside from '@/components/Aside';
import { useSession } from 'next-auth/react';
import { NavContext } from '@/contexts/NavBarContext';

const Page = () => {

  const { data: session } = useSession();

  const { setFocusHome, setFocusSearch, setFocusNotif, setFocusDM } = useContext(NavContext);
  
  useEffect(()=>{
    setFocusDM(false);
    setFocusHome(true);
    setFocusSearch(false);
    setFocusNotif(false);
  },[])
    
  const [shouldCreate, setShouldCreate] = useState(false);

  const [tweetsArray, setTweetsArray] = useState([...tweets]);

  const [profilePic, setProfilePic] = useState<StaticImageData|string>(profileIcon);

  useEffect(()=>{
            if(session?.user){setProfilePic(String(session.user.image))};
            }, [session])

  const [openAside, setOpenAside] = useState(false);

  const [currentScrollY, setCurrentScrollY] = useState(0);  //Trying to implement "if user scrolls down, '+' icon turns transparent, if user scrolls up, it becomes opaque"
  const [lastScrollY, setLastScrollY] = useState(0);        //
  const [array, setArray] = useState([lastScrollY, currentScrollY]); //
  
  useEffect(()=>{  //I understand the code inside. Don't really understand why useEffect is here. Claude just said it's better that way?...
    if(window){
    window.addEventListener('scroll', ()=>{
        setArray([currentScrollY, window.scrollY]);
        setCurrentScrollY(window.scrollY);
    })
    }
  },[])

  useEffect(() => {
    let start = 0;

    const handleTouchStart = (e: TouchEvent) => {
      start = e.touches[0].clientX;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const end = e.changedTouches[0].clientX;
      const diff = end - start;

      // Swipe right from left edge (open aside)
      if (start < 50 && diff > 40) {
        setOpenAside(true);
      }
      // Swipe left when aside is open (close aside)
      if (openAside && diff < -40) {
        setOpenAside(false);
      }
    };

    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchend', handleTouchEnd);
  }, [openAside]);

  return (
    <div className='w-full max-w-[700px] min-w-[280px] min-h-screen relative'>
        <header
             className='w-[100%] flex justify-between border-b border-b-gray-300 p-2 mb-4 rounded-xl sticky top-2 backdrop-blur-lg bg-gray-100/5'
        >
                <Image
                    alt='user profile icon'
                    className='rounded-full hover:cursor-pointer active:bg-gradient-to-b from-red-200 to-blue-200 active:scale-110 active:p-1 duration-300 ease'
                    src={profilePic}
                    width={40}
                    height={45}
                    onClick={()=>setOpenAside(true)}
                />

                <Image
                    alt='twitter bird' 
                    className='hover:cursor-pointer'
                    src={twitterBird}
                    width={40}
                    height={45}
                />
        </header>

        <CreatePost shouldCreate={shouldCreate} setShouldCreate={setShouldCreate} tweetsArray={tweetsArray} setTweetsArray={setTweetsArray} profilePic={profilePic} />

        <Aside profilePic={profilePic} openAside={openAside} user={session?.user} />
        <div 
            id='overlay'
            onClick={()=>setOpenAside(false)}
            className={`fixed inset-0 z-25 bg-gray-500 opacity-90 ${openAside? '' : 'hidden'} duration-100 ease`}
        >
        </div>

        <main>
            {tweetsArray.map((tweet)=> <Tweet key={tweet.handle+''+tweet.timeDetails} username={tweet.username} handle={tweet.handle} profilePic={tweet.profilePic} time={tweet.time} timeDetails={tweet.timeDetails} tweetText={tweet.tweetText} commentCounter={tweet.commentCounter} likeCounter={tweet.likeCounter} imgSrcs={tweet.imgSrcs}/>)}
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
    </div>
  )
}

export default Page;