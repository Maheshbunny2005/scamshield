// ============================================================
// ReportScamTab – Submit a manual scam report
// ============================================================
import { useState } from 'react'
import axios from 'axios'

const INITIAL_FORM = {
  companyName: '',
  jobDescription: '',
  salary: '',
  contactEmail: '',
  jobLink: '',
  reportType: 'job_post',
}

const REPORT_TYPES = [
  { value: 'job_post',       label: '💼 Fake Job Post' },
  { value: 'scam_call',      label: '📞 Scam Call' },
  { value: 'phishing_email', label: '📧 Phishing Email' },
  { value: 'fake_website',   label: '🌐 Fake Website' },
  { value: 'other',          label: '❓ Other' },
]

export default function ReportScamTab() {
  const [form, setForm] = useState(INITIAL_FORM)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.companyName.trim() || !form.jobDescription.trim()) {
      setError('Company name and description are required')
      return
    }
    setLoading(true)
    try {
      await axios.post('/job/report', form)
      setSuccess(true)
      setForm(INITIAL_FORM)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit report')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="max-w-xl mx-auto">
        <div className="card text-center py-14 animate-slide-up">
          <div className="text-5xl mb-5">🎯</div>
          <h3 className="text-xl font-display font-bold text-white mb-2">Report Submitted!</h3>
          <p className="text-gray-400 text-sm mb-8">
            Thank you for helping protect other job seekers. Your report has been added to the community database.
          </p>
          <button onClick={() => setSuccess(false)} className="btn-primary mx-auto">
            📢 Submit Another Report
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-display font-bold text-white mb-2">📢 Report a Scam</h2>
        <p className="text-gray-400 text-sm">
          Encountered a fake job, scam call, or phishing attempt? Report it to warn the community.
        </p>
      </div>

      {/* Impact banner */}
      <div className="flex items-center gap-4 bg-shield-500/5 border border-shield-500/10 rounded-xl p-4 mb-6">
        <span className="text-2xl">🛡️</span>
        <p className="text-sm text-gray-300">
          Every report you submit helps protect thousands of job seekers from falling into the same trap.
          Your identity is never publicly disclosed.
        </p>
      </div>

      <div className="card">
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl px-4 py-3 mb-5 flex items-center gap-2">
            <span>⚠️</span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Report type */}
          <div>
            <label className="label">Type of Scam *</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {REPORT_TYPES.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setForm({ ...form, reportType: type.value })}
                  className={`text-sm px-3 py-2.5 rounded-xl border transition-all text-left ${
                    form.reportType === type.value
                      ? 'bg-shield-500/10 border-shield-500/30 text-shield-300'
                      : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="label">Company / Person Name *</label>
              <input
                type="text"
                name="companyName"
                value={form.companyName}
                onChange={handleChange}
                placeholder="e.g. Fake TCS HR"
                className="input-field"
              />
            </div>
            <div>
              <label className="label">Offered Salary (if any)</label>
              <input
                type="text"
                name="salary"
                value={form.salary}
                onChange={handleChange}
                placeholder="e.g. ₹80,000/day"
                className="input-field"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="label">Scammer's Email</label>
              <input
                type="email"
                name="contactEmail"
                value={form.contactEmail}
                onChange={handleChange}
                placeholder="scammer@suspicious.com"
                className="input-field"
              />
            </div>
            <div>
              <label className="label">Scam Link / Website</label>
              <input
                type="url"
                name="jobLink"
                value={form.jobLink}
                onChange={handleChange}
                placeholder="https://fake-jobs.com/..."
                className="input-field"
              />
            </div>
          </div>

          <div>
            <label className="label">Describe the Scam *</label>
            <textarea
              name="jobDescription"
              value={form.jobDescription}
              onChange={handleChange}
              rows={5}
              placeholder="Describe what happened. What made you suspect this was a scam? Include any details about how they contacted you, what they asked for, etc."
              className="input-field resize-none"
            />
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Submitting...
              </>
            ) : (
              <> 🚨 Submit Scam Report </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
