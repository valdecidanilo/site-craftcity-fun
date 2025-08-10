import { useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export function UserProfileModal({ open, onClose, initialData, onSave }: {
  open: boolean;
  onClose: () => void;
  initialData?: any;
  onSave?: (data: any) => void;
}) {
  const [form, setForm] = useState({
    id: undefined,
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

  // Buscar dados do usuário apenas uma vez ao abrir o modal na tab register
  useEffect(() => {
    if (open && tab === 'register' && session?.user?.email && !form.id) {
      setLoading(true);
      fetch('/api/user')
        .then(res => res.json())
        .then(data => {
          if (data && !data.error) setForm({
            id: data.id,
            nome: data.name || '',
            sobrenome: data.sobrenome || '',
            idade: data.idade || '',
            email: data.email || '',
            senha: '',
            nickname: data.nickname || '',
          });
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [open, session?.user?.email]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      let res;
      if (tab === 'register') {
        const method = form.id ? 'PUT' : 'POST';
        res = await fetch('/api/user', {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form)
        });
        
        if (res.ok && method === 'POST') {
          // Auto login após registro bem-sucedido via NextAuth
          setMessage('Usuário criado! Fazendo login...');
          const result = await signIn('credentials', {
            email: form.email,
            senha: form.senha,
            redirect: false
          });
          
          if (result?.ok) {
            setMessage('Registro e login realizados com sucesso!');
            if (onSave) onSave(form);
            setTimeout(() => {
              setMessage(null);
              onClose();
              router.refresh();
            }, 1200);
          } else {
            setMessage('Usuário criado, mas erro no login automático. Tente fazer login manualmente.');
          }
        } else if (res.ok) {
          setMessage('Perfil atualizado com sucesso!');
          if (onSave) onSave(form);
          setTimeout(() => {
            setMessage(null);
            onClose();
          }, 1200);
        } else {
          const errorData = await res.json();
          setMessage(errorData.error || 'Erro ao salvar perfil.');
        }
      } else {
        // login via NextAuth credentials
        const result = await signIn('credentials', {
          email: form.email,
          senha: form.senha,
          redirect: false
        });
        
        if (result?.ok) {
          setMessage('Login realizado!');
          if (onSave) onSave(form);
          setTimeout(() => {
            setMessage(null);
            onClose();
            router.refresh();
          }, 1200);
        } else {
          setMessage(result?.error || 'Login inválido.');
        }
      }
    } catch (err) {
      setMessage(tab === 'register' ? 'Erro ao salvar perfil.' : 'Erro de conexão.');
    }
    setLoading(false);
  }

  useEffect(() => {
    if(!open) return;
    if (session) {
      onClose();
      router.refresh();
    }
  }, [open, session, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-[#181c2b] rounded-xl p-6 lg:p-8 w-full max-w-md text-white shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex gap-4 mb-6 justify-center">
          <button
            type="button"
            className={`px-4 py-2 rounded font-bold ${tab === 'login' ? 'bg-[#9bf401] text-[#151923]' : 'bg-[#23263a] text-white'}`}
            onClick={() => {setTab('login'); setMessage(null);}}
            disabled={loading}
          >
            Login
          </button>
          <button
            type="button"
            className={`px-4 py-2 rounded font-bold ${tab === 'register' ? 'bg-[#9bf401] text-[#151923]' : 'bg-[#23263a] text-white'}`}
            onClick={() => {setTab('register'); setMessage(null);}}
            disabled={loading}
          >
            Registrar
          </button>
        </div>
        <h2 className="text-2xl font-bold mb-6">{tab === 'login' ? 'Login' : 'Configurar Perfil'}</h2>

  <form onSubmit={handleSubmit}>
          <div className="mb-4 flex flex-col">
            <label htmlFor="email" className="font-semibold mb-2">Email</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} className="p-2 rounded bg-[#23263a] text-white" />
          </div>
          <div className="mb-4 flex flex-col">
            <label htmlFor="senha" className="font-semibold mb-2">Senha</label>
            <input name="senha" type="password" value={form.senha} onChange={handleChange} className="p-2 rounded bg-[#23263a] text-white" />
          </div>
          {tab === 'login' && (
            
            <div className="flex flex-col gap-2 mb-4">
                {message && (
                    <div className={`mb-4 text-center font-semibold ${message.includes('sucesso') || message.includes('Login realizado') ? 'text-green-400' : 'text-red-400'}`}>{message}</div>
                )}
                <button
                type="button"
                className="bg-white text-[#151923] font-bold rounded px-6 py-2 flex items-center justify-center gap-2 border border-[#9bf401] hover:bg-[#9bf401] hover:text-[#151923] transition"
onClick={async () => {
                    try {
                        setLoading(true);
                        onClose(); // Close modal before redirect
                        await signIn('google', {
                            callbackUrl: window.location.href,
                        });
                    } catch (e) {
                        setLoading(false);
                        setMessage('Erro ao fazer login com Google');
                    }
                }}
                disabled={loading}
                >
                
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="20" height="20"><g><path fill="#4285F4" d="M24 9.5c3.54 0 6.36 1.22 8.32 2.25l6.16-6.16C34.36 2.34 29.52 0 24 0 14.64 0 6.48 5.84 2.56 14.16l7.28 5.66C12.36 14.02 17.68 9.5 24 9.5z"/><path fill="#34A853" d="M46.1 24.5c0-1.64-.14-3.22-.4-4.75H24v9h12.5c-.52 2.8-2.08 5.18-4.44 6.8l7.16 5.58C43.52 37.16 46.1 31.36 46.1 24.5z"/><path fill="#FBBC05" d="M10.84 28.34c-.6-1.8-.94-3.7-.94-5.84s.34-4.04.94-5.84l-7.28-5.66C2.34 15.64 0 20.48 0 24c0 3.52 2.34 8.36 6.62 13.16l7.28-5.66z"/><path fill="#EA4335" d="M24 48c6.52 0 12-2.16 16.08-5.9l-7.16-5.58c-2.02 1.36-4.62 2.18-8.92 2.18-6.32 0-11.64-4.52-13.52-10.5l-7.28 5.66C6.48 42.16 14.64 48 24 48z"/></g></svg>
                Entrar com Google
                </button>
            </div>
          )}
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
          {tab === 'register' && message && (
            <div className={`mb-4 text-center font-semibold ${message.includes('sucesso') || message.includes('Login realizado') ? 'text-green-400' : 'text-red-400'}`}>{message}</div>
          )}
          <div className="flex flex-col sm:flex-row gap-4 mt-6 justify-center">
            <button type="submit" className="bg-[#9bf401] text-[#151923] font-bold rounded px-6 py-2 w-full sm:w-auto" disabled={loading}>{tab === 'login' ? 'Entrar' : 'Salvar'}</button>
            <button type="button" className="bg-[#23263a] text-white rounded px-6 py-2 w-full sm:w-auto" onClick={onClose} disabled={loading}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
}
