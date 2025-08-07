// src/components/layout/Sidebar/sidebar.tsx
import { ChevronRight, Menu } from "lucide-react"
import * as styles from "@/components/sidebar/styles"

type SidebarProps = {
  categories: string[]
  selectedCategory: string
  onCategoryChange: (category: string) => void
}

export function Sidebar({ categories, selectedCategory, onCategoryChange }: SidebarProps) {
  return (
    <aside className={styles.sidebarWrapper}>
      <nav className="space-y-4">
        {categories.map((cat, index) => (
          <button
            key={cat}
            className={
              `${styles.sidebarItem} flex items-center w-full text-left px-4 py-2 rounded transition-colors ` +
              (selectedCategory === cat ? 'bg-[#9bf401] text-[#151923]' : 'hover:bg-[#23263a]')
            }
            onClick={() => onCategoryChange(cat)}
          >
            <div className={styles.sidebarIconText}>
              <Menu className={
                `w-5 h-5 mr-2 ` +
                (selectedCategory === cat ? 'text-[#151923]' : 'text-[#9bf401]')
              } />
              <span
                className={
                  styles.sidebarTitle +
                  (selectedCategory === cat
                    ? ' text-white'
                    : '')
                }
              >{cat}</span>
            </div>
            {selectedCategory === cat && (
              <ChevronRight className={styles.sidebarChevron + ' text-[#151923]'} />
            )}
          </button>
        ))}
      </nav>
    </aside>
  )
}