'use client'
import { useState, useEffect } from 'react'
import Image from "next/image"
import { ShoppingCart, SlidersHorizontal } from 'lucide-react'
import { ProductCard } from "@/components/product-card/product-card"
import { Pagination } from "@/components/pagination/pagination"

import Logo from "@/public/craftcity-logo.png"
import Background from "@/public/craft-city-bg.png"
import { Header } from '@/components/header/header'
import { Footer } from '@/components/footer/footer'
import { Sidebar } from '@/components/sidebar/sidebar'

type Product = {
  id: string
  name: string
  price: string
  discountPrice?: string | null
  description: string
  category: string
  subcategory?: string | null
  image?: string | null
  isDiscounted?: boolean
}

export default function Component() {
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedCategory, setSelectedCategory] = useState('Todas')
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const productsPerPage = 6

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await fetch('/api/products')
        if (!response.ok) throw new Error('Erro ao carregar produtos')
        const data = await response.json()
        setProducts(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido')
        console.error('Erro ao buscar produtos:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  const categories = ["Todas", ...Array.from(new Set((products || []).map(p => p.category)))]
  const subcategories = selectedCategory === "Todas"
    ? []
    : Array.from(new Set((products || [])
        .filter(p => p.category === selectedCategory && p.subcategory)
        .map(p => p.subcategory)))
        .filter((sub): sub is string => typeof sub === 'string')

  const filteredProducts = selectedCategory === "Todas"
    ? (products || [])
    : (products || []).filter(p => {
        if (!selectedSubcategory) return p.category === selectedCategory
        return p.category === selectedCategory && p.subcategory === selectedSubcategory
      })

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage)
  const startIndex = (currentPage - 1) * productsPerPage
  const currentProducts = filteredProducts.slice(startIndex, startIndex + productsPerPage)

  return (
    <div className="min-h-screen text-white flex flex-col" style={{ background: '#151923' }}>
      {/* Header fixo (z-50) */}
      <div className="w-full fixed top-0 left-0 z-50">
        <Header />
      </div>

      <div className="relative w-full flex flex-1">
        {/* BG image */}
        <div className="absolute left-0 top-0 w-full z-0" style={{ height: 400 }}>
          <Image
            src={Background}
            alt="Background Craft City"
            fill
            style={{ objectFit: 'cover', objectPosition: 'center', opacity: .5 }}
            priority
          />
        </div>

        {/* Sidebar - Desktop */}
        <div className="hidden lg:block">
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
        </div>

        {/* Sidebar - Mobile (Overlay abaixo do header, acima do resto) */}
        {sidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 z-[45] bg-black bg-opacity-50"
            onClick={() => setSidebarOpen(false)}
          >
            <div
              className="absolute left-0 top-0 h-full w-80 bg-[#181c2b] pt-20 z-[46]"
              onClick={e => e.stopPropagation()}
            >
              <Sidebar
                categories={categories}
                selectedCategory={selectedCategory}
                onCategoryChange={(cat) => {
                  setSelectedCategory(cat)
                  setSelectedSubcategory(null)
                  setCurrentPage(1)
                  setSidebarOpen(false)
                }}
                subcategories={subcategories}
                selectedSubcategory={selectedSubcategory}
                onSubcategoryChange={(sub) => {
                  setSelectedSubcategory(sub)
                  setCurrentPage(1)
                  setSidebarOpen(false)
                }}
              />
            </div>
          </div>
        )}

        {/* Main */}
        <main className="flex-1 flex flex-col items-center p-4 lg:p-8 space-y-8 lg:space-y-12 pt-20 lg:pt-24">
          {/* Logo */}
          <div className="w-full flex justify-center items-center" style={{ minHeight: 280 }}>
            <div className="text-center w-full">
              <Image
                src={Logo}
                alt="Craft City Logo"
                width={250}
                height={250}
                className="mx-auto w-[200px] sm:w-[250px] lg:w-[300px] h-auto object-contain relative z-10"
                priority
              />
            </div>
          </div>

          {/* Filtros Mobile (entre o logo e “Produtos”) */}
          <div className="w-full max-w-6xl pt-4 px-4 lg:hidden">
            <div className="bg-[#1c2230]/90 backdrop-blur-sm border border-[#1b202d] rounded-xl p-4 shadow">
              <div className="flex flex-col gap-3 items-center text-center">
                <button
                  type="button"
                  onClick={() => setSidebarOpen(true)}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-bold bg-[#9bf401] text-[#151923] w-full sm:w-auto"
                >
                  <SlidersHorizontal className="w-5 h-5" />
                  Filtrar por Categoria
                </button>

                <div className="text-lg">
                  <span className="text-white/70">Categoria: </span>
                  <span className="font-semibold" style={{ color: '#9bf401' }}>
                    {selectedCategory}
                    {selectedSubcategory ? ` · ${selectedSubcategory}` : ''}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Listagem de produtos */}
          <div className="w-full max-w-6xl px-4 lg:px-0">
            <h2 className="text-white font-bold pt-5 text-2xl lg:text-3xl mb-6 lg:mb-8 text-center">Produtos</h2>

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="text-white text-lg">Carregando produtos...</div>
              </div>
            ) : error ? (
              <div className="flex justify-center items-center py-12">
                <div className="text-red-400 text-lg">Erro: {error}</div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-6 lg:mb-8">
                  {currentProducts.map((product) => (
                    <ProductCard key={product.id} {...product} />
                  ))}
                </div>

                {filteredProducts.length > 0 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                )}

                {filteredProducts.length === 0 && !loading && (
                  <div className="text-center text-gray-400 py-8">
                    Nenhum produto encontrado nesta categoria.
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>

      {/* Floating cart link */}
      <a
        href="/cart"
        className="fixed bottom-4 right-4 lg:bottom-8 lg:right-8 z-50 bg-green-500 text-white px-4 py-2 lg:px-6 lg:py-3 rounded-full shadow-lg flex items-center gap-2 hover:bg-green-600 transition"
      >
        <ShoppingCart size={20} className="lg:w-6 lg:h-6" />
        <span className="hidden sm:inline">Carrinho</span>
      </a>

      <Footer />
    </div>
  )
}
