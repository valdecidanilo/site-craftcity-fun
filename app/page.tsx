'use client'

import { useState } from 'react'
import Image from "next/image"
import { Home, ShoppingCart, Store, Menu, ChevronRight } from 'lucide-react'
import { ProductCard } from "@/components/product-card/product-card"
import { Pagination } from "@/components/pagination/pagination"

import Logo from "@/public/craftcity-logo.png"
import { Header } from '@/components/header/header'
import { Footer } from '@/components/footer/footer'
import { Sidebar } from '@/components/sidebar/sidebar'

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

      <Header />

      <div className="relative z-10 flex">
        <Sidebar />

        {/* Main */}
        <main className="flex-1 flex flex-col items-center p-8 space-y-12">
          <div className="text-center">
            <Image
              src={Logo}
              alt="Craft City Logo"
              width={600}
              height={300}
              className="mx-auto"
              priority
            />
          </div>

          <div className="w-full max-w-6xl">
            <h2 className="text-white font-bold text-3xl mb-8 text-center">Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {currentProducts.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </main>
      </div>

      <Footer />
    </div>
  )
}
