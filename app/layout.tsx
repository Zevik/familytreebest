import './globals.css'

export const metadata = {
  title: 'Family Tree App',
  description: 'A family tree application built with Next.js',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" dir="rtl">
      <body className="bg-gray-50">{children}</body>
    </html>
  )
}
