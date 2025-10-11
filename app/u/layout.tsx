'use client';

import { sfpro } from '@/utils/useFonts';
import NavBar from '@/components/NavBar';
import { SessionProvider } from 'next-auth/react';
import { NavBarContext } from '@/contexts/NavBarContext';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (
    <SessionProvider>
      <NavBarContext>
       <div
          className={`antialiased ${sfpro.className} py-3 px-6 flex flex-col items-center`}
       >
          {children}

          <div
            className='w-full flex justify-center fixed bottom-0 left-1 right-1 bg-gray-50/60 backdrop-blur-2xl h-14 border-t border-t-gray-400 p-2 rounded-xl'
          >
            <NavBar />
          </div>
       </div>
      </NavBarContext>
    </SessionProvider>
  );
}

