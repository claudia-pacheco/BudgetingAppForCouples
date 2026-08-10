import { useState } from 'react'
import Onboarding from './screens/Onboarding'
import Dashboard from './screens/Dashboard'
import CategoryDetail from './screens/CategoryDetail'
import BudgetOverview from './screens/BudgetOverview'
import Settings from './screens/Settings'
import Pots, { SAVINGS, DEBTS } from './screens/Pots'
import PotDetail from './screens/PotDetail'
import CreateAccount from './screens/CreateAccount'
import Login from './screens/Login'
import { ThemeProvider } from './ThemeContext'

export const CATEGORIES = [
  {
    slug: 'groceries',
    name: 'Groceries',
    emoji: '🛒',
    budget: 420,
    spent: 350,
    color: '#4ECDC4',
    partnerA: 'Claudia',
    partnerB: 'Samuel',
    activities: [
      { name: 'Claudia', amount: 92.34, date: '3 Aug', who: 'claudia', merchant: 'Waitrose' },
      { name: 'Samuel', amount: 78.16, date: '1 Aug', who: 'samuel', merchant: 'Tesco' },
      { name: 'Claudia', amount: 55.21, date: '28 Jul', who: 'claudia', merchant: "Sainsbury's" },
      { name: 'Samuel', amount: 41.28, date: '25 Jul', who: 'samuel', merchant: 'Aldi' },
      { name: 'Claudia', amount: 83.01, date: '20 Jul', who: 'claudia', merchant: 'Ocado' },
    ],
  },
  {
    slug: 'holiday',
    name: 'Holiday',
    emoji: '🌴',
    budget: 950,
    spent: 612,
    color: '#FF8C42',
    partnerA: 'Claudia',
    partnerB: 'Samuel',
    activities: [
      { name: 'Samuel', amount: 380, date: '30 Aug', who: 'samuel', merchant: 'EasyJet' },
      { name: 'Claudia', amount: 145, date: '28 Aug', who: 'claudia', merchant: 'Booking.com' },
      { name: 'Samuel', amount: 87, date: '15 Aug', who: 'samuel', merchant: 'Airbnb' },
    ],
  },
  {
    slug: 'dining',
    name: 'Dining Out',
    emoji: '🍽️',
    budget: 280,
    spent: 196,
    color: '#C6F135',
    partnerA: 'Claudia',
    partnerB: 'Samuel',
    activities: [
      { name: 'Claudia', amount: 68.5, date: '2 Aug', who: 'claudia', merchant: 'Dishoom' },
      { name: 'Samuel', amount: 44.2, date: '29 Jul', who: 'samuel', merchant: 'Ottolenghi' },
      { name: 'Claudia', amount: 83.3, date: '22 Jul', who: 'claudia', merchant: 'Padella' },
    ],
  },
  {
    slug: 'transport',
    name: 'Transport',
    emoji: '🚇',
    budget: 180,
    spent: 94,
    color: '#FF4F5E',
    partnerA: 'Claudia',
    partnerB: 'Samuel',
    activities: [
      { name: 'Samuel', amount: 47, date: '1 Aug', who: 'samuel', merchant: 'TfL Oyster' },
      { name: 'Claudia', amount: 47, date: '1 Aug', who: 'claudia', merchant: 'TfL Oyster' },
    ],
  },
]

export default function App() {
  const [screen, setScreen] = useState({ id: 'onboarding' })

  const navigate = (s) => setScreen(s)
  const currentCategory = screen.id === 'category'
    ? CATEGORIES.find(c => c.slug === screen.slug) ?? null
    : null
  const currentPot = screen.id === 'pot-detail'
    ? (screen.type === 'savings' ? SAVINGS : DEBTS).find(p => p.slug === screen.slug) ?? null
    : null

  return (
    <ThemeProvider>
      <div className="app-root">
        {/* Mobile frame */}
        <div className="mobile-frame">
          {screen.id === 'onboarding' && (
            <Onboarding onNavigate={navigate} />
          )}
          {screen.id === 'create-account' && (
            <CreateAccount onNavigate={navigate} />
          )}
          {screen.id === 'login' && (
            <Login onNavigate={navigate} />
          )}
          {screen.id === 'dashboard' && (
            <Dashboard onNavigate={navigate} categories={CATEGORIES} />
          )}
          {screen.id === 'category' && currentCategory && (
            <CategoryDetail category={currentCategory} onNavigate={navigate} />
          )}
          {screen.id === 'overview' && (
            <BudgetOverview categories={CATEGORIES} onNavigate={navigate} />
          )}
          {screen.id === 'settings' && (
            <Settings onNavigate={navigate} />
          )}
          {screen.id === 'pots' && (
            <Pots onNavigate={navigate} />
          )}
          {screen.id === 'pot-detail' && currentPot && (
            <PotDetail pot={currentPot} type={screen.type} onNavigate={navigate} />
          )}
        </div>
      </div>
    </ThemeProvider>
  )
}
