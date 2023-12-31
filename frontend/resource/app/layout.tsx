import './globals.css';
import titleStyles from '@/styles/title.module.css';
import localFont from 'next/font/local'

import React from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AuthContextProvider } from '@/components/user/auth';
 
const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '42Transcendence',
  description: 'enjoy ping pong and chat',
}

const myFont = localFont({
  src: './fonts/KimjungchulGothic-Bold.otf',
  display: 'swap',
})


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className={`${myFont.className} full-background`}>
        <h1 className={titleStyles.mainTitle}>Transcendence</h1>
        <AuthContextProvider>
          {children}
        </AuthContextProvider>
				<div id="modal-root"></div>
      </body>
    </html>
  )
}
// if NavBar has textContent(the text between opening tag and closing tag) the text is considered as child node
// and it requires for NavBar component to include chlidNode in its props.
