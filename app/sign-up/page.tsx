'use client';

import Footer from '@/components/Footer';
import { signIn } from 'next-auth/react';

import Image from 'next/image';
import googleIcon from '@/public/google.png';
import xIcon from '@/public/x-filled.svg';
import githubIcon from '@/public/github.png';

import { useState } from 'react';
import Link from 'next/link';

const SignUp = () => {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

  return (
    <>
        <header>Header</header>

        <main className='mb-4 flex flex-col gap-4 items-center'>

            <div 
                className='flex flex-col gap-15 m-4 p-10 border border-gray-700/20 shadow-sm rounded-xl min-w-[310px]'
            >
                <div id='Google' className='flex flex-row gap-2 w-full'>
                    <Image 
                        src={googleIcon}
                        className=''
                        alt='google logo'
                        width={120}
                        height={120}
                        onClick={()=>signIn('google', {redirectTo: '/u/home'})}
                    />

                    <div 
                        className='border p-2 w-40 h-15 rounded-t-xl rounded-br-xl flex justify-center items-center'
                    >
                        Sign Up with Google
                    </div>
                </div>

                <div id='X' className='flex flex-row gap-4'>
                    <div 
                        className='border p-2 w-40 h-15 rounded-t-xl rounded-bl-xl flex justify-center items-center'
                    >
                        Sign Up with X
                    </div>

                    <Image 
                        src={xIcon}
                        className=''
                        alt='x logo'
                        width={90}
                        height={90}
                        onClick={()=>signIn('twitter', {redirectTo: '/u/home'})}
                    />

                </div>

                <div id='GitHub' className='flex flex-row gap-4 w-full'>
                    <Image 
                        src={githubIcon}
                        className=''
                        alt='github logo'
                        width={120}
                        height={120}
                        onClick={()=>signIn('github', { redirectTo: '/u/home' })}
                    />

                    <div 
                        className='border p-2 w-40 h-15 rounded-t-xl rounded-br-xl flex justify-center items-center'
                    >
                        Sign Up with GitHub
                    </div>

                </div>
            </div>

            <Link 
                className='text-xl bg-gray-900 text-white border rounded-xl px-8 py-2 max-w-[300px] flex flex-row justify-center items-center gap-3 w-6/10 min-w-[220px]'
                href='/sign-in'
                      
            >
                <span>Sign In</span>
                <span>instead</span>
            </Link>
            
        </main>

        <Footer />
    </>
  )
}

export default SignUp;