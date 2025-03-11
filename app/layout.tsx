import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Daily Quran Verses',
  description: 'Get daily inspiration from the Holy Quran with translations in Arabic, English, and Malayalam',
  icons: {
    icon: 'https://img.freepik.com/free-vector/arab-quran-book-icon-white-background_24640-133905.jpg'
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Naskh+Arabic:wght@400;700&family=Amiri:wght@400;700&family=Noto+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-gradient-to-br from-emerald-50 to-teal-100 min-h-screen overflow-x-hidden">
        <div className="fixed inset-0 pattern-islamic opacity-5 pointer-events-none"></div>
        <main className="min-h-screen font-['Noto_Sans'] antialiased relative">
          {children}
        </main>
      </body>
    </html>
  )
}