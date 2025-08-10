import { Home, ShoppingCart, Store, Settings, Menu, X } from "lucide-react"
import { Button } from "@/components/button/button"
import * as styles from "@/components/header/styles"
import { UserMenu } from "./UserMenu"
import { useState, useEffect } from 'react';
import { UserProfileModal } from './UserProfileModal';
import { useCart } from "@/components/cart/CartContext";
import { useSession } from 'next-auth/react';

export function Header() {
  const { cart } = useCart();
  const { data: session } = useSession();
  const [isHydrated, setIsHydrated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
  
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    // isAdmin agora vem direto da sessão NextAuth
    setIsAdmin((session?.user as any)?.isAdmin || false);
  }, [session]);
  
  function openUserProfileModal() {
    window.dispatchEvent(new CustomEvent('open-user-profile-modal'));
  }
  return (
    <header className={styles.headerWrapper}>
      <div className={styles.headerContainer}>
        <div className={styles.headerRow + ' flex justify-between items-center'}>
          {/* Logo/Home - sempre visível */}
          <a href="/" className="flex items-center gap-2 text-white font-semibold text-lg hover:text-[#9bf401] transition">
            <Home className="w-6 h-6" />
            <span className="hidden sm:inline">Inicio</span>
          </a>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <a href="/cart" className="flex items-center gap-2 text-white font-semibold text-lg hover:text-[#9bf401] transition relative">
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
            {isAdmin && (
              <a href="/admin/dashboard" className="flex items-center gap-2 text-white font-semibold text-lg hover:text-[#9bf401] transition">
                <Settings className="w-6 h-6" /> Admin
              </a>
            )}
            <UserMenu onClick={openUserProfileModal} />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            {/* Cart icon for mobile */}
            <a href="/cart" className="relative text-white hover:text-[#9bf401] transition">
              <ShoppingCart className="w-6 h-6" />
              {isHydrated && itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full min-w-[1.25rem] h-5 flex items-center justify-center px-1">
                  {itemCount}
                </span>
              )}
            </a>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white hover:text-[#9bf401] transition"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <UserMenu onClick={openUserProfileModal} />
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-[#181c2b] border-t border-[#23263a] z-50">
            <div className="flex flex-col p-4 space-y-4">
              <Button className={styles.headerButton + " justify-center"}>
                <Store className="w-5 h-5" /> Loja
              </Button>
              {isAdmin && (
                <a
                  href="/admin/dashboard"
                  className="flex items-center justify-center gap-2 text-white font-semibold text-lg hover:text-[#9bf401] transition py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Settings className="w-6 h-6" /> Admin
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}