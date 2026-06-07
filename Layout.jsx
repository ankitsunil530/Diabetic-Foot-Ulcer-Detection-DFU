import { NavLink, Outlet } from 'react-router-dom'
import { Moon, Sun, X, User } from 'lucide-react'
import { useState } from 'react'
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

// Validates the auth form fields and returns an object of per-field error
// strings. An empty object means all fields are valid.
function validateAuthForm(tab, form) {
  const errs = {}
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (tab === 'signup' && !form.name.trim()) {
    errs.name = 'Full name is required.'
  }

  if (!form.email.trim()) {
    errs.email = 'Email is required.'
  } else if (!emailRe.test(form.email)) {
    errs.email = 'Enter a valid email address.'
  }

  if (!form.password) {
    errs.password = 'Password is required.'
  } else if (form.password.length < 6) {
    errs.password = 'Password must be at least 6 characters.'
  }

  if (tab === 'signup') {
    if (!form.confirm) {
      errs.confirm = 'Please confirm your password.'
    } else if (form.confirm !== form.password) {
      errs.confirm = 'Passwords do not match.'
    }
  }

  return errs
}

function AuthModal({ open, onClose }) {
  const [tab, setTab] = useState('login')
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  // Per-field errors keyed by field name. Replaced from a single shared
  // error string so each field highlights and describes its own issue.
  const [errors, setErrors] = useState({})
  const [success, setSuccess] = useState('')

  if (!open) return null

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
    // Clear only the error for the field the user is currently editing so
    // other fields keep their inline messages until they are corrected.
    setErrors((prev) => ({ ...prev, [e.target.name]: '' }))
    setSuccess('')
  }

  function handleSubmit(e) {
    e.preventDefault()
    setSuccess('')

    const errs = validateAuthForm(tab, form)
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }

    setErrors({})

    if (tab === 'login') {
      // 🔌 TODO: connect to your backend /api/login
      setSuccess('Logged in successfully! (demo)')
      setTimeout(() => { onClose(); setSuccess('') }, 1200)
    } else {
      // 🔌 TODO: connect to your backend /api/signup
      setSuccess('Account created! (demo)')
      setTimeout(() => { setTab('login'); setSuccess('') }, 1200)
    }
  }

  function switchTab(t) {
    setTab(t)
    setErrors({})
    setSuccess('')
    setForm({ name: '', email: '', password: '', confirm: '' })
  }

  // Returns input className with a red border when the field has an error,
  // and the standard blue focus ring otherwise.
  function inputClass(field) {
    return errors[field]
      ? 'w-full rounded-xl border border-red-400 bg-red-50 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-red-400 focus:ring-2 focus:ring-red-400/20 dark:border-red-500 dark:bg-red-950/20 dark:text-white'
      : 'w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-blue-500'
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-950">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="grid h-8 w-8 place-items-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
              <User className="h-4 w-4" />
            </div>
            <span className="text-sm font-extrabold text-slate-900 dark:text-white">
              {tab === 'login' ? 'Sign in' : 'Create account'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-900"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex gap-1 px-5 pt-4">
          {['login', 'signup'].map((t) => (
            <button
              key={t}
              onClick={() => switchTab(t)}
              className={`flex-1 rounded-xl py-2 text-sm font-semibold transition ${
                tab === t
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900'
              }`}
            >
              {t === 'login' ? 'Login' : 'Sign Up'}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="grid gap-3 px-5 py-4">
          {tab === 'signup' && (
            <div className="grid gap-1">
              <label
                htmlFor="auth-name"
                className="text-xs font-semibold text-slate-600 dark:text-slate-400"
              >
                Full name
              </label>
              <input
                id="auth-name"
                name="name"
                type="text"
                autoComplete="name"
                placeholder="John Doe"
                value={form.name}
                onChange={handleChange}
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? 'auth-name-error' : undefined}
                className={inputClass('name')}
              />
              {errors.name && (
                <p id="auth-name-error" role="alert" className="text-xs font-semibold text-red-600 dark:text-red-400">
                  {errors.name}
                </p>
              )}
            </div>
          )}

          <div className="grid gap-1">
            <label
              htmlFor="auth-email"
              className="text-xs font-semibold text-slate-600 dark:text-slate-400"
            >
              Email
            </label>
            <input
              id="auth-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'auth-email-error' : undefined}
              className={inputClass('email')}
            />
            {errors.email && (
              <p id="auth-email-error" role="alert" className="text-xs font-semibold text-red-600 dark:text-red-400">
                {errors.email}
              </p>
            )}
          </div>

          <div className="grid gap-1">
            <label
              htmlFor="auth-password"
              className="text-xs font-semibold text-slate-600 dark:text-slate-400"
            >
              Password
            </label>
            <input
              id="auth-password"
              name="password"
              type="password"
              autoComplete={tab === 'login' ? 'current-password' : 'new-password'}
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? 'auth-password-error' : undefined}
              className={inputClass('password')}
            />
            {errors.password && (
              <p id="auth-password-error" role="alert" className="text-xs font-semibold text-red-600 dark:text-red-400">
                {errors.password}
              </p>
            )}
          </div>

          {tab === 'signup' && (
            <div className="grid gap-1">
              <label
                htmlFor="auth-confirm"
                className="text-xs font-semibold text-slate-600 dark:text-slate-400"
              >
                Confirm password
              </label>
              <input
                id="auth-confirm"
                name="confirm"
                type="password"
                autoComplete="new-password"
                placeholder="••••••••"
                value={form.confirm}
                onChange={handleChange}
                aria-invalid={!!errors.confirm}
                aria-describedby={errors.confirm ? 'auth-confirm-error' : undefined}
                className={inputClass('confirm')}
              />
              {errors.confirm && (
                <p id="auth-confirm-error" role="alert" className="text-xs font-semibold text-red-600 dark:text-red-400">
                  {errors.confirm}
                </p>
              )}
            </div>
          )}

          {success && (
            <div className="rounded-xl border border-green-200 bg-green-50 px-3 py-2 text-xs font-semibold text-green-700 dark:border-green-900/60 dark:bg-green-950/40 dark:text-green-300">
              {success}
            </div>
          )}

          <button
            type="submit"
            className="mt-1 w-full rounded-xl bg-blue-600 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 active:scale-[0.99]"
          >
            {tab === 'login' ? 'Sign in' : 'Create account'}
          </button>

          <p className="text-center text-xs text-slate-500 dark:text-slate-400">
            {tab === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
            <button
              type="button"
              onClick={() => switchTab(tab === 'login' ? 'signup' : 'login')}
              className="font-semibold text-blue-600 hover:underline dark:text-blue-400"
            >
              {tab === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </form>
      </div>
    </div>
  )
}

export default function Layout() {
  const { theme, toggle } = useDarkMode()
  const [authOpen, setAuthOpen] = useState(false)

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

            {/* Login / Signup button */}
            <button
              onClick={() => setAuthOpen(true)}
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900"
            >
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Login</span>
            </button>

            {/* Dark mode toggle */}
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

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </div>
  )
}
