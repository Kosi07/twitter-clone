'use client';

import Link from 'next/link';

import { useContext } from 'react';
import { NavContext } from '@/contexts/NavBarContext';

function Home({focusHome, haptic} : {focusHome: boolean, haptic: () => void}){
    return(
        <svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"
            className={`w-11 h-11 
                        hover:bg-gray-300 hover:rounded-[50%] hover:p-2 hover:scale-130 
                        active:scale-150 active:p-3 active:rounded-full 
                        duration-300`}
            onClick={()=>{
                    haptic();
                }}
        >
            <path d="M 50 25 L 20 50 L 20 80 L 42 80 L 42 60 L 58 60 L 58 80 L 80 80 L 80 50 Z" 
                fill={focusHome? 'black': 'none'} 
                stroke={focusHome? 'white' : 'black'} 
                strokeWidth={focusHome? 4 : 2} 
                strokeLinejoin="round"
            />
        </svg>
    )
}

 function SearchIcon ({focusSearch, haptic}:{focusSearch: boolean, haptic: ()=>void}){
    return(
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={100}
            height={100}
            className={`w-11 h-11 
                                hover:bg-gray-300 hover:rounded-[50%] hover:p-2 hover:scale-130 active:scale-150 active:p-3 active:rounded-full 
                                duration-300`}
            onClick={()=>{
                            haptic();
                        }}
            viewBox="0 0 24 24"
            fill='transparent'
            stroke='black'
            strokeWidth={focusSearch? 1.7 : 0.5}
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="11" cy="12" r="5.5" />
            <line x1="15.55" y1="15.55" x2="21" y2="21" />
        </svg>
    )
}

function Bell({focusNotif, haptic}:{focusNotif: boolean, haptic: ()=> void }){
    return(
        <svg width="24" height="24" viewBox="0 0 24 24" 
            fill="none" xmlns="http://www.w3.org/2000/svg"
            className={`w-9 h-9
                        hover:bg-gray-300 hover:rounded-[50%] hover:p-2 hover:scale-130 active:scale-150 active:p-3 active:rounded-full duration-300`}
            onClick={()=>{
                haptic();
            }}
        >
            <path d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z" 
                stroke="currentColor" 
                strokeWidth={focusNotif?'2': '0.5'} 
                strokeLinecap="round" 
                strokeLinejoin="round"
            />
            <path d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21" stroke="currentColor" stroke-width={focusNotif?'2': '0.5'} stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    )
}

function DM({focusDM, haptic}:{focusDM:boolean, haptic:()=>void}){
    return(
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
            className={`w-10 h-10 
                        hover:bg-gray-300 hover:rounded-[50%] hover:p-2 hover:scale-120 active:scale-150 active:p-3 active:rounded-full duration-300`}
            onClick={()=>{
                haptic();
            }}
        >
            <path d="M21 11.5C21.0034 12.8199 20.6951 14.1219 20.1 15.3C19.3944 16.7118 18.3098 17.8992 16.9674 18.7293C15.6251 19.5594 14.0782 19.9994 12.5 20C11.1801 20.0035 9.87812 19.6951 8.7 19.1L3 21L4.9 15.3C4.30493 14.1219 3.99656 12.8199 4 11.5C4.00061 9.92179 4.44061 8.37488 5.27072 7.03258C6.10083 5.69028 7.28825 4.6056 8.7 3.90003C9.87812 3.30496 11.1801 2.99659 12.5 3.00003H13C15.0843 3.11502 17.053 3.99479 18.5291 5.47089C20.0052 6.94699 20.885 8.91568 21 11V11.5Z" 
                stroke="currentColor" 
                strokeWidth={focusDM? '1.7': '0.8'} 
                strokeLinecap="round" 
                strokeLinejoin="round"
            />
        </svg>
    )
}


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
            <Home focusHome={focusHome} haptic={haptic}/>
        </Link>

        <Link href='/search'>
            <SearchIcon focusSearch={focusSearch} haptic={haptic} />
        </Link>

        <Link href='/notifications' className='relative'>
            <Bell focusNotif={focusNotif} haptic={haptic} />
            <span id='notification-counter' className='absolute w-3 h-3 top-[0.3] right-[1.5] px-1 rounded-full text-white bg-blue-600 font-[1000] text-[1rem]'>
            </span>
        </Link>

        <Link href='/DMs'>
            <DM focusDM={focusDM} haptic={haptic} />
        </Link>
    </nav>
  )
}

export default NavBar;
