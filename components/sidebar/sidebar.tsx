// src/components/sidebar/sidebar.tsx
import React from "react"
import { ChevronRight, Menu, Ticket, Package, Rocket, Boxes, Star, User, Gem, Shield, Heart, Gift, Crown, Palette, Wand2, Medal } from "lucide-react"
import * as styles from "@/components/sidebar/styles"

type CatObj = { id?: string; slug?: string; name: string }
type SidebarProps = {
  categories: Array<string | CatObj>
  selectedCategory: string
  onCategoryChange: (category: string) => void
  subcategories?: Array<string | CatObj>
  selectedSubcategory?: string | null
  onSubcategoryChange?: (subcategory: string) => void
}

function toKey(v: string | CatObj) {
  if (typeof v === "string") return v
  return v.id ?? v.slug ?? v.name
}
function toLabel(v: string | CatObj) {
  return typeof v === "string" ? v : v.name
}
function uniqByKey<T extends string | CatObj>(arr: T[]) {
  const seen = new Set<string>()
  const out: T[] = []
  for (const item of arr) {
    const k = toKey(item)
    if (!seen.has(k)) {
      seen.add(k)
      out.push(item)
    }
  }
  return out
}

export function Sidebar({
  categories,
  selectedCategory,
  onCategoryChange,
  subcategories = [],
  selectedSubcategory,
  onSubcategoryChange,
}: SidebarProps) {
  // garante itens únicos e com chave estável
  const cats = uniqByKey(categories)
  const subs = uniqByKey(subcategories)

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
        {cats.map((cat) => {
          const key = toKey(cat)
          const label = toLabel(cat)
          const isActive = selectedCategory === label
          return (
            <div key={key}>
              <button
                className={
                  `group ${styles.sidebarItem} flex items-center w-full text-left px-4 py-2 rounded transition-colors ` +
                  (isActive ? 'bg-[#9bf401] text-[#151923]' : 'hover:bg-[#23263a]')
                }
                onClick={() => onCategoryChange(label)}
              >
                <div className={styles.sidebarIconText}>
                  {categoryIcons[label]
                    ? React.cloneElement(categoryIcons[label], {
                        className:
                          `w-5 h-5 mr-2 transition-colors ` +
                          (isActive ? 'text-[#151923]' : 'text-[#9bf401]'),
                      } as any)
                    : (
                      <Menu
                        className={
                          `w-5 h-5 mr-2 ` +
                          (isActive ? 'text-[#151923]' : 'text-[#9bf401]')
                        }
                      />
                    )}
                  <span className={styles.sidebarTitle + (isActive ? ' text-white' : '')}>
                    {label}
                  </span>
                </div>
                {isActive && <ChevronRight className={styles.sidebarChevron + ' text-[#151923]'} />}
              </button>

              {/* Subcategorias */}
              {isActive && subs.length > 0 && (
                <div className="ml-8 mt-2 space-y-2">
                  {subs.map((sub) => {
                    const skey = toKey(sub)
                    const slabel = toLabel(sub)
                    const sActive = selectedSubcategory === slabel
                    return (
                      <button
                        key={skey}
                        className={
                          `w-full flex items-center text-left px-3 py-1 rounded transition-colors font-medium ` +
                          (sActive ? 'bg-[#23263a] text-[#9bf401]' : 'hover:bg-[#23263a] text-white')
                        }
                        onClick={() => onSubcategoryChange && onSubcategoryChange(slabel)}
                      >
                        {subcategoryIcons[slabel]
                          ? React.cloneElement(subcategoryIcons[slabel], {
                              className: `w-4 h-4 mr-2 transition-colors ` + (sActive ? 'text-[#9bf401]' : 'text-white'),
                            } as any)
                          : null}
                        {slabel}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </nav>
    </aside>
  )
}
