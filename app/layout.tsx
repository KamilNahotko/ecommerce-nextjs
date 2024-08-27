import type { Metadata } from 'next';
import { Inter as FontSans } from 'next/font/google';
import './globals.css';

import { Navigation } from '@/modules';
import { cn } from '@/lib/utils';

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={cn('font-sans antialiased', fontSans.variable)}>
        <div className='flex-grow px-6 md:px-12 mx-auto max-w-8xl'>
          <Navigation />
          {children}
        </div>
      </body>
    </html>
  );
}
