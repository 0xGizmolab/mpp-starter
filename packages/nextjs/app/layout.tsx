export const metadata = {
  title: 'MPP Next.js Example',
  description: 'Machine Payments Protocol integration with Next.js',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
