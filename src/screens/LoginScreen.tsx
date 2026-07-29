import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useShop } from '../store/ShopContext'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function LoginScreen() {
  const navigate = useNavigate()
  const { login, register, loginAsGuest } = useShop()
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [focused, setFocused] = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formError, setFormError] = useState('')

  const validate = () => {
    const next: Record<string, string> = {}
    if (mode === 'register' && !name.trim()) next.name = 'Name is required'
    if (!email.trim()) next.email = 'Email is required'
    else if (!EMAIL_RE.test(email.trim())) next.email = 'Enter a valid email'
    if (!password) next.password = 'Password is required'
    else if (password.length < 6) next.password = 'Password must be at least 6 characters'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setFormError('')
    if (!validate()) return

    if (mode === 'register') {
      const result = register(name, email, password)
      if (!result.ok) {
        setFormError(result.error)
        return
      }
    } else {
      const result = login(email, password)
      if (!result.ok) {
        setFormError(result.error)
        return
      }
    }
    navigate('/home', { replace: true })
  }

  const handleSocial = (provider: string) => {
    loginAsGuest(
      provider === 'Google' ? 'Aline Uwase' : 'Aline Uwase',
      provider === 'Google' ? 'aline.uwase@email.com' : 'aline.uwase@icloud.com'
    )
    navigate('/home', { replace: true })
  }

  const fieldClass = (key: string) =>
    `w-full bg-surface border rounded-xl px-4 py-3.5 font-body text-ink text-sm outline-none transition-all placeholder:text-ink-3 ${
      errors[key]
        ? 'border-red-500'
        : focused === key
          ? 'border-ink shadow-sm'
          : 'border-rule'
    }`

  return (
    <div className="h-full flex flex-col bg-canvas overflow-y-auto hide-scrollbar">
      <div className="bg-ink flex-none px-8 pt-16 pb-12">
        <div className="mb-6">
          <span className="text-brand font-display font-bold text-xs uppercase tracking-[0.25em]">
            ShopEase
          </span>
        </div>
        <h1 className="font-display font-extrabold text-5xl text-white leading-none mb-4">
          From want<br />to on the<br />
          <span className="text-brand">way.</span>
        </h1>
        <p className="text-white/50 font-body text-sm leading-relaxed max-w-xs">
          Fast discovery, honest prices, and clear order tracking — all in one place.
        </p>
      </div>

      <div className="flex-1 bg-canvas px-6 pt-8 pb-10">
        <div className="flex gap-0 bg-rule rounded-xl p-1 mb-8">
          {(['login', 'register'] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => {
                setMode(m)
                setErrors({})
                setFormError('')
              }}
              className={`flex-1 py-2.5 rounded-lg text-sm font-display font-semibold transition-all duration-200 ${
                mode === m ? 'bg-surface text-ink shadow-sm' : 'text-ink-3'
              }`}
            >
              {m === 'login' ? 'Log In' : 'Create Account'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
          {mode === 'register' && (
            <div>
              <label className="block text-ink font-body font-medium text-xs uppercase tracking-widest mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onFocus={() => setFocused('name')}
                onBlur={() => setFocused(null)}
                placeholder="Aline Uwase"
                className={fieldClass('name')}
              />
              {errors.name && (
                <p className="mt-1.5 font-body text-xs text-red-500">{errors.name}</p>
              )}
            </div>
          )}

          <div>
            <label className="block text-ink font-body font-medium text-xs uppercase tracking-widest mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setFocused('email')}
              onBlur={() => setFocused(null)}
              placeholder="aline@example.com"
              className={fieldClass('email')}
            />
            {errors.email && (
              <p className="mt-1.5 font-body text-xs text-red-500">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-ink font-body font-medium text-xs uppercase tracking-widest mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setFocused('password')}
              onBlur={() => setFocused(null)}
              placeholder="••••••••"
              className={fieldClass('password')}
            />
            {errors.password && (
              <p className="mt-1.5 font-body text-xs text-red-500">{errors.password}</p>
            )}
          </div>

          {mode === 'login' && (
            <button type="button" className="text-brand font-body font-medium text-sm text-right -mt-1">
              Forgot password?
            </button>
          )}

          {formError && (
            <p className="font-body text-sm text-red-500 text-center">{formError}</p>
          )}

          <button
            type="submit"
            className="mt-2 w-full min-h-11 bg-brand text-white font-display font-bold text-base py-4 rounded-xl transition-all active:bg-brand-hover active:scale-[0.98]"
          >
            {mode === 'login' ? 'Log In' : 'Create Account'}
          </button>
        </form>

        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-rule" />
          <span className="text-ink-3 font-body text-xs">or continue with</span>
          <div className="flex-1 h-px bg-rule" />
        </div>

        <div className="flex gap-3">
          {['Google', 'Apple'].map((provider) => (
            <button
              key={provider}
              type="button"
              onClick={() => handleSocial(provider)}
              className="flex-1 border border-rule bg-surface rounded-xl py-3 flex items-center justify-center gap-2 font-body font-medium text-sm text-ink"
            >
              <span>{provider}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
