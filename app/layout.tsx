import './globals.css'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Estimathon Grader',
  description: 'A polished, local-first Estimathon scoring app',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950 text-slate-100">
        <div className="site-header border-b border-slate-800 bg-slate-950/90 backdrop-blur">
          <nav className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
            <Link href="/" className="flex items-baseline gap-2">
              <span className="text-lg font-semibold tracking-tight text-slate-100">Estimathon Scoring</span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Event Console</span>
            </Link>
            <div className="flex items-center gap-6 text-sm text-slate-300">
              <Link href="/" className="hover:text-white">Scoreboard</Link>
              <Link href="/entry" className="hover:text-white">Entry</Link>
              <Link href="/admin" className="hover:text-white">Admin</Link>
              <Link href="/rules" className="hover:text-white">Rules</Link>
            </div>
          </nav>
        </div>
        <main className="mx-auto max-w-6xl px-4 pb-16 pt-6">{children}</main>
        <footer className="site-footer text-xs text-slate-500 py-6 text-center border-t border-slate-900 mt-8">
          Designed for school Estimathons. Not affiliated with Jane Street.
        </footer>
      </body>
    </html>
  )
}
