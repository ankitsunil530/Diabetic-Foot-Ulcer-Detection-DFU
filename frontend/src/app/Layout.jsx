import { NavLink, Outlet } from 'react-router-dom'
import { Moon, Sun } from 'lucide-react'
import useDarkMode from '../hooks/useDarkMode.js'

function NavItem({ to, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `rounded-xl px-3 py-2 text-sm font-semibold transition ${
          isActive
            ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
            : 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-900'
        }`
      }
      end
    >
      {children}
    </NavLink>
  )
}

export default function Layout() {
  const { theme, toggle } = useDarkMode()

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/70">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-blue-50 text-primary dark:bg-blue-950/40">
              <span className="text-sm font-black">AI</span>
            </div>
            <div>
              <div className="text-sm font-extrabold tracking-tight">
                DFU Detection
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Medical AI dashboard
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <nav className="hidden items-center gap-1 md:flex">
              <NavItem to="/">Home</NavItem>
              <NavItem to="/analyze">Analyze</NavItem>
              <NavItem to="/history">History</NavItem>
            </nav>
            <button
              onClick={toggle}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900"
              aria-label="Toggle dark mode"
              title="Toggle dark mode"
              type="button"
            >
              {theme === 'dark' ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 py-6">
        <Outlet />
      </main>

      <footer className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
        <div className="mx-auto w-full max-w-6xl px-4 py-6 text-xs text-slate-500 dark:text-slate-400">
          Disclaimer: For screening support only. Always rely on clinical
          judgement. Integrate your trained model behind{' '}
          <span className="font-semibold text-slate-700 dark:text-slate-200">
            POST /api/predict
          </span>
          .
        </div>
      </footer>
    </div>
  )
}
