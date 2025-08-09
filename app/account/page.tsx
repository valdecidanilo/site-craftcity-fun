'use client';

import { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

import { Header } from '@/components/header/header';
import { Footer } from '@/components/footer/footer';

export default function AccountPage() {
  const { status } = useSession();
  const router = useRouter();
  const [form, setForm] = useState({ nome: '', sobrenome: '', idade: '', email: '', nickname: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/');
  }, [status, router]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch('/api/user', { cache: 'no-store' });
        if (res.status === 401 || res.status === 403) {
          router.push('/');
          return;
        }
        const data = await safeJson(res);
        if (!mounted) return;
        setForm({
          nome: data?.nome ?? data?.name ?? '',
          sobrenome: data?.sobrenome ?? '',
          idade: (data?.idade ?? '').toString(),
          email: data?.email ?? '',
          nickname: data?.nickname ?? '',
        });
      } catch (e) {
        console.error('Falha ao carregar /api/user', e);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [router]);

  async function save() {
    setSaving(true);
    setMsg(null);
    try {
      const res = await fetch('/api/user', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: form.nome,
          sobrenome: form.sobrenome,
          idade: Number(form.idade) || null,
          nickname: form.nickname,
        }),
      });

      const data = await safeJson(res);
      if (res.ok) {
        setMsg(data?.message ?? 'Perfil salvo!');
      } else {
        setMsg(data?.error ?? data?.message ?? 'Erro ao salvar.');
      }
    } catch (e) {
      setMsg('Erro inesperado ao salvar.');
    } finally {
      setSaving(false);
    }
  }

  async function safeJson(res: Response) {
    const text = await res.text();
    if (!text) return null;
    try {
      return JSON.parse(text);
    } catch {
      return null;
    }
  }

  if (loading) {
    // mantém o shell padrão enquanto carrega
    return (
      <div className="min-h-screen text-white" style={{ background: '#151923' }}>
        <div className="w-full fixed top-0 left-0 z-50">
          <Header />
        </div>
        <div className="relative w-full flex pt-[72px]">
          <div className="mx-auto p-6">Carregando perfil...</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white" style={{ background: '#151923' }}>
      {/* Header fixo igual à home */}
      <div className="w-full fixed top-0 left-0 z-50">
        <Header />
      </div>
        <main className="flex-1 flex flex-col items-center p-8 pt-[10rem] space-y-12">
          <div className="w-full max-w-3xl">
            <h1 className="text-2xl font-bold mb-4">Meu Perfil</h1>

            {msg && (
              <div className={`mb-4 ${msg.includes('Erro') ? 'text-red-400' : 'text-green-400'}`}>{msg}</div>
            )}

            {/* Card no mesmo estilo da loja (bg, borda, radius) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#181c2b] p-6 rounded-xl border border-white/10">
              <Field label="Email" value={form.email} disabled onChange={() => {}} />
              <Field
                label="Nickname Minecraft"
                value={form.nickname}
                onChange={(v) => setForm((f) => ({ ...f, nickname: v }))}
              />
              <Field label="Nome" value={form.nome} onChange={(v) => setForm((f) => ({ ...f, nome: v }))} />
              <Field
                label="Sobrenome"
                value={form.sobrenome}
                onChange={(v) => setForm((f) => ({ ...f, sobrenome: v }))}
              />
              <Field label="Idade" type="number" value={form.idade} onChange={(v) => setForm((f) => ({ ...f, idade: v }))} />
            </div>

            <div className="flex gap-3 mt-6 justify-center">
              <button
                onClick={save}
                disabled={saving}
                className="bg-[#9bf401] text-[#151923] font-bold rounded px-6 py-2 disabled:opacity-60"
              >
                {saving ? 'Salvando...' : 'Salvar'}
              </button>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="bg-[#23263a] text-white rounded px-6 py-2"
              >
                Sair da conta
              </button>
            </div>
          </div>
        </main>
      </div>
    );
}

function Field({
  label,
  value,
  onChange,
  disabled,
  type = 'text',
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
  type?: string;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="font-semibold">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        type={type}
        className="p-2 rounded bg-[#23263a] text-white disabled:opacity-60"
      />
    </label>
  );
}
