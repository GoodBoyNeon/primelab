import { useState } from 'react'
import { invoke } from '@tauri-apps/api/core'
import ToolShell from '../ToolShell'
import { useApp } from '../../context/AppContext'
import type { PrimalityResponse } from '../../types'
import { Field, FieldDescription, FieldGroup, FieldLabel } from '../ui/field'
import { Input } from '../ui/input'
import ResultCard from '../ResultCard'
import { Button } from '../ui/button'

export default function MillerRabin() {
  const { setStatus } = useApp()
  const [n, setN] = useState('')
  const [iterations, setIterations] = useState(15)
  const [result, setResult] = useState<PrimalityResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function run() {
    const num = parseInt(n)
    if (isNaN(num) || num < 1) {
      setError('Enter a valid positive integer')
      return
    }
    setError(null)
    setLoading(true)
    const start = performance.now()
    try {
      const res = await invoke<PrimalityResponse>('is_prime', {
        n: num,
        algorithm: 'MillerRabin',
        iterations,
      })
      const elapsed = performance.now() - start
      setResult(res)
      const verdict = res.is_composite ? 'composite' : res.is_probable_prime ? 'probable prime' : 'prime'
      setStatus({ tool: 'miller-rabin', elapsed_ms: elapsed, summary: `${num} → ${verdict}` })
    } catch (e) {
      setError(String(e))
    } finally {
      setLoading(false)
    }
  }

  const verdict = result
    ? result.is_composite
      ? 'composite'
      : result.is_probable_prime
        ? 'probable'
        : result.is_prime
          ? 'prime'
          : 'neither'
    : null

  return (
    <ToolShell
      title="Miller-Rabin Primality Test"
      description="Probabilistic primality test using random witnesses. Each iteration reduces the false-positive probability by 1/4."
    >
      <div className="">
        <div>
          <div className="bg-card py-6 px-4">
            <FieldGroup className="flex flex-row w-full gap-4">
              <Field className="flex-[1.4] text-base">
                <FieldLabel htmlFor="input-field-number" className="text-base">
                  Number
                </FieldLabel>
                <Input
                  id="input-field-number"
                  type="number"
                  className="w-full text-lg"
                  value={n}
                  onChange={(e) => setN(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && run()}
                  placeholder="Enter an integer..."
                  min={1}
                />
              </Field>
              <Field className="flex-1">
                <FieldLabel htmlFor="input-field-iterations" className="text-base">
                  Iterations
                </FieldLabel>
                <Input
                  id="input-field-iterations"
                  type="number"
                  placeholder=""
                  defaultValue={iterations}
                  value={iterations}
                  onChange={(e) => setIterations(Number(e.target.value))}
                  className="w-full"
                />
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 4 }}>
                  {[5, 10, 15, 20, 50].map((v) => (
                    <Button
                      variant={'outline'}
                      size={'sm'}
                      key={v}
                      className={`ghost ${iterations === v ? 'active' : ''}`}
                      onClick={() => setIterations(v)}
                    >
                      {v}
                    </Button>
                  ))}
                </div>
                <FieldDescription>
                  Higher iterations ensure higher confidence but also require more time and computation
                </FieldDescription>
              </Field>
            </FieldGroup>
          </div>
        </div>

        <div style={{ marginTop: '1rem', display: 'flex', gap: 8 }}>
          <Button className="primary" onClick={run} disabled={loading} size={'lg'}>
            {loading ? 'Testing...' : 'Run Test'}
          </Button>
          {result && (
            <Button
              variant={'outline'}
              size={'lg'}
              onClick={() => {
                setResult(null)
                setStatus(null)
              }}
            >
              Clear
            </Button>
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

        <ResultCard
          verdict={verdict}
          value={result?.number}
          confidence={result?.confidence ?? null}
          extra={
            result ? { iterations: result.iterations, 'false-positive': `≤ (1/4)^${result.iterations}` } : undefined
          }
        />
      </div>
    </ToolShell>
  )
}
