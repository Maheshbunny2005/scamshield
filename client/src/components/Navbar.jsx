// ============================================================
// Navbar Component
// ============================================================
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function Navbar({ activeTab, setActiveTab }) {
  const { user, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)

  const tabs = [
    { id: 'analyze', label: 'Verify Job', icon: '🕵️' },
    { id: 'reports', label: 'Community', icon: '🚨' },
    { id: 'report', label: 'Report Scam', icon: '📢' },
    { id: 'activity', label: 'My Activity', icon: '📊' },
  ]

  return (
    <nav className="sticky top-0 z-40 bg-gray-950/80 backdrop-blur-xl border-b border-gray-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-shield-500/10 border border-shield-500/20 flex items-center justify-center text-lg">
              🛡️
            </div>
            <div>
              <span className="font-display font-bold text-white text-lg leading-none">ScamShield</span>
              <div className="text-[10px] text-shield-400 font-mono leading-none mt-0.5">PROTECTED</div>
            </div>
          </div>

          {/* Desktop tabs */}
          <div className="hidden md:flex items-center gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-shield-500/10 text-shield-400 border border-shield-500/20'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* User info + logout */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-shield-500/20 border border-shield-500/30 flex items-center justify-center text-sm font-bold text-shield-400">
                {user?.name?.[0]?.toUpperCase()}
              </div>
              <span className="text-sm text-gray-300 font-medium hidden lg:block">{user?.name}</span>
            </div>
            <button
              onClick={logout}
              className="text-xs text-gray-500 hover:text-gray-300 border border-gray-800 hover:border-gray-600 px-3 py-1.5 rounded-lg transition-all"
            >
              Sign out
            </button>
            {/* Mobile menu button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 text-gray-400 hover:text-white"
            >
              {menuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-gray-800 py-3 flex flex-col gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setMenuOpen(false) }}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-shield-500/10 text-shield-400'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </nav>
  )
}
