// ============================================================
// Signup Page
// ============================================================
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

export default function Signup() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  const validate = () => {
    if (!form.name.trim() || form.name.length < 2) return 'Name must be at least 2 characters'
    if (!/\S+@\S+\.\S+/.test(form.email)) return 'Please enter a valid email'
    if (form.password.length < 6) return 'Password must be at least 6 characters'
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validationError = validate()
    if (validationError) { setError(validationError); return }

    setLoading(true)
    try {
      const { data } = await axios.post('/auth/signup', form)
      login(data.user, data.token)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed')
    } finally {
      setLoading(false)
    }
  }

  // Password strength indicator
  const getPasswordStrength = () => {
    const p = form.password
    if (p.length === 0) return { label: '', color: '', width: '0%' }
    if (p.length < 6) return { label: 'Too short', color: 'bg-red-500', width: '25%' }
    if (p.length < 8) return { label: 'Weak', color: 'bg-amber-500', width: '50%' }
    if (p.length < 12) return { label: 'Good', color: 'bg-emerald-500', width: '75%' }
    return { label: 'Strong', color: 'bg-shield-500', width: '100%' }
  }

  const strength = getPasswordStrength()

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-shield-500/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-shield-600/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md animate-slide-up">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-shield-500/10 border border-shield-500/20 mb-4">
            <span className="text-3xl">🛡️</span>
          </div>
          <h1 className="text-3xl font-display font-bold text-white">ScamShield</h1>
          <p className="text-gray-400 mt-1 text-sm">Join the community fighting job fraud</p>
        </div>

        <div className="card">
          <h2 className="text-xl font-display font-semibold text-white mb-6">Create your account</h2>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl px-4 py-3 mb-5 flex items-center gap-2">
              <span>⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Full name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Ravi Kumar"
                className="input-field"
                autoComplete="name"
              />
            </div>
            <div>
              <label className="label">Email address</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="input-field"
                autoComplete="email"
              />
            </div>
            <div>
              <label className="label">Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Min. 6 characters"
                className="input-field"
                autoComplete="new-password"
              />
              {/* Password strength bar */}
              {form.password.length > 0 && (
                <div className="mt-2">
                  <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${strength.color}`}
                      style={{ width: strength.width }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{strength.label}</p>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full mt-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account...
                </>
              ) : (
                <> 🚀 Create Account </>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-shield-400 hover:text-shield-300 font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </div>

        {/* Trust badges */}
        <div className="mt-4 flex items-center justify-center gap-6 text-xs text-gray-600">
          <span>🔒 Encrypted</span>
          <span>•</span>
          <span>🛡️ Secure</span>
          <span>•</span>
          <span>✅ Free forever</span>
        </div>
      </div>
    </div>
  )
}
