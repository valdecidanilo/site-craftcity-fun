import Image from "next/image"
import { FileText, Shield } from 'lucide-react'

export function Footer() {
  return (
    <footer className="relative z-20 bg-[#151923] border-t border-gray-700 mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Seção Principal do Footer */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
          
          {/* Logo e Informações */}
          <div className="flex flex-col items-center md:items-start space-y-4">
            <div className="flex items-center gap-3">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Dalle-CraftCity-Title-pbj0VPvEBUrdqam5Znd5qDuEzfGiOk.png"
                alt="Craft City Logo"
                width={80}
                height={20}
                className="object-contain"
              />
            </div>
            <p className="text-gray-400 text-center md:text-left text-sm">
              Servidor Minecraft Premium<br />
              Construa sua cidade dos sonhos!
            </p>
            <div className="text-[#9bf401] font-mono text-sm">
              IP: craftcity.fun
            </div>
          </div>

          {/* Links Legais */}
          <div className="flex flex-col items-center md:items-start space-y-4">
            <h3 className="text-white font-semibold text-lg mb-2">Informações</h3>
            <div className="flex flex-col space-y-3">
              <a 
                href="/terms" 
                className="text-gray-400 hover:text-[#9bf401] transition-colors duration-300 flex items-center gap-2 text-sm"
              >
                <FileText className="w-4 h-4" />
                Termos de Uso
              </a>
              <a 
                href="/privacy" 
                className="text-gray-400 hover:text-[#9bf401] transition-colors duration-300 flex items-center gap-2 text-sm"
              >
                <Shield className="w-4 h-4" />
                Política de Privacidade
              </a>
              <a 
                href="/support" 
                className="text-gray-400 hover:text-[#9bf401] transition-colors duration-300 text-sm"
              >
                Suporte
              </a>
            </div>
          </div>
          
          {/* Informações do Servidor */}
          <div className="flex flex-col items-center md:items-start space-y-4">
            <h3 className="text-white font-semibold text-lg mb-2">Servidor</h3>
            <div className="flex flex-col space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-gray-400">Status:</span>
                <span className="text-[#9bf401] flex items-center gap-1">
                  <div className="w-2 h-2 bg-[#9bf401] rounded-full animate-pulse"></div>
                  Online
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-400">Versão:</span>
                <span className="text-white">1.20.x</span>
              </div>
              <div className="flex items-center gap-2">
                {/*<span className="text-gray-400">Jogadores:</span>
                <span className="text-[#FD8500] font-semibold">50+ Online</span>*/}
              </div>
            </div>
          </div>
        </div>


        {/* Linha Divisória */}
        <div className="border-t border-gray-700 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            
            {/* Copyright */}
            <div className="text-gray-400 text-sm text-center md:text-left">
              © 2025 <span className="text-[#9bf401] font-semibold">CraftCity</span>. 
              Todos os direitos reservados.
            </div>

            {/* Links Rápidos Mobile */}
            <div className="flex flex-wrap justify-center gap-4 md:gap-6 text-sm">
              <a 
                href="/terms" 
                className="text-gray-400 hover:text-[#9bf401] transition-colors duration-300"
              >
                Termos
              </a>
              <a 
                href="/privacy" 
                className="text-gray-400 hover:text-[#9bf401] transition-colors duration-300"
              >
                Privacidade
              </a>
              <a 
                href="/support" 
                className="text-gray-400 hover:text-[#9bf401] transition-colors duration-300"
              >
                Suporte
              </a>
            </div>
          </div>
        </div>

        {/* Disclaimer Minecraft */}
        <div className="mt-6 pt-4 border-t border-gray-800">
          <p className="text-gray-500 text-xs text-center">
            CraftCity não é afiliado com Mojang Studios ou Microsoft. Minecraft é uma marca registrada da Mojang Studios.
          </p>
        </div>
      </div>
    </footer>
  )
}