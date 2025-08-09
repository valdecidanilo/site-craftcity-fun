import { useState, useEffect } from 'react';

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
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Buscar dados do usuário ao abrir o modal (apenas para perfil)
  useEffect(() => {
    if (open && tab === 'register') {
      setLoading(true);
      fetch('/api/user')
        .then(res => res.json())
        .then(data => {
          if (data) setForm({
            id: data.id,
            nome: data.nome || '',
            sobrenome: data.sobrenome || '',
            idade: data.idade || '',
            email: data.email || '',
            senha: '',
            nickname: data.nickname || '',
          });
        })
        .finally(() => setLoading(false));
    }
  }, [open, tab]);

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
      } else {
        // login
        res = await fetch('/api/user/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: form.email, senha: form.senha })
        });
      }
      if (res.ok) {
        setMessage(tab === 'register' ? 'Perfil salvo com sucesso!' : 'Login realizado!');
        if (onSave) onSave(form);
        setTimeout(() => {
          setMessage(null);
          onClose();
        }, 1200);
      } else {
        setMessage(tab === 'register' ? 'Erro ao salvar perfil.' : 'Login inválido.');
      }
    } catch (err) {
      setMessage(tab === 'register' ? 'Erro ao salvar perfil.' : 'Login inválido.');
    }
    setLoading(false);
  }

  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-[#181c2b] rounded-xl p-8 min-w-[350px] text-white shadow-2xl">
        <div className="flex gap-4 mb-6 justify-center">
          <button
            type="button"
            className={`px-4 py-2 rounded font-bold ${tab === 'login' ? 'bg-[#9bf401] text-[#151923]' : 'bg-[#23263a] text-white'}`}
            onClick={() => setTab('login')}
            disabled={loading}
          >
            Login
          </button>
          <button
            type="button"
            className={`px-4 py-2 rounded font-bold ${tab === 'register' ? 'bg-[#9bf401] text-[#151923]' : 'bg-[#23263a] text-white'}`}
            onClick={() => setTab('register')}
            disabled={loading}
          >
            Registrar
          </button>
        </div>
        <h2 className="text-2xl font-bold mb-6">{tab === 'login' ? 'Login' : 'Configurar Perfil'}</h2>
        {message && (
          <div className={`mb-4 text-center font-semibold ${message.includes('sucesso') || message.includes('Login realizado') ? 'text-green-400' : 'text-red-400'}`}>{message}</div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4 flex flex-col">
            <label htmlFor="email" className="font-semibold mb-2">Email</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} className="p-2 rounded bg-[#23263a] text-white" />
          </div>
          <div className="mb-4 flex flex-col">
            <label htmlFor="senha" className="font-semibold mb-2">Senha</label>
            <input name="senha" type="password" value={form.senha} onChange={handleChange} className="p-2 rounded bg-[#23263a] text-white" />
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
          <div className="flex gap-4 mt-6 justify-center">
            <button type="submit" className="bg-[#9bf401] text-[#151923] font-bold rounded px-6 py-2" disabled={loading}>{tab === 'login' ? 'Entrar' : 'Salvar'}</button>
            <button type="button" className="bg-[#23263a] text-white rounded px-6 py-2" onClick={onClose} disabled={loading}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
}
