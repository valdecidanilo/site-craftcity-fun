"use client";
import { signIn } from "next-auth/react";
export default function SignInPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#181c2b] text-white">
      <h1 className="text-3xl font-bold mb-6">Entrar</h1>
      <div className="flex flex-col gap-4 w-full max-w-xs">
        <button
          className="bg-white text-[#151923] font-bold rounded px-6 py-2 flex items-center justify-center gap-2 border border-[#9bf401] hover:bg-[#9bf401] hover:text-[#151923] transition"
          onClick={() => signIn('google')}
        >
          <span className="w-5 h-5 mr-2 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="20" height="20"><g><path fill="#4285F4" d="M24 9.5c3.54 0 6.36 1.22 8.32 2.25l6.16-6.16C34.36 2.34 29.52 0 24 0 14.64 0 6.48 5.84 2.56 14.16l7.28 5.66C12.36 14.02 17.68 9.5 24 9.5z"/><path fill="#34A853" d="M46.1 24.5c0-1.64-.14-3.22-.4-4.75H24v9h12.5c-.52 2.8-2.08 5.18-4.44 6.8l7.16 5.58C43.52 37.16 46.1 31.36 46.1 24.5z"/><path fill="#FBBC05" d="M10.84 28.34c-.6-1.8-.94-3.7-.94-5.84s.34-4.04.94-5.84l-7.28-5.66C2.34 15.64 0 20.48 0 24c0 3.52 2.34 8.36 6.62 13.16l7.28-5.66z"/><path fill="#EA4335" d="M24 48c6.52 0 12-2.16 16.08-5.9l-7.16-5.58c-2.02 1.36-4.62 2.18-8.92 2.18-6.32 0-11.64-4.52-13.52-10.5l-7.28 5.66C6.48 42.16 14.64 48 24 48z"/></g></svg>
          </span>
          Entrar com Google
        </button>
        <button
          className="bg-white text-[#151923] font-bold rounded px-6 py-2 flex items-center justify-center gap-2 border border-[#9bf401] hover:bg-[#9bf401] hover:text-[#151923] transition"
          onClick={() => signIn('azure-ad')}
        >
          <span className="w-5 h-5 mr-2 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="20" height="20"><g><rect x="2" y="2" width="13" height="13" fill="#F25022"/><rect x="17" y="2" width="13" height="13" fill="#7FBA00"/><rect x="2" y="17" width="13" height="13" fill="#00A4EF"/><rect x="17" y="17" width="13" height="13" fill="#FFB900"/></g></svg>
          </span>
          Entrar com Microsoft
        </button>
      </div>
    </div>
  );
}
