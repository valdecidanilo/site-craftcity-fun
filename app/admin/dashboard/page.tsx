'use client'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/button/button"
import { Header } from '@/components/header/header'
import { Footer } from '@/components/footer/footer'
import { Plus, Edit, Trash2, Save, X } from 'lucide-react'

type Product = {
  id?: string
  name: string
  price: string
  discountPrice?: string
  description: string
  category: string
  subcategory?: string
  image?: string
}

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)

  const [formData, setFormData] = useState<Product>({
    name: '',
    price: '',
    discountPrice: '',
    description: '',
    category: '',
    subcategory: '',
    image: ''
  })

  useEffect(() => {
    if (status === 'loading') return
    
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
      return
    }

    // Verificar se é admin
    checkAdminStatus()
    
    fetchProducts()
  }, [status, router])

  const checkAdminStatus = async () => {
    try {
      const response = await fetch('/api/user/admin')
      const data = await response.json()
      if (!data.isAdmin) {
        router.push('/')
        return
      }
      setIsAdmin(true)
    } catch (error) {
      console.error('Error checking admin status:', error)
      router.push('/')
    }
  }

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/products')
      if (!response.ok) throw new Error('Erro ao carregar produtos')
      const data = await response.json()
      setProducts(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const method = editingProduct ? 'PUT' : 'POST'
      const url = editingProduct ? `/api/products/${editingProduct.id}` : '/api/products'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!response.ok) throw new Error('Erro ao salvar produto')
      
      await fetchProducts()
      resetForm()
      setShowAddForm(false)
      setEditingProduct(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar')
    }
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setFormData({ ...product })
    setShowAddForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja deletar este produto?')) return
    
    try {
      const response = await fetch(`/api/products/${id}`, { method: 'DELETE' })
      if (!response.ok) throw new Error('Erro ao deletar produto')
      await fetchProducts()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao deletar')
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      discountPrice: '',
      description: '',
      category: '',
      subcategory: '',
      image: ''
    })
  }

  const handleCancel = () => {
    resetForm()
    setShowAddForm(false)
    setEditingProduct(null)
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white">Carregando...</div>
      </div>
    )
  }

  if (!session || !isAdmin) {
    return null
  }

  return (
    <div className="min-h-screen flex flex-col" style={{background: '#151923'}}>
      <Header />
      
      <main className="container mx-auto px-4 py-8 pt-20 flex-1">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Dashboard Admin - Produtos</h1>
          <Button
            onClick={() => setShowAddForm(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg flex items-center gap-2"
          >
            <Plus size={20} />
            Adicionar Produto
          </Button>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {showAddForm && (
          <div className="bg-gray-800 p-6 rounded-lg mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">
              {editingProduct ? 'Editar Produto' : 'Adicionar Novo Produto'}
            </h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Nome do produto"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="bg-gray-700 text-white px-4 py-2 rounded border border-gray-600 focus:border-green-500"
              />
              <input
                type="text"
                placeholder="Preço (ex: R$ 10,99)"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
                className="bg-gray-700 text-white px-4 py-2 rounded border border-gray-600 focus:border-green-500"
              />
              <input
                type="text"
                placeholder="Preço com desconto (opcional)"
                value={formData.discountPrice || ''}
                onChange={(e) => setFormData({ ...formData, discountPrice: e.target.value })}
                className="bg-gray-700 text-white px-4 py-2 rounded border border-gray-600 focus:border-green-500"
              />
              <input
                type="text"
                placeholder="Categoria"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
                className="bg-gray-700 text-white px-4 py-2 rounded border border-gray-600 focus:border-green-500"
              />
              <input
                type="text"
                placeholder="Subcategoria (opcional)"
                value={formData.subcategory || ''}
                onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                className="bg-gray-700 text-white px-4 py-2 rounded border border-gray-600 focus:border-green-500"
              />
              <input
                type="text"
                placeholder="URL da imagem (opcional)"
                value={formData.image || ''}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="bg-gray-700 text-white px-4 py-2 rounded border border-gray-600 focus:border-green-500"
              />
              <textarea
                placeholder="Descrição"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                rows={3}
                className="bg-gray-700 text-white px-4 py-2 rounded border border-gray-600 focus:border-green-500 md:col-span-2"
              />
              <div className="md:col-span-2 flex gap-4">
                <Button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded flex items-center gap-2"
                >
                  <Save size={18} />
                  {editingProduct ? 'Salvar' : 'Adicionar'}
                </Button>
                <Button
                  type="button"
                  onClick={handleCancel}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded flex items-center gap-2"
                >
                  <X size={18} />
                  Cancelar
                </Button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <div className="text-center text-white py-8">
            Carregando produtos...
          </div>
        ) : (
          <div className="bg-gray-800 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Nome</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Preço</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Categoria</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Descrição</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-700/50">
                      <td className="px-6 py-4 whitespace-nowrap text-white">
                        <div>
                          <div className="font-medium">{product.name}</div>
                          {product.subcategory && (
                            <div className="text-gray-400 text-sm">{product.subcategory}</div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-white">
                        <div>
                          <div className={product.discountPrice ? 'line-through text-red-400' : ''}>{product.price}</div>
                          {product.discountPrice && (
                            <div className="text-green-400 font-bold">{product.discountPrice}</div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-white">{product.category}</td>
                      <td className="px-6 py-4 text-white max-w-xs truncate">{product.description}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(product)}
                            className="text-blue-400 hover:text-blue-300"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => product.id && handleDelete(product.id)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}