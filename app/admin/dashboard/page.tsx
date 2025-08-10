'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/header/header';
import { Footer } from '@/components/footer/footer';
import { Button } from '@/components/button/button';
import { Plus, Edit, Trash2, Save, X, Tags } from 'lucide-react';

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
};

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [isAdmin, setIsAdmin] = useState(false);
  const [adminLoading, setAdminLoading] = useState(true);

  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const [editing, setEditing] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState<FormProduct>({
    name: '',
    price: '',
    discountPrice: '',
    description: '',
    image: '',
    categoryId: '',
    subcategoryId: '',
  });

  const BRL = useMemo(
    () => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }),
    []
  );

  // --------- Guards / Admin check ----------
  useEffect(() => {
    if (status === 'loading') return;

    if (status === 'unauthenticated') {
      router.push('/auth/signin');
      return;
    }

    checkAdmin();
  }, [status, router]);

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
      await Promise.all([loadCategories(), loadProducts()]);
    } catch (err) {
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

        {/* Painel de Categorias */}
        <section className="bg-[#181c2b] border border-white/10 rounded-xl p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Tags className="w-5 h-5 text-[#9bf401]" />
            <h2 className="text-xl font-semibold text-white">Categorias & Subcategorias</h2>
          </div>

          {categories.length === 0 ? (
            <div className="text-white/70">Nenhuma categoria cadastrada.</div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {categories.map((cat) => (
                <div key={cat.id} className="rounded-lg bg-[#1b2132] border border-white/10 p-4">
                  <div className="flex items-center justify-between">
                    <div className="text-white font-semibold">
                      {cat.name} <span className="text-white/50">({cat._count?.products ?? 0})</span>
                    </div>
                    {!cat.isActive && <span className="text-xs px-2 py-1 rounded bg-red-500/20 text-red-300">inativa</span>}
                  </div>
                  {cat.subcategories?.length ? (
                    <ul className="mt-3 space-y-1">
                      {cat.subcategories.map((sub) => (
                        <li key={sub.id} className="text-white/80 text-sm flex justify-between">
                          <span>{sub.name}</span>
                          <span className="text-white/50">({sub._count?.products ?? 0})</span>
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
        </section>

        {/* Formulário de Produto */}
        {showForm && (
          <section className="bg-[#181c2b] border border-white/10 rounded-xl p-6 mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">
              {editing ? 'Editar Produto' : 'Adicionar Produto'}
            </h2>

            {error && (
              <div className="mb-4 bg-red-500/20 border border-red-500 text-red-300 rounded px-4 py-2">{error}</div>
            )}
            {message && (
              <div className="mb-4 bg-green-500/20 border border-green-500 text-green-300 rounded px-4 py-2">{message}</div>
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
