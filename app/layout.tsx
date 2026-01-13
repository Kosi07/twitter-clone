import type { Metadata } from "next";
import "./globals.css";
import { sfpro } from '@/lib/fonts';

export const metadata: Metadata = {
  title: "Twitter",
  description: "A good-enough twitter clone",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased ${sfpro.className} flex flex-col items-center`}
      >
        {children}
      </body>
    </html>
  );
}
