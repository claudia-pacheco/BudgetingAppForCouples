import { useTheme } from '../ThemeContext'

export default function Settings({ onNavigate }) {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <div className="settings-root">
      <div className="settings-header">
        <button className="back-btn" onClick={() => onNavigate({ id: 'dashboard' })}>←</button>
        <h1 className="settings-title">Settings</h1>
      </div>

      <div className="settings-body">
        {/* Profile section */}
        <div className="settings-section-label">Profile</div>
        <div className="settings-card">
          <div className="settings-profile-row">
            <div className="settings-avatar" style={{ background: 'rgba(0,136,166,0.2)', border: '2px solid #0088A6', color: '#0088A6' }}>C</div>
            <div className="settings-profile-info">
              <p className="settings-profile-name">Claudia</p>
              <p className="settings-profile-sub">claudia@example.com</p>
            </div>
          </div>
          <div className="settings-divider" />
          <div className="settings-partner-row">
            <div className="settings-avatar settings-avatar-sm" style={{ background: 'rgba(255,79,64,0.2)', border: '2px solid #FF4F40', color: '#FF4F40' }}>S</div>
            <div className="settings-profile-info">
              <p className="settings-profile-name">Samuel</p>
              <p className="settings-profile-sub">PAIR'd partner</p>
            </div>
            <span className="paired-badge">PAIR'd ♥</span>
          </div>
        </div>

        {/* Appearance */}
        <div className="settings-section-label">Appearance</div>
        <div className="settings-card">
          <div className="settings-row">
            <div className="settings-row-left">
              <span className="settings-row-icon">🌙</span>
              <div>
                <p className="settings-row-label">Dark mode</p>
                <p className="settings-row-sub">Switch between light and dark</p>
              </div>
            </div>
            <button
              className={`theme-toggle ${isDark ? 'theme-toggle--on' : 'theme-toggle--off'}`}
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              <div className="theme-toggle-thumb" />
            </button>
          </div>
        </div>

        {/* Preferences */}
        <div className="settings-section-label">Preferences</div>
        <div className="settings-card">
          {[
            { icon: '🔔', label: 'Notifications', sub: 'Budget alerts & reminders' },
            { icon: '💷', label: 'Currency', sub: 'British Pound (GBP)' },
            { icon: '📅', label: 'Budget reset day', sub: '1st of every month' },
          ].map((item, i, arr) => (
            <div key={item.label}>
              <div className="settings-row">
                <div className="settings-row-left">
                  <span className="settings-row-icon">{item.icon}</span>
                  <div>
                    <p className="settings-row-label">{item.label}</p>
                    <p className="settings-row-sub">{item.sub}</p>
                  </div>
                </div>
                <span className="settings-chevron">›</span>
              </div>
              {i < arr.length - 1 && <div className="settings-divider" />}
            </div>
          ))}
        </div>

        {/* Account */}
        <div className="settings-section-label">Account</div>
        <div className="settings-card">
          <button className="settings-danger-btn">Sign out</button>
        </div>
      </div>
    </div>
  )
}
