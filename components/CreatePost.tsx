'use client';

import Image from 'next/image';
import imageIcon from '@/public/image-icon.png';
import emojiIcon from '@/public/smiling.png'

import { useState } from 'react';

const CreatePost = ({ shouldCreate, setShouldCreate, tweetsArray, setTweetsArray }: {
  shouldCreate : boolean,
  setShouldCreate: any,
  tweetsArray : any[],
  setTweetsArray : any,
}) => {

  const [tweetInput, setTweetInput] = useState('');

  const disabled: boolean = tweetInput.trim() === '';

  const [imgPreviewSrc, setImgPreviewSrc] = useState<string | null>(null);

  let newTweet;

  function handleTweet(){

    console.log(tweetInput);

    newTweet = {
      username: 'Random User',
      handle: 'random_user',
      time: 0,
      timeDetails: Date(),
      tweetText: tweetInput.trim(),
      commentCounter: 2,
      likeCounter: 12,
      imgSrcs: [imgPreviewSrc],
    }

    setTweetsArray([newTweet, ...tweetsArray]); 
    setTweetInput('');
    setShouldCreate(false);
  };

  return (
    <div
      className={`z-30 bg-gray-100 rounded-lg max-w-[690px] p-2 overflow-auto
          ${shouldCreate? 'fixed inset-4 m-auto opacity-95': 'hidden opacity-0'} duration-300 ease-in-out`}
    >
        <div 
          className='buttons w-full flex flex-row justify-between p-4 mb-4'
        >
          <button
              onClick={()=> setShouldCreate(false)}
              className='text-blue-400 font-bold
                      hover:cursor-pointer hover:scale-110 duration-200 ease-out'
          >
            Cancel
          </button>

          <button
              className={`${disabled? 'bg-blue-300' : 'bg-blue-400'}
                   text-white font-bold px-4 py-2 rounded-4xl
                   hover:cursor-pointer hover:bg-white hover:text-blue-400 hover:scale-110 duration-200 ease-out`}
              onClick={()=>handleTweet()}
              disabled={disabled}
          >
            Tweet
          </button>
        </div>

        <div 
          className='flex flex-row gap-4 w-full p-4'
        >
          <div className="profile min-w-11 h-11 bg-gradient-to-br from-black to-blue-400 rounded-[50%]"></div>
          <div className='flex flex-col'>
            <textarea
                className='text-2xl w-full p-2 focus:outline-none'
                placeholder="What's happening?"
                value={tweetInput}
                maxLength={180}
                onChange={(e)=> {
                  const scrollHeight = e.currentTarget.scrollHeight;
                  setTweetInput(e.target.value);
                  console.log('textarea onChange');
                  e.currentTarget.style.height = scrollHeight + 'px';
                }}
            />
            
            {imgPreviewSrc && (
              <div className='relative'>
                <button 
                    className='py-2 px-3 border rounded-[50%] bg-gray-200/70 absolute top-2 right-2 text-black font-extrabold
                            hover:bg-gray-900 hover:text-white hover:border-white hover:cursor-pointer
                            active:bg-blue-400 active:text-white active:border-white duration-400'
                    onClick={()=> setImgPreviewSrc(null)}
                >
                  X
                </button>
                <img
                    src={imgPreviewSrc}
                    className='w-full h-auto rounded-2xl'
                />
              </div>
            )}
          </div>
        </div>

        <div className='p-4 flex flex-row gap-2'>
          <label htmlFor='img-input'>
          <Image 
              alt='image icon'
              className='h-11 w-11 p-1 rounded-[50%]
                      hover:bg-blue-200 hover:p-2 duration-300'
              src={imageIcon}
              width={40}
              height={40}
              quality={100}
              title='add image?'
          />
          </label>
          <input 
                type='file'
                id='img-input'
                className='w-40 border hidden'
                accept='image/jpeg, image/png, image/webp, image/gif'
                capture='user'
                multiple={false}
                onChange={(e)=>{
                  console.log('input type file onChange');
                  const file = e.target.files[0];
                  setImgPreviewSrc(URL.createObjectURL(file));
                  console.log(e.target.value) // .value is the file name
                  e.target.value=''; //causes onChange to trigger even if the same img is selected immediately after it has been removed.
                }}
          />

          <Image
              alt='emoji icon'
              className='h-11 w-11 p-1 rounded-[50%]
                      hover:bg-blue-200 hover:p-2 duration-300'
              src={emojiIcon}
              width={40}
              height={40}
              title='add emoji?'
          />
        </div>
    </div>
  )
}

export default CreatePost;