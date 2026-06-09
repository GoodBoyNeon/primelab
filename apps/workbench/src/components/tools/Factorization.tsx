import { useState } from 'react'
import { invoke } from '@tauri-apps/api/core'
import ToolShell from '../ToolShell'
import { useApp } from '../../context/AppContext'

type Format = 'default' | 'compact' | 'raw'

function toCompact(factors: number[]): string {
  const parts: string[] = []
  let i = 0
  while (i < factors.length) {
    let count = 1
    while (i + count < factors.length && factors[i + count] === factors[i]) count++
    parts.push(count > 1 ? `${factors[i]}^${count}` : `${factors[i]}`)
    i += count
  }
  return parts.join(' × ')
}

export default function Factorization() {
  const { setStatus } = useApp()
  const [n, setN] = useState('')
  const [format, setFormat] = useState<Format>('compact')
  const [result, setResult] = useState<number[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function run() {
    const num = parseInt(n)
    if (isNaN(num) || num < 2) {
      setError('Enter an integer ≥ 2')
      return
    }
    setError(null)
    setLoading(true)
    const start = performance.now()
    try {
      const res = await invoke<number[]>('get_prime_factors', { n: num })
      const elapsed = performance.now() - start
      setResult(res)
      setStatus({
        tool: 'factorization',
        elapsed_ms: elapsed,
        summary: `${num} → ${res.length} factor${res.length !== 1 ? 's' : ''}`,
      })
    } catch (e) {
      setError(String(e))
    } finally {
      setLoading(false)
    }
  }

  const display = result
    ? format === 'compact'
      ? toCompact(result)
      : format === 'raw'
        ? result.join('\n')
        : result.join(' × ')
    : null

  return (
    <ToolShell
      title="Prime Factorization"
      description="Decompose a number into its prime factors using trial division with a precomputed sieve."
    >
      <div style={{ maxWidth: 520 }}>
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
          Number
        </div>
        <input
          type="number"
          value={n}
          onChange={(e) => setN(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && run()}
          placeholder="Enter an integer ≥ 2..."
          min={2}
        />

        <div style={{ marginTop: '1rem' }}>
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
            Display format
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {(['compact', 'default', 'raw'] as Format[]).map((f) => (
              <button key={f} className={`ghost ${format === f ? 'active' : ''}`} onClick={() => setFormat(f)}>
                {f}
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginTop: '1rem', display: 'flex', gap: 8 }}>
          <button className="primary" onClick={run} disabled={loading}>
            {loading ? 'Factorizing...' : 'Factorize'}
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
            <div
              style={{
                border: '1px solid var(--border-bright)',
                background: 'var(--bg-secondary)',
                padding: '1.25rem 1.5rem',
              }}
            >
              <div
                style={{
                  fontSize: '0.6rem',
                  fontFamily: 'JetBrains Mono, monospace',
                  fontWeight: 600,
                  letterSpacing: '0.15em',
                  color: 'var(--accent)',
                  marginBottom: 10,
                }}
              >
                {n} =
              </div>
              <div
                style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: format === 'raw' ? '0.9rem' : '1.4rem',
                  fontWeight: 300,
                  color: 'var(--text)',
                  whiteSpace: format === 'raw' ? 'pre' : 'normal',
                  lineHeight: format === 'raw' ? 1.8 : 1.3,
                  wordBreak: 'break-all',
                }}
              >
                {display}
              </div>
              <div style={{ marginTop: 10, display: 'flex', gap: '1.5rem' }}>
                <Stat label="unique factors" value={new Set(result).size} />
                <Stat label="total factors" value={result.length} />
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolShell>
  )
}

function Stat({ label, value }: { label: string; value: number }) {
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
