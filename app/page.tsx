'use client'

import { ProductCard } from "@/components/product-card"
import { Pagination } from "@/components/pagination"
import { useState } from 'react'
import { Home, ShoppingCart, Store, Menu, ChevronRight } from 'lucide-react'
import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function Component() {
  const [currentPage, setCurrentPage] = useState(1)
  const productsPerPage = 6
  const totalPages = 3

  // Mock products data
  const products = [
    { id: 1, name: "Diamond Sword", price: "R$ 29,99", description: "Uma espada poderosa feita de diamante puro para dominar seus inimigos." },
    { id: 2, name: "Enchanted Pickaxe", price: "R$ 19,99", description: "Picareta encantada que aumenta sua velocidade de mineração." },
    { id: 3, name: "Golden Armor Set", price: "R$ 49,99", description: "Conjunto completo de armadura dourada para máxima proteção." },
    { id: 4, name: "Magic Potion Pack", price: "R$ 15,99", description: "Pacote com 10 poções mágicas variadas para suas aventuras." },
    { id: 5, name: "Rare Block Bundle", price: "R$ 24,99", description: "Coleção de blocos raros para construções únicas." },
    { id: 6, name: "Pet Dragon Egg", price: "R$ 99,99", description: "Ovo de dragão que pode ser chocado para ter um pet exclusivo." },
    { id: 7, name: "Builder's Toolkit", price: "R$ 34,99", description: "Kit completo de ferramentas para construtores profissionais." },
    { id: 8, name: "Teleport Scroll", price: "R$ 12,99", description: "Pergaminho mágico para teletransporte instantâneo." },
    { id: 9, name: "Experience Booster", price: "R$ 18,99", description: "Multiplicador de experiência por 24 horas." },
  ]

  const startIndex = (currentPage - 1) * productsPerPage
  const currentProducts = products.slice(startIndex, startIndex + productsPerPage)
  return (
    <div className="min-h-screen bg-[#151923] text-white">
      {/* Header */}
      <header className="relative z-10 bg-[#151923]/90 backdrop-blur-sm border-b border-[#1c2230]">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-white font-semibold text-lg">
              <Home className="w-6 h-6" />
              Inicio
            </div>
            
            <div className="flex items-center gap-2 text-white font-semibold text-lg">
              <ShoppingCart className="w-6 h-6" />
              Carrinho
            </div>
            
            <Button className="bg-[#9bf401] hover:bg-[#354b24] text-black font-semibold px-6 py-2 rounded-lg flex items-center gap-2">
              <Store className="w-5 h-5" />
              Loja
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-10 flex">
        {/* Sidebar Navigation */}
        <aside className="w-80 bg-[#1c2230]/95 backdrop-blur-sm min-h-screen p-6">
          <nav className="space-y-4">
            <div className="flex items-center justify-between p-4 hover:bg-[#1b202d] rounded-lg cursor-pointer transition-colors">
              <div className="flex items-center gap-3">
                <Home className="w-5 h-5 text-[#9bf401]" />
                <span className="text-white font-semibold text-lg">INICIO</span>
              </div>
              <ChevronRight className="w-5 h-5 text-[#8f8f8f]" />
            </div>

            <div className="flex items-center justify-between p-4 hover:bg-[#1b202d] rounded-lg cursor-pointer transition-colors">
              <div className="flex items-center gap-3">
                <Menu className="w-5 h-5 text-[#9bf401]" />
                <span className="text-white font-semibold text-lg">PASSES</span>
              </div>
              <ChevronRight className="w-5 h-5 text-[#8f8f8f]" />
            </div>

            <div className="flex items-center justify-between p-4 hover:bg-[#1b202d] rounded-lg cursor-pointer transition-colors">
              <div className="flex items-center gap-3">
                <Menu className="w-5 h-5 text-[#9bf401]" />
                <span className="text-white font-semibold text-lg">PACOTES</span>
              </div>
              <ChevronRight className="w-5 h-5 text-[#8f8f8f]" />
            </div>

            <div className="flex items-center justify-between p-4 hover:bg-[#1b202d] rounded-lg cursor-pointer transition-colors">
              <div className="flex items-center gap-3">
                <Menu className="w-5 h-5 text-[#9bf401]" />
                <span className="text-white font-semibold text-lg">BOOSTERS</span>
              </div>
              <ChevronRight className="w-5 h-5 text-[#8f8f8f]" />
            </div>

            <div className="flex items-center justify-between p-4 hover:bg-[#1b202d] rounded-lg cursor-pointer transition-colors">
              <div className="flex items-center gap-3">
                <Menu className="w-5 h-5 text-[#9bf401]" />
                <span className="text-white font-semibold text-lg">DIVERSOS</span>
              </div>
              <ChevronRight className="w-5 h-5 text-[#8f8f8f]" />
            </div>

            <div className="flex items-center justify-between p-4 hover:bg-[#1b202d] rounded-lg cursor-pointer transition-colors">
              <div className="flex items-center gap-3">
                <Menu className="w-5 h-5 text-[#9bf401]" />
                <span className="text-white font-semibold text-lg">COSMETICOS</span>
              </div>
              <ChevronRight className="w-5 h-5 text-[#8f8f8f]" />
            </div>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col items-center p-8 space-y-12">
          <div className="text-center">
            {/* CRAFT CITY Logo Image */}
            <div className="relative">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Dalle-CraftCity-Title-pbj0VPvEBUrdqam5Znd5qDuEzfGiOk.png"
                alt="Craft City Logo"
                width={600}
                height={300}
                className="mx-auto"
                priority
              />
            </div>
          </div>

          {/* Products Section */}
          <div className="w-full max-w-6xl">
            <h2 className="text-white font-bold text-3xl mb-8 text-center">Products</h2>
            
            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {currentProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  price={product.price}
                  description={product.description}
                />
              ))}
            </div>

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-[#151923]/90 backdrop-blur-sm border-t border-[#1c2230] py-6">
        <div className="container mx-auto px-4">
          <div className="flex items-center">
            <div className="flex items-center gap-3">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Dalle-CraftCity-Title-pbj0VPvEBUrdqam5Znd5qDuEzfGiOk.png"
                alt="Craft City Logo"
                width={120}
                height={60}
                className="object-contain"
              />
              <span className="text-white font-semibold text-lg">CraftCity 2025</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
