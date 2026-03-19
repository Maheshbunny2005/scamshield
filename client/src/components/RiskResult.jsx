// ============================================================
// RiskResult Component – displays analysis output
// ============================================================

const riskConfig = {
  Low: {
    badge: 'badge-low',
    bar: 'bg-emerald-500',
    border: 'border-emerald-500/20',
    bg: 'bg-emerald-500/5',
    icon: '✅',
    label: 'LOW RISK',
  },
  Medium: {
    badge: 'badge-medium',
    bar: 'bg-amber-500',
    border: 'border-amber-500/20',
    bg: 'bg-amber-500/5',
    icon: '⚠️',
    label: 'MEDIUM RISK',
  },
  High: {
    badge: 'badge-high',
    bar: 'bg-red-500',
    border: 'border-red-500/20',
    bg: 'bg-red-500/5',
    icon: '🚨',
    label: 'HIGH RISK',
  },
}

export default function RiskResult({ result }) {
  if (!result) return null
  const { riskScore, riskPercentage, flags, explanation } = result
  const config = riskConfig[riskScore] || riskConfig.Low

  return (
    <div className={`rounded-2xl border ${config.border} ${config.bg} p-6 mt-6 animate-slide-up`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{config.icon}</span>
          <div>
            <div className="text-xs font-mono text-gray-500 mb-0.5">ANALYSIS RESULT</div>
            <span className={config.badge}>{config.label}</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-3xl font-display font-bold text-white">{riskPercentage}%</div>
          <div className="text-xs text-gray-500">risk score</div>
        </div>
      </div>

      {/* Risk meter */}
      <div className="mb-5">
        <div className="flex justify-between text-xs text-gray-600 mb-1.5">
          <span>Safe</span>
          <span>Dangerous</span>
        </div>
        <div className="h-2.5 bg-gray-800 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full risk-bar ${config.bar}`}
            style={{ width: `${riskPercentage}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-700 mt-1">
          <span>0</span>
          <span>50</span>
          <span>100</span>
        </div>
      </div>

      {/* Explanation */}
      <p className="text-sm text-gray-300 leading-relaxed mb-4 bg-gray-900/50 rounded-xl p-3 border border-gray-800">
        {explanation}
      </p>

      {/* Flags */}
      {flags && flags.length > 0 && (
        <div>
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Detected Red Flags ({flags.length})
          </h4>
          <ul className="space-y-2">
            {flags.map((flag, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-sm text-gray-300 bg-gray-900/60 rounded-lg px-3 py-2 border border-gray-800"
              >
                <span className="mt-0.5 shrink-0">›</span>
                {flag}
              </li>
            ))}
          </ul>
        </div>
      )}

      {flags && flags.length === 0 && (
        <div className="text-sm text-emerald-400 flex items-center gap-2">
          <span>✓</span> No red flags detected
        </div>
      )}
    </div>
  )
}
