// ============================================================
// ReportsTab – Displays all community reported scams
// ============================================================
import { useState, useEffect } from 'react'
import axios from 'axios'

const riskBadge = {
  Low:    'badge-low',
  Medium: 'badge-medium',
  High:   'badge-high',
}

const reportTypeLabel = {
  job_post:       '💼 Fake Job Post',
  scam_call:      '📞 Scam Call',
  phishing_email: '📧 Phishing Email',
  fake_website:   '🌐 Fake Website',
  other:          '❓ Other',
}

function StarRating({ reportId, currentRating, onRate }) {
  const [hover, setHover] = useState(0)

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => onRate(reportId, star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          className="text-lg transition-transform hover:scale-110"
        >
          <span className={star <= (hover || currentRating) ? 'text-amber-400' : 'text-gray-700'}>
            ★
          </span>
        </button>
      ))}
      {currentRating > 0 && (
        <span className="text-xs text-gray-500 ml-1">{currentRating}/5</span>
      )}
    </div>
  )
}

export default function ReportsTab() {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('all')

  const fetchReports = async () => {
    try {
      const { data } = await axios.get('/job/reports')
      setReports(data.reports)
    } catch (err) {
      setError('Failed to load reports')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchReports() }, [])

  const handleRate = async (reportId, rating) => {
    try {
      const { data } = await axios.post('/job/rate', { reportId, rating })
      setReports((prev) =>
        prev.map((r) =>
          r._id === reportId ? { ...r, averageRating: data.averageRating } : r
        )
      )
    } catch (err) {
      console.error('Rating failed')
    }
  }

  const filtered = filter === 'all'
    ? reports
    : reports.filter((r) => r.riskScore === filter)

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-3 border-shield-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-500 text-sm">Loading community reports...</p>
      </div>
    </div>
  )

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-display font-bold text-white mb-1">🚨 Community Reports</h2>
          <p className="text-gray-400 text-sm">{reports.length} scams reported by our community</p>
        </div>
        {/* Filter */}
        <div className="flex items-center gap-2">
          {['all', 'High', 'Medium', 'Low'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filter === f
                  ? 'bg-shield-500/10 text-shield-400 border border-shield-500/20'
                  : 'text-gray-500 hover:text-gray-300 border border-gray-800 hover:border-gray-700'
              }`}
            >
              {f === 'all' ? 'All' : f}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl px-4 py-3 mb-5">
          ⚠️ {error}
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="card text-center py-16">
          <div className="text-5xl mb-4">🎉</div>
          <h3 className="text-lg font-semibold text-gray-300 mb-2">No reports found</h3>
          <p className="text-gray-500 text-sm">
            {filter === 'all' ? 'Be the first to report a scam!' : `No ${filter}-risk reports yet.`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((report) => (
            <div
              key={report._id}
              className="card-hover animate-fade-in"
            >
              {/* Card header */}
              <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gray-800 border border-gray-700 flex items-center justify-center text-lg shrink-0">
                    🏢
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{report.companyName}</h3>
                    <p className="text-xs text-gray-500">
                      Reported by {report.userName} · {new Date(report.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className={riskBadge[report.riskScore]}>
                    {report.riskScore === 'High' ? '🚨' : report.riskScore === 'Medium' ? '⚠️' : '✅'}{' '}
                    {report.riskScore} Risk
                  </span>
                  {report.isUserReport && (
                    <span className="text-xs bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2 py-0.5 rounded-full">
                      {reportTypeLabel[report.reportType] || 'Reported'}
                    </span>
                  )}
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-400 line-clamp-2 mb-3">
                {report.jobDescription}
              </p>

              {/* Flags */}
              {report.flags && report.flags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {report.flags.slice(0, 3).map((flag, i) => (
                    <span key={i} className="text-xs bg-gray-800 text-gray-400 px-2 py-1 rounded-lg border border-gray-700">
                      {flag.split('"')[0].trim()}
                    </span>
                  ))}
                  {report.flags.length > 3 && (
                    <span className="text-xs text-gray-600">+{report.flags.length - 3} more</span>
                  )}
                </div>
              )}

              {/* Footer */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-gray-800">
                <div className="flex items-center gap-4">
                  {report.salary && (
                    <span className="text-xs text-gray-500">💰 {report.salary}</span>
                  )}
                  {report.contactEmail && (
                    <span className="text-xs text-gray-500 font-mono truncate max-w-[150px]">
                      📧 {report.contactEmail}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-600">Trust score:</span>
                  <StarRating
                    reportId={report._id}
                    currentRating={report.averageRating || 0}
                    onRate={handleRate}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
