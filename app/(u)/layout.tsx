'use client';

import NavBar from '@/components/NavBar';
import { NavBarContext } from '@/contexts/NavBarContext';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (
      <NavBarContext>
       <>
          {children}

          <div
            className='w-full max-w-[700px] m-auto flex justify-center fixed bottom-0 left-1 right-1 bg-gray-50/60 backdrop-blur-2xl border-t border-t-gray-400 p-2 rounded-xl'
          >
            <NavBar />
          </div>
       </>
      </NavBarContext>
  );
}

