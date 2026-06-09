import { useState } from 'react'
import { invoke } from '@tauri-apps/api/core'
import ToolShell from '../ToolShell'
import { useApp } from '../../context/AppContext'

export default function PrevPrime() {
  const { setStatus } = useApp()
  const [n, setN] = useState('')
  const [result, setResult] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function run() {
    const num = parseInt(n)
    if (isNaN(num) || num < 3) {
      setError('Enter an integer ≥ 3')
      return
    }
    setError(null)
    setLoading(true)
    const start = performance.now()
    try {
      const res = await invoke<number>('get_prev_prime', { n: num })
      const elapsed = performance.now() - start
      if (res === 0) {
        setError('No prime exists before this number')
        setResult(null)
      } else {
        setResult(res)
        setStatus({ tool: 'prev-prime', elapsed_ms: elapsed, summary: `prev prime before ${num} → ${res}` })
      }
    } catch (e) {
      setError(String(e))
    } finally {
      setLoading(false)
    }
  }

  return (
    <ToolShell title="Previous Prime" description="Find the largest prime less than n.">
      <div style={{ maxWidth: 480 }}>
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
          placeholder="Enter an integer ≥ 3..."
          min={3}
        />
        <div style={{ marginTop: '1rem', display: 'flex', gap: 8 }}>
          <button className="primary" onClick={run} disabled={loading}>
            {loading ? 'Searching...' : 'Find'}
          </button>
          {result !== null && (
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
        {result !== null && (
          <div
            style={{
              marginTop: '1.5rem',
              border: '1px solid var(--info)',
              background: 'color-mix(in srgb, var(--info) 6%, var(--bg))',
              padding: '1.25rem 1.5rem',
              position: 'relative',
            }}
          >
            <div
              style={{ position: 'absolute', top: 0, left: 0, width: 3, height: '100%', background: 'var(--info)' }}
            />
            <div style={{ paddingLeft: '0.75rem' }}>
              <div
                style={{
                  fontSize: '0.6rem',
                  fontFamily: 'JetBrains Mono, monospace',
                  fontWeight: 600,
                  letterSpacing: '0.15em',
                  color: 'var(--info)',
                  marginBottom: 6,
                }}
              >
                PREV PRIME BEFORE {n}
              </div>
              <div
                style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '2.5rem',
                  fontWeight: 300,
                  color: 'var(--text)',
                  letterSpacing: '-0.04em',
                  lineHeight: 1,
                }}
              >
                {result}
              </div>
              <div style={{ marginTop: 8, fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                gap: {parseInt(n) - result}
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolShell>
  )
}
