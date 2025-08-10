'use client';

import { useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

type ModalProps = {
  open: boolean;
  onClose: () => void;
  initialData?: any;
  onSave?: (data: any) => void;
};

const errorMessages: Record<string, string> = {
  CredentialsSignin: 'E-mail ou senha inválidos.',
  OAuthSignin: 'Erro ao conectar com o provedor.',
  OAuthCallback: 'Erro no retorno do provedor.',
  OAuthCreateAccount: 'Erro ao criar conta no provedor.',
  EmailCreateAccount: 'Erro ao criar conta com e-mail.',
  Callback: 'Erro no callback de autenticação.',
  OAuthAccountNotLinked: 'Conta já vinculada a outro método de login.',
  EmailSignin: 'Erro ao enviar link de login.',
  default: 'Erro desconhecido. Tente novamente.',
};

function translateAuthError(code?: string | null): string {
  if (!code) return 'Erro ao fazer login.';
  return errorMessages[code] ?? errorMessages.default;
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function UserProfileModal({ open, onClose, initialData, onSave }: ModalProps) {
  const [form, setForm] = useState({
    id: undefined as string | undefined,
    nome: '',
    sobrenome: '',
    idade: '',
    email: '',
    senha: '',
    nickname: '',
  });
  const { data: session } = useSession();
  const router = useRouter();
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Prefill no modo "register" quando usuário já tem sessão (editar perfil)
  useEffect(() => {
    if (open && tab === 'register' && session?.user?.email && !form.id) {
      setLoading(true);
      fetch('/api/user')
        .then(async (res) => {
          try {
            const data = await res.json();
            if (data && !data.error) {
              setForm({
                id: data.id,
                nome: data.name || '',
                sobrenome: data.sobrenome || '',
                idade: data.idade || '',
                email: data.email || '',
                senha: '',
                nickname: data.nickname || '',
              });
            }
          } catch {}
        })
        .finally(() => setLoading(false));
    }
  }, [open, tab, session?.user?.email, form.id]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function emailExists(email: string) {
    const res = await fetch('/api/user/exists', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    if (!res.ok) return false;
    const data = await res.json();
    return !!data.exists;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const email = form.email.trim().toLowerCase();
      const senha = form.senha;

      if (!isValidEmail(email)) {
        setMessage('Informe um e-mail válido.');
        setLoading(false);
        return;
      }

      if (tab === 'register') {
        const isCreate = !form.id; // POST se não tiver id; PUT se tiver (editar)
        if (isCreate) {
          // senha obrigatória para novo registro
          if (!senha || senha.length < 6) {
            setMessage('A senha precisa ter pelo menos 6 caracteres.');
            setLoading(false);
            return;
          }

          // checa se email já está cadastrado
          const exists = await emailExists(email);
          if (exists) {
            setMessage('Este e-mail já está cadastrado. Faça login ou recupere sua senha.');
            setLoading(false);
            return;
          }
        }

        const method = isCreate ? 'POST' : 'PUT';
        const res = await fetch('/api/user', {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...form, email }),
        });

        if (res.ok && isCreate) {
          // Auto login após registro
          setMessage('Usuário criado! Fazendo login...');
          const result = await signIn('credentials', {
            email,
            senha,
            redirect: false,
          });

          if (result?.ok) {
            setMessage('Registro e login realizados com sucesso!');
            onSave?.(form);
            setTimeout(() => {
              setMessage(null);
              onClose();
              router.refresh();
            }, 1200);
          } else {
            setMessage(
              translateAuthError(result?.error) ||
                'Usuário criado, mas erro no login automático. Tente fazer login manualmente.'
            );
          }
        } else if (res.ok) {
          setMessage('Perfil atualizado com sucesso!');
          onSave?.(form);
          setTimeout(() => {
            setMessage(null);
            onClose();
          }, 1200);
        } else {
          let errorText = 'Erro ao salvar perfil.';
          try {
            const errorData = await res.json();
            errorText = errorData?.error || errorText;
          } catch {}
          setMessage(errorText);
        }
      } else {
        // LOGIN
        if (!senha) {
          setMessage('Informe sua senha.');
          setLoading(false);
          return;
        }

        const result = await signIn('credentials', {
          email,
          senha,
          redirect: false,
        });

        if (result?.ok) {
          setMessage('Login realizado!');
          onSave?.(form);
          setTimeout(() => {
            setMessage(null);
            onClose();
            router.refresh();
          }, 1200);
        } else {
          setMessage(translateAuthError(result?.error));
        }
      }
    } catch {
      setMessage(tab === 'register' ? 'Erro ao salvar perfil.' : 'Erro de conexão.');
    }
    setLoading(false);
  }

  // Fecha se logar por fora
  useEffect(() => {
    if (!open) return;
    if (session) {
      onClose();
      router.refresh();
    }
  }, [open, session, onClose, router]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-[#181c2b] rounded-xl p-6 lg:p-8 w-full max-w-md text-white shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex gap-4 mb-6 justify-center">
          <button
            type="button"
            className={`px-4 py-2 rounded font-bold ${tab === 'login' ? 'bg-[#9bf401] text-[#151923]' : 'bg-[#23263a] text-white'}`}
            onClick={() => { setTab('login'); setMessage(null); }}
            disabled={loading}
          >
            Login
          </button>
          <button
            type="button"
            className={`px-4 py-2 rounded font-bold ${tab === 'register' ? 'bg-[#9bf401] text-[#151923]' : 'bg-[#23263a] text-white'}`}
            onClick={() => { setTab('register'); setMessage(null); }}
            disabled={loading}
          >
            Registrar
          </button>
        </div>

        <h2 className="text-2xl font-bold mb-6">{tab === 'login' ? 'Login' : (form.id ? 'Editar Perfil' : 'Criar Conta')}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4 flex flex-col">
            <label htmlFor="email" className="font-semibold mb-2">Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="p-2 rounded bg-[#23263a] text-white"
              required
            />
          </div>

          <div className="mb-4 flex flex-col">
            <label htmlFor="senha" className="font-semibold mb-2">Senha</label>
            <input
              name="senha"
              type="password"
              value={form.senha}
              onChange={handleChange}
              className="p-2 rounded bg-[#23263a] text-white"
              // senha obrigatória ao criar conta; opcional ao editar perfil
              required={tab === 'login' || !form.id}
              minLength={tab === 'register' && !form.id ? 6 : undefined}
            />
            {tab === 'register' && !form.id && (
              <span className="text-xs text-white/60 mt-1">Mínimo de 6 caracteres.</span>
            )}
          </div>

          {tab === 'register' && (
            <>
              <div className="mb-4 flex flex-col">
                <label htmlFor="nome" className="font-semibold mb-2">Nome</label>
                <input name="nome" value={form.nome} onChange={handleChange} className="p-2 rounded bg-[#23263a] text-white" />
              </div>

              <div className="mb-4 flex flex-col">
                <label htmlFor="idade" className="font-semibold mb-2">Idade</label>
                <input name="idade" type="number" value={form.idade} onChange={handleChange} className="p-2 rounded bg-[#23263a] text-white" />
              </div>

              <div className="mb-4 flex flex-col">
                <label htmlFor="nickname" className="font-semibold mb-2">Nickname Minecraft</label>
                <input name="nickname" value={form.nickname} onChange={handleChange} className="p-2 rounded bg-[#23263a] text-white" />
              </div>
            </>
          )}

          {tab === 'login' && (
            
            <div className="flex flex-col gap-2 mb-4">
              {message && (
                <div className={`mb-4 text-center font-semibold ${message.includes('sucesso') || message.includes('Login realizado') ? 'text-green-400' : 'text-red-400'}`}>
                  {message}
                </div>
              )}
              <button
                type="button"
                className="bg-white text-[#151923] font-bold rounded px-6 py-2 flex items-center justify-center gap-2 border border-[#9bf401] hover:bg-[#9bf401] hover:text-[#151923] transition"
                onClick={async () => {
                  try {
                    setLoading(true);
                    onClose();
                    await signIn('google', { callbackUrl: window.location.href });
                  } catch {
                    setLoading(false);
                    setMessage('Erro ao fazer login com Google');
                  }
                }}
                disabled={loading}
              >
                {/* ícone Google */}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="20" height="20"><g><path fill="#4285F4" d="M24 9.5c3.54 0 6.36 1.22 8.32 2.25l6.16-6.16C34.36 2.34 29.52 0 24 0 14.64 0 6.48 5.84 2.56 14.16l7.28 5.66C12.36 14.02 17.68 9.5 24 9.5z"/><path fill="#34A853" d="M46.1 24.5c0-1.64-.14-3.22-.4-4.75H24v9h12.5c-.52 2.8-2.08 5.18-4.44 6.8l7.16 5.58C43.52 37.16 46.1 31.36 46.1 24.5z"/><path fill="#FBBC05" d="M10.84 28.34c-.6-1.8-.94-3.7-.94-5.84s.34-4.04.94-5.84l-7.28-5.66C2.34 15.64 0 20.48 0 24c0 3.52 2.34 8.36 6.62 13.16l7.28-5.66z"/><path fill="#EA4335" d="M24 48c6.52 0 12-2.16 16.08-5.9l-7.16-5.58c-2.02 1.36-4.62 2.18-8.92 2.18-6.32 0-11.64-4.52-13.52-10.5l-7.28 5.66C6.48 42.16 14.64 48 24 48z"/></g></svg>
                Entrar com Google
              </button>
            </div>
          )}
          {message && tab === 'register' && (
            <div className={`mb-4 text-center font-semibold ${message.includes('sucesso') || message.includes('Login realizado') ? 'text-green-400' : 'text-red-400'}`}>
              {message}
            </div>
          )}
          <div className="flex flex-col sm:flex-row gap-4 mt-6 justify-center">
            <button type="submit" className="bg-[#9bf401] text-[#151923] font-bold rounded px-6 py-2 w-full sm:w-auto" disabled={loading}>
              {tab === 'login' ? 'Entrar' : (form.id ? 'Salvar' : 'Criar conta')}
            </button>
            <button type="button" className="bg-[#23263a] text-white rounded px-6 py-2 w-full sm:w-auto" onClick={onClose} disabled={loading}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
