'use client';

import { useState } from 'react';

const CreatePost = ({ shouldCreate, setShouldCreate, tweetsArray, setTweetsArray }) => {

  const [tweetInput, setTweetInput] = useState('');

  const disabled: boolean = tweetInput.trim() === '';

  let newTweet;

  function handleTweet(){

    console.log(tweetInput);

    newTweet = {
      username: 'Random User',
      handle: 'random_user',
      time: 0,
      timeDetails: Date(),
      tweetText: tweetInput,
      commentCounter: 2,
      likeCounter: 12,
    }

    setTweetsArray([newTweet, ...tweetsArray]); 
    setTweetInput('');
    setShouldCreate(false);
  };

  return (
    <div
      className={`z-30 bg-gray-100 rounded-lg max-w-[690px] p-2
          ${shouldCreate? 'fixed': ''} ${shouldCreate? 'inset-4': ''} ${shouldCreate? 'm-auto': ''}   ${shouldCreate? '': 'hidden'} ${shouldCreate? 'opacity-95': 'opacity-0'} duration-300 ease-in-out`}
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
          className='flex flex-row gap-4 w-full p-1 h-[70vh]'
        >
          <div className="profile min-w-9 h-9 bg-gradient-to-br from-black to-blue-400 rounded-[50%]"></div>
          <div className=''>
            <input
                type='text'
                className='text-2xl w-9/10 p-2 border rounded-2xl'
                placeholder="What's happening?"
                value={tweetInput}
                onChange={(e)=> {
                  setTweetInput(e.target.value);
                }}
            />
          </div>
        </div>
    </div>
  )
}

export default CreatePost