'use client';

import Image from 'next/image';
import twitt3rBird from '@/public/twitter-bird.png'

import Link from 'next/link';

const HeroSection = () => {
  return (
    <section className='min-w-[350px] my-4 flex flex-col gap-4 items-center'>
        <Image 
            alt='twitt3r-bird-logo'
            className={``}
            width={50}
            height={50}
            src={twitt3rBird}
        />

        <div 
            id='container'
            className='w-9/10 flex flex-col gap-10 items-center text-center'
        >
            <h1 id='text-container' className={`text-4xl font-extrabold`}>
              Happening now
            </h1>

            <div >
              <Link 
                  className='text-xl border m-1 px-20 py-2 rounded-xl'
                  href='/sign-up'
                  
              >
                SignUp
              </Link>
             
              <p className='text-sm my-2'>
                By signing up, you agree to the <a className='text-blue-400'>Terms of Service</a> and <a className='text-blue-400'>Privacy Policy</a>, including <a className='text-blue-400'>Cookie Use</a>.
              </p>
            </div>

            <div>
              <p className='text-lg font-bold my-2'>
                Already have an account?
              </p>
              <Link 
                  className='text-xl border px-10 py-1 m-1 rounded-xl text-white bg-gray-800'
                  href='/sign-in'
                  
              >
                SignIn
              </Link>
            </div>

            <a 
              className='bg-gray-300/95 p-6 rounded-4xl flex flex-row gap-2 justify-center items-center from-red-200 to-blue-200
                        hover:cursor-pointer hover:bg-gradient-to-b hover:scale-110 hover:p-7 active:scale-120 active:px-10 active:bg-gradient-to-b duration-300 ease-in'
              href='/u/home'
              id='skip-to-app'
            >
              <p>Skip to app</p>
              <Image 
                src={twitt3rBird}
                className={``}
                alt='twitt3r app icon'
                width={30}
                height={30}
              />
            </a>
        </div>
    </section>
  )
}

export default HeroSection