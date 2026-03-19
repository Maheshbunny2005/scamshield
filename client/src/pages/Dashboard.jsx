// ============================================================
// Dashboard Page – Main app shell after login
// ============================================================
import { useState } from 'react'
import Navbar from '../components/Navbar'
import AnalyzeTab from '../components/AnalyzeTab'
import ReportsTab from '../components/ReportsTab'
import ReportScamTab from '../components/ReportScamTab'
import ActivityTab from '../components/ActivityTab'

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('analyze')

  const renderTab = () => {
    switch (activeTab) {
      case 'analyze':  return <AnalyzeTab />
      case 'reports':  return <ReportsTab />
      case 'report':   return <ReportScamTab />
      case 'activity': return <ActivityTab />
      default:         return <AnalyzeTab />
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Alert banner */}
      <div className="bg-amber-500/5 border-b border-amber-500/10 text-amber-400 text-xs text-center py-2 px-4 font-mono">
        🛡️ ScamShield uses AI-powered analysis to detect fraudulent job postings — always verify independently
      </div>

      {/* Main content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-8">
        {renderTab()}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-5 text-center text-xs text-gray-600">
        <p>🛡️ ScamShield · Protecting job seekers since 2024 · Built with ❤️ for safety</p>
      </footer>
    </div>
  )
}
