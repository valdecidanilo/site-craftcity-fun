'use client';
import { useState, useEffect } from 'react';
import { Home, ShoppingCart, Settings, Menu, X, FileText, Shield } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { UserMenu } from '../auth/UserMenu';

export function Header() {
    const { data: session } = useSession();
    const [isAdmin, setIsAdmin] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        setIsAdmin((session?.user as any)?.isAdmin || false);
    }, [session]);

    return (
        <header className="bg-[#151923] p-4">
            <div className="flex justify-between items-center">
                <a href="/" className="text-white font-bold flex items-center gap-2 hover:text-[#9bf401] transition-colors">
                    <Home className="w-6 h-6" /> 
                    <span>Início</span>
                </a>
                
                {/* Menu Desktop */}
                <div className="hidden md:flex items-center gap-6">
                    <a href="/cart" className="text-white flex items-center gap-2 hover:text-[#9bf401] transition-colors">
                        <ShoppingCart className="w-6 h-6" /> 
                        Carrinho
                    </a>
                    {/*
                    <a href="/terms" className="text-white flex items-center gap-2 hover:text-[#9bf401] transition-colors">
                        <FileText className="w-5 h-5" /> 
                        Termos
                    </a>
                    
                    <a href="/privacy" className="text-white flex items-center gap-2 hover:text-[#9bf401] transition-colors">
                        <Shield className="w-5 h-5" /> 
                        Privacidade
                    </a>
                    
                    {isAdmin && (
                        <a href="/admin/dashboard" className="text-white flex items-center gap-2 hover:text-[#FD8500] transition-colors">
                            <Settings className="w-6 h-6" /> 
                            Admin
                        </a>
                    )}
                    */}
                    
                    <UserMenu />
                </div>

                {/* Menu Mobile - Botão */}
                <div className="md:hidden flex items-center gap-4">
                    <button 
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
                        className="text-white hover:text-[#9bf401] transition-colors"
                    >
                        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                    <UserMenu />
                </div>
            </div>

            {/* Menu Mobile - Conteúdo */}
            {mobileMenuOpen && (
                <div className="md:hidden mt-4 bg-[#181c2b] p-4 rounded-xl border border-gray-700">
                    <div className="flex flex-col gap-3">
                        <a 
                            href="/cart" 
                            className="text-white py-2 px-3 rounded-lg hover:bg-[#9bf401]/10 hover:text-[#9bf401] transition-all flex items-center gap-3"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            <ShoppingCart className="w-5 h-5" />
                            Carrinho
                        </a>
                        {/*
                            <a 
                                href="/terms" 
                                className="text-white py-2 px-3 rounded-lg hover:bg-[#9bf401]/10 hover:text-[#9bf401] transition-all flex items-center gap-3"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <FileText className="w-5 h-5" />
                                Termos de Uso
                            </a>
                            
                            <a 
                                href="/privacy" 
                                className="text-white py-2 px-3 rounded-lg hover:bg-[#9bf401]/10 hover:text-[#9bf401] transition-all flex items-center gap-3"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <Shield className="w-5 h-5" />
                                Política de Privacidade
                            </a>
                        */}
                        {isAdmin && (
                            <a 
                                href="/admin/dashboard" 
                                className="text-white py-2 px-3 rounded-lg hover:bg-[#FD8500]/10 hover:text-[#FD8500] transition-all flex items-center gap-3"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <Settings className="w-5 h-5" />
                                Painel Admin
                            </a>
                        )}
                    </div>
                </div>
            )}


        </header>
    );
}