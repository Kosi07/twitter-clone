'use client';
import { useSession } from "next-auth/react"
import Link from "next/link";

const Search = () => {
  const { data: session } = useSession();
  return (
    <>
      Search
      <hr className='w-11/12 mb-4 text-blue-400' />
      {session?.user?
          <></>
        :
          <div className='flex flex-col gap-5'>
            <Link
              className='text-xl border rounded-xl px-10 py-2'
              href='/sign-up'
                    
            >
              SignUp
            </Link>

            <Link 
                  className='text-xl bg-gray-900 text-white border rounded-xl px-10 py-2'
                  href='/sign-in'
                        
            >
              SignIn
            </Link>
          </div>
      }
    </>
  )
}

export default Search