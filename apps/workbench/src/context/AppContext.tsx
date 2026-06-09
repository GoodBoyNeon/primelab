import React, { createContext, useContext, useState } from 'react'
import type { Tool, StatusInfo } from '../types'

interface AppContextType {
  activeTool: Tool
  setActiveTool: (tool: Tool) => void
  status: StatusInfo | null
  setStatus: (info: StatusInfo | null) => void
}

const AppContext = createContext<AppContextType | null>(null)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [activeTool, setActiveTool] = useState<Tool>('fermat')
  const [status, setStatus] = useState<StatusInfo | null>(null)

  return <AppContext.Provider value={{ activeTool, setActiveTool, status, setStatus }}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
