'use client';

import Image from 'next/image';
import homeIcon from '@/public/home.png';
import searchIcon from '@/public/search.png';
import notifIcon from '@/public/notification.png';
import DMIcon from '@/public/DMs.png'

import Link from 'next/link';

import { useContext } from 'react';
import { NavContext } from '@/contexts/NavBarContext';

const NavBar = () => {

    const { focusHome, focusSearch, focusNotif, focusDM } = useContext(NavContext);

    const haptic = () => {
        if(navigator.vibrate){
            navigator.vibrate(50);
        }
    };

  return (
    <nav
        className='w-9/10 flex flex-row justify-between items-center'
    >
        <Link href='/home'>
            <Image 
                alt='home icon'
                className={`w-11 h-11 ${focusHome? 'bg-gradient-to-b':''} from-red-200 to-blue-200 rounded-2xl
                        hover:bg-gray-300 hover:rounded-[50%] hover:p-2 hover:scale-130 active:scale-150 active:p-3 active:rounded-full duration-300`}
                src={homeIcon}
                width={40}
                height={40}
                onClick={()=>{
                    haptic();
                }}
            />
        </Link>

        <Link href='/search'>
            <Image 
                alt='search icon'
                className={`w-11 h-11 ${focusSearch? 'bg-gradient-to-b':''} from-red-200 to-blue-200 rounded-2xl
                        hover:bg-gray-300 hover:rounded-[50%] hover:p-2 hover:scale-130 active:scale-150 active:p-3 active:rounded-full duration-300`}
                src={searchIcon}
                width={40}
                height={40}
                onClick={()=>{
                    haptic();
                }}
            />
        </Link>

        <Link href='/notifications' className='relative'>
            <Image 
                alt='notification icon'
                className={`w-12 h-12 ${focusNotif? 'bg-gradient-to-b':''} from-red-200 to-blue-200 rounded-2xl
                        hover:bg-gray-300 hover:rounded-[50%] hover:p-2 hover:scale-130 active:scale-150 active:p-3 active:rounded-full duration-300`}
                src={notifIcon}
                width={40}
                height={40}
                onClick={()=>{
                    haptic();
                }}
            />
            <span id='notification-counter' className='absolute top-0 right-0 px-1.5 rounded-full text-white bg-blue-600 font-[1000] text-[1rem]'>
                2
            </span>
        </Link>

        <Link href='/DMs'>
            <Image 
                alt='message icon'
                className={`w-12 h-12 ${focusDM? 'bg-gradient-to-b':''} from-red-200 to-blue-200 rounded-2xl
                        hover:bg-gray-300 hover:rounded-[50%] hover:p-2 hover:scale-120 active:scale-150 active:p-3 active:rounded-full duration-300`}
                src={DMIcon}
                width={40}
                height={40}
                onClick={()=>{
                    haptic();
                }}
            />
        </Link>
    </nav>
  )
}

export default NavBar;
