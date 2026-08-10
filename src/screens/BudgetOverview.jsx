import { useState } from 'react'

const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
const FULL_MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']

const HISTORY = {
  '-1': { groceries: 0.88, holiday: 0.30, dining: 0.72, transport: 0.61 },
  '-2': { groceries: 0.95, holiday: 0.55, dining: 0.91, transport: 0.78 },
  '-3': { groceries: 0.82, holiday: 0.12, dining: 0.68, transport: 0.55 },
  '-4': { groceries: 1.05, holiday: 0.00, dining: 1.12, transport: 0.90 },
  '-5': { groceries: 0.79, holiday: 0.80, dining: 0.62, transport: 0.72 },
  '-6': { groceries: 0.91, holiday: 0.40, dining: 0.85, transport: 0.68 },
}

const FUTURE_BUDGETS = {
  '+1': { groceries: 420, holiday: 1200, dining: 280, transport: 180 },
  '+2': { groceries: 440, holiday: 600,  dining: 300, transport: 200 },
  '+3': { groceries: 420, holiday: 400,  dining: 280, transport: 180 },
}

function getMonthData(categories, offset) {
  const baseMonth = 7
  const absMonth = ((baseMonth + offset) % 12 + 12) % 12
  const yearOffset = Math.floor((baseMonth + offset) / 12)
  const year = 2025 + yearOffset
  const label = `${FULL_MONTHS[absMonth]} ${year}`
  const shortLabel = `${MONTH_NAMES[absMonth]} ${year}`

  if (offset === 0) {
    return { label, shortLabel, year, cats: categories, isPast: false, isFuture: false }
  }
  if (offset < 0 && HISTORY[String(offset)]) {
    const mults = HISTORY[String(offset)]
    const cats = categories.map(c => ({ ...c, spent: Math.round(c.budget * (mults[c.slug] ?? 0.75)) }))
    return { label, shortLabel, year, cats, isPast: true, isFuture: false }
  }
  if (offset > 0) {
    const budgets = FUTURE_BUDGETS[`+${offset}`] || {}
    const cats = categories.map(c => ({ ...c, budget: budgets[c.slug] ?? c.budget, spent: 0, activities: [] }))
    return { label, shortLabel, year, cats, isPast: false, isFuture: true }
  }
  const cats = categories.map(c => ({ ...c, spent: Math.round(c.budget * (0.6 + Math.abs(offset) * 0.05)) }))
  return { label, shortLabel, year, cats, isPast: true, isFuture: false }
}

const ArrowLeft = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const ArrowRight = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

export default function BudgetOverview({ categories, onNavigate }) {
  const [offset, setOffset] = useState(0)
  const { label, cats, isPast, isFuture } = getMonthData(categories, offset)
  const totalBudget = cats.reduce((s, c) => s + c.budget, 0)
  const totalSpent = cats.reduce((s, c) => s + c.spent, 0)


  return (
    <div className="budget-overview-root">
      {/* Header */}
      <div className="budget-overview-header">
        <div className="budget-overview-header-top">
          <button onClick={() => onNavigate({ id: 'dashboard' })} className="back-btn">←</button>
          <h1 className="budget-overview-title">Budgets</h1>
          <div style={{ width: 36 }} />
        </div>
        <div className="budget-month-nav">
          <button className="budget-month-arrow" onClick={() => setOffset(o => o - 1)}>
            <ArrowLeft />
          </button>
          <div className="budget-month-label-wrap">
            <span className="budget-month-label">{label}</span>
            {isFuture && <span className="budget-month-badge">Planned</span>}
            {isPast && <span className="budget-month-badge budget-month-badge--past">Past</span>}
          </div>
          <button className="budget-month-arrow" onClick={() => setOffset(o => o + 1)} disabled={offset >= 3}>
            <ArrowRight />
          </button>
        </div>
      </div>


      {/* Future banner */}
      {isFuture && (
        <div className="budget-future-banner">
          <span className="budget-future-icon">📅</span>
          <div>
            <p className="budget-future-title">Plan ahead for {label}</p>
            <p className="budget-future-sub">Set your budget targets — spending will track here when the month arrives.</p>
          </div>
        </div>
      )}

      {/* Summary */}
      <div className="budget-summary-row">
        <DonutChart categories={cats} total={totalBudget} isFuture={isFuture} />
        <div className="budget-summary-info">
          <p className="budget-summary-label">{isFuture ? 'Planned budget' : 'Total spent'}</p>
          <p className="budget-summary-total">£{(isFuture ? totalBudget : totalSpent).toLocaleString()}</p>
          <p className="budget-summary-of">{isFuture ? 'budget planned' : `of £${totalBudget.toLocaleString()} budget`}</p>
          {isPast && (
            <p className="budget-summary-saved" style={{ color: totalSpent < totalBudget ? '#47D3B2' : '#FF4F40' }}>
              {totalSpent < totalBudget
                ? `✓ £${(totalBudget - totalSpent).toLocaleString()} under budget`
                : `⚠ £${(totalSpent - totalBudget).toLocaleString()} over budget`}
            </p>
          )}
          <div className="budget-legend">
            {cats.map(c => (
              <div key={c.slug} className="budget-legend-item">
                <div className="budget-legend-dot" style={{ background: c.color }} />
                <span className="budget-legend-name">{c.name}</span>
                <span className="budget-legend-pct">
                  {isFuture ? `£${c.budget}` : totalSpent > 0 ? `${Math.round((c.spent / totalSpent) * 100)}%` : '—'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Category list */}
      <div className="budget-list">
        <div className="budget-list-inner">
          {cats.map(cat => {
            const pct = isFuture ? 0 : cat.spent / cat.budget
            return (
              <button
                key={cat.slug}
                onClick={() => !isFuture && onNavigate({ id: 'category', slug: cat.slug })}
                className={`budget-category-card ${isFuture ? 'budget-category-card--future' : ''}`}
              >
                <div className="budget-category-card-top">
                  <div className="budget-category-card-left">
                    <div className="budget-category-icon" style={{ background: `${cat.color}18`, border: `1px solid ${cat.color}30` }}>
                      {cat.emoji}
                    </div>
                    <div>
                      <p className="budget-category-name">{cat.name}</p>
                      <p className="budget-category-txn">
                        {isFuture ? 'Planned' : `${cat.activities.length} transactions`}
                      </p>
                    </div>
                  </div>
                  <div className="budget-category-card-right">
                    {isFuture ? (
                      <p className="budget-category-planned">£{cat.budget}</p>
                    ) : (
                      <>
                        <p className="budget-category-spent">£{cat.spent}</p>
                        <p className="budget-category-budget">/ £{cat.budget}</p>
                      </>
                    )}
                  </div>
                </div>
                <div className="budget-progress-track">
                  <div
                    className="budget-progress-fill"
                    style={{ width: `${Math.min(pct, 1) * 100}%`, background: `linear-gradient(90deg, ${cat.color}99, ${cat.color})` }}
                  />
                </div>
                <div className="budget-progress-labels">
                  <span className="budget-pct-label">
                    {isFuture ? 'No spending yet' : `${Math.round(pct * 100)}% of budget`}
                  </span>
                  <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: pct > 0.85 ? '#FF4F5E' : cat.color }}>
                    {isFuture ? `£${cat.budget} budgeted` : pct > 0.85 ? '⚠ Almost full' : `£${cat.budget - cat.spent} left`}
                  </span>
                </div>
              </button>
            )
          })}
        </div>
        <button className="btn-add-budget">+ Add new budget</button>
      </div>
    </div>
  )
}

function DonutChart({ categories, total, isFuture }) {
  const size = 120, cx = 60, cy = 60, r = 44, strokeW = 16
  const circumference = 2 * Math.PI * r
  const gap = 3
  const totalSpent = categories.reduce((s, c) => s + c.spent, 0)
  let off = 0
  const segments = categories.map(cat => {
    const base = isFuture ? cat.budget : cat.spent
    const fraction = base / (isFuture ? total : (totalSpent || total))
    const dash = fraction * (circumference - gap * categories.length)
    const seg = { color: cat.color, dash, offset: off }
    off += dash + gap
    return seg
  })

  return (
    <div className="donut-chart-wrapper">
      <svg width={size} height={size} className="donut-chart-svg">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={strokeW} />
        {segments.map((seg, i) => (
          <circle key={i} cx={cx} cy={cy} r={r} fill="none"
            stroke={seg.color} strokeWidth={strokeW}
            opacity={isFuture ? 0.35 : 1}
            strokeDasharray={`${seg.dash} ${circumference - seg.dash}`}
            strokeDashoffset={-seg.offset}
            strokeLinecap="round"
          />
        ))}
      </svg>
      <div className="donut-chart-center">
        <span className="donut-chart-pct">{isFuture ? '—' : `${Math.round((totalSpent / total) * 100)}%`}</span>
        <span className="donut-chart-label">{isFuture ? 'planned' : 'used'}</span>
      </div>
    </div>
  )
}
