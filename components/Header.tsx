import Image, { StaticImageData } from "next/image"
import twitterBird from '@/public/twitter-bird.png';
import { userType } from "@/lib/types";

const Header = ({ profilePic,setOpenAside, user }: 
    {
        profilePic:string|StaticImageData,
        setOpenAside: React.Dispatch<React.SetStateAction<boolean>>,
        user: userType|undefined,
    }) => {
  return (
        <header
             className='w-full flex justify-between border-b border-b-gray-300 p-2 mb-4 rounded-xl sticky top-2 backdrop-blur-lg bg-gray-100/5'
        >
                <Image
                    alt='user profile icon'
                    className='rounded-full hover:cursor-pointer active:bg-gradient-to-b from-red-200 to-blue-200 active:scale-110 active:p-1 duration-300 ease'
                    src={user?.image? user.image : profilePic}
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
  )
}

export default Header