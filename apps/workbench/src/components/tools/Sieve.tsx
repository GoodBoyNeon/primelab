import { useState } from 'react'
import { invoke } from '@tauri-apps/api/core'
import ToolShell from '../ToolShell'
import { useApp } from '../../context/AppContext'

const MAX_DISPLAY = 500

export default function Sieve() {
  const { setStatus } = useApp()
  const [n, setN] = useState('')
  const [result, setResult] = useState<number[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function run() {
    const num = parseInt(n)
    if (isNaN(num) || num < 2) {
      setError('Enter an integer ≥ 2')
      return
    }
    if (num > 1_000_000) {
      setError('Maximum supported value is 1,000,000')
      return
    }
    setError(null)
    setLoading(true)
    const start = performance.now()
    try {
      const res = await invoke<number[]>('sieve', { n: num })
      const elapsed = performance.now() - start
      setResult(res)
      setStatus({ tool: 'sieve', elapsed_ms: elapsed, summary: `found ${res.length} primes up to ${num}` })
    } catch (e) {
      setError(String(e))
    } finally {
      setLoading(false)
    }
  }

  const displayed = result ? result.slice(0, MAX_DISPLAY) : null
  const truncated = result && result.length > MAX_DISPLAY

  return (
    <ToolShell
      title="Sieve of Eratosthenes"
      description="Generate all primes up to n by iteratively eliminating multiples of each prime."
    >
      <div style={{ maxWidth: 600 }}>
        <div
          style={{
            fontSize: '0.7rem',
            fontWeight: 600,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'var(--text-muted)',
            marginBottom: 6,
          }}
        >
          Upper bound
        </div>
        <input
          type="number"
          value={n}
          onChange={(e) => setN(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && run()}
          placeholder="Enter an integer up to 1,000,000..."
          min={2}
          max={1000000}
        />

        <div style={{ marginTop: '1rem', display: 'flex', gap: 8 }}>
          <button className="primary" onClick={run} disabled={loading}>
            {loading ? 'Sieving...' : 'Generate'}
          </button>
          {result && (
            <button
              className="ghost"
              onClick={() => {
                setResult(null)
                setStatus(null)
              }}
            >
              Clear
            </button>
          )}
        </div>

        {error && (
          <div
            style={{
              marginTop: '0.75rem',
              fontSize: '0.75rem',
              color: 'var(--danger)',
              fontFamily: 'JetBrains Mono, monospace',
            }}
          >
            ✕ {error}
          </div>
        )}

        {result && (
          <div style={{ marginTop: '1.5rem' }}>
            {/* Stats */}
            <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
              <Stat label="primes found" value={result.length.toLocaleString()} />
              <Stat label="largest" value={result[result.length - 1]?.toLocaleString() ?? '—'} />
              <Stat label="smallest" value={result[0]?.toLocaleString() ?? '—'} />
              <Stat label="density" value={`${((result.length / parseInt(n)) * 100).toFixed(2)}%`} />
            </div>

            {/* Prime grid */}
            <div
              style={{
                border: '1px solid var(--border)',
                background: 'var(--bg-secondary)',
                padding: '1rem',
                maxHeight: 300,
                overflowY: 'auto',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '0.35rem',
                }}
              >
                {displayed?.map((p) => (
                  <span
                    key={p}
                    style={{
                      fontFamily: 'JetBrains Mono, monospace',
                      fontSize: '0.75rem',
                      color: 'var(--text)',
                      background: 'var(--bg)',
                      border: '1px solid var(--border)',
                      padding: '0.15rem 0.4rem',
                    }}
                  >
                    {p}
                  </span>
                ))}
                {truncated && (
                  <span
                    style={{
                      fontFamily: 'JetBrains Mono, monospace',
                      fontSize: '0.75rem',
                      color: 'var(--text-muted)',
                      padding: '0.15rem 0.4rem',
                    }}
                  >
                    +{(result!.length - MAX_DISPLAY).toLocaleString()} more...
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolShell>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div
        style={{
          fontSize: '0.6rem',
          color: 'var(--text-dim)',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          marginBottom: 2,
        }}
      >
        {label}
      </div>
      <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1rem', color: 'var(--text)' }}>{value}</div>
    </div>
  )
}
