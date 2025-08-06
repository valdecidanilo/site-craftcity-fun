import { Home, ShoppingCart, Store } from "lucide-react"
import { Button } from "@/components/button/button"
import * as styles from "@/components/header/styles"

export function Header() {
  return (
    <header className={styles.headerWrapper}>
      <div className={styles.headerContainer}>
        <div className={styles.headerRow}>
          <div className="flex items-center gap-2 text-white font-semibold text-lg">
            <Home className="w-6 h-6" /> Inicio
          </div>

          <div className="flex items-center gap-2 text-white font-semibold text-lg">
            <ShoppingCart className="w-6 h-6" /> Carrinho
          </div>

          <Button className={styles.headerButton}>
            <Store className="w-5 h-5" /> Loja
          </Button>
        </div>
      </div>
    </header>
  )
}