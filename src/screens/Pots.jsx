import { useState } from 'react'

export const SAVINGS = [
  { slug: 'emergency', name: 'Emergency fund', emoji: '🛡️', saved: 1200, goal: 3000, color: '#0088A6', desc: 'Safety net for 3 months' },
  { slug: 'holiday', name: 'Holiday 2026', emoji: '✈️', saved: 430, goal: 2000, color: '#47D3B2', desc: 'Greece, summer 2026' },
  { slug: 'sofa', name: 'New sofa', emoji: '🛋️', saved: 85, goal: 600, color: '#BBF42E', desc: 'Living room upgrade' },
  { slug: 'wedding', name: 'Wedding', emoji: '💍', saved: 2800, goal: 5000, color: '#FF4F40', desc: 'The big day fund' },
]

export const DEBTS = [
  { slug: 'barclaycard', name: 'Barclaycard', emoji: '💳', paid: 1840, total: 3200, color: '#FF4F40', apr: '19.9%', minPayment: 64 },
  { slug: 'student-loan', name: 'Student loan', emoji: '🎓', paid: 6200, total: 14500, color: '#FF8C42', apr: '7.1%', minPayment: 180 },
  { slug: 'car-finance', name: 'Car finance', emoji: '🚗', paid: 4100, total: 8000, color: '#47D3B2', apr: '5.4%', minPayment: 210 },
]

export default function Pots({ onNavigate }) {
  const [tab, setTab] = useState('savings')

  const totalSaved = SAVINGS.reduce((s, p) => s + p.saved, 0)
  const totalGoal = SAVINGS.reduce((s, p) => s + p.goal, 0)
  const totalDebt = DEBTS.reduce((s, d) => s + (d.total - d.paid), 0)
  const totalDebtOriginal = DEBTS.reduce((s, d) => s + d.total, 0)
  const totalPaid = DEBTS.reduce((s, d) => s + d.paid, 0)

  return (
    <div className="pots-root">
      {/* Status bar */}
      <div className="status-bar">
        <span className="status-time">9:41</span>
      </div>

      {/* Header */}
      <div className="pots-page-header">
        <button className="back-btn" onClick={() => onNavigate({ id: 'dashboard' })}>←</button>
        <h1 className="pots-page-title">Pots</h1>
        <p className="pots-page-subtitle">August 2025 · Claudia & Samuel</p>
      </div>

      {/* Summary card */}
      <div className="pots-summary-row">
        {tab === 'savings' ? (
          <div className="pots-summary-card pots-summary-card--savings">
            <div>
              <p className="pots-summary-label">Total saved</p>
              <p className="pots-summary-value" style={{ color: '#47D3B2' }}>£{totalSaved.toLocaleString()}</p>
              <p className="pots-summary-of">of £{totalGoal.toLocaleString()} goal</p>
            </div>
            <div className="pots-summary-ring">
              <RingProgress value={totalSaved / totalGoal} color="#47D3B2" />
            </div>
          </div>
        ) : (
          <div className="pots-summary-card pots-summary-card--debt">
            <div>
              <p className="pots-summary-label">Remaining debt</p>
              <p className="pots-summary-value" style={{ color: '#FF4F40' }}>£{totalDebt.toLocaleString()}</p>
              <p className="pots-summary-of">£{totalPaid.toLocaleString()} paid off</p>
            </div>
            <div className="pots-summary-ring">
              <RingProgress value={totalPaid / totalDebtOriginal} color="#FF4F40" />
            </div>
          </div>
        )}
      </div>

      {/* Tab switcher */}
      <div className="pots-tabs">
        <button className={`pots-tab ${tab === 'savings' ? 'pots-tab--active' : ''}`} onClick={() => setTab('savings')}>
          🪴 Savings
        </button>
        <button className={`pots-tab ${tab === 'debts' ? 'pots-tab--active' : ''}`} onClick={() => setTab('debts')}>
          💳 Debts
        </button>
      </div>

      {/* Content */}
      <div className="pots-list">
        {tab === 'savings' && (
          <>
            {SAVINGS.map(pot => {
              const pct = pot.saved / pot.goal
              return (
                <button
                  key={pot.slug}
                  className="pot-row-card pot-row-card--btn"
                  onClick={() => onNavigate({ id: 'pot-detail', slug: pot.slug, type: 'savings' })}
                >
                  <div className="pot-row-left">
                    <div className="pot-row-emoji" style={{ background: `${pot.color}18`, border: `1px solid ${pot.color}28` }}>
                      {pot.emoji}
                    </div>
                    <div className="pot-row-info">
                      <p className="pot-row-name">{pot.name}</p>
                      <p className="pot-row-desc">{pot.desc}</p>
                      <div className="pot-row-track">
                        <div className="pot-row-fill" style={{ width: `${Math.min(pct, 1) * 100}%`, background: pot.color }} />
                      </div>
                    </div>
                  </div>
                  <div className="pot-row-right">
                    <p className="pot-row-saved" style={{ color: pot.color }}>£{pot.saved.toLocaleString()}</p>
                    <p className="pot-row-goal">/ £{pot.goal.toLocaleString()}</p>
                    <p className="pot-row-pct" style={{ color: pot.color }}>{Math.round(pct * 100)}%</p>
                  </div>
                </button>
              )
            })}
            <button className="btn-add-pot">+ Create a savings pot</button>
          </>
        )}

        {tab === 'debts' && (
          <>
            {DEBTS.map(debt => {
              const pct = debt.paid / debt.total
              const remaining = debt.total - debt.paid
              return (
                <button
                  key={debt.slug}
                  className="pot-row-card pot-row-card--btn"
                  onClick={() => onNavigate({ id: 'pot-detail', slug: debt.slug, type: 'debts' })}
                >
                  <div className="pot-row-left">
                    <div className="pot-row-emoji" style={{ background: `${debt.color}18`, border: `1px solid ${debt.color}28` }}>
                      {debt.emoji}
                    </div>
                    <div className="pot-row-info">
                      <p className="pot-row-name">{debt.name}</p>
                      <p className="pot-row-desc">APR {debt.apr} · min £{debt.minPayment}/mo</p>
                      <div className="pot-row-track">
                        <div className="pot-row-fill" style={{ width: `${Math.min(pct, 1) * 100}%`, background: debt.color }} />
                      </div>
                    </div>
                  </div>
                  <div className="pot-row-right">
                    <p className="pot-row-saved" style={{ color: debt.color }}>£{remaining.toLocaleString()}</p>
                    <p className="pot-row-goal">left</p>
                    <p className="pot-row-pct" style={{ color: debt.color }}>{Math.round(pct * 100)}% paid</p>
                  </div>
                </button>
              )
            })}
            <button className="btn-add-pot">+ Add a debt</button>
          </>
        )}
      </div>
    </div>
  )
}

function RingProgress({ value, color }) {
  const size = 72, cx = 36, cy = 36, r = 28
  const circ = 2 * Math.PI * r
  const offset = circ - Math.min(value, 1) * circ
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={8} />
      <circle cx={cx} cy={cy} r={r} fill="none"
        stroke={color} strokeWidth={8}
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round"
      />
    </svg>
  )
}
