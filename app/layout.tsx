import type { Metadata } from "next";
import "./globals.css";
import { sfpro } from '@/utils/useFonts';

export const metadata: Metadata = {
  title: "Twitt3r",
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
        className={`antialiased ${sfpro.className} p-3 px-6 flex justify-center`}
      >
        {children}
      </body>
    </html>
  );
}
