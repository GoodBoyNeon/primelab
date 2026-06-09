import { useApp } from '../context/AppContext'
import { NAV } from '../types'
import type { Tool } from '../types'
import ThemeToggle from './ThemeToggle'

export default function Sidebar() {
  const { activeTool, setActiveTool } = useApp()

  return (
    <aside className="w-50 min-w-50 flex flex-col">
      {/* Logo */}
      <div className="p-4 border-b">
        <div className="font-mono font-semibold text-base text-mist-400 tracking-tight">
          Prime
          <span className="text-foreground opacity-50">Lab</span>
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, overflowY: 'auto', padding: '0.5rem 0' }}>
        {NAV.map((category) => (
          <div key={category.label}>
            <div
              className="pt-3 p-4 pb-1 font-semibold text-xs"
              style={{
                padding: '0.75rem 1rem 0.25rem',
                fontSize: '0.6rem',
                fontWeight: 600,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--text-dim)',
              }}
            >
              {category.label}
            </div>
            {category.items.map((item) => (
              <NavButton
                key={item.id}
                label={item.label}
                active={activeTool === item.id}
                onClick={() => setActiveTool(item.id as Tool)}
              />
            ))}
          </div>
        ))}
      </nav>

      {/* Theme toggle */}
      <div>
        <ThemeToggle />
      </div>
    </aside>
  )
}

function NavButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: '100%',
        textAlign: 'left',
        padding: '0.4rem 1rem',
        fontSize: '0.82rem',
        fontFamily: 'DM Sans, sans-serif',
        background: active ? 'var(--accent-dim)' : 'transparent',
        color: active ? 'var(--accent-text)' : 'var(--text-muted)',
        border: 'none',
        borderLeft: `2px solid ${active ? 'var(--accent)' : 'transparent'}`,
        cursor: 'pointer',
        transition: 'all 0.12s',
        display: 'block',
      }}
      onMouseEnter={(e) => {
        if (!active) {
          e.currentTarget.style.color = 'var(--text)'
          e.currentTarget.style.background = 'var(--bg-hover)'
        }
      }}
      onMouseLeave={(e) => {
        if (!active) {
          e.currentTarget.style.color = 'var(--text-muted)'
          e.currentTarget.style.background = 'transparent'
        }
      }}
    >
      {label}
    </button>
  )
}
