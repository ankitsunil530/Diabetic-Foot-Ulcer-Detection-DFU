import { NavLink, Outlet } from 'react-router-dom'
import { Moon, Sun, Github } from 'lucide-react'
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
    <div className="min-h-screen flex flex-col">
      {/* Header */}
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
                Medical AI Dashboard
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

      {/* Main Content */}
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
        <div className="mx-auto max-w-6xl px-4 py-6">
          <div className="flex flex-col items-center gap-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              DFU Detection
            </h3>

            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-600 dark:text-slate-400">
              <NavLink to="/" className="hover:text-blue-600">
                Home
              </NavLink>

              <NavLink to="/analyze" className="hover:text-blue-600">
                Analyze
              </NavLink>

              <NavLink to="/history" className="hover:text-blue-600">
                History
              </NavLink>

              <a
                href="https://github.com/krista9669/Diabetic-Foot-Ulcer-Detection-DFU"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-600"
              >
                GitHub
              </a>
            </div>

            <p className="max-w-2xl text-center text-sm text-slate-500 dark:text-slate-400">
              AI-powered diabetic foot ulcer detection platform for screening
              support and early assessment. This tool does not replace
              professional medical diagnosis or clinical judgment.
            </p>

            <div className="w-full border-t border-slate-200 pt-4 text-center text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
              © {new Date().getFullYear()} DFU Detection System
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}