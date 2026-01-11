'use client'

import { useEffect, useState } from "react";

const PostIcon = ({setShouldCreate}
    :
    {
        setShouldCreate: React.Dispatch<React.SetStateAction<boolean>>
    }
) => {
    //"if user scrolls down, '+' icon background turns transparent, if user scrolls up, it becomes opaque"      
    const [scrollArray, setScrollArray] = useState([0, 0]); 

    useEffect(()=>{
        const handleScroll = () => {
        setScrollArray([scrollArray[1], window.scrollY])
        }
        
        window.addEventListener('scroll', handleScroll)

        return () => window.removeEventListener('scroll', handleScroll);
    }, [scrollArray])

  return (
    <div 
        className={`z-20 fixed right-1/9 bottom-1/6 
            ${(scrollArray[1]>scrollArray[0])?'bg-gray-800/50 border':'bg-gradient-to-br from-gray-900/85 to-blue-300'} 
            rounded-[50%] p-4 px-7 shadow-gray-700 shadow-lg/50
            hover:scale-120 hover:cursor-pointer 
            active:scale-130 
            duration-400`
        }
        onClick={()=>setShouldCreate(true)}
        title='Post tweet?'
       >
        <div className='relative w-3 h-9 bg-gray-200 rounded-xs'>
            <div className='absolute w-9 h-3 bg-gray-200 -left-3 top-2.5 rounded-xs'></div>
        </div>
    </div>
  )
}

export default PostIcon