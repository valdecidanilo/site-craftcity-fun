"use client";

import { useEffect, useMemo, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/header/header';
import { Footer } from '@/components/footer/footer';
import { Button } from '@/components/button/button';
import { Plus, Edit, Trash2, Save, X, Tags } from 'lucide-react';

// Formatador de moeda brasileira
const BRL = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

// --- Tipos para pedidos ---
type OrderItem = {
  id: string;
  product: { id: string; name: string; minecraftCommand?: string | null };
  quantity: number;
  price: number;
  commandSent: boolean;
  commandSentAt?: string | null;
  commandResponse?: string | null;
};

type Order = {
  id: string;
  user: { id: string; name?: string | null; email?: string | null; nickname?: string | null };
  createdAt: string;
  status: string;
  items: OrderItem[];
};

type Subcategory = {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
  order: number;
  _count?: { products: number };
};

type Category = {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
  order: number;
  subcategories: Subcategory[];
  _count?: { products: number };
};

type Product = {
  id: string;
  name: string;
  price: number;
  discountPrice?: number | null;
  description: string;
  image?: string | null;
  categoryId: string;
  subcategoryId?: string | null;
  category?: { id: string; name: string; slug: string } | null;
  subcategory?: { id: string; name: string; slug: string } | null;
  isExpirable?: boolean;
  expireDays?: number | null;
  expireCommand?: string | null;
  minecraftCommand?: string | null;
};

type FormProduct = {
  id?: string;
  name: string;
  price: string; // input como string, convertemos ao salvar
  discountPrice: string;
  description: string;
  image: string;
  categoryId: string;
  subcategoryId: string; // vazio quando não selecionado
  isExpirable: boolean;
  expireDays: string;
  expireCommand: string;
  minecraftCommand: string;
};

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Estados
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminLoading, setAdminLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  // Form states
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<FormProduct>({
    name: '',
    price: '',
    discountPrice: '',
    description: '',
    image: '',
    categoryId: '',
    subcategoryId: '',
    isExpirable: false,
    expireDays: '',
    expireCommand: '',
    minecraftCommand: '',
  });

  // Category states
  const [catOpen, setCatOpen] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [newSubcategory, setNewSubcategory] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [catSaving, setCatSaving] = useState(false);

  // Order states
  const [orderLoading, setOrderLoading] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [orderFilter, setOrderFilter] = useState('');

  // Verificação de admin
  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/');
      return;
    }

    checkAdmin();
  }, [status, router, session]);

  async function checkAdmin() {
    try {
      setAdminLoading(true);
      const res = await fetch('/api/user/admin', { cache: 'no-store' });
      const data = await res.json();
      if (!res.ok || !data?.isAdmin) {
        router.push('/');
        return;
      }
      setIsAdmin(true);
      await Promise.all([loadCategories(), loadProducts(), loadOrders()]);
    } catch {
      router.push('/');
    } finally {
      setAdminLoading(false);
    }
  }

  // --------- Loads ----------
  async function loadCategories() {
    try {
      const res = await fetch('/api/categories', { cache: 'no-store' });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || 'Falha ao carregar categorias');
      setCategories(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao carregar categorias');
    }
  }

  async function loadProducts() {
    try {
      setLoading(true);
      const res = await fetch('/api/products', { cache: 'no-store' });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || 'Falha ao carregar produtos');
      setProducts(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao carregar produtos');
    } finally {
      setLoading(false);
    }
  }

  async function loadOrders(nick?: string) {
    setOrderLoading(true);
    setOrderError(null);
    try {
      const url = nick ? `/api/admin/orders?nickname=${encodeURIComponent(nick)}` : '/api/admin/orders';
      const res = await fetch(url, { cache: 'no-store' });
      let json;
      try {
        json = await res.json();
      } catch (e) {
        throw new Error('Erro ao carregar compras: resposta inesperada do servidor.');
      }
      if (!res.ok) throw new Error(json?.error || 'Falha ao carregar pedidos');
      setOrders(json);
    } catch (err) {
      setOrderError(err instanceof Error ? err.message : 'Falha ao carregar pedidos');
    } finally {
      setOrderLoading(false);
    }
  }

  // --------- Form helpers ----------
  function resetForm() {
    setEditing(null);
    setForm({
      name: '',
      price: '',
      discountPrice: '',
      description: '',
      image: '',
      categoryId: '',
      subcategoryId: '',
      isExpirable: false,
      expireDays: '',
      expireCommand: '',
      minecraftCommand: '',
    });
  }

  function startCreate() {
    resetForm();
    setShowForm(true);
  }

  function startEdit(p: Product) {
    setEditing(p);
    setForm({
      id: p.id,
      name: p.name,
      price: p.price?.toString() ?? '',
      discountPrice: p.discountPrice?.toString() ?? '',
      description: p.description ?? '',
      image: p.image ?? '',
      categoryId: p.categoryId ?? '',
      subcategoryId: p.subcategoryId ?? '',
      isExpirable: !!p.isExpirable,
      expireDays: p.expireDays?.toString() ?? '',
      expireCommand: p.expireCommand ?? '',
      minecraftCommand: p.minecraftCommand ?? '',
    });
    setShowForm(true);
  }

  function onCategoryChange(catId: string) {
    setForm((f) => ({
      ...f,
      categoryId: catId,
      subcategoryId: '', // limpa sub quando muda a categoria
    }));
  }

  const subcategoryOptions = useMemo(() => {
    const cat = categories.find((c) => c.id === form.categoryId);
    return cat?.subcategories ?? [];
  }, [categories, form.categoryId]);

  // --------- CRUD ----------
  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setMessage(null);

    try {
      // validações simples
      if (!form.name.trim()) throw new Error('Informe o nome do produto');
      if (!form.categoryId) throw new Error('Selecione uma categoria');
      const priceNum = Number(form.price);
      if (!Number.isFinite(priceNum) || priceNum <= 0) throw new Error('Preço inválido');

      const discountNum =
        form.discountPrice.trim() === '' ? null : Number(form.discountPrice);
      if (discountNum != null && (!Number.isFinite(discountNum) || discountNum < 0)) {
        throw new Error('Preço com desconto inválido');
      }

      const payload = {
        name: form.name.trim(),
        price: priceNum,
        discountPrice: discountNum,
        description: form.description.trim(),
        image: form.image.trim() || null,
        categoryId: form.categoryId,
        subcategoryId: form.subcategoryId || null,
        isExpirable: !!form.isExpirable,
        expireDays: form.isExpirable && form.expireDays ? Number(form.expireDays) : null,
        expireCommand: form.isExpirable ? form.expireCommand.trim() : null,
      };

      const method = editing ? 'PUT' : 'POST';
      const url = editing ? `/api/products/${editing.id}` : '/api/products';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Erro ao salvar produto');

      setMessage(editing ? 'Produto atualizado!' : 'Produto criado!');
      await loadProducts();
      setShowForm(false);
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar');
    } finally {
      setSaving(false);
    }
  }

  async function onDelete(id: string) {
    if (!confirm('Tem certeza que deseja deletar este produto?')) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Erro ao deletar produto');
      await loadProducts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao deletar');
    }
  }

  async function addCategory(e: React.FormEvent) {
    e.preventDefault();
    if (!newCategory.trim()) return;
    try {
      setCatSaving(true);
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCategory.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Erro ao criar categoria');
      setNewCategory('');
      await loadCategories();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erro ao criar categoria');
    } finally {
      setCatSaving(false);
    }
  }

  async function addSubcategory(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedCategory || !newSubcategory.trim()) return;
    try {
      setCatSaving(true);
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newSubcategory.trim(),
          categoryId: selectedCategory,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Erro ao criar subcategoria');
      setNewSubcategory('');
      setSelectedCategory('');
      await loadCategories();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erro ao criar subcategoria');
    } finally {
      setCatSaving(false);
    }
  }

  // Função para reenvio de comando
  async function resendCommand(itemId: string) {
    if (!confirm('Tem certeza que deseja reenviar o comando deste item?')) return;
    try {
      setOrderLoading(true);
      const res = await fetch(`/api/orders/resend-command/${itemId}`, { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Erro ao reenviar comando');
      setMessage('Comando reenviado com sucesso!');
      await loadOrders();
    } catch (err) {
      setOrderError(err instanceof Error ? err.message : 'Erro ao reenviar comando');
    } finally {
      setOrderLoading(false);
    }
  }

  // Filtrar pedidos por nickname
  async function handleOrderFilter(e: React.FormEvent) {
    e.preventDefault();
    try {
      setOrderLoading(true);
      const res = await fetch(`/api/orders?nickname=${encodeURIComponent(orderFilter)}`, { cache: 'no-store' });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Erro ao filtrar pedidos');
      setOrders(data);
    } catch (err) {
      setOrderError(err instanceof Error ? err.message : 'Erro ao filtrar pedidos');
    } finally {
      setOrderLoading(false);
    }
  }

  // --------- Guards render ----------
  if (status === 'loading' || adminLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#151923' }}>
        <div className="text-white">Carregando...</div>
      </div>
    );
  }

  if (!session || !isAdmin) return null;

  // --------- UI ----------
  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#151923' }}>
      <Header />

      <main className="container mx-auto px-4 py-8 pt-20 flex-1">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white">Dashboard Admin</h1>
          <div className="flex gap-3">
            <Button
              onClick={startCreate}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg flex items-center gap-2"
            >
              <Plus size={20} />
              Adicionar Produto
            </Button>
          </div>
        </div>

        {/* Painel de Categorias (responsivo) */}
        <section className="bg-[#181c2b] border border-white/10 rounded-xl p-4 sm:p-6 mb-8">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <Tags className="w-5 h-5 text-[#9bf401]" />
              <h2 className="text-lg sm:text-xl font-semibold text-white">Categorias & Subcategorias</h2>
            </div>

            {/* Toggle só no mobile */}
            <button
              onClick={() => setCatOpen(v => !v)}
              className="sm:hidden px-3 py-2 text-sm rounded bg-[#23263a] text-white border border-white/10"
              aria-expanded={catOpen}
              aria-controls="cats-panel"
              type="button"
            >
              {catOpen ? 'Fechar' : 'Abrir'}
            </button>
          </div>

          <div
            id="cats-panel"
            className={`transition-all duration-200 overflow-hidden sm:overflow-visible
                        ${catOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0 sm:max-h-none sm:opacity-100'}`}
          >
            {categories.length === 0 && (
              <div className="text-white/70 mb-4">Nenhuma categoria cadastrada.</div>
            )}

            {categories.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 mb-6">
                {categories.map((cat) => (
                  <div
                    key={cat.id}
                    className="rounded-lg bg-[#1b2132] border border-white/10 p-4"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="text-white font-semibold truncate">
                        {cat.name}{' '}
                        <span className="text-white/50">({cat._count?.products ?? 0})</span>
                      </div>
                      {!cat.isActive && (
                        <span className="text-[10px] px-2 py-1 rounded bg-red-500/20 text-red-300 shrink-0">
                          inativa
                        </span>
                      )}
                    </div>

                    {cat.subcategories?.length ? (
                      <ul className="mt-3 space-y-1 max-h-40 overflow-auto pr-1 sm:max-h-none sm:overflow-visible">
                        {cat.subcategories.map((sub) => (
                          <li key={sub.id} className="text-white/80 text-sm flex justify-between gap-2">
                            <span className="truncate">{sub.name}</span>
                            <span className="text-white/50 shrink-0">({sub._count?.products ?? 0})</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="text-white/60 text-sm mt-2">Sem subcategorias</div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Formulários de adicionar: empilham no mobile */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 mb-6">
              <form onSubmit={addCategory} className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  placeholder="Nova categoria"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="flex-1 bg-[#23263a] text-white px-4 py-2 rounded border border-white/10 focus:outline-none focus:border-[#9bf401]"
                />
                <Button
                  type="submit"
                  disabled={catSaving}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                >
                  Adicionar
                </Button>
              </form>

              <form onSubmit={addSubcategory} className="flex flex-col sm:flex-row gap-2">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="bg-[#23263a] text-white px-4 py-2 rounded border border-white/10 focus:outline-none focus:border-[#9bf401]"
                >
                  <option value="">Categoria</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Nova subcategoria"
                  value={newSubcategory}
                  onChange={(e) => setNewSubcategory(e.target.value)}
                  className="flex-1 bg-[#23263a] text-white px-4 py-2 rounded border border-white/10 focus:outline-none focus:border-[#9bf401]"
                />
                <Button
                  type="submit"
                  disabled={catSaving || !selectedCategory}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                >
                  Adicionar
                </Button>
              </form>
            </div>
          </div>
        </section>

        {/* Formulário de Produto */}
        {showForm && (
          <section className="bg-[#181c2b] border border-white/10 rounded-xl p-6 mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">
              {editing ? 'Editar Produto' : 'Adicionar Produto'}
            </h2>

            {error && (
              <div className="mb-4 bg-red-500/20 border border-red-500 text-red-300 rounded px-4 py-2">
                {error}
              </div>
            )}
            {message && (
              <div className="mb-4 bg-green-500/20 border border-green-500 text-green-300 rounded px-4 py-2">
                {message}
              </div>
            )}

            <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <input
                type="text"
                placeholder="Nome do produto"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                className="bg-[#23263a] text-white px-4 py-2 rounded border border-white/10 focus:outline-none focus:border-[#9bf401]"
              />

              <input
                type="number"
                step="0.01"
                placeholder="Preço"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                required
                className="bg-[#23263a] text-white px-4 py-2 rounded border border-white/10 focus:outline-none focus:border-[#9bf401]"
              />

              <input
                type="number"
                step="0.01"
                placeholder="Preço com desconto (opcional)"
                value={form.discountPrice}
                onChange={(e) => setForm({ ...form, discountPrice: e.target.value })}
                className="bg-[#23263a] text-white px-4 py-2 rounded border border-white/10 focus:outline-none focus:border-[#9bf401]"
              />

              <input
                type="text"
                placeholder="URL da imagem (opcional)"
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
                className="bg-[#23263a] text-white px-4 py-2 rounded border border-white/10 focus:outline-none focus:border-[#9bf401]"
              />
              <div className='w-full'>
                <label className="block text-white/80 text-sm mb-2">Comando ao comprar</label>
                <input
                  type="text"
                  placeholder="/comando para executar ao comprar"
                  value={form.minecraftCommand}
                  onChange={(e) => setForm({ ...form, minecraftCommand: e.target.value })}
                  required
                  className="bg-[#23263a] text-white px-4 py-2 rounded border border-white/10 focus:outline-none focus:border-[#9bf401]"
                />
              </div>
              {/* Toggle para produto expirável */}
              <div className="md:col-span-2 flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isExpirable"
                  checked={form.isExpirable}
                  onChange={e => setForm(f => ({ ...f, isExpirable: e.target.checked }))}
                  className="w-4 h-4"
                />
                <label htmlFor="isExpirable" className="text-white/80 text-sm select-none cursor-pointer">Produto expirável</label>
              </div>
              
              {/* Campos de expiração, só aparecem se toggle ativado */}
              {form.isExpirable && (
                <>
                  <div>
                    <label className="block text-white/80 text-sm mb-2">Dias de validade</label>
                    <input
                      type="number"
                      min="1"
                      placeholder="Ex: 30"
                      value={form.expireDays}
                      onChange={e => setForm(f => ({ ...f, expireDays: e.target.value }))}
                      className="w-full bg-[#23263a] text-white px-4 py-2 rounded border border-white/10 focus:outline-none focus:border-[#9bf401]"
                    />
                  </div>
                  <div>
                    <label className="block text-white/80 text-sm mb-2">Comando ao expirar</label>
                    <input
                      type="text"
                      placeholder="/comando para expiração"
                      value={form.expireCommand}
                      onChange={e => setForm(f => ({ ...f, expireCommand: e.target.value }))}
                      className="w-full bg-[#23263a] text-white px-4 py-2 rounded border border-white/10 focus:outline-none focus:border-[#9bf401]"
                    />
                  </div>
                </>
              )}
              
              <div className="md:col-span-1">
                <label className="block text-white/80 text-sm mb-2">Categoria</label>
                <select
                  value={form.categoryId}
                  onChange={(e) => onCategoryChange(e.target.value)}
                  required
                  className="w-full bg-[#23263a] text-white px-4 py-2 rounded border border-white/10 focus:outline-none focus:border-[#9bf401]"
                >
                  <option value="">Selecione...</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-1">
                <label className="block text-white/80 text-sm mb-2">Subcategoria (opcional)</label>
                <select
                  value={form.subcategoryId}
                  onChange={(e) => setForm({ ...form, subcategoryId: e.target.value })}
                  disabled={!form.categoryId}
                  className="w-full bg-[#23263a] text-white px-4 py-2 rounded border border-white/10 disabled:opacity-50 focus:outline-none focus:border-[#9bf401]"
                >
                  <option value="">Sem subcategoria</option>
                  {subcategoryOptions.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <textarea
                placeholder="Descrição"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3}
                className="md:col-span-2 bg-[#23263a] text-white px-4 py-2 rounded border border-white/10 focus:outline-none focus:border-[#9bf401]"
              />

              <div className="md:col-span-2 flex gap-3 mt-2">
                <Button
                  type="submit"
                  disabled={saving}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded flex items-center gap-2"
                >
                  <Save size={18} />
                  {editing ? 'Salvar' : 'Adicionar'}
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    resetForm();
                    setShowForm(false);
                  }}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded flex items-center gap-2"
                >
                  <X size={18} />
                  Cancelar
                </Button>
              </div>
            </form>
          </section>
        )}

        {/* Painel de Compras de Usuários */}
        <section className="bg-[#181c2b] border border-white/10 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Compras de Usuários</h2>
          <form onSubmit={handleOrderFilter} className="flex flex-col sm:flex-row gap-2 mb-4">
            <input
              type="text"
              placeholder="Filtrar por nickname do jogador"
              value={orderFilter}
              onChange={e => setOrderFilter(e.target.value)}
              className="bg-[#23263a] text-white px-4 py-2 rounded border border-white/10 focus:outline-none focus:border-[#9bf401]"
            />
            <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">Filtrar</Button>
          </form>
          {orderLoading ? (
            <div className="text-white/70">Carregando compras...</div>
          ) : orderError ? (
            <div className="text-red-400">{orderError}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-white text-sm">
                <thead className="bg-[#1b2132]">
                  <tr>
                    <th className="px-4 py-2">Data</th>
                    <th className="px-4 py-2">Usuário</th>
                    <th className="px-4 py-2">Nickname</th>
                    <th className="px-4 py-2">Produto</th>
                    <th className="px-4 py-2">Qtd</th>
                    <th className="px-4 py-2">Comando</th>
                    <th className="px-4 py-2">Status</th>
                    <th className="px-4 py-2">Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.length === 0 && (
                    <tr><td colSpan={8} className="text-center py-8 text-white/60">Nenhuma compra encontrada.</td></tr>
                  )}
                  {orders.flatMap(order => order.items.map(item => (
                    <tr key={item.id} className="border-b border-white/10">
                      <td className="px-4 py-2 whitespace-nowrap">{new Date(order.createdAt).toLocaleString()}</td>
                      <td className="px-4 py-2 whitespace-nowrap">{order.user.name || order.user.email || '—'}</td>
                      <td className="px-4 py-2 whitespace-nowrap">{order.user.nickname || '—'}</td>
                      <td className="px-4 py-2 whitespace-nowrap">{item.product.name}</td>
                      <td className="px-4 py-2 text-center">{item.quantity}</td>
                      <td className="px-4 py-2 font-mono text-xs">{item.product.minecraftCommand || '—'}</td>
                      <td className="px-4 py-2">
                        {item.commandSent ? (
                          <span className="text-green-400">Enviado</span>
                        ) : (
                          <span className="text-yellow-400">Pendente</span>
                        )}
                        {item.commandSentAt && (
                          <div className="text-white/40 text-xs">{new Date(item.commandSentAt).toLocaleString()}</div>
                        )}
                        {item.commandResponse && (
                          <div className="text-white/60 text-xs">{item.commandResponse}</div>
                        )}
                      </td>
                      <td className="px-4 py-2">
                        <Button
                          onClick={() => resendCommand(item.id)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs"
                          disabled={orderLoading}
                        >Reenviar</Button>
                      </td>
                    </tr>
                  )))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Tabela de Produtos */}
        {loading ? (
          <div className="text-center text-white py-10">Carregando produtos...</div>
        ) : (
          <section className="bg-[#181c2b] border border-white/10 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#1b2132]">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase">Nome</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase">Preço</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase">Categoria</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase">Descrição</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-white/5">
                      <td className="px-6 py-4 whitespace-nowrap text-white">
                        <div className="font-medium">{p.name}</div>
                        {p.subcategory?.name && (
                          <div className="text-white/60 text-sm">{p.subcategory.name}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-white">
                        <div className={p.discountPrice ? 'line-through text-red-400' : ''}>
                          {BRL.format(Number(p.price))}
                        </div>
                        {p.discountPrice != null && (
                          <div className="text-[#9bf401] font-bold">
                            {BRL.format(Number(p.discountPrice))}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-white">
                        {p.category?.name ?? '—'}
                      </td>
                      <td className="px-6 py-4 text-white/90 max-w-md truncate">{p.description}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex gap-2">
                          <button
                            onClick={() => startEdit(p)}
                            className="text-blue-400 hover:text-blue-300"
                            title="Editar"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => onDelete(p.id)}
                            className="text-red-400 hover:text-red-300"
                            title="Excluir"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {products.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-white/70">
                        Nenhum produto cadastrado.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}