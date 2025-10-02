import Image, { StaticImageData } from 'next/image';
import commentIcon from '@/public/comment.svg';
import heartIcon from '@/public/heart.png';

const Tweet = ({ username, handle, time, timeDetails, tweetText, commentCounter, likeCounter, imgSrcs } : {
  username : string,
  handle : string,
  time : number,
  timeDetails : string,
  tweetText : string,
  commentCounter : number,
  likeCounter : number,
  imgSrcs: StaticImageData[],
}) => {

  const timeSinceTweet = time;

  let cCounter = commentCounter>=1000000? (Math.round(commentCounter/1000000))+'M' : commentCounter; 
  let lCounter = likeCounter>=1000000? (Math.round(likeCounter/1000000))+'M' : likeCounter;

  cCounter = commentCounter>=1000? (Math.round(commentCounter/1000))+'K' : commentCounter; 
  lCounter = likeCounter>=1000? (Math.round(likeCounter/1000))+'K' : likeCounter;

  // useEffect(()=>{
  //     const interval = setInterval(()=>{
  //       setTimeSinceTweet(prev => prev+1);
  //     }, 60000);

  //   return () => clearInterval(interval);
  // }, [])

  return (
    <div className='w-10/11 border-b border-b-gray-400/20 sm:text-xl md:text-2xl'>
        <div className='flex justify-between gap-4 w-full my-3 p-1'>
            <div className="profilePic w-20 min-w-20 h-20 bg-gradient-to-br from-black to-blue-400 rounded-[50%]"></div>
            <div className='flex flex-col gap-4 w-7/9'>
                <div className='flex flex-row gap-1'>
                  <span id='username' className='font-bold w-11/20 line-clamp-1 overflow-ellipses'>{username}</span>
                  <span id='handle' className='text-gray-500 w-7/20 line-clamp-1 overflow-ellipsis hover:cursor-pointer hover:underline'>@{handle}</span>
                  <span id='time' title={timeDetails} className='text-gray-500 w-1/10 text-center hover:cursor-pointer hover:underline'>{timeSinceTweet}m</span>
                </div>

                <div id='tweet-text' className='w-10/11 line-clamp-4 overflow-ellipsis'>{tweetText}</div>

                <div>
                  {imgSrcs.map((imgSrc, index)=> <Image key={`Img${index}`} alt='' className='w-full h-auto rounded-2xl' src={imgSrc} quality={100} width={500} height={500} />)}
                </div>

                <div id='counter-container' className='w-10/11 flex flex-row justify-between gap-4'>
                  <div className='flex flex-row items-center gap-1'>
                    <Image
                        alt=''
                        className=''
                        src={commentIcon}
                        width={30}
                        height={30} 
                    />
                    <span id='comment-counter' className='text-gray-500'>{cCounter}</span>
                  </div>

                  <div className='flex flex-row items-center gap-1'>
                    <Image 
                        alt=''
                        className=''
                        src={heartIcon}
                        width={30}
                        height={30}
                    />
                    <span id='like-counter' className='text-gray-500'>{lCounter}</span>
                  </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Tweet