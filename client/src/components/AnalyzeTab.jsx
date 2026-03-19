// ============================================================
// AnalyzeTab – Submit job for AI scam analysis
// ============================================================
import { useState } from 'react'
import axios from 'axios'
import RiskResult from './RiskResult'

const INITIAL_FORM = {
  companyName: '',
  jobDescription: '',
  salary: '',
  contactEmail: '',
}

export default function AnalyzeTab() {
  const [form, setForm] = useState(INITIAL_FORM)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.companyName.trim() || !form.jobDescription.trim()) {
      setError('Company name and job description are required')
      return
    }
    setLoading(true)
    setResult(null)
    try {
      const { data } = await axios.post('/job/analyze', form)
      setResult(data)
    } catch (err) {
      setError(err.response?.data?.message || 'Analysis failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setForm(INITIAL_FORM)
    setResult(null)
    setError('')
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-display font-bold text-white mb-2">🕵️ Verify a Job Posting</h2>
        <p className="text-gray-400 text-sm">
          Paste the job details below. Our AI will analyze it for scam patterns and red flags instantly.
        </p>
      </div>

      <div className="card">
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl px-4 py-3 mb-5 flex items-center gap-2">
            <span>⚠️</span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="label">Company Name *</label>
              <input
                type="text"
                name="companyName"
                value={form.companyName}
                onChange={handleChange}
                placeholder="e.g. Infosys, TCS, Amazon"
                className="input-field"
              />
            </div>
            <div>
              <label className="label">Offered Salary</label>
              <input
                type="text"
                name="salary"
                value={form.salary}
                onChange={handleChange}
                placeholder="e.g. ₹50,000/month or Unlimited"
                className="input-field"
              />
            </div>
          </div>

          <div>
            <label className="label">Contact Email</label>
            <input
              type="email"
              name="contactEmail"
              value={form.contactEmail}
              onChange={handleChange}
              placeholder="recruiter@company.com"
              className="input-field"
            />
            <p className="text-xs text-gray-600 mt-1">
              We check for suspicious domains and spoofed addresses
            </p>
          </div>

          <div>
            <label className="label">Job Description *</label>
            <textarea
              name="jobDescription"
              value={form.jobDescription}
              onChange={handleChange}
              rows={6}
              placeholder="Paste the full job description here. Include all details — requirements, responsibilities, salary info, contact details, etc."
              className="input-field resize-none"
            />
            <div className="flex justify-between text-xs text-gray-600 mt-1">
              <span>More detail = more accurate analysis</span>
              <span>{form.jobDescription.split(' ').filter(Boolean).length} words</span>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex-1"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Analyzing...
                </>
              ) : (
                <> 🔍 Analyze for Scams </>
              )}
            </button>
            {result && (
              <button type="button" onClick={handleReset} className="btn-secondary">
                Reset
              </button>
            )}
          </div>
        </form>

        {/* Result */}
        <RiskResult result={result} />
      </div>

      {/* Tips */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: '💰', title: 'Unrealistic Pay', desc: 'Be wary of extremely high salaries for simple tasks' },
          { icon: '📧', title: 'Fake Domains', desc: 'Legit companies use corporate email, not Gmail/Yahoo' },
          { icon: '💸', title: 'Upfront Fees', desc: 'Never pay money to apply for any job' },
        ].map((tip) => (
          <div key={tip.title} className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
            <div className="text-xl mb-2">{tip.icon}</div>
            <div className="text-sm font-semibold text-gray-200">{tip.title}</div>
            <div className="text-xs text-gray-500 mt-1">{tip.desc}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
