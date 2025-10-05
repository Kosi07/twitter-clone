'use client';

import Footer from '@/components/Footer';
import { authClient } from '@/lib/auth-client';

import { FormEvent, useState } from 'react';

const Page = () => {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignUp = async(e: FormEvent) => {
        e.preventDefault();

        const { data, error } = await authClient.signUp.email({
            name,
            email,
            password,
        }) 

        if (error) {
            alert(error.message);
        } else {
            alert("Account created!");
        }
    };

  return (
    <>
        <header>Header</header>

        <main>
            <form 
                className='flex flex-col gap-4'
                onSubmit={handleSignUp}
            >
                <div>
                    <label htmlFor='name-input'>Name: </label>
                    <input 
                        type='text'
                        id='name-input'
                        value={name}
                        onChange={(e)=>setName(e.target.value)}
                        placeholder='Mary Jane'
                        className='border p-3'
                    />
                </div>

                <div>
                    <label htmlFor='email-input'>Email: </label>
                    <input 
                        type='email'
                        id='email-input'
                        value={email}
                        onChange={(e)=>setEmail(e.target.value)}
                        placeholder='mj@gmail.com'
                        className='border p-3'
                    />
                </div>

                <div>
                    <label htmlFor='password-input'>Password: </label>
                    <input 
                        type='password'
                        id='password-input'
                        value={password}
                        onChange={(e)=>setPassword(e.target.value)}
                        minLength={8}
                        className='border p-3'
                    />
                </div>

                <div className='flex flex-row gap-4'>
                    <button 
                        type='submit'
                        className='border p-2'
                    >
                        Sign Up
                    </button>

                    <button 
                        type='reset'
                        className='border p-2'
                    >
                        Reset
                    </button>
                </div>
            </form>
        </main>

        <Footer />
    </>
  )
}

export default Page;