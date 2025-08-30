'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export function UserMenu({ onClick }: { onClick?: () => void }) {
  const { data: session, status, update } = useSession();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const isLogged = status === 'authenticated' && !!session?.user;
  const imgSrc = isLogged
    ? (session?.user?.image && session.user.image.trim() !== '' ? session.user.image : '/placeholder-user.png')
    : '/placeholder-not-user.png';

  const displayName = isLogged ? (session?.user?.name || 'Minha conta') : 'Entrar';
  const displayEmail = isLogged ? (session?.user?.email || '') : '';

  const handleOpenLogin = () => {
    // Dispara evento para abrir modal de login/registro
    window.dispatchEvent(new CustomEvent('open-user-profile-modal'));
  };

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, []);

  if (!isLogged) {
    return (
      <button
        onClick={(e) => { 
          e.preventDefault(); 
          handleOpenLogin(); 
        }}
        aria-label="Área do usuário"
        className="ml-2 flex items-center gap-2 p-0 bg-transparent border-none cursor-pointer hover:opacity-80 transition-opacity"
      >
        <span className="text-white text-sm hidden sm:inline">Entrar</span>
        <Image
          src={imgSrc}
          alt="Usuário não autenticado"
          width={40}
          height={40}
          className="rounded-full w-10 h-10 object-cover border-2 border-transparent hover:border-[#9bf401] transition-colors"
        />
      </button>
    );
  }

  return (
    <div className="relative ml-2 overflow-visible" ref={menuRef}>
      <button
      type="button"
        onClick={(e) => {
          e.stopPropagation();
          setOpen(v => !v);
        }}
        aria-label="Menu do usuário"
        className="flex items-center gap-2 p-0 bg-transparent border-none cursor-pointer"
      >
        <span className="text-white text-sm hidden sm:inline font-medium">
          {displayName}
        </span>
        <Image
          src={imgSrc}
          alt={displayName}
          width={40}
          height={40}
          className="rounded-full w-10 h-10 object-cover ring-1 ring-white/20"
        />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-64 rounded-xl bg-[#1b2132] text-white shadow-2xl border border-white/10 p-3 z-50">
          <div className="flex items-center gap-3 p-2 rounded-lg bg-white/5">
            <Image src={imgSrc} alt={displayName} width={36} height={36} className="rounded-full" />
            <div className="min-w-0">
              <div className="font-semibold truncate">{displayName}</div>
              <div className="text-xs text-white/60 truncate">{displayEmail}</div>
            </div>
          </div>

          <button
            onClick={() => { setOpen(false); router.push('/account'); }}
            className="w-full text-left mt-2 px-3 py-2 rounded-lg hover:bg-white/10"
          >
            Meu perfil
          </button>

          <QuickNickname />

          <div className="h-px bg-white/10 my-2" />

          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/10 text-red-300"
          >
            Sair
          </button>
        </div>
      )}
    </div>
  );
}

function QuickNickname() {
  const { data: session, update } = useSession();
  const currentNick = session?.user?.nickname || '';
  const [nick, setNick] = useState(currentNick);
  const [saving, setSaving] = useState(false);
  const [ok, setOk] = useState<null | boolean>(null);

  // Sync input if session nickname changes
  useEffect(() => {
    setNick(currentNick);
  }, [currentNick]);

  return (
    <div className="mt-2 px-3 py-2 rounded-lg">
      <div className="text-sm mb-1">Nickname Minecraft</div>
      <div className="flex gap-2">
        <input
          value={nick}
          onChange={e => setNick(e.target.value)}
          placeholder=""
          className="flex-1 bg-[#23263a] w-1 text-white rounded px-3 py-2 outline-none"
        />
        <button
          onClick={async () => {
            if (!nick.trim()) return;
            setSaving(true);
            setOk(null);
            try {
              const res = await fetch('/api/user', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nickname: nick.trim() }),
              });
              setOk(res.ok);
              if (res.ok) await update();
            } finally {
              setSaving(false);
            }
          }}
          disabled={saving || !nick.trim()}
          className="px-3 py-2 rounded bg-[#9bf401] text-[#151923] font-bold disabled:opacity-60"
        >
          {saving ? 'Salvando...' : 'Salvar'}
        </button>
      </div>
      {ok === true && <div className="text-green-400 text-xs mt-1">Nickname atualizado!</div>}
      {ok === false && <div className="text-red-400 text-xs mt-1">Erro ao salvar.</div>}
    </div>
  );
}