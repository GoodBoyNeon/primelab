import { AppProvider } from './context/AppContext'
import Sidebar from './components/Sidebar'
import WorkArea from './components/WorkArea'
import { ThemeProvider } from './context/ThemeProvider'
import { SidebarProvider } from './components/ui/sidebar'

export default function App() {
  return (
    <ThemeProvider>
      <AppProvider>
        <SidebarProvider>
          <Sidebar />
          <main className="flex-1 bg-background text-foreground flex flex-col">
            <WorkArea />
          </main>
        </SidebarProvider>
      </AppProvider>
    </ThemeProvider>
  )
}
