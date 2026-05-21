import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { submitClaim } from '../api/api'

const INCIDENT_TYPES = [
  'Accident',
  'Critical Illness',
  'Hospitalization',
  'Surgery',
  'Death',
  'Disability',
  'Maternity',
]

export default function ClaimForm() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    customerName: '',
    policyNumber: '',
    claimAmount: '',
    hospitalName: '',
    incidentType: '',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  async function handleSubmit(e) {
    e.preventDefault()

    if (!form.customerName.trim()) return setError('Customer name is required.')
    if (!form.hospitalName.trim()) return setError('Hospital name is required.')
    if (!form.incidentType)        return setError('Please select an incident type.')
    if (!form.claimAmount || isNaN(Number(form.claimAmount)) || Number(form.claimAmount) <= 0)
      return setError('Enter a valid claim amount.')

    setLoading(true)
    setError('')

    try {
      const payload = {
        ...form,
        claimAmount: parseFloat(form.claimAmount),
      }
      const { data } = await submitClaim(payload)
      navigate(`/result/${data.claimId}`, { state: { result: data } })
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit claim. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-start justify-center py-12 px-4">
      <div className="w-full max-w-xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Submit Insurance Claim</h1>
          <p className="text-slate-500">
            Fill in the claim details. Our system will instantly calculate a fraud risk score.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-5">
          <Field label="Customer Name" required>
            <input
              type="text"
              name="customerName"
              placeholder="e.g. Rajesh Kumar"
              value={form.customerName}
              onChange={handleChange}
              className="form-input"
            />
          </Field>

          <Field label="Policy Number" hint="Leave blank to simulate missing policy rule">
            <input
              type="text"
              name="policyNumber"
              placeholder="e.g. HDFC-LIF-2024-00123"
              value={form.policyNumber}
              onChange={handleChange}
              className="form-input"
            />
          </Field>

          <Field label="Claim Amount (₹)" required>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">₹</span>
              <input
                type="number"
                name="claimAmount"
                placeholder="e.g. 350000"
                value={form.claimAmount}
                onChange={handleChange}
                min="1"
                className="form-input pl-8"
              />
            </div>
            <p className="text-xs text-slate-400 mt-1">Tip: enter &gt; ₹5,00,000 to trigger high-amount rule</p>
          </Field>

          <Field label="Hospital Name" required>
            <input
              type="text"
              name="hospitalName"
              placeholder="e.g. Apollo Hospital, Mumbai"
              value={form.hospitalName}
              onChange={handleChange}
              className="form-input"
            />
          </Field>

          <Field label="Incident Type" required>
            <select
              name="incidentType"
              value={form.incidentType}
              onChange={handleChange}
              className="form-input bg-white"
            >
              <option value="">Select incident type...</option>
              {INCIDENT_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </Field>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-red-700 text-sm">
              {error}
            </div>
          )}

          <button type="submit" disabled={loading} className="btn-primary w-full text-base py-3 mt-2">
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Spinner /> Analysing Claim...
              </span>
            ) : (
              'Submit & Analyse Claim'
            )}
          </button>
        </form>

        <p className="text-center text-xs text-slate-400 mt-4">
          Your claim ID will be generated automatically after submission.
        </p>
      </div>
    </div>
  )
}

function Field({ label, required, hint, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-slate-400 mt-1">{hint}</p>}
    </div>
  )
}

function Spinner() {
  return (
    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  )
}
