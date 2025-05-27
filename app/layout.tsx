import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import '@coinbase/onchainkit/styles.css'; 
import { Providers } from './providers'

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "PATA - African AR Treasure Hunt",
  description: "Uncover Africa's Hidden Treasures through an immersive AR experience",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Providers>
          {children}
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'