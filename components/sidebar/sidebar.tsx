// src/components/layout/Sidebar/sidebar.tsx
import { ChevronRight, Home, Menu } from "lucide-react"
import * as styles from "@/components/sidebar/styles"

const sidebarItems = [
  { icon: <Home className="w-5 h-5 text-[#9bf401]" />, label: "INICIO" },
  { icon: <Menu className="w-5 h-5 text-[#9bf401]" />, label: "PASSES" },
  { icon: <Menu className="w-5 h-5 text-[#9bf401]" />, label: "PACOTES" },
  { icon: <Menu className="w-5 h-5 text-[#9bf401]" />, label: "BOOSTERS" },
  { icon: <Menu className="w-5 h-5 text-[#9bf401]" />, label: "DIVERSOS" },
  { icon: <Menu className="w-5 h-5 text-[#9bf401]" />, label: "COSMETICOS" },
]

export function Sidebar() {
  return (
    <aside className={styles.sidebarWrapper}>
      <nav className="space-y-4">
        {sidebarItems.map((item, index) => (
          <div key={index} className={styles.sidebarItem}>
            <div className={styles.sidebarIconText}>
              {item.icon}
              <span className={styles.sidebarTitle}>{item.label}</span>
            </div>
            <ChevronRight className={styles.sidebarChevron} />
          </div>
        ))}
      </nav>
    </aside>
  )
}