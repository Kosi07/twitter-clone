'use client';

import Footer from '@/components/Footer';

import Image from 'next/image';
import googleIcon from '@/public/google.png';
import xIcon from '@/public/x.png';
import { signInWithGoogle, signInWithTwitter } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';

const SignIn = () => {
    const router = useRouter()

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
                        onClick={()=>{
                                signInWithGoogle()
                                router.push('/home')
                            }
                        }
                    />

                    <div 
                        className='border p-2 w-40 h-15 rounded-t-xl rounded-br-xl flex justify-center items-center'
                        onClick={()=>{
                                signInWithGoogle()
                                router.push('/home')
                            }
                        }
                    >
                        Sign In with Google
                    </div>
                </div>

                <div id='X' className='flex flex-row gap-4'>
                    <div 
                        className='border p-2 w-40 h-15 rounded-t-xl rounded-bl-xl flex justify-center items-center'
                        onClick={()=>{
                                signInWithTwitter()
                                router.push('/home')
                            }
                        }
                    >
                        Sign In with X
                    </div>

                    <Image 
                        src={xIcon}
                        className=''
                        alt='x logo'
                        width={140}
                        height={140}
                        onClick={()=>{
                                signInWithTwitter()
                                router.push('/home')
                            }
                        }
                    />

                </div>

            </div>            
        </main>

        <Footer />
    </>
  )
}

export default SignIn;