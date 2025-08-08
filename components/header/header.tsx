import { Home, ShoppingCart, Store } from "lucide-react"
import { Button } from "@/components/button/button"
import * as styles from "@/components/header/styles"

export function Header() {
  return (
    <header className={styles.headerWrapper}>
      <div className={styles.headerContainer}>
        <div className={styles.headerRow + ' flex justify-between items-center'}>
          {/* Esquerda */}
          <a href="/" className="flex items-center gap-2 text-white font-semibold text-lg hover:text-[#9bf401] transition">
            <Home className="w-6 h-6" /> Inicio
          </a>

          {/* Direita */}
          <div className="flex items-center gap-4">
            <a href="/cart" className="flex items-center gap-2 text-white font-semibold text-lg hover:text-[#9bf401] transition">
              <ShoppingCart className="w-6 h-6" /> Carrinho
            </a>
            <Button className={styles.headerButton}>
              <Store className="w-5 h-5" /> Loja
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}