'use client';

import Footer from '@/components/Footer';
import { signIn } from 'next-auth/react';

import { useState } from 'react';

const SignIn = () => {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

  return (
    <>
        <header>Header</header>

        <main>

            <div 
                className='flex flex-col gap-4 mt-8'
            >
                <div id='Google' className='flex flex-row gap-4'>
                    <button 
                        className='border p-2 rounded-xl hover:cursor-pointer'
                        onClick={()=>console.log('Sign In with Google')}
                    >
                        Sign In with Google
                    </button>

                </div>

                <div id='X' className='flex flex-row gap-4'>
                    <button 
                        className='border p-2 rounded-xl hover:cursor-pointer'
                        onClick={()=>console.log('Sign In with X')}
                    >
                        Sign In with X
                    </button>

                </div>

                <div id='GitHub' className='flex flex-row gap-4'>
                    <button 
                        className='border p-2 rounded-xl hover:cursor-pointer'
                        onClick={()=>signIn('github', { redirectTo: '/u/home' })}
                    >
                        Sign In with GitHub
                    </button>

                </div>
            </div>
            
        </main>

        <Footer />
    </>
  )
}

export default SignIn;