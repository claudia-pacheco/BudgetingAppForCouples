import { useState } from 'react'

export default function Login({ onNavigate }) {
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  function set(key, val) {
    setForm(f => ({ ...f, [key]: val }))
    setErrors(e => ({ ...e, [key]: '' }))
  }

  function handleLogin() {
    const e = {}
    if (!form.email.includes('@')) e.email = 'Enter a valid email'
    if (!form.password) e.password = 'Password is required'
    setErrors(e)
    if (Object.keys(e).length > 0) return

    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      onNavigate({ id: 'dashboard' })
    }, 800)
  }

  return (
    <div className="auth-root">
      <div className="auth-bg-glow auth-bg-glow--tl" />
      <div className="auth-bg-glow auth-bg-glow--br" />

      {/* Back */}
      <button className="auth-back" onClick={() => onNavigate({ id: 'onboarding' })}>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M13 16L7 10L13 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      <div className="auth-content">
        {/* Logo */}
        <div className="auth-logo">
          {[['P','#0088A6'],['A','#47D3B2'],['I','#BBF42E'],['R','#FF4F40']].map(([l, c]) => (
            <span key={l} className="pair-logo-letter" style={{ color: c }}>{l}</span>
          ))}
        </div>

        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-subtitle">Log in to your PAIR account</p>

        <div className="auth-fields">
          <div className="auth-field">
            <label className="auth-label">Email address</label>
            <input
              className={`auth-input ${errors.email ? 'auth-input--error' : ''}`}
              type="email"
              placeholder="claudia@example.com"
              value={form.email}
              onChange={e => set('email', e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
            />
            {errors.email && <p className="auth-error">{errors.email}</p>}
          </div>

          <div className="auth-field">
            <div className="auth-label-row">
              <label className="auth-label">Password</label>
              <button className="auth-forgot">Forgot password?</button>
            </div>
            <div className="auth-input-wrap">
              <input
                className={`auth-input auth-input--icon ${errors.password ? 'auth-input--error' : ''}`}
                type={showPass ? 'text' : 'password'}
                placeholder="Your password"
                value={form.password}
                onChange={e => set('password', e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
              />
              <button className="auth-eye" onClick={() => setShowPass(s => !s)}>
                {showPass ? '🙈' : '👁'}
              </button>
            </div>
            {errors.password && <p className="auth-error">{errors.password}</p>}
          </div>
        </div>

        <button
          className="btn-create-account auth-cta"
          onClick={handleLogin}
          disabled={loading}
          style={{ opacity: loading ? 0.7 : 1 }}
        >
          {loading ? 'Logging in…' : 'Log in'}
        </button>

        <p className="auth-switch">
          {"Don't have an account? "}
          <button className="auth-switch-link" onClick={() => onNavigate({ id: 'create-account' })}>
            Create one
          </button>
        </p>
      </div>

      <p className="auth-legal">
        By continuing you agree to our{' '}
        <span className="auth-legal-link">Terms</span> and{' '}
        <span className="auth-legal-link">Privacy Policy</span>
      </p>
    </div>
  )
}
