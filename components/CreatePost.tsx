'use client';

import Image, { StaticImageData } from 'next/image';
import imageIcon from '@/public/image-icon.png';
import emojiIcon from '@/public/smiling.png'
import profileIcon from '@/public/profile.png';


import { useState } from 'react';
import { tweetType } from '@/lib/types';
import { authClient } from '@/lib/client-side-auth-client';
import { useRouter } from 'next/navigation';

const CreatePost = ({ shouldCreate, setShouldCreate, fetchTweets}: {
  shouldCreate : boolean,
  setShouldCreate: React.Dispatch<React.SetStateAction<boolean>>,
  tweetsArray : tweetType[],
  setTweetsArray : React.Dispatch<React.SetStateAction<tweetType[]>>,
  fetchTweets: () => Promise<void>,
}) => {

  const session = authClient.useSession()
  const user = session?.data?.user

  const profilePic: string | StaticImageData = user?.image? user.image : profileIcon

  const router = useRouter()

  const [tweetInput, setTweetInput] = useState('');

  const [isPosting, setIsPosting] = useState(false)

  const disabled: boolean = (tweetInput.trim() === '' && user) || isPosting? true : false;

  const [imgPreviewSrc, setImgPreviewSrc] = useState<string | StaticImageData>();

  const [selectedFile, setSelectedFile] = useState<File>()

  let newTweet : tweetType;

  async function saveImgToCloudinary(img: File) {
    try {
      // Create form data with the image
      const formData = new FormData();
      formData.append('image', img);

      // Send to your API route
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      // Get the response
      const data = await response.json();
      
      if (data.success) {
        return data.url; // Return the Cloudinary URL
      } else {
        console.error('Upload failed');
        return null;
      }
      
    } 
    catch(err){
      console.error('Error saving to cloudinary', err);
      return null;
    }
  }

  async function handleTweet(){
    setIsPosting(true)

    if(user){
      let cloudinaryUrl=null

      if(selectedFile){
        cloudinaryUrl = await saveImgToCloudinary(selectedFile)

        if(!cloudinaryUrl){
          alert('Failed to upload image')
          return
        }
      }

      newTweet = {
        username: user.name,
        handle: `${user.name.toLowerCase()}-${user.id}`,
        profilePic: profilePic,
        tweetText: tweetInput.trim(),
        commentCounter: 0,
        likeCounter: 0,
        ...(cloudinaryUrl && { imgSrc: cloudinaryUrl })
      }

      await saveToMongoDB()

      setTweetInput('');
      setSelectedFile(undefined);
      setShouldCreate(false);

      fetchTweets()
    
  } 
  else {
    console.log('Need to be signed in to post');
  }

  setIsPosting(prev => !prev) //false
}

  async function saveToMongoDB(){
    console.log(newTweet)
    const result = await fetch('/api/tweets', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        newTweet
      })
    })

    console.log('result',typeof result, result)

  }

  return (
    <div
      className={`z-40 bg-gray-100 rounded-lg max-w-[690px] p-2 overflow-auto
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
              onClick={()=>{
                if(user){
                  handleTweet()
                }
                else{
                  router.push('/sign-in')
                }
              }}
              disabled={disabled}
          >
            {user?'Tweet':'SignIn'}
          </button>
        </div>

        <div 
          className='flex flex-row gap-4 w-full p-4'
        >
          <div id='profilePic' className='min-w-11 h-11'>
            <Image 
              src={profilePic}
              className='rounded-full'
              alt='profile picture'
              width={50}
              height={50}
            />
          </div>

          <div className='flex flex-col'>
            <textarea
                className='text-2xl w-full p-2 focus:outline-none'
                placeholder="What's happening?"
                value={tweetInput}
                maxLength={180}
                onChange={(e)=> {
                  setTweetInput(e.target.value);

                  const scrollHeight = e.currentTarget.scrollHeight;
                  e.currentTarget.style.height = scrollHeight + 'px';
                }}
            />
            
            {imgPreviewSrc && (
              <div className='relative'>
                <button 
                    className='py-2 px-3 border rounded-[50%] bg-gray-200/70 absolute top-2 right-2 text-black font-extrabold
                            hover:bg-gray-900 hover:text-white hover:border-white hover:cursor-pointer
                            active:bg-blue-400 active:text-white active:border-white duration-400'
                    onClick={()=> {
                        setImgPreviewSrc('')
                        setSelectedFile(undefined)
                      }
                    }
                >
                  X
                </button>
                <Image
                    src={imgPreviewSrc}
                    alt=''
                    className='w-full h-auto rounded-2xl'
                    width={500}
                    height={500}
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
                multiple={false}
                onChange={(e)=>{
                  console.log('input type file onChange');
                  if(e.target.files){
                    const file = e.target.files[0];
                    console.log('file',file)
                    setSelectedFile(file)

                    setImgPreviewSrc(URL.createObjectURL(file));
                    console.log('objectURL',URL.createObjectURL(file))

                    console.log('e.target.value',e.target.value) // .value is the file name
                    e.target.value=''; //causes onChange to trigger even if the same img is selected immediately after it has been removed.
                  }
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