import coupleIllustration from '../imports/157AE80E-058C-4322-812F-2849831737FD.PNG'
import pairLogoImg from '../imports/4A0183E0-34C0-41BF-8C19-99C58D6D65E1.PNG'

export default function Onboarding({ onNavigate }) {
  return (
    <div className="onboarding-container">
      {/* Background decoration */}
      <div className="onboarding-bg-top" />
      <div className="onboarding-bg-bottom" />

      {/* Logo area */}
      <div className="logo-area">
        <PairLogo />
      </div>

      {/* Hero copy */}
      <div className="hero-copy">
        <div className="hero-heading">
          {'Money, '}
          <span className="gradient-text">together</span>
          {'.'}
        </div>
        <p className="hero-subtext">
          The monthly budgeting app for couples who share everything — including their finances.
        </p>

        {/* Couple illustration */}
        <img
          src={coupleIllustration}
          alt="Illustrated couple connected by a heart"
          className="couple-illustration"
        />

        {/* PAIR'd detail */}
        <div className="pair-detail">
          <Avatar initials="You" color="#0088A6" />
          <div className="pair-connector" />
          <Avatar initials="Partner" color="#BBF42E" />
        </div>
      </div>

      {/* CTA buttons */}
      <div className="cta-buttons">
        <button
          onClick={() => onNavigate({ id: 'create-account' })}
          className="btn-create-account"
        >
          Create account
        </button>
        <button
          onClick={() => onNavigate({ id: 'login' })}
          className="btn-login"
        >
          Log in
        </button>
      </div>
    </div>
  )
}

function PairLogo() {
  return (
    <div className="pair-logo">
      {[['P','#0088A6'],['A','#47D3B2'],['I','#BBF42E'],['R','#FF4F40']].map(([letter, color]) => (
        <span key={letter} className="pair-logo-letter" style={{ color }}>{letter}</span>
      ))}
    </div>
  )
}

function Avatar({ initials, color }) {
  return (
    <div
      className="onboarding-avatar"
      style={{
        background: `${color}22`,
        border: `1.5px solid ${color}`,
        color,
      }}
    >
      {initials}
    </div>
  )
}
