'use client';

import Image from 'next/image';
import homeIcon from '@/public/home.png';
import searchIcon from '@/public/search.png';
import notifIcon from '@/public/notification.png';
import DMIcon from '@/public/DMs.png'

import Link from 'next/link';

import { useState } from 'react';

const NavBar = () => {

    const [focusHome, setFocusHome] = useState(true);
    const [focusSearch, setFocusSearch] = useState(false);
    const [focusNotif, setFocusNotif] = useState(false);
    const [focusDM, setFocusDM] = useState(false);

    const haptic = () => {
        if(navigator.vibrate){
            navigator.vibrate(50);
        }
    };

  return (
    <nav
        className='w-9/10 flex flex-row justify-between items-center'
    >
        <Link href='/u/home'>
            <Image 
                alt='home icon'
                className={`w-11 h-11 ${focusHome? 'bg-gradient-to-b':''} from-red-200 to-blue-200 rounded-2xl
                        hover:bg-gray-300 hover:rounded-[50%] hover:p-2 hover:scale-130 active:scale-150 active:p-3 active:rounded-full duration-300`}
                src={homeIcon}
                width={40}
                height={40}
                onClick={()=>{
                    haptic();
                    setFocusHome(true);
                    setFocusSearch(false);
                    setFocusNotif(false);
                    setFocusDM(false);
                }}
            />
        </Link>

        <Link href='/u/search'>
            <Image 
                alt='search icon'
                className={`w-11 h-11 ${focusSearch? 'bg-gradient-to-b':''} from-red-200 to-blue-200 rounded-2xl
                        hover:bg-gray-300 hover:rounded-[50%] hover:p-2 hover:scale-130 active:scale-150 active:p-3 active:rounded-full duration-300`}
                src={searchIcon}
                width={40}
                height={40}
                onClick={()=>{
                    haptic();
                    setFocusHome(false);
                    setFocusSearch(true);
                    setFocusNotif(false);
                    setFocusDM(false);
                }}
            />
        </Link>

        <Link href='/u/notifications'>
            <Image 
                alt='notification icon'
                className={`w-11 h-11 ${focusNotif? 'bg-gradient-to-b':''} from-red-200 to-blue-200 rounded-2xl
                        hover:bg-gray-300 hover:rounded-[50%] hover:p-2 hover:scale-130 active:scale-150 active:p-3 active:rounded-full duration-300`}
                src={notifIcon}
                width={40}
                height={40}
                onClick={()=>{
                    haptic();
                    setFocusHome(false);
                    setFocusSearch(false);
                    setFocusNotif(true);
                    setFocusDM(false);
                }}
            />
        </Link>

        <Link href='/u/DMs'>
            <Image 
                alt='message icon'
                className={`w-11 h-11 ${focusDM? 'bg-gradient-to-b':''} from-red-200 to-blue-200 rounded-2xl
                        hover:bg-gray-300 hover:rounded-[50%] hover:p-2 hover:scale-120 active:scale-150 active:p-3 active:rounded-full duration-300`}
                src={DMIcon}
                width={40}
                height={40}
                onClick={()=>{
                    haptic();
                    setFocusHome(false);
                    setFocusSearch(false);
                    setFocusNotif(false);
                    setFocusDM(true);
                }}
            />
        </Link>
    </nav>
  )
}

export default NavBar;
