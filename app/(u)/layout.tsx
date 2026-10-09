'use client';

import AppSidebar from '@/components/AppSidebar'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (
    <div className="mx-auto flex max-w-[1280px]">
      <AppSidebar />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}

