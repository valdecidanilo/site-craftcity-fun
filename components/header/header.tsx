import { Home, ShoppingCart, Store } from "lucide-react"
import { Button } from "@/components/button/button"
import * as styles from "@/components/header/styles"
import { UserMenu } from "./UserMenu"
import { useState, useEffect } from 'react';
import { UserProfileModal } from './UserProfileModal';
import { useCart } from "@/components/cart/CartContext";

export function Header() {
  const { cart } = useCart();
  const [isHydrated, setIsHydrated] = useState(false);
  const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
  
  useEffect(() => {
    setIsHydrated(true);
  }, []);
  
  function openUserProfileModal() {
    window.dispatchEvent(new CustomEvent('open-user-profile-modal'));
  }
  return (
    <header className={styles.headerWrapper}>
      <div className={styles.headerContainer}>
        <div className={styles.headerRow + ' flex justify-between items-center'}>
          {/* Esquerda */}
          <a href="/" className="flex items-center gap-2 text-white font-semibold text-lg hover:text-[#9bf401] transition">
            <Home className="w-6 h-6" /> Inicio
          </a>
          {/* Direita */}
          <div className="flex items-center gap-8">
            <a href="/cart" className="flex items-center gap- text-white font-semibold text-lg hover:text-[#9bf401] transition relative">
              <ShoppingCart className="w-6 h-6" /> Carrinho
              {isHydrated && itemCount > 0 && (
                <span className="absolute -top-2 -right-4 bg-red-500 text-white text-xs font-bold rounded-full min-w-[1.25rem] h-5 flex items-center justify-center px-1">
                  {itemCount}
                </span>
              )}
            </a>
            <Button className={styles.headerButton}>
              <Store className="w-5 h-5" /> Loja
            </Button>
            <UserMenu onClick={openUserProfileModal} />
          </div>
        </div>
      </div>
    </header>
  )
}