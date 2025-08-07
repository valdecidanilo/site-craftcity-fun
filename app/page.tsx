'use client'

import { useState } from 'react'
import Image from "next/image"
import { Home, ShoppingCart, Store, Menu, ChevronRight } from 'lucide-react'
import { ProductCard } from "@/components/product-card/product-card"
import { Pagination } from "@/components/pagination/pagination"

import Logo from "@/public/craftcity-logo.png"
import Background from "@/public/craft-city-bg.png"
import { Header } from '@/components/header/header'
import { Footer } from '@/components/footer/footer'
import { Sidebar } from '@/components/sidebar/sidebar'

export default function Component() {
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedCategory, setSelectedCategory] = useState('Todas')
  const productsPerPage = 6
  

  // Mock products data com categoria e subcategoria
  const products = [
    // Passes
    { id: 1, name: "Passe VIP", price: "R$ 49,99", 
      description: "Acesso VIP por 30 dias.", 
      category: "Passes" },

    // Pacotes
    { id: 2, name: "Pacote de Moeda", price: "R$ 29,99", discountPrice: "R$ 19,99", 
      description: "Pacote com 1000 moedas.", 
      category: "Pacotes", subcategory: "Pacote de Moeda", 
      image: "/products/packs/product-coin-medium.png" },
    { id: 3, name: "Pacote de Dinheiro", price: "R$ 59,99", 
      description: "Pacote com 5000 dinheiro.", 
      category: "Pacotes", subcategory: "Pacote de Dinheiro", 
      image: "/products/packs/product-money-high.png" },

    // Boosters
    { id: 4, name: "Experience Booster", price: "R$ 18,99", 
      description: "Multiplicador de experiência por 24 horas.", 
      category: "Boosters" },

    // Diversos
    { id: 5, name: "Teleport Scroll", price: "R$ 12,99", 
      description: "Pergaminho mágico para teletransporte instantâneo.", 
      category: "Diversos" },
    { id: 6, name: "Magic Potion Pack", price: "R$ 15,99", 
      description: "Pacote com 10 poções mágicas variadas.", 
      category: "Diversos" },

    // Cosmeticos
    { id: 7, name: "Skin de Dragão", price: "R$ 39,99", 
      description: "Skin exclusiva de dragão.", 
      category: "Cosmeticos", subcategory: "Skins" },
    { id: 8, name: "Asa Flamejante", price: "R$ 44,99", 
      description: "Asa com efeito flamejante.", 
      category: "Cosmeticos", subcategory: "Asas" },
    { id: 9, name: "Mochila Gamer", price: "R$ 24,99", 
      description: "Mochila temática gamer.", 
      category: "Cosmeticos", subcategory: "Mochilas" },
  ]

  // Extrai categorias únicas automaticamente
  const categories = ["Todas", ...Array.from(new Set(products.map(p => p.category)))]

  // Extrai subcategorias da categoria selecionada
  const subcategories = selectedCategory === "Todas"
    ? []
    : Array.from(new Set(products.filter(p => p.category === selectedCategory && p.subcategory).map(p => p.subcategory))).filter((sub): sub is string => typeof sub === 'string')

  // Estado para subcategoria selecionada
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null)

  // Filtra produtos pela categoria e subcategoria selecionada
  const filteredProducts = selectedCategory === "Todas"
    ? products
    : products.filter(p => {
        if (!selectedSubcategory) return p.category === selectedCategory
        return p.category === selectedCategory && p.subcategory === selectedSubcategory
      })

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage)
  const startIndex = (currentPage - 1) * productsPerPage
  const currentProducts = filteredProducts.slice(startIndex, startIndex + productsPerPage)


  return (
    <div className="min-h-screen text-white" style={{background: '#151923' }}>

      <Header />

      <div className="relative w-full flex">
        <div
          className="absolute left-0 top-0 w-full -z-99"
          style={{ height: 400}}
        >
          <Image
            src={Background}
            alt="Background Craft City"
            fill
            style={{ objectFit: 'cover', objectPosition: 'center', opacity: .3 }}
            priority
          />
        </div>

        <Sidebar
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={(cat) => {
            setSelectedCategory(cat)
            setSelectedSubcategory(null)
            setCurrentPage(1)
          }}
          subcategories={subcategories}
          selectedSubcategory={selectedSubcategory}
          onSubcategoryChange={(sub) => {
            setSelectedSubcategory(sub)
            setCurrentPage(1)
          }}
        />

        {/* Main */}
        <main className="flex-1 flex flex-col items-center p-8 space-y-12">
          <div className="w-full flex justify-center items-center" style={{ minHeight: 320 }}>
            <div className="text-center w-full">
              <Image
                src={Logo}
                alt="Craft City Logo"
                width={300}
                height={300}
                className="mx-auto -z-999"
                priority
                style={{ opacity: 1 }}
              />
            </div>
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
