'use client'

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation";
import EmojiPicker from "emoji-picker-react";
import { CircleUserRound, FaceSlightlySmilingPlus, ImageIcon } from "lucide-react"
import Link from 'next/link'
import { authClient } from '@/lib/client-side-auth-client'

const PostComment = ({ user, idOfOriginalTweet }) => {    
  const {data:session } = authClient.useSession()
  
  const [profilePic, setProfilePic] = useState('')
  
  useEffect(() => {
    if (!session?.user) return;
  
    setProfilePic(session.user.image ?? "");
  }, [session])

    const router = useRouter() 

    const [draft, setDraft] = useState('')
    const [openEmoji, setOpenEmoji] = useState(false)
    
    const fileInputRef = useRef(null)
    const [imgPreviewSrc, setImgPreviewSrc] = useState();
    
    const [selectedImage, setSelectedImage] = useState()
    
    const [isPosting, setIsPosting] = useState(false)
    const disabled = (draft.trim()==='' && session) || isPosting? true : false



    let newTweet
    
    async function saveImgToCloudinary(img) {
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
    
    async function tweet(){
      setIsPosting(true)
    
      if(user){
        let cloudinaryUrl=null
    
        if(selectedImage){
          cloudinaryUrl = await saveImgToCloudinary(selectedImage)
    
          if(!cloudinaryUrl){
            alert('Failed to upload image')
            return
          }
        }
    
        newTweet = {
          tweetText: draft.trim(),
          commentCounter: 0,
          likeCounter: 0,
          ...(cloudinaryUrl && { imgSrc: cloudinaryUrl }),
          commentOf: idOfOriginalTweet,
        }
    
        await saveToMongoDB()
    
        setDraft('');
        setImgPreviewSrc('')
        setSelectedImage(undefined);
        setOpenEmoji(false)
        
      } 
      else {
        console.log('Need to be signed in to post');
      }
    
      setIsPosting(false) 
    }

    async function saveToMongoDB(){
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

  const textAreaRef = useRef(null)
  
  useEffect(() => {
    const pause = setTimeout(() => {
      textAreaRef.current?.focus()
    }, 100)
    return ()=>clearTimeout(pause)
  }, [])


  return (
    <div className="mb-6 rounded-2xl border border-border/80 bg-card p-4 shadow-[0_6px_24px_rgba(47,43,36,0.035)] sm:p-5">
      <div className="flex gap-3">
        {profilePic?
          <img src={profilePic} id='Avatar' className='bg-[#d9e0ea] text-[#40546e] grid shrink-0 place-items-center rounded-full text-xs font-semibold tracking-tight size-9' />
        :
          <CircleUserRound className='size-9'/>
        }
        <textarea 
          value={draft} 
                      ref={textAreaRef}
                      onChange={(e) => setDraft(e.target.value)} 
                      placeholder="Share something thoughtful..." 
                      aria-label="Create a post" 
                      rows={2} 
                      maxLength={180}
                      className="min-h-14 flex-1 resize-none bg-transparent pt-1 text-sm leading-6 outline-none placeholder:text-muted-foreground/70" 
                    />
                  </div>
                  {selectedImage && 
                    <div className="relative mt-4 overflow-hidden rounded-xl border border-border/70">
                      <img src={imgPreviewSrc}
                        className="max-h-72 w-full object-cover" 
                      />
                      <button type="button" 
                        onClick={ ()=> {setImgPreviewSrc('');  setSelectedImage(undefined);} } aria-label="Remove selected image" 
                        className="absolute right-2 top-2 rounded-full bg-foreground/80 px-2.5 py-1 text-xs font-medium text-background backdrop-blur-sm transition-colors hover:bg-foreground"
                      >
                        Remove
                      </button>
                    </div>
                  }
                  <div className="mt-3 flex items-center border-t border-border/70 pt-3">
                    <button aria-label="Add image" 
                      onClick={()=>fileInputRef.current?.click()}
                      className="rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-foreground"
                    >
                      <ImageIcon className="size-4" />
                      <input 
                        ref={fileInputRef}
                        type='file'
                        className='w-40 border hidden'
                        accept='image/jpeg, image/png, image/webp, image/gif'
                        multiple={false}
                        onChange={(e)=>{
                          console.log('input type file onChange');
                          if(e.target.files){
                            const file = e.target.files[0];
                            console.log('file',file)
                            setSelectedImage(file)
    
                            setImgPreviewSrc(URL.createObjectURL(file));
                            console.log('objectURL',URL.createObjectURL(file))
    
                            console.log('e.target.value',e.target.value) // .value is the file name
                            e.target.value=''; //causes onChange to trigger even if the same img is selected immediately after it has been removed.
                          }
                        }}
                      />
                    </button>
    
                    <button aria-label="Add emoji" 
                      onClick={()=>setOpenEmoji(prev=>!prev)}
                      className="relative rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-foreground"
                    >
                      <FaceSlightlySmilingPlus className='size-4' />
                      {openEmoji &&
                        <div className='absolute z-2 p-2'>
                          <EmojiPicker
                            onEmojiClick={(emojiObject)=>{
                                        setDraft(prev => prev + emojiObject.emoji)
                            }}
                          />
                        </div>
                      }
                    </button>
                    {session?
                      <button 
                        onClick={() => { 
                          if (draft.trim()){ 
                            tweet()
                            //Clear draft/input
                            setDraft('') 
                          } 
                        }} 
                        disabled={disabled} 
                        className="ml-auto rounded-lg bg-foreground px-4 py-2 text-xs font-medium text-background transition-opacity disabled:cursor-not-allowed disabled:opacity-35"
                      >
                        Reply
                      </button>
                    :
                      <Link href='/sign-in' className='ml-auto rounded-lg bg-foreground px-4 py-2 text-xs font-medium text-background'>Sign In</Link>
                    }
                  </div>
    </div>
  )
}

export default PostComment