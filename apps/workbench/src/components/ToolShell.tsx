import type { ReactNode } from 'react'

interface Props {
  title: string
  description: string
  children: ReactNode
}

export default function ToolShell({ title, description, children }: Props) {
  return (
    <div className="flex flex-col h-full overflow-hidden bg-background">
      <div className="pt-12 px-6 pb-4 shrink-0">
        <h1 className="font-mono font-bold text-3xl">{title}</h1>
        <p className="text-muted-foreground text-lg">{description}</p>
      </div>

      {/* Tool content */}
      <div style={{ flex: 1, overflow: 'auto', padding: '1.5rem' }}>{children}</div>
    </div>
  )
}
