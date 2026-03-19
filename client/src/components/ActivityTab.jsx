// ============================================================
// ActivityTab – Current user's activity and reports
// ============================================================
import { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

const riskBadge = {
  Low:    'badge-low',
  Medium: 'badge-medium',
  High:   'badge-high',
}

export default function ActivityTab() {
  const { user } = useAuth()
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get('/job/my-reports')
      .then(({ data }) => setReports(data.reports))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const stats = {
    total: reports.length,
    high: reports.filter((r) => r.riskScore === 'High').length,
    medium: reports.filter((r) => r.riskScore === 'Medium').length,
    low: reports.filter((r) => r.riskScore === 'Low').length,
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Welcome banner */}
      <div className="mb-8 p-6 rounded-2xl bg-gradient-to-br from-shield-500/10 to-gray-900 border border-shield-500/20">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-shield-500/20 border border-shield-500/30 flex items-center justify-center text-2xl font-bold text-shield-400 font-display">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-display font-bold text-white">
              Welcome back, {user?.name?.split(' ')[0]}! 👋
            </h2>
            <p className="text-gray-400 text-sm mt-0.5">{user?.email}</p>
            <p className="text-shield-400 text-xs mt-1">
              🛡️ ScamShield Community Member
            </p>
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Analyses', value: stats.total, icon: '📊', color: 'text-white' },
          { label: 'High Risk', value: stats.high, icon: '🚨', color: 'text-red-400' },
          { label: 'Medium Risk', value: stats.medium, icon: '⚠️', color: 'text-amber-400' },
          { label: 'Low Risk', value: stats.low, icon: '✅', color: 'text-emerald-400' },
        ].map((stat) => (
          <div key={stat.label} className="card text-center">
            <div className="text-2xl mb-1">{stat.icon}</div>
            <div className={`text-3xl font-display font-bold ${stat.color}`}>{stat.value}</div>
            <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Reports list */}
      <div>
        <h3 className="text-lg font-display font-semibold text-white mb-4">
          📋 Your Recent Analyses
        </h3>

        {loading ? (
          <div className="text-center py-12 text-gray-500">
            <div className="w-8 h-8 border-2 border-shield-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            Loading your activity...
          </div>
        ) : reports.length === 0 ? (
          <div className="card text-center py-14">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-lg font-semibold text-gray-300 mb-2">No analyses yet</h3>
            <p className="text-gray-500 text-sm">
              Use the "Verify Job" tab to analyze your first job posting.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {reports.map((report) => (
              <div key={report._id} className="card-hover flex items-start gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 ${
                  report.riskScore === 'High' ? 'bg-red-500/10' :
                  report.riskScore === 'Medium' ? 'bg-amber-500/10' : 'bg-emerald-500/10'
                }`}>
                  {report.riskScore === 'High' ? '🚨' : report.riskScore === 'Medium' ? '⚠️' : '✅'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                    <h4 className="font-medium text-white truncate">{report.companyName}</h4>
                    <span className={riskBadge[report.riskScore]}>
                      {report.riskScore} Risk · {report.riskPercentage}%
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 line-clamp-1 mb-2">{report.jobDescription}</p>
                  <div className="flex flex-wrap gap-3 text-xs text-gray-600">
                    {report.flags?.length > 0 && (
                      <span>🚩 {report.flags.length} red flag{report.flags.length !== 1 ? 's' : ''}</span>
                    )}
                    {report.salary && <span>💰 {report.salary}</span>}
                    <span>🕒 {new Date(report.createdAt).toLocaleDateString('en-IN')}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Safety tips */}
      <div className="mt-8 card border-shield-500/10">
        <h4 className="font-display font-semibold text-white mb-4">🔐 Safety Reminders</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            'Never pay any fee to apply for a job',
            'Verify company on official websites',
            'Don\'t share Aadhaar / PAN before joining',
            'Legitimate jobs don\'t ask for bank details upfront',
            'Be cautious of WhatsApp-only recruiters',
            'Research company reviews on Glassdoor',
          ].map((tip, i) => (
            <div key={i} className="flex items-start gap-2 text-sm text-gray-400">
              <span className="text-shield-500 mt-0.5 shrink-0">›</span>
              {tip}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
