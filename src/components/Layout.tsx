import { Outlet, useLocation } from 'react-router-dom'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { useEffect } from 'react'

export default function Layout() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <main className="flex flex-col min-h-screen bg-background font-body text-foreground">
      <Header />
      <div className="flex-grow pt-[60px] md:pt-[72px]">
        <Outlet />
      </div>
      <Footer />
    </main>
  )
}
