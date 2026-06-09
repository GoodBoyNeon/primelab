import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import ThemeToggle from './ThemeToggle'
import { NAV, NavItem } from '@/types'
import { useApp } from '@/context/AppContext'

export default function AppSidebar() {
  const { setActiveTool, activeTool } = useApp()
  const handleClick = (item: NavItem) => {
    setActiveTool(item.id)
  }
  return (
    <Sidebar>
      <SidebarHeader>
        <p className="font-mono font-bold text-2xl mt-4 mb-2">
          <span className="opacity-80">Prime</span>
          <span className="text-mist-400">Lab</span>
        </p>
      </SidebarHeader>
      <SidebarContent>
        {NAV.map((navCategory, i) => (
          <SidebarGroup key={i}>
            <SidebarGroupLabel className="uppercase">{navCategory.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navCategory.items.map((item) => (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton asChild isActive={activeTool === item.id}>
                      <button onClick={() => handleClick(item)}>{item.label}</button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <ThemeToggle />
      </SidebarFooter>
    </Sidebar>
  )
}
