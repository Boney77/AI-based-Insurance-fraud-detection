import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAllClaims, approveClaim, rejectClaim, investigateClaim } from '../api/api'

const STATUS_META = {
  APPROVED:      { label: 'Approved',            color: 'bg-emerald-100 text-emerald-800' },
  REJECTED:      { label: 'Rejected',            color: 'bg-red-100 text-red-800' },
  UNDER_REVIEW:  { label: 'Under Review',        color: 'bg-amber-100 text-amber-800' },
  INVESTIGATION: { label: 'Investigation',       color: 'bg-purple-100 text-purple-800' },
  PENDING:       { label: 'Pending',             color: 'bg-slate-100 text-slate-600' },
}

const LEVEL_META = {
  LOW_RISK:    { label: 'Low',    color: 'text-emerald-700 bg-emerald-50' },
  MEDIUM_RISK: { label: 'Medium', color: 'text-amber-700 bg-amber-50' },
  HIGH_RISK:   { label: 'High',   color: 'text-red-700 bg-red-50' },
}

const ALL_STATUSES = ['ALL', 'PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'INVESTIGATION']

export default function AdminDashboard() {
  const navigate = useNavigate()

  const [claims, setClaims]         = useState([])
  const [loading, setLoading]       = useState(true)
  const [filter, setFilter]         = useState('ALL')
  const [search, setSearch]         = useState('')
  const [actionLoading, setActionLoading] = useState(null)
  const [toast, setToast]           = useState(null)
  const [selected, setSelected]     = useState(null)

  const fetchClaims = useCallback(async () => {
    try {
      const { data } = await getAllClaims()
      setClaims(data.claims || [])
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem('adminToken')
        navigate('/admin/login')
      }
    } finally {
      setLoading(false)
    }
  }, [navigate])

  useEffect(() => { fetchClaims() }, [fetchClaims])

  function showToast(msg, type = 'success') {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  async function handleAction(claimId, action) {
    setActionLoading(claimId + action)
    try {
      if (action === 'approve')    await approveClaim(claimId)
      if (action === 'reject')     await rejectClaim(claimId)
      if (action === 'investigate') await investigateClaim(claimId)
      showToast(`Claim ${claimId} — ${action}d successfully.`)
      await fetchClaims()
      if (selected?.claimId === claimId) setSelected(null)
    } catch {
      showToast('Action failed. Please try again.', 'error')
    } finally {
      setActionLoading(null)
    }
  }

  const filtered = claims.filter((c) => {
    const matchFilter = filter === 'ALL' || c.status === filter
    const matchSearch = !search.trim() ||
      c.claimId.toLowerCase().includes(search.toLowerCase()) ||
      c.customerName.toLowerCase().includes(search.toLowerCase()) ||
      (c.policyNumber || '').toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchSearch
  })

  const stats = {
    total:         claims.length,
    underReview:   claims.filter(c => c.status === 'UNDER_REVIEW').length,
    highRisk:      claims.filter(c => c.fraudLevel === 'HIGH_RISK').length,
    approved:      claims.filter(c => c.status === 'APPROVED').length,
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] py-8 px-4">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Admin Dashboard</h1>
            <p className="text-slate-500 text-sm mt-1">Review and manage insurance claims</p>
          </div>
          <button
            onClick={fetchClaims}
            className="btn-secondary flex items-center gap-2 text-sm"
          >
            <RefreshIcon className="h-4 w-4" />
            Refresh
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total Claims"    value={stats.total}       color="text-brand-700" />
          <StatCard label="Under Review"    value={stats.underReview} color="text-amber-600" />
          <StatCard label="High Risk"       value={stats.highRisk}    color="text-red-600" />
          <StatCard label="Approved"        value={stats.approved}    color="text-emerald-600" />
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-3 mb-6">
          <input
            type="text"
            placeholder="Search by Claim ID, Customer, Policy..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-input flex-1 min-w-[200px] max-w-sm"
          />
          <div className="flex flex-wrap gap-2">
            {ALL_STATUSES.map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
                  filter === s
                    ? 'bg-brand-700 text-white border-brand-700'
                    : 'bg-white text-slate-600 border-slate-300 hover:border-brand-400'
                }`}
              >
                {s === 'ALL' ? 'All' : s.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="text-center py-20 text-slate-400">Loading claims...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            {claims.length === 0 ? 'No claims submitted yet.' : 'No claims match the current filter.'}
          </div>
        ) : (
          <div className="card p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    {['Claim ID', 'Customer', 'Policy No.', 'Amount', 'Hospital', 'Incident', 'Risk', 'Score', 'Status', 'Actions'].map((h) => (
                      <th key={h} className="px-4 py-3 text-left font-semibold text-slate-600 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((claim) => {
                    const sm = STATUS_META[claim.status] || STATUS_META.PENDING
                    const lm = LEVEL_META[claim.fraudLevel] || LEVEL_META.LOW_RISK
                    const busy = (action) => actionLoading === claim.claimId + action
                    const done = ['APPROVED', 'REJECTED', 'INVESTIGATION'].includes(claim.status)

                    return (
                      <tr
                        key={claim.claimId}
                        className="border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer"
                        onClick={() => setSelected(claim)}
                      >
                        <td className="px-4 py-3 font-mono font-semibold text-brand-700 whitespace-nowrap">{claim.claimId}</td>
                        <td className="px-4 py-3 font-medium whitespace-nowrap">{claim.customerName}</td>
                        <td className="px-4 py-3 text-slate-500">
                          {claim.policyNumber || <em className="text-slate-300">—</em>}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap font-medium">
                          ₹{Number(claim.claimAmount).toLocaleString('en-IN')}
                        </td>
                        <td className="px-4 py-3 text-slate-600 max-w-[140px] truncate">{claim.hospitalName}</td>
                        <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{claim.incidentType}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${lm.color}`}>{lm.label}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`font-bold ${claim.fraudScore >= 61 ? 'text-red-600' : claim.fraudScore >= 31 ? 'text-amber-600' : 'text-emerald-600'}`}>
                            {claim.fraudScore}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${sm.color}`}>{sm.label}</span>
                        </td>
                        <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                          <div className="flex gap-1.5">
                            <ActionBtn
                              label="Approve"
                              color="btn-success"
                              disabled={done || !!actionLoading}
                              loading={busy('approve')}
                              onClick={() => handleAction(claim.claimId, 'approve')}
                            />
                            <ActionBtn
                              label="Reject"
                              color="btn-danger"
                              disabled={done || !!actionLoading}
                              loading={busy('reject')}
                              onClick={() => handleAction(claim.claimId, 'reject')}
                            />
                            <ActionBtn
                              label="Investigate"
                              color="btn-warning"
                              disabled={done || !!actionLoading}
                              loading={busy('investigate')}
                              onClick={() => handleAction(claim.claimId, 'investigate')}
                            />
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            <div className="px-4 py-3 border-t border-slate-100 text-xs text-slate-400">
              Showing {filtered.length} of {claims.length} claims &nbsp;&middot;&nbsp; Click a row to view full details
            </div>
          </div>
        )}

        {/* Detail Panel */}
        {selected && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setSelected(null)}>
            <div className="bg-white rounded-2xl w-full max-w-md p-6 relative" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setSelected(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
              >
                <CloseIcon className="h-5 w-5" />
              </button>
              <h2 className="text-xl font-bold text-slate-800 mb-1">{selected.claimId}</h2>
              <p className="text-sm text-slate-500 mb-5">Full claim details</p>
              <dl className="space-y-3 text-sm">
                {[
                  ['Customer',     selected.customerName],
                  ['Policy No.',   selected.policyNumber || '—'],
                  ['Amount',       `₹${Number(selected.claimAmount).toLocaleString('en-IN')}`],
                  ['Hospital',     selected.hospitalName],
                  ['Incident',     selected.incidentType],
                  ['Fraud Score',  selected.fraudScore + ' / 100'],
                  ['Fraud Level',  selected.fraudLevel?.replace('_', ' ')],
                  ['Status',       selected.status?.replace('_', ' ')],
                  ['Submitted',    selected.submittedAt ? new Date(selected.submittedAt).toLocaleString() : '—'],
                  ['Admin Note',   selected.adminNote || '—'],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between gap-4">
                    <dt className="text-slate-500">{label}</dt>
                    <dd className="font-medium text-slate-800 text-right">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        )}

        {/* Toast */}
        {toast && (
          <div className={`fixed bottom-6 right-6 px-5 py-3 rounded-xl text-white text-sm font-medium transition-all z-50 ${
            toast.type === 'error' ? 'bg-red-600' : 'bg-emerald-600'
          }`}>
            {toast.msg}
          </div>
        )}
      </div>
    </div>
  )
}

function StatCard({ label, value, color }) {
  return (
    <div className="card text-center">
      <div className={`text-3xl font-bold ${color}`}>{value}</div>
      <div className="text-slate-500 text-sm mt-1">{label}</div>
    </div>
  )
}

function ActionBtn({ label, color, disabled, loading, onClick }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`${color} text-xs px-2 py-1 rounded-lg`}
      title={disabled ? 'Already actioned' : label}
    >
      {loading ? '...' : label}
    </button>
  )
}

function RefreshIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  )
}

function CloseIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
}
