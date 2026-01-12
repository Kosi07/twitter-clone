'use client'
import Image from "next/image"
import imageIcon from '@/public/image-icon.png';
import emojiIcon from '@/public/smiling.png'
import profileIcon from '@/public/profile.png';


import { useEffect, useState } from "react"
import { tweetType, userType } from "@/lib/types";
import { useRouter } from "next/navigation";
import EmojiPicker from "emoji-picker-react";

const PostComment = ({ user, idOfOriginalTweet }:
    {
        user: userType,
        idOfOriginalTweet: string,
    }) => {

    const email = user?.email

    async function getUserDetails(){
      let userDetails

      if(email){ 
        const response = await fetch('/api/userdetails', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            email
          })
        })

        if(response.ok){
          userDetails = await response.json()
        }
      }

      return userDetails
    }

    const [profilePic, setProfilePic] = useState(profileIcon)

    useEffect(()=>{

      if(user){
        getUserDetails().then((userDetails)=>{
          if(userDetails?.profilePic){
            setProfilePic(userDetails.profilePic)
          }
        })
      }

    })

    const router = useRouter() 

    const [inputValue, setInputValue] = useState('')

    const [imgPreviewSrc, setImgPreviewSrc] = useState('')

    const [selectedFile, setSelectedFile] = useState<File>()

    const [isPosting, setIsPosting] = useState(false)

    const [chooseEmoji, setChooseEmoji] = useState(false)


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
        } 
        else {
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
          tweetText: inputValue.trim(),
          commentCounter: 0,
          likeCounter: 0,
          ...(cloudinaryUrl && { imgSrc: cloudinaryUrl }),
          commentOf: idOfOriginalTweet,
        }
    
        await saveToMongoDB()
    
        setInputValue('');
        setImgPreviewSrc('')
        setSelectedFile(undefined);
        
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

      if(result.ok){
        alert('Success!')
        router.refresh()
      }
    }


  return (
    <div className='bg-gray-50/5 rounded-lg'>
      <div className='p-2 flex flex-row gap-2'>
        <Image 
          src={profilePic}
          alt=''
          className='min-w-11 h-11 rounded-full'
          width={50}
          height={50}
        />

        <textarea
            autoFocus={true}
            className='text-2xl w-full p-2 focus:outline-none'
            placeholder="Whatcha think?"
            value={inputValue}
            maxLength={180}
            onChange={(e)=> {
                setInputValue(e.target.value);

                e.currentTarget.style.height = 'auto';
                const scrollHeight = e.currentTarget.scrollHeight;
                e.currentTarget.style.height = scrollHeight + 'px';
                
            }}
        />
      </div>

        {imgPreviewSrc && 
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
                    width={100}
                    height={100}
                />
            </div>
        }
        <div  className='flex flex-row justify-between items-center'>
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
                className='h-11
                 w-11 p-1 rounded-[50%]
                        hover:bg-blue-200 hover:p-2 duration-300'
                src={emojiIcon}
                width={40}
                height={40}
                title='add emoji?'
                onClick={()=>setChooseEmoji(prev => !prev)}
            />
          </div>

          <button
            className='p-1 px-5 h-12 bg-blue-400 text-center text-white text-lg font-bold rounded-3xl'
            disabled={isPosting? true:false}
            onClick={()=> handleTweet()}
          >
            Post
          </button>
        </div>

        {chooseEmoji &&
          <div className='w-full'>
            <EmojiPicker
              width={'100%'}
              onEmojiClick={(emojiObject)=>{
                  setInputValue(prev => prev + emojiObject.emoji)
              }}
            />
          </div>
        }

    </div>
  )
}

export default PostComment