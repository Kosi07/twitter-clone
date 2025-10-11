import Image, { StaticImageData } from 'next/image';
import commentIcon from '@/public/comment.svg';
import heartIcon from '@/public/heart.png';
import { useState } from 'react';

const Tweet = ({ username, handle, profilePic, time, timeDetails, tweetText, commentCounter, likeCounter, imgSrcs } : {
  username : string,
  handle : string,
  profilePic: StaticImageData | string,
  time : number,
  timeDetails : string,
  tweetText : string,
  commentCounter : number,
  likeCounter : number,
  imgSrcs: StaticImageData[],
}) => {

  const [isLiked, setIsLiked] = useState(false);

  const [likes, setLikes] = useState(likeCounter);

  const timeSinceTweet = time;

  function formatCounter(counter:number){
    if (counter >= 1000000){ return `${Math.round(counter/1000000)}M`}
    if (counter >= 1000){ return `${Math.round(counter/1000)}K`}
    if (counter < 1000){ return counter }
  };

  const newCommentCounter = formatCounter(commentCounter);
  const newLikeCounter = formatCounter(likes);
  // useEffect(()=>{
  //     const interval = setInterval(()=>{
  //       setTimeSinceTweet(prev => prev+1);
  //     }, 60000);

  //   return () => clearInterval(interval);
  // }, [])

  return (
    <div className='w-10/11 border-b border-b-gray-400/20 sm:text-xl md:text-2xl'>
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
            
            <div className='flex flex-col gap-4 w-9/11'>
                <div className='flex flex-row gap-1'>
                  <span id='username' className='font-bold w-11/20 line-clamp-1 overflow-ellipses hover:cursor-pointer'>{username}</span>
                  <span id='handle' className='text-gray-500 w-7/20 line-clamp-1 overflow-ellipsis hover:cursor-pointer hover:underline'>@{handle}</span>
                  <span id='time' title={timeDetails} className='text-gray-500 w-1/10 text-center hover:cursor-pointer hover:underline'>{timeSinceTweet}m</span>
                </div>

                <div id='tweet-text' className='w-10/11 line-clamp-6 overflow-ellipsis'>{tweetText}</div>

                {imgSrcs[0] &&
                  <div>
                    {imgSrcs.map((imgSrc, index)=> <Image key={`Img${index}`} alt='' className='w-full h-auto rounded-2xl' src={imgSrc} quality={100} width={500} height={500} />)}
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
                    <span id='comment-counter' className='text-gray-500 hover:text-teal-300 duration-200'>{newCommentCounter}</span>
                  </div>

                  <div 
                    className='flex flex-row items-center gap-1'
                    id='likes-div'
                  >                    
                    {isLiked?
                      <div 
                        className='relative w-[25px] h-[20px] mr-1
                                hover:cursor-pointer hover:scale-90 duration-300'
                        onClick={()=>{
                                      setIsLiked(false);
                                      setLikes(prev=>prev-1);
                                     }
                                }
                      >
                        <div className='absolute w-1/2 h-[18px] bg-red-500 rounded-t-full left-[11px] origin-bottom-left -rotate-45'></div>
                        <div className='absolute w-1/2 h-[18px] bg-red-500 rounded-t-full left-0 origin-bottom-right rotate-45'></div>
                      </div>
                      :
                      <Image 
                          alt=''
                          className='rounded-full 
                                  hover:scale-110 hover:p-1 hover:bg-red-400 active:bg-red-400 active:scale-110 active:p-1 duration-300'
                          src={heartIcon}
                          width={30}
                          height={30}
                          onClick={()=>{
                            setIsLiked(true);
                            setLikes(prev=>prev+1)
                          }}
                      />
                    }

                    <span id='like-counter' className='text-gray-500 hover:text-red-400 duration-200'>{newLikeCounter}</span>
                  </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Tweet