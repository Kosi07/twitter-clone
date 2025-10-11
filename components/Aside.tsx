'use client';

import { User } from 'next-auth';
import { signOut } from 'next-auth/react';
import Image, { StaticImageData } from 'next/image';
import Link from 'next/link';

const Aside = ({ profilePic, openAside, user }:{ profilePic: StaticImageData|string, openAside: boolean, user: User|undefined }) => {
  return (
    <aside className={`fixed top-0 left-0 bottom-0 z-30 w-7/10 sm:w-1/2 max-w-[650px]  bg-gray-50 border-r border-blue-100 p-2
              flex flex-col gap-4 
              ${openAside? 'translate-x-0' : '-translate-x-full opacity-0'} duration-300 ease`}
    >
      <Image
          src={profilePic}
          className='rounded-full'
          alt='profile picture'
          height={100}
          width={100}
      />

      {user?
        <button 
            className='text-xl border rounded-xl px-10 py-2 max-w-[300px] text-center'
            onClick={()=>signOut()}
                  
        >
          SignOut
        </button>
        :
        <>
          <Link 
            className='text-xl border rounded-xl px-10 py-2 max-w-[300px] text-center'
            href='/sign-up'
                  
          >
            SignUp
          </Link>

          <Link 
                className='text-xl bg-gray-900 text-white border rounded-xl px-10 py-2 max-w-[300px] text-center'
                href='/sign-in'
                      
          >
            SignIn
          </Link>
        </>
      }
    </aside>
  )
}

export default Aside;