import Image, { StaticImageData } from "next/image"
import twitterBird from '@/public/twitter-bird.png';
import { userType } from "@/lib/types";
import HeaderNav from "./HeaderNav";

const Header = ({ profilePic,setOpenAside, user }: 
    {
        profilePic:string|StaticImageData,
        setOpenAside: React.Dispatch<React.SetStateAction<boolean>>,
        user: userType|undefined,
    }) => {
  return (
        <header className='w-full border-b border-b-gray-300 p-2 rounded-xl sticky top-0 backdrop-blur-lg bg-gray-100/5'>
            <div
                className='w-full flex flex-row gap-1'
            >
                <div className='w-4/10'>
                    <Image
                        alt='user profile icon'
                        className='rounded-full w-8 h-8
                            hover:cursor-pointer 
                            active:scale-110 active:p-1 
                            duration-300 ease'
                        src={user?.image? user.image : profilePic}
                        width={40}
                        height={45}
                        onClick={()=>setOpenAside(true)}
                    />
                </div>

                <Image
                    alt='twitter bird' 
                    className=' w-8 h-8
                        hover:cursor-pointer'
                    src={twitterBird}
                    width={40}
                    height={45}
                />
            </div>

            <HeaderNav />
        </header>
  )
}

export default Header