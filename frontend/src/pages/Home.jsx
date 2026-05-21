import { Link } from 'react-router-dom'

const FEATURES = [
  {
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: 'Real-Time Fraud Scoring',
    desc: 'Claims are scored instantly using rule-based AI logic — no waiting, no guesswork.',
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
    title: 'Auto Claim ID Generation',
    desc: 'Every submission gets a unique Claim ID (e.g. CLM1024) for easy tracking.',
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    title: 'Admin Control Panel',
    desc: 'Admins can approve, reject or flag claims for investigation with full audit trail.',
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: 'Rapid Detection Rules',
    desc: 'High claim amounts, missing policy numbers, repeated hospitals — all caught instantly.',
  },
]

const RULES = [
  { rule: 'Claim amount > ₹5,00,000', score: '+30', color: 'text-red-600' },
  { rule: 'Missing / blank policy number', score: '+20', color: 'text-orange-600' },
  { rule: 'Same hospital has 3+ claims', score: '+15', color: 'text-amber-600' },
  { rule: 'Same policy submitted within 1 hour', score: '+35', color: 'text-red-700' },
]

const LEVELS = [
  { range: '0 – 30', level: 'LOW RISK', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
  { range: '31 – 60', level: 'MEDIUM RISK', color: 'bg-amber-100 text-amber-800 border-amber-200' },
  { range: '61 – 100', level: 'HIGH RISK', color: 'bg-red-100 text-red-800 border-red-200' },
]

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-brand-900 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-brand-800 text-brand-200 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            System Online — Real-time Analysis Active
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-5">
            AI-Powered Insurance<br />
            <span className="text-brand-300">Fraud Detection</span> System
          </h1>
          <p className="text-brand-200 text-lg max-w-2xl mx-auto mb-8">
            Submit insurance claims and receive an instant fraud risk score. Our engine
            analyses claim patterns, amounts, and submission behaviour to protect insurers
            from fraudulent claims.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/submit" className="btn-primary text-base px-8 py-3">
              Submit a Claim
            </Link>
            <Link to="/admin/login" className="btn-secondary text-base px-8 py-3">
              Admin Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-center text-slate-800 mb-10">
          How it works
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((f) => (
            <div key={f.title} className="card hover:border-brand-300 transition-colors">
              <div className="w-11 h-11 bg-brand-100 text-brand-600 rounded-xl flex items-center justify-center mb-4">
                {f.icon}
              </div>
              <h3 className="font-semibold text-slate-800 mb-2">{f.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Fraud Rules */}
      <section className="py-12 px-4 bg-slate-100">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-slate-800 mb-2">
            Fraud Detection Rules
          </h2>
          <p className="text-center text-slate-500 mb-8 text-sm">
            These rules are applied cumulatively. Max fraud score = 100.
          </p>
          <div className="grid sm:grid-cols-2 gap-4 mb-10">
            {RULES.map((r) => (
              <div key={r.rule} className="bg-white rounded-xl border border-slate-200 px-5 py-4 flex items-center justify-between">
                <span className="text-slate-700 text-sm">{r.rule}</span>
                <span className={`font-bold text-lg ${r.color}`}>{r.score}</span>
              </div>
            ))}
          </div>

          <h3 className="text-lg font-semibold text-center text-slate-700 mb-4">
            Risk Levels
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            {LEVELS.map((l) => (
              <div
                key={l.level}
                className={`border rounded-xl px-6 py-4 text-center font-semibold ${l.color}`}
              >
                <div className="text-2xl font-bold">{l.range}</div>
                <div className="text-sm mt-1">{l.level}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 text-center max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">
          Ready to test the system?
        </h2>
        <p className="text-slate-500 mb-6">
          Submit a claim and instantly see your fraud risk score. Try different amounts and
          hospitals to see the rules in action.
        </p>
        <Link to="/submit" className="btn-primary text-base px-8 py-3 inline-block">
          Submit Your First Claim
        </Link>
      </section>
    </div>
  )
}
