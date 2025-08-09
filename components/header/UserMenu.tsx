import { useState } from 'react';
import Image from 'next/image';

export function UserMenu({ onClick }: { onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label="Área do usuário"
      className="ml-2 flex items-center p-0 bg-transparent border-none cursor-pointer"
    >
      <Image
        src="/placeholder-user.jpg"
        alt="Usuário"
        width={40}
        height={40}
        className="rounded-full w-10 h-10 object-cover"
      />
    </button>
  );
}
