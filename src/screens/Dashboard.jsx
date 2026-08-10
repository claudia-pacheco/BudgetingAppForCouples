import { useState } from 'react'

export default function Dashboard({ onNavigate, categories }) {
  const [activeTab, setActiveTab] = useState('home')

  const totalBudget = categories.reduce((s, c) => s + c.budget, 0)
  const totalSpent = categories.reduce((s, c) => s + c.spent, 0)
  const remaining = totalBudget - totalSpent

  return (
    <div className="dashboard-root">
      {/* Status bar placeholder */}
      <div className="status-bar">
        <span className="status-time">9:41</span>
        <div className="status-icons">
          <SignalIcon />
          <BatteryIcon />
        </div>
      </div>

      {/* Scrollable content */}
      <div className="dashboard-scroll">
        {/* Header */}
        <div className="dashboard-header">
          <div className="dashboard-header-row">
            <div>
              <h1 className="dashboard-month">
                August 2025
              </h1>
            </div>
            <div className="avatar-bubbles">
              <div className="paired-badge">
                PAIR'd ♥ with Samuel
              </div>
            </div>
          </div>
        </div>

        {/* Balance card */}
        <div className="balance-card-wrapper">
          <div className="balance-card">
            <div className="balance-card-glow" />
            <p className="balance-label">
              Monthly balance
            </p>
            <p className="balance-amount">
              £{totalSpent.toLocaleString('en-GB', { minimumFractionDigits: 2 })}
            </p>
            <p className="balance-trend">
              ↑ £{(totalSpent * 0.12).toFixed(0)} more than last month
            </p>

            {/* Mini spark chart */}
            <SparkChart />

            <div className="balance-stats-row">
              <Stat label="Budget" value={`£${totalBudget}`} color="#8B9EC7" />
              <Stat label="Spent" value={`£${totalSpent}`} color="#FF8C42" />
              <Stat label="Left" value={`£${remaining}`} color="#4ECDC4" />
            </div>
          </div>
        </div>

        {/* Overall progress bar */}
        <div className="overall-progress">
          <div className="overall-progress-row">
            <span className="progress-label">Overall spending</span>
            <span className="progress-pct">
              {Math.round((totalSpent / totalBudget) * 100)}%
            </span>
          </div>
          <ProgressBar value={totalSpent / totalBudget} color="#4ECDC4" height={8} />
        </div>

        {/* Categories */}
        <div className="categories-section">
          <div className="section-header">
            <h2 className="section-title">
              Budgets
            </h2>
            <button
              onClick={() => onNavigate({ id: 'overview' })}
              className="btn-view-all"
            >
              View all
            </button>
          </div>
          <div className="categories-list">
            {categories.map(cat => (
              <CategoryCard key={cat.slug} category={cat} onClick={() => onNavigate({ id: 'category', slug: cat.slug })} />
            ))}
          </div>
        </div>

        {/* Recent activity */}
        <div className="activity-section">
          <h2 className="section-title-activity">
            Recent activity
          </h2>
          <div className="activity-list">
            {[
              { who: 'Claudia', merchant: 'Waitrose', amount: 92.34, cat: '🛒', date: 'Today', color: '#4ECDC4' },
              { who: 'Samuel', merchant: 'TfL Oyster', amount: 47.00, cat: '🚇', date: 'Today', color: '#FF4F5E' },
              { who: 'Claudia', merchant: 'Dishoom', amount: 68.50, cat: '🍽️', date: 'Yesterday', color: '#C6F135' },
              { who: 'Samuel', merchant: 'EasyJet', amount: 380.00, cat: '🌴', date: '30 Jul', color: '#FF8C42' },
            ].map((item, i) => (
              <div key={i} className="activity-item">
                <div
                  className="activity-icon"
                  style={{
                    background: `${item.color}18`,
                    border: `1px solid ${item.color}30`,
                  }}
                >
                  {item.cat}
                </div>
                <div className="activity-info">
                  <p className="activity-merchant">
                    {item.merchant}
                  </p>
                  <p className="activity-meta">
                    {item.who} · {item.date}
                  </p>
                </div>
                <span className="activity-amount">
                  £{item.amount.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom nav */}
      <BottomNav activeTab={activeTab} onTab={setActiveTab} onNavigate={onNavigate} />
    </div>
  )
}

function CategoryCard({ category, onClick }) {
  const pct = category.spent / category.budget
  return (
    <button
      onClick={onClick}
      className="category-card"
    >
      <div className="category-card-top">
        <div className="category-card-left">
          <span className="category-emoji">{category.emoji}</span>
          <span className="category-name">
            {category.name}
          </span>
        </div>
        <div className="category-card-right">
          <span className="category-spent">
            £{category.spent}
          </span>
          <span className="category-budget-label">
            {' '}/ £{category.budget}
          </span>
        </div>
      </div>
      <ProgressBar value={pct} color={category.color} height={6} />
      <div className="category-card-footer">
        <span className="category-pct-label">
          {Math.round(pct * 100)}% used
        </span>
        <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: category.color }}>
          £{category.budget - category.spent} left
        </span>
      </div>
    </button>
  )
}

function ProgressBar({ value, color, height }) {
  const clamped = Math.min(1, Math.max(0, value))
  const isOverBudget = value > 0.85
  const barColor = isOverBudget ? '#FF4F5E' : color
  return (
    <div
      className="progress-bar-track"
      style={{ height: `${height}px` }}
    >
      <div
        className="progress-bar-fill"
        style={{
          width: `${clamped * 100}%`,
          background: `linear-gradient(90deg, ${barColor}cc, ${barColor})`,
        }}
      />
    </div>
  )
}

function Stat({ label, value, color }) {
  return (
    <div>
      <p className="stat-label">{label}</p>
      <p className="stat-value" style={{ color }}>{value}</p>
    </div>
  )
}

function SparkChart() {
  const points = [38, 55, 42, 67, 58, 82, 75, 91, 83]
  const max = 100
  const w = 260, h = 48
  const pts = points.map((p, i) => `${(i / (points.length - 1)) * w},${h - (p / max) * h}`)
  const path = `M${pts.join(' L')}`
  const area = `${path} L${w},${h} L0,${h} Z`
  return (
    <div className="spark-chart-wrapper">
      <svg width={w} height={h} className="spark-chart-svg">
        <defs>
          <linearGradient id="spark" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4ECDC4" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#4ECDC4" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={area} fill="url(#spark)" />
        <path d={path} fill="none" stroke="#4ECDC4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        {/* Last point dot */}
        <circle cx={(8 / 8) * w} cy={h - (points[8] / max) * h} r="4" fill="#4ECDC4" />
      </svg>
    </div>
  )
}

function AvatarBubble({ letter, color }) {
  return (
    <div
      className="avatar-bubble"
      style={{
        background: `${color}20`,
        border: `2px solid ${color}`,
        color,
      }}
    >
      {letter}
    </div>
  )
}

function BottomNav({ activeTab, onTab, onNavigate }) {
  const tabs = [
    { id: 'home', label: 'Home', icon: '⌂' },
    { id: 'budgets', label: 'Budgets', icon: '◎' },
    { id: 'pots', label: 'Pots', icon: '🪴' },
    { id: 'profile', label: 'Profile', icon: '◉' },
  ]
  return (
    <div className="bottom-nav">
      {tabs.map(tab => {
        const active = activeTab === tab.id
        return (
          <button
            key={tab.id}
            onClick={() => {
              if (tab.id === 'profile') { onNavigate({ id: 'settings' }); return }
              if (tab.id === 'budgets') { onNavigate({ id: 'overview' }); return }
              if (tab.id === 'pots') { onNavigate({ id: 'pots' }); return }
              onTab(tab.id)
            }}
            className="bottom-nav-btn"
          >
            <span
              className="bottom-nav-icon"
              style={{ opacity: active ? 1 : 0.4, filter: active ? 'none' : 'grayscale(1)' }}
            >
              {tab.icon}
            </span>
            <span
              className="bottom-nav-label"
              style={{
                fontWeight: active ? 600 : 400,
                color: active ? '#4ECDC4' : '#8B9EC7',
              }}
            >
              {tab.label}
            </span>
            {active && (
              <div className="bottom-nav-dot" />
            )}
          </button>
        )
      })}
    </div>
  )
}

function SignalIcon() {
  return (
    <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
      <rect x="0" y="8" width="3" height="4" rx="1" fill="#F0F4FF" opacity="0.9" />
      <rect x="4.5" y="5" width="3" height="7" rx="1" fill="#F0F4FF" opacity="0.9" />
      <rect x="9" y="2" width="3" height="10" rx="1" fill="#F0F4FF" opacity="0.9" />
      <rect x="13.5" y="0" width="2.5" height="12" rx="1" fill="#F0F4FF" opacity="0.9" />
    </svg>
  )
}

function BatteryIcon() {
  return (
    <svg width="22" height="12" viewBox="0 0 22 12" fill="none">
      <rect x="0.5" y="0.5" width="18" height="11" rx="3" stroke="#F0F4FF" strokeOpacity="0.6" />
      <rect x="2" y="2" width="13" height="8" rx="1.5" fill="#F0F4FF" opacity="0.9" />
      <rect x="19" y="4" width="2.5" height="4" rx="1.25" fill="#F0F4FF" opacity="0.5" />
    </svg>
  )
}
