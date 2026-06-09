import { AlertTriangle, CheckCircle } from 'lucide-react'

interface Props {
  verdict: 'prime' | 'composite' | 'probable' | 'neither' | null
  value?: string | number
  label?: string
  confidence?: number | null
  extra?: Record<string, string | number>
}

const LABELS = {
  prime: 'PRIME',
  probable: 'PROBABLY PRIME',
  composite: 'COMPOSITE',
  neither: 'NEITHER',
}

export default function ResultCard({ verdict, value, label, confidence, extra }: Props) {
  if (!verdict) return null

  return (
    <div
      // className="mt-12 bg-card py-8 px-6"

      className={`mt-12 bg-card py-8 px-6 border ${
        verdict === 'prime' || verdict === 'probable'
          ? 'dark:bg-emerald-950/20 bg-emerald-200/20 dark:border-mist-500/30 border-mist-400/30 dark:text-mist-300 shadow-[0_0_15px_rgba(16,185,129,0.1)]'
          : 'dark:bg-rose-950/25 bg-rose-200/25 border-rose-400/30 dark:border-rose-500/30 dark:text-rose-300 text-rose-700 shadow-[0_0_15px_rgba(239,68,68,0.1)]'
      }`}
    >
      <div className="flex gap-2 pb-4">
        {verdict === 'prime' || verdict === 'probable' ? (
          <CheckCircle className="w-8 h-8 dark:text-mist-400 text-mist-500 shrink-0" />
        ) : (
          <AlertTriangle className="w-8 h-8 dark:text-rose-400 text-rose-500 shrink-0" />
        )}
        <span className="font-sans text-3xl font-semibold uppercase">verdict</span>
      </div>
      <div style={{ paddingLeft: '0.75rem' }}>
        {/* Verdict label */}
        <div className={`text-mono font-semibold text-lg uppercase`}>{LABELS[verdict]}</div>

        {/* Main value */}
        {value !== undefined && <div className="font-sans text-3xl">{value}</div>}

        {label && <div className="text-base text-muted-foreground mt-1">{label}</div>}

        {/* Confidence */}
        {confidence !== null && confidence !== undefined && (
          <div className="flex items-center gap-2 mt-3">
            <div className="flex-1 h-0.5 bg-border relative">
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  height: '100%',
                  width: `${confidence * 100}%`,
                  transition: 'width 0.4s ease',
                }}
              />
            </div>
            {/* <span className="font-mono text-base text-muted-foreground ">{(confidence * 100).toFixed(2)}%</span> */}
          </div>
        )}

        {/* Extra info */}
        <div>
          {confidence && (
            <div className="my-2 uppercase font-sans font-medium text-base text-muted-foreground">
              <span>verified with</span> <span>{(confidence * 100).toFixed(2)}% confidence</span>
            </div>
          )}
          {extra && Object.keys(extra).length > 0 && (
            <div className="mt-6 flex gap-6 flex-wrap">
              {Object.entries(extra).map(([k, v]) => (
                <div key={k}>
                  <div
                    className="text-sm text-muted-foreground tracking-widest uppercase mb-0.5"
                    style={{
                      marginBottom: 2,
                    }}
                  >
                    {k}
                  </div>
                  <div className="font-mono text-sm text-foreground">{v}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
