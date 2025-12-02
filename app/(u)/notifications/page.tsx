'use client';
import { useSession } from "next-auth/react"
import Link from "next/link";
import { useContext, useEffect } from "react";
import { NavContext } from '@/contexts/NavBarContext';

const Notifications = () => {
  const { data: session } = useSession();

  const { setFocusHome, setFocusSearch, setFocusNotif, setFocusDM } = useContext(NavContext);
  
  useEffect(()=>{
      setFocusDM(false);
      setFocusHome(false);
      setFocusSearch(false);
      setFocusNotif(true);
    })
  return (
    <>
      Notifications
      <hr className='w-11/12 text-blue-400 mb-4' />
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

export default Notifications