import Image, { StaticImageData } from 'next/image';
import commentIcon from '@/public/comment.svg';
import { useState } from 'react';
import ImgViewer from './ImgViewer';

{/* Heart */}
function Heart({isLiked, setIsLiked, setLikes} 
  : 
  {
    isLiked: boolean,
    setIsLiked: React.Dispatch<React.SetStateAction<boolean>>,
    setLikes: React.Dispatch<React.SetStateAction<number>>,
  }){
  return(
    <svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"
      className='w-9 h-9 rounded-full 
                  hover:scale-110 hover:p-1 hover:bg-red-400 hover:cursor-pointer
                  active:bg-red-400 active:scale-110 active:p-1 
                  duration-140 ease-out'

      onClick={()=>{
        setIsLiked(prev => !prev)
        if(isLiked){
          setLikes(prev => prev-1)
        }
        else{
          setLikes(prev => prev+1)
        }
      }}
    >
      <path d="M 50 75 Q 30 60 22 48 Q 15 35 20 27 Q 25 20 35 20 Q 42 20 50 28 Q 58 20 65 20 Q 75 20 80 27 Q 85 35 78 48 Q 70 60 50 75 Z" 
            fill={isLiked? '#DC143C' : 'none'} stroke="black" strokeWidth={isLiked? '3' : '2'}/>
    </svg>
  )
}

const Tweet = ({ username, handle, profilePic, createdAt, tweetText, commentCounter, likeCounter, imgSrc } : {
  username : string,
  handle : string,
  profilePic: StaticImageData | string,
  createdAt?: Date,
  tweetText : string,
  commentCounter : number,
  likeCounter : number,
  imgSrc?: string | StaticImageData,
}) => {

  const [isLiked, setIsLiked] = useState(false);

  const [likes, setLikes] = useState(likeCounter);

  function formatTweetDate(date: Date) {
    const currentYear = new Date().getFullYear();
    const tweetYear = date.getFullYear();
    
    const options: Intl.DateTimeFormatOptions = { 
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

  function formatCounter(counter:number){
    if (counter >= 1000000){ return `${Math.floor(counter/1000000)}M`}
    if (counter >= 1000){ return `${Math.floor(counter/1000)}K`}
    if (counter < 1000){ return counter }
  };

  const newCommentCounter = formatCounter(commentCounter);
  const newLikeCounter = formatCounter(likes);

  const [viewImg, setViewImg] = useState(false);

  return (
    <div className='w-19/20 border-b border-b-gray-400/20 sm:text-xl md:text-2xl'>
        <div className='flex justify-between gap-2 w-full my-3 p-1'>
            <div id='profilePic' className='w-10 min-w-10 h-10 sm:w-15 sm:h-15 md:w-20 md:h-20'>
              <Image 
                  src={profilePic}
                  className='rounded-full'
                  alt='profile picture'
                  width={100}
                  height={100}
              />
            </div>
            
            <div className='flex flex-col gap-4 w-11/12'>
                <div className='flex flex-row gap-1'>
                  <span id='username' className='font-bold w-53/100 line-clamp-1 overflow-ellipses hover:cursor-pointer'>{username}</span>

                  <span id='handle' className='text-gray-500 text-lg w-3/10 line-clamp-1 overflow-ellipsis hover:cursor-pointer hover:underline'>@{handle.split('-')[0]}</span>

                  <span id='time' title={`${createdAt}`} className='text-gray-500 w-3/10 text-lg text-center hover:cursor-pointer hover:underline'>{timeSinceTweet}</span>
                </div>

                <div id='tweet-text' className='w-10/11 line-clamp-6 break-words overflow-ellipsis'>{tweetText}</div>

                {imgSrc &&
                  <div>
                      <div>
                        <Image alt='' onClick={()=>setViewImg(true)} className='w-full h-auto rounded-2xl' src={imgSrc} quality={100} width={500} height={500} />

                        <ImgViewer imgSrc={imgSrc} viewImg={viewImg} setViewImg={setViewImg} />
                      </div>
                  </div>
                }

                <div id='counter-container' className='w-10/11 flex flex-row justify-between gap-4'>
                  <div className='flex flex-row items-center gap-1'>
                    <Image
                        alt=''
                        className='rounded-full 
                                  hover:scale-110 hover:p-1 hover:bg-teal-300/50 active:bg-teal-300 active:scale-110 active:p-1 duration-300'
                        src={commentIcon}
                        width={30}
                        height={30} 
                    />
                    <span id='comment-counter' className='text-gray-500 text-lg hover:text-teal-300 duration-200'>{newCommentCounter}</span>
                  </div>

                  <div 
                    className='flex flex-row items-center gap-1'
                    id='likes-div'
                  >                    
                    <Heart isLiked={isLiked} setIsLiked={setIsLiked} setLikes={setLikes} />

                    <span id='like-counter' className='text-gray-500 text-lg hover:text-red-400 duration-200'>{newLikeCounter}</span>
                  </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Tweet