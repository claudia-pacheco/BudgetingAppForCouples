export default function CategoryDetail({ category, onNavigate }) {
  const pct = category.spent / category.budget
  const remaining = category.budget - category.spent
  const claudiaSpent = category.activities.filter(a => a.who === 'claudia').reduce((s, a) => s + a.amount, 0)
  const samuelSpent = category.activities.filter(a => a.who === 'samuel').reduce((s, a) => s + a.amount, 0)

  return (
    <div className="category-detail-root">
      {/* Header */}
      <div
        className="category-detail-header"
        style={{ background: `linear-gradient(160deg, ${category.color}18 0%, #0B1120 60%)` }}
      >
        <button
          onClick={() => onNavigate({ id: 'dashboard' })}
          className="back-btn"
        >
          ←
        </button>

        <div className="category-detail-header-row">
          <div>
            <div className="category-detail-title-group">
              <span className="category-detail-emoji">{category.emoji}</span>
              <span className="category-detail-budget-label">
                Monthly budget
              </span>
            </div>
            <h1 className="category-detail-budget-amount">
              £{category.budget.toFixed(2)}
            </h1>
            <p style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '14px',
              color: pct > 0.85 ? '#FF4F5E' : category.color,
              margin: '8px 0 0',
            }}>
              {pct > 0.85 ? '⚠️' : '✓'} £{category.spent} spent · £{remaining} remaining
            </p>
          </div>

          {/* Radial progress */}
          <RadialProgress value={pct} color={category.color} />
        </div>

        {/* Progress bar */}
        <div className="category-detail-progress-wrap">
          <div className="category-detail-progress-track">
            <div
              className="category-detail-progress-fill"
              style={{
                width: `${Math.min(pct, 1) * 100}%`,
                background: `linear-gradient(90deg, ${category.color}99, ${category.color})`,
              }}
            />
          </div>
          <div className="category-detail-progress-labels">
            <span className="progress-endpoint-label">£0</span>
            <span className="progress-endpoint-label">£{category.budget}</span>
          </div>
        </div>
      </div>

      {/* Scrollable body */}
      <div className="category-detail-body">
        {/* Spending insights */}
        <div className="insights-section">
          <h2 className="section-title-sm">
            Spending insights
          </h2>
          <div className="insights-card">
            <div className="insights-row">
              <InsightCard
                label="Claudia"
                amount={claudiaSpent}
                color="#4ECDC4"
                pct={claudiaSpent / category.spent}
              />
              <InsightCard
                label="Samuel"
                amount={samuelSpent}
                color="#C6F135"
                pct={samuelSpent / category.spent}
              />
            </div>
            <p className="insights-note">
              {claudiaSpent > samuelSpent
                ? `You spend £${(claudiaSpent - samuelSpent).toFixed(0)} more than Samuel. Nice work keeping track!`
                : `Samuel spends £${(samuelSpent - claudiaSpent).toFixed(0)} more than you this month.`}
            </p>
          </div>
        </div>

        {/* Category info */}
        <div className="category-info-section">
          <div className="info-grid">
            <InfoItem label="Reset date" value="30 Aug 2025" />
            <InfoItem label="You split" value="50 / 50" />
            <InfoItem label="Transactions" value={`${category.activities.length} this month`} />
            <InfoItem label="Trend" value={pct < 0.8 ? '↓ Under budget' : '↑ Watch spend'} color={pct < 0.8 ? '#4ECDC4' : '#FF8C42'} />
          </div>
        </div>

        {/* Activity */}
        <div className="insights-section">
          <h2 className="section-title-sm">
            Activity
          </h2>
          <div className="detail-activity-list">
            {category.activities.map((act, i) => (
              <div key={i} className="detail-activity-item">
                <AvatarDot who={act.who} />
                <div className="detail-activity-info">
                  <p className="detail-activity-merchant">
                    {act.merchant}
                  </p>
                  <p className="detail-activity-meta">
                    {act.name} · {act.date}
                  </p>
                </div>
                <div className="detail-activity-amount-wrap">
                  <span className={act.who === 'claudia' ? 'activity-amount-claudia' : 'activity-amount-samuel'}>
                    +£{act.amount.toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add transaction */}
        <div className="add-transaction-section">
          <button
            className="btn-add-transaction"
            style={{
              background: `${category.color}15`,
              border: `1px dashed ${category.color}40`,
              color: category.color,
            }}
          >
            + Add transaction
          </button>
        </div>
      </div>
    </div>
  )
}

function RadialProgress({ value, color }) {
  const r = 28, cx = 34, cy = 34
  const circumference = 2 * Math.PI * r
  const offset = circumference - Math.min(value, 1) * circumference
  return (
    <svg width={68} height={68} className="radial-progress">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={6} />
      <circle
        cx={cx} cy={cy} r={r} fill="none"
        stroke={color} strokeWidth={6}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform={`rotate(-90 ${cx} ${cy})`}
      />
      <text x={cx} y={cy + 5} textAnchor="middle" fill={color} className="radial-progress-text">
        {Math.round(value * 100)}%
      </text>
    </svg>
  )
}

function InsightCard({ label, amount, color, pct }) {
  return (
    <div
      className="insight-card"
      style={{
        background: `${color}10`,
        border: `1px solid ${color}20`,
      }}
    >
      <p className="insight-card-label">{label}</p>
      <p className="insight-card-amount" style={{ color }}>
        £{amount.toFixed(0)}
      </p>
      <div className="insight-card-bar-track">
        <div
          className="insight-card-bar-fill"
          style={{ width: `${pct * 100}%`, background: color }}
        />
      </div>
    </div>
  )
}

function InfoItem({ label, value, color = '#F0F4FF' }) {
  return (
    <div>
      <p className="info-item-label">{label}</p>
      <p className="info-item-value" style={{ color }}>{value}</p>
    </div>
  )
}

function AvatarDot({ who }) {
  const color = who === 'claudia' ? '#4ECDC4' : '#C6F135'
  const letter = who === 'claudia' ? 'C' : 'S'
  return (
    <div
      className="avatar-dot"
      style={{
        background: `${color}18`,
        border: `1.5px solid ${color}`,
        color,
      }}
    >
      {letter}
    </div>
  )
}
