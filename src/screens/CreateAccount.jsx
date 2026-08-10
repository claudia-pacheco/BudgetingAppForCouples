import { useState } from 'react'

export default function CreateAccount({ onNavigate }) {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    name: '', email: '', password: '',
    partnerName: '', partnerEmail: '',
  })
  const [showPass, setShowPass] = useState(false)
  const [errors, setErrors] = useState({})

  function set(key, val) {
    setForm(f => ({ ...f, [key]: val }))
    setErrors(e => ({ ...e, [key]: '' }))
  }

  function validateStep1() {
    const e = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.email.includes('@')) e.email = 'Enter a valid email'
    if (form.password.length < 8) e.password = 'At least 8 characters'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleNext() {
    if (validateStep1()) setStep(2)
  }

  function handleCreate() {
    onNavigate({ id: 'dashboard' })
  }

  return (
    <div className="auth-root">
      <div className="auth-bg-glow auth-bg-glow--tl" />
      <div className="auth-bg-glow auth-bg-glow--br" />

      {/* Back */}
      <button className="auth-back" onClick={() => step === 1 ? onNavigate({ id: 'onboarding' }) : setStep(1)}>
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

        {/* Step indicator */}
        <div className="auth-steps">
          <div className={`auth-step-dot ${step >= 1 ? 'auth-step-dot--active' : ''}`} />
          <div className="auth-step-line" />
          <div className={`auth-step-dot ${step >= 2 ? 'auth-step-dot--active' : ''}`} />
        </div>

        {step === 1 && (
          <>
            <h1 className="auth-title">Create your account</h1>
            <p className="auth-subtitle">Step 1 of 2 · Your details</p>

            <div className="auth-fields">
              <Field label="Your name" error={errors.name}>
                <input
                  className={`auth-input ${errors.name ? 'auth-input--error' : ''}`}
                  placeholder="Claudia"
                  value={form.name}
                  onChange={e => set('name', e.target.value)}
                />
              </Field>

              <Field label="Email address" error={errors.email}>
                <input
                  className={`auth-input ${errors.email ? 'auth-input--error' : ''}`}
                  type="email"
                  placeholder="claudia@example.com"
                  value={form.email}
                  onChange={e => set('email', e.target.value)}
                />
              </Field>

              <Field label="Password" error={errors.password}>
                <div className="auth-input-wrap">
                  <input
                    className={`auth-input auth-input--icon ${errors.password ? 'auth-input--error' : ''}`}
                    type={showPass ? 'text' : 'password'}
                    placeholder="Min. 8 characters"
                    value={form.password}
                    onChange={e => set('password', e.target.value)}
                  />
                  <button className="auth-eye" onClick={() => setShowPass(s => !s)}>
                    {showPass ? '🙈' : '👁'}
                  </button>
                </div>
              </Field>
            </div>

            <button className="btn-create-account auth-cta" onClick={handleNext}>
              Continue
            </button>

            <p className="auth-switch">
              Already have an account?{' '}
              <button className="auth-switch-link" onClick={() => onNavigate({ id: 'login' })}>Log in</button>
            </p>
          </>
        )}

        {step === 2 && (
          <>
            <h1 className="auth-title">Invite your partner</h1>
            <p className="auth-subtitle">Step 2 of 2 · PAIR'd together</p>

            <div className="auth-partner-card">
              <div className="auth-partner-avatars">
                <div className="auth-partner-avatar" style={{ background: '#0088A618', border: '1.5px solid #0088A6', color: '#0088A6' }}>
                  {form.name ? form.name[0].toUpperCase() : 'Y'}
                </div>
                <div className="auth-partner-heart">♥</div>
                <div className="auth-partner-avatar auth-partner-avatar--ghost">?</div>
              </div>
              <p className="auth-partner-label">
                <span style={{ color: '#0088A6', fontWeight: 700 }}>{form.name || 'You'}</span>
                {' & your partner'}
              </p>
            </div>

            <div className="auth-fields">
              <Field label="Partner's name">
                <input
                  className="auth-input"
                  placeholder="Samuel"
                  value={form.partnerName}
                  onChange={e => set('partnerName', e.target.value)}
                />
              </Field>

              <Field label="Partner's email" hint="They'll receive an invite to join PAIR">
                <input
                  className="auth-input"
                  type="email"
                  placeholder="samuel@example.com"
                  value={form.partnerEmail}
                  onChange={e => set('partnerEmail', e.target.value)}
                />
              </Field>
            </div>

            <button className="btn-create-account auth-cta" onClick={handleCreate}>
              Create account & send invite
            </button>

            <button className="auth-skip" onClick={handleCreate}>
              Skip for now
            </button>
          </>
        )}
      </div>

      {/* T&C */}
      <p className="auth-legal">
        By continuing you agree to our{' '}
        <span className="auth-legal-link">Terms</span> and{' '}
        <span className="auth-legal-link">Privacy Policy</span>
      </p>
    </div>
  )
}

function Field({ label, hint, error, children }) {
  return (
    <div className="auth-field">
      <label className="auth-label">{label}</label>
      {children}
      {hint && !error && <p className="auth-hint">{hint}</p>}
      {error && <p className="auth-error">{error}</p>}
    </div>
  )
}
