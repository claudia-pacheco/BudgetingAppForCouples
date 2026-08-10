import { useState } from 'react'

const EMOJIS = ['🛡️','✈️','🛋️','💍','💳','🎓','🚗','🏠','📱','🎵','🌴','🐶','🎁','🍕','💊','🚀']

export default function PotDetail({ pot, type, onNavigate }) {
  const isSavings = type === 'savings'

  // Local editable details
  const [details, setDetails] = useState({
    name: pot.name,
    emoji: pot.emoji,
    desc: pot.desc || '',
    goal: isSavings ? pot.goal : pot.total,
    apr: pot.apr || '',
    minPayment: pot.minPayment || '',
  })

  const [payments, setPayments] = useState(
    isSavings
      ? [
          { who: 'Claudia', amount: +(pot.saved * 0.55).toFixed(2), date: '1 Aug', note: 'Monthly contribution' },
          { who: 'Samuel', amount: +(pot.saved * 0.45).toFixed(2), date: '1 Aug', note: 'Monthly contribution' },
        ]
      : [
          { who: 'Claudia', amount: +(pot.paid * 0.5).toFixed(2), date: '1 Aug', note: 'Regular payment' },
          { who: 'Samuel', amount: +(pot.paid * 0.5).toFixed(2), date: '1 Jul', note: 'Regular payment' },
        ]
  )

  const [showInput, setShowInput] = useState(false)
  const [inputAmount, setInputAmount] = useState('')
  const [inputWho, setInputWho] = useState('Claudia')
  const [inputNote, setInputNote] = useState('')
  const [showEdit, setShowEdit] = useState(false)
  const [editDraft, setEditDraft] = useState(null)

  const current = isSavings ? pot.saved : pot.paid
  const target = details.goal
  const remaining = target - current
  const pct = Math.min(current / target, 1)

  function addPayment() {
    const amount = parseFloat(inputAmount)
    if (!amount || isNaN(amount)) return
    setPayments(prev => [{
      who: inputWho,
      amount,
      date: 'Today',
      note: inputNote || (isSavings ? 'Manual deposit' : 'Payment'),
    }, ...prev])
    setInputAmount('')
    setInputNote('')
    setShowInput(false)
  }

  function openEdit() {
    setEditDraft({ ...details })
    setShowEdit(true)
  }

  function saveEdit() {
    setDetails({ ...editDraft })
    setShowEdit(false)
  }

  return (
    <div className="pot-detail-root">
      {/* Header */}
      <div className="pot-detail-header" style={{ background: `linear-gradient(160deg, ${pot.color}18 0%, transparent 60%)` }}>
        <div className="pot-detail-nav">
          <button className="back-btn" onClick={() => onNavigate({ id: 'pots' })}>←</button>
          <button className="pot-edit-btn" onClick={openEdit}>
            <EditIcon />
            Edit
          </button>
        </div>

        <div className="pot-detail-header-top">
          <div className="pot-detail-emoji-wrap" style={{ background: `${pot.color}18`, border: `1px solid ${pot.color}30` }}>
            {details.emoji}
          </div>
          <div>
            <p className="pot-detail-label">{isSavings ? 'Savings pot' : 'Debt tracker'}</p>
            <h1 className="pot-detail-name">{details.name}</h1>
            {details.desc && <p className="pot-detail-desc">{details.desc}</p>}
            {!isSavings && details.apr && <p className="pot-detail-desc">APR {details.apr} · min £{details.minPayment}/mo</p>}
          </div>
        </div>

        {/* Big number */}
        <div className="pot-detail-amount-row">
          <div>
            <p className="pot-detail-amount-label">{isSavings ? 'Saved' : 'Paid off'}</p>
            <p className="pot-detail-amount" style={{ color: pot.color }}>
              £{current.toLocaleString('en-GB', { minimumFractionDigits: 2 })}
            </p>
            <p className="pot-detail-amount-sub">
              {isSavings ? `£${remaining.toLocaleString()} to go` : `£${remaining.toLocaleString()} remaining`}
            </p>
          </div>
          <RadialProgress value={pct} color={pot.color} label={`${Math.round(pct * 100)}%`} />
        </div>

        {/* Progress bar */}
        <div className="pot-detail-progress-wrap">
          <div className="pot-detail-track">
            <div className="pot-detail-fill" style={{ width: `${pct * 100}%`, background: `linear-gradient(90deg, ${pot.color}99, ${pot.color})` }} />
          </div>
          <div className="pot-detail-progress-labels">
            <span className="progress-endpoint-label">£0</span>
            <span className="progress-endpoint-label">£{target.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="pot-detail-body">
        {/* Stats */}
        <div className="pot-detail-stats">
          <div className="pot-stat">
            <p className="info-item-label">{isSavings ? 'Target' : 'Original debt'}</p>
            <p className="info-item-value">£{target.toLocaleString()}</p>
          </div>
          <div className="pot-stat">
            <p className="info-item-label">{isSavings ? 'Monthly est.' : 'Min. payment'}</p>
            <p className="info-item-value">
              {isSavings ? `£${Math.round(remaining / 12)}/mo` : `£${details.minPayment}`}
            </p>
          </div>
          <div className="pot-stat">
            <p className="info-item-label">{isSavings ? 'Contributors' : 'APR'}</p>
            <p className="info-item-value">{isSavings ? 'C & S' : details.apr}</p>
          </div>
          <div className="pot-stat">
            <p className="info-item-label">Progress</p>
            <p className="info-item-value" style={{ color: pot.color }}>{Math.round(pct * 100)}%</p>
          </div>
        </div>

        {/* Add payment */}
        <div className="pot-detail-section">
          <h2 className="section-title-sm">{isSavings ? 'Add deposit' : 'Make a payment'}</h2>
          {showInput ? (
            <div className="pot-payment-form">
              <div className="pot-payment-who">
                {['Claudia', 'Samuel'].map(name => (
                  <button
                    key={name}
                    className={`pot-who-btn ${inputWho === name ? 'pot-who-btn--active' : ''}`}
                    style={inputWho === name ? { borderColor: pot.color, color: pot.color, background: `${pot.color}15` } : {}}
                    onClick={() => setInputWho(name)}
                  >
                    {name}
                  </button>
                ))}
              </div>
              <div className="pot-payment-input-row">
                <span className="pot-payment-currency">£</span>
                <input
                  className="pot-payment-input"
                  type="number"
                  placeholder="0.00"
                  value={inputAmount}
                  onChange={e => setInputAmount(e.target.value)}
                  autoFocus
                />
              </div>
              <input
                className="pot-payment-note-input"
                type="text"
                placeholder="Add a note (optional)"
                value={inputNote}
                onChange={e => setInputNote(e.target.value)}
              />
              <div className="pot-payment-actions">
                <button className="pot-cancel-btn" onClick={() => setShowInput(false)}>Cancel</button>
                <button className="pot-confirm-btn" style={{ background: pot.color }} onClick={addPayment}>
                  {isSavings ? 'Deposit' : 'Pay'}
                </button>
              </div>
            </div>
          ) : (
            <button
              className="pot-add-btn"
              style={{ borderColor: `${pot.color}40`, color: pot.color, background: `${pot.color}0d` }}
              onClick={() => setShowInput(true)}
            >
              + {isSavings ? 'Add deposit' : 'Make a payment'}
            </button>
          )}
        </div>

        {/* History */}
        <div className="pot-detail-section">
          <h2 className="section-title-sm">History</h2>
          <div className="detail-activity-list">
            {payments.map((p, i) => (
              <div key={i} className="detail-activity-item">
                <div className="avatar-dot" style={{
                  background: `${p.who === 'Claudia' ? '#0088A6' : '#FF4F40'}18`,
                  border: `1.5px solid ${p.who === 'Claudia' ? '#0088A6' : '#FF4F40'}`,
                  color: p.who === 'Claudia' ? '#0088A6' : '#FF4F40',
                }}>
                  {p.who[0]}
                </div>
                <div className="detail-activity-info">
                  <p className="detail-activity-merchant">{p.note}</p>
                  <p className="detail-activity-meta">{p.who} · {p.date}</p>
                </div>
                <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '15px', color: pot.color }}>
                  +£{p.amount.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Edit sheet */}
      {showEdit && editDraft && (
        <>
          <div className="edit-sheet-overlay" onClick={() => setShowEdit(false)} />
          <div className="edit-sheet">
            <div className="edit-sheet-handle" />
            <div className="edit-sheet-header">
              <h2 className="edit-sheet-title">Edit {isSavings ? 'savings pot' : 'debt'}</h2>
              <button className="edit-sheet-close" onClick={() => setShowEdit(false)}>✕</button>
            </div>

            {/* Emoji picker */}
            <div className="edit-field-label">Icon</div>
            <div className="edit-emoji-grid">
              {EMOJIS.map(e => (
                <button
                  key={e}
                  className={`edit-emoji-btn ${editDraft.emoji === e ? 'edit-emoji-btn--active' : ''}`}
                  style={editDraft.emoji === e ? { borderColor: pot.color, background: `${pot.color}18` } : {}}
                  onClick={() => setEditDraft(d => ({ ...d, emoji: e }))}
                >
                  {e}
                </button>
              ))}
            </div>

            {/* Name */}
            <div className="edit-field-label">Name</div>
            <input
              className="edit-input"
              value={editDraft.name}
              onChange={e => setEditDraft(d => ({ ...d, name: e.target.value }))}
              placeholder="Pot name"
            />

            {/* Description */}
            <div className="edit-field-label">{isSavings ? 'Description' : 'Notes'}</div>
            <input
              className="edit-input"
              value={editDraft.desc}
              onChange={e => setEditDraft(d => ({ ...d, desc: e.target.value }))}
              placeholder={isSavings ? 'e.g. Greece, summer 2026' : 'Optional notes'}
            />

            {/* Goal / Total */}
            <div className="edit-field-label">{isSavings ? 'Savings goal (£)' : 'Total debt (£)'}</div>
            <div className="pot-payment-input-row edit-input-row">
              <span className="pot-payment-currency">£</span>
              <input
                className="pot-payment-input edit-number-input"
                type="number"
                value={editDraft.goal}
                onChange={e => setEditDraft(d => ({ ...d, goal: parseFloat(e.target.value) || 0 }))}
              />
            </div>

            {/* Debt-specific fields */}
            {!isSavings && (
              <>
                <div className="edit-field-label">APR</div>
                <input
                  className="edit-input"
                  value={editDraft.apr}
                  onChange={e => setEditDraft(d => ({ ...d, apr: e.target.value }))}
                  placeholder="e.g. 19.9%"
                />
                <div className="edit-field-label">Minimum monthly payment (£)</div>
                <div className="pot-payment-input-row edit-input-row">
                  <span className="pot-payment-currency">£</span>
                  <input
                    className="pot-payment-input edit-number-input"
                    type="number"
                    value={editDraft.minPayment}
                    onChange={e => setEditDraft(d => ({ ...d, minPayment: parseFloat(e.target.value) || 0 }))}
                  />
                </div>
              </>
            )}

            <button className="pot-confirm-btn edit-save-btn" style={{ background: pot.color }} onClick={saveEdit}>
              Save changes
            </button>
          </div>
        </>
      )}
    </div>
  )
}

function RadialProgress({ value, color, label }) {
  const r = 28, cx = 34, cy = 34
  const circ = 2 * Math.PI * r
  const offset = circ - value * circ
  return (
    <svg width={68} height={68} style={{ flexShrink: 0 }}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={6} />
      <circle cx={cx} cy={cy} r={r} fill="none"
        stroke={color} strokeWidth={6}
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round"
        transform={`rotate(-90 ${cx} ${cy})`}
      />
      <text x={cx} y={cy + 5} textAnchor="middle" fill={color}
        style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '13px' }}>
        {label}
      </text>
    </svg>
  )
}

function EditIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ display: 'block' }}>
      <path d="M9.5 1.5L12.5 4.5L4.5 12.5H1.5V9.5L9.5 1.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}
