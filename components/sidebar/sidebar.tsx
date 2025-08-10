// src/components/layout/Sidebar/sidebar.tsx
import React from "react"
import { ChevronRight, Menu, Ticket, Package, Rocket, Boxes, Star, User, Gem, Shield, Heart, Gift, Crown, Palette, Wand2, Medal } from "lucide-react"
import * as styles from "@/components/sidebar/styles"

type SidebarProps = {
  categories: string[]
  selectedCategory: string
  onCategoryChange: (category: string) => void
  subcategories?: string[]
  selectedSubcategory?: string | null
  onSubcategoryChange?: (subcategory: string) => void
}

export function Sidebar({ categories, selectedCategory, onCategoryChange, subcategories = [], selectedSubcategory, onSubcategoryChange }: SidebarProps) {
  const categoryIcons: Record<string, React.ReactElement> = {
    Passes: <Ticket />,
    Pacotes: <Package />,
    Boosters: <Rocket />,
    Diversos: <Boxes />,
    Cosmeticos: <Star />,
  }
  const subcategoryIcons: Record<string, React.ReactElement> = {
    VIP: <Crown />,
    "Passe Mensal": <Ticket />,
    "Passe Semanal": <Ticket />,
    "Booster XP": <Rocket />,
    "Booster Coins": <Boxes />,
    "Cosmético Skin": <Palette />,
    "Cosmético Item": <Wand2 />,
    "Diamante": <Gem />,
    "Proteção": <Shield />,
    "Coração": <Heart />,
    "Presente": <Gift />,
    "Medalha": <Medal />,
    "Usuário": <User />,
  }
  return (
    <aside className={styles.sidebarWrapper}>
      <nav className="space-y-4">
        {categories.map((cat: string) => (
          <div key={cat}>
            <button
              className={
                `group ${styles.sidebarItem} flex items-center w-full text-left px-4 py-2 rounded transition-colors ` +
                (selectedCategory === cat ? 'bg-[#9bf401] text-[#151923]' : 'hover:bg-[#23263a]')
              }
              onClick={() => onCategoryChange(cat)}
            >
              <div className={styles.sidebarIconText}>
                {categoryIcons[cat]
                  ? React.cloneElement(categoryIcons[cat], {
                      className:
                        `w-5 h-5 mr-2 transition-colors ` +
                        (selectedCategory === cat ? 'text-[#151923]' : 'text-[#9bf401]'),
                    } as any)
                  : (
                    <Menu
                      className={
                        `w-5 h-5 mr-2 ` +
                        (selectedCategory === cat ? 'text-[#151923]' : 'text-[#9bf401]')
                      }
                    />
                  )}
                <span
                  className={
                    styles.sidebarTitle +
                    (selectedCategory === cat ? ' text-white' : '')
                  }
                >
                  {cat}
                </span>
              </div>
              {selectedCategory === cat && (
                <ChevronRight className={styles.sidebarChevron + ' text-[#151923]'} />
              )}
            </button>
            {/* Subcategorias */}
            {selectedCategory === cat && subcategories.length > 0 && (
              <div className="ml-8 mt-2 space-y-2">
                {subcategories.map((sub: string) => (
                  <button
                    key={sub}
                    className={
                      `w-full flex items-center text-left px-3 py-1 rounded transition-colors font-medium ` +
                      (selectedSubcategory === sub ? 'bg-[#23263a] text-[#9bf401]' : 'hover:bg-[#23263a] text-white')
                    }
                    onClick={() => onSubcategoryChange && onSubcategoryChange(sub)}
                  >
                    {/* Ícone da subcategoria, se existir */}
                    {subcategoryIcons[sub]
                      ? React.cloneElement(subcategoryIcons[sub], {
                          className:
                            `w-4 h-4 mr-2 transition-colors ` +
                            (selectedSubcategory === sub ? 'text-[#9bf401]' : 'text-white'),
                        } as any)
                      : null}
                    {sub}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </aside>
  )
}