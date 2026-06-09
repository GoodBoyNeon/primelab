import { useApp } from '../context/AppContext'

export default function StatusBar() {
  const { status, activeTool } = useApp()

  return (
    <div
      style={{
        height: 28,
        background: 'var(--sidebar-bg)',
        borderTop: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 1rem',
        gap: '1.5rem',
        fontSize: '0.68rem',
        fontFamily: 'JetBrains Mono, monospace',
        color: 'var(--text-muted)',
        flexShrink: 0,
      }}
    >
      <span style={{ color: 'var(--accent)', letterSpacing: '0.08em' }}>{activeTool.toUpperCase()}</span>

      {status ? (
        <>
          <Divider />
          <span style={{ color: 'var(--text)' }}>{status.summary}</span>
          <Divider />
          {status.elapsed_ms !== null && <span>{status.elapsed_ms.toFixed(2)}ms</span>}
        </>
      ) : (
        <span style={{ opacity: 0.5 }}>ready</span>
      )}

      <div style={{ marginLeft: 'auto', display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <span>primelab</span>
        <span style={{ color: 'var(--accent)', opacity: 0.7 }}>α</span>
      </div>
    </div>
  )
}

function Divider() {
  return <span style={{ opacity: 0.3 }}>|</span>
}
