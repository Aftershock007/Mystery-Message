import Navbar from "@/components/Navbar"

interface RootLayoutProps {
  readonly children: React.ReactNode
}

export default async function RootLayout({ children }: RootLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      {children}
    </div>
  )
}
