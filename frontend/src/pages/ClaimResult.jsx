import { useParams, useLocation, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { getClaimStatus } from '../api/api'

const STATUS_META = {
  APPROVED:     { label: 'Approved',              color: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
  REJECTED:     { label: 'Rejected',              color: 'bg-red-100 text-red-800 border-red-200' },
  UNDER_REVIEW: { label: 'Under Review',          color: 'bg-amber-100 text-amber-800 border-amber-200' },
  INVESTIGATION:{ label: 'Under Investigation',   color: 'bg-purple-100 text-purple-800 border-purple-200' },
  PENDING:      { label: 'Pending',               color: 'bg-slate-100 text-slate-600 border-slate-200' },
}

const LEVEL_META = {
  LOW_RISK:    { label: 'Low Risk',    bar: 'bg-emerald-500', text: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200' },
  MEDIUM_RISK: { label: 'Medium Risk', bar: 'bg-amber-500',   text: 'text-amber-700',   bg: 'bg-amber-50 border-amber-200'   },
  HIGH_RISK:   { label: 'High Risk',   bar: 'bg-red-500',     text: 'text-red-700',     bg: 'bg-red-50 border-red-200'       },
}

export default function ClaimResult() {
  const { claimId } = useParams()
  const location    = useLocation()

  const [claim, setClaim]   = useState(location.state?.result || null)
  const [loading, setLoading] = useState(!location.state?.result)
  const [error, setError]   = useState('')

  useEffect(() => {
    if (!claim) {
      getClaimStatus(claimId)
        .then(({ data }) => setClaim(data))
        .catch(() => setError('Claim not found. Please check the Claim ID.'))
        .finally(() => setLoading(false))
    }
  }, [claimId, claim])

  if (loading) return <Loading />

  if (error) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
      <p className="text-red-600 mb-4">{error}</p>
      <Link to="/submit" className="btn-primary">Submit New Claim</Link>
    </div>
  )

  if (!claim) return null

  const levelMeta  = LEVEL_META[claim.fraudLevel]  || LEVEL_META.LOW_RISK
  const statusMeta = STATUS_META[claim.status]      || STATUS_META.PENDING

  return (
    <div className="min-h-[calc(100vh-4rem)] py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-100 mb-4">
            <CheckIcon className="h-8 w-8 text-brand-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-800 mb-1">Claim Submitted</h1>
          <p className="text-slate-500">Your claim has been received and analysed.</p>
        </div>

        {/* Claim ID */}
        <div className="card mb-4 text-center">
          <p className="text-sm text-slate-500 mb-1">Claim ID</p>
          <p className="text-4xl font-bold text-brand-700 tracking-wider">{claim.claimId}</p>
          <p className="text-xs text-slate-400 mt-1">Save this ID to track your claim</p>
        </div>

        {/* Fraud Score */}
        <div className={`card mb-4 border ${levelMeta.bg}`}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-slate-600">Fraud Risk Score</span>
            <span className={`text-sm font-bold px-3 py-1 rounded-full border ${levelMeta.bg} ${levelMeta.text}`}>
              {levelMeta.label}
            </span>
          </div>
          <div className="flex items-end gap-3 mb-3">
            <span className={`text-5xl font-bold ${levelMeta.text}`}>{claim.fraudScore}</span>
            <span className="text-slate-400 text-lg mb-1">/ 100</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-3">
            <div
              className={`${levelMeta.bar} h-3 rounded-full transition-all duration-700`}
              style={{ width: `${Math.min(claim.fraudScore, 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-slate-400 mt-1">
            <span>0 — Low</span>
            <span>100 — Critical</span>
          </div>
        </div>

        {/* Status */}
        <div className="card mb-4 flex items-center justify-between">
          <span className="text-sm font-medium text-slate-600">Current Status</span>
          <span className={`text-sm font-semibold px-4 py-1.5 rounded-full border ${statusMeta.color}`}>
            {statusMeta.label}
          </span>
        </div>

        {/* Claim Details */}
        <div className="card mb-6">
          <h3 className="font-semibold text-slate-700 mb-4">Claim Details</h3>
          <dl className="space-y-3">
            {[
              { label: 'Customer Name',  value: claim.customerName },
              { label: 'Policy Number',  value: claim.policyNumber || <em className="text-slate-400">Not provided</em> },
              { label: 'Claim Amount',   value: `₹${Number(claim.claimAmount).toLocaleString('en-IN')}` },
              { label: 'Hospital',       value: claim.hospitalName },
              { label: 'Incident Type',  value: claim.incidentType },
              { label: 'Submitted At',   value: claim.submittedAt ? new Date(claim.submittedAt).toLocaleString() : '—' },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between items-start gap-4 text-sm">
                <dt className="text-slate-500 shrink-0">{label}</dt>
                <dd className="text-slate-800 font-medium text-right">{value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="flex flex-wrap gap-3 justify-center">
          <Link to="/submit" className="btn-primary">Submit Another Claim</Link>
          <Link to="/" className="btn-secondary">Back to Home</Link>
        </div>
      </div>
    </div>
  )
}

function CheckIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

function Loading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-brand-200 border-t-brand-600 mb-3" />
        <p className="text-slate-500">Loading claim details...</p>
      </div>
    </div>
  )
}
