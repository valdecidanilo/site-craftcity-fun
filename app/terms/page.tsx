import { Header } from '@/components/header/header'
import { Footer } from '@/components/footer/footer'
import { FileText, AlertTriangle, Shield, Users } from 'lucide-react'

export default function Terms() {
  return (
    <div className="min-h-screen text-white flex flex-col" style={{ background: '#151923' }}>
      {/* Header fixo */}
      <div className="w-full fixed top-0 left-0 z-50">
        <Header />
      </div>

      {/* Main Content */}
      <main className="flex-1 pt-20 pb-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Hero Section */}
          <div className="text-center mb-12 pt-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#9bf401]/20 mb-6">
              <FileText className="w-8 h-8 text-[#9bf401]" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-[#9bf401]">Termos</span> de Uso
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Regras e condições para jogar no servidor CraftCity
            </p>
            <div className="mt-4 text-sm text-gray-500">
              Última atualização: Janeiro de 2025
            </div>
          </div>

          {/* Content */}
          <div className="space-y-8">
            
            {/* Seção 1 */}
            <section className="bg-[#1c2230]/50 rounded-xl p-6 border border-[#1b202d]">
              <div className="flex items-center gap-3 mb-4">
                <Users className="w-6 h-6 text-[#FD8500]" />
                <h2 className="text-2xl font-semibold text-[#FD8500]">1. Aceitação dos Termos</h2>
              </div>
              <div className="text-gray-300 space-y-4">
                <p>
                  Ao acessar e jogar no servidor CraftCity (craftcity.fun), você concorda em cumprir 
                  e ficar vinculado a estes termos de uso. Se você não concordar com qualquer parte 
                  destes termos, não deve usar nosso servidor.
                </p>
                <p>
                  Reservamo-nos o direito de alterar estes termos a qualquer momento. As alterações 
                  entrarão em vigor imediatamente após a publicação.
                </p>
              </div>
            </section>

            {/* Seção 2 */}
            <section className="bg-[#1c2230]/50 rounded-xl p-6 border border-[#1b202d]">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-6 h-6 text-[#9bf401]" />
                <h2 className="text-2xl font-semibold text-[#9bf401]">2. Regras do Servidor</h2>
              </div>
              <div className="text-gray-300 space-y-4">
                <h3 className="text-lg font-semibold text-white">Comportamento</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Seja respeitoso com todos os jogadores e staff</li>
                  <li>Não use linguagem ofensiva, discriminatória ou tóxica</li>
                  <li>Não faça spam no chat ou comandos</li>
                  <li>Não divulgue outros servidores</li>
                </ul>

                <h3 className="text-lg font-semibold text-white mt-6">Gameplay</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Não use hacks, cheats, mods não autorizados ou exploits</li>
                  <li>Não griefe construções de outros jogadores</li>
                  <li>Respeite as propriedades protegidas</li>
                  <li>Não construa estruturas ofensivas ou inapropriadas</li>
                </ul>
              </div>
            </section>

            {/* Seção 3 */}
            <section className="bg-[#1c2230]/50 rounded-xl p-6 border border-[#1b202d]">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="w-6 h-6 text-[#FD8500]" />
                <h2 className="text-2xl font-semibold text-[#FD8500]">3. Punições e Banimentos</h2>
              </div>
              <div className="text-gray-300 space-y-4">
                <p>
                  Violações das regras resultarão em punições que podem incluir:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><span className="text-yellow-400">Aviso:</span> Primeira infração menor</li>
                  <li><span className="text-orange-400">Mute:</span> Silenciamento temporário</li>
                  <li><span className="text-red-400">Kick:</span> Expulsão temporária</li>
                  <li><span className="text-red-500">Ban Temporário:</span> 1 dia a 30 dias</li>
                  <li><span className="text-red-600">Ban Permanente:</span> Infrações graves ou reincidência</li>
                </ul>
                <p className="mt-4">
                  Todas as punições são revisadas pela staff e podem ser contestadas através do nosso 
                  sistema de appeals.
                </p>
              </div>
            </section>

            {/* Seção 4 */}
            <section className="bg-[#1c2230]/50 rounded-xl p-6 border border-[#1b202d]">
              <h2 className="text-2xl font-semibold text-[#9bf401] mb-4">4. Loja e Transações</h2>
              <div className="text-gray-300 space-y-4">
                <p>
                  Nossa loja oferece itens e vantagens virtuais para melhorar sua experiência de jogo:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Todas as compras são finais e não reembolsáveis</li>
                  <li>Itens virtuais não têm valor monetário fora do servidor</li>
                  <li>Reservamos o direito de alterar ou remover itens da loja</li>
                  <li>Abuse de bugs relacionados à loja resultará em punição</li>
                </ul>
              </div>
            </section>

            {/* Seção 5 */}
            <section className="bg-[#1c2230]/50 rounded-xl p-6 border border-[#1b202d]">
              <h2 className="text-2xl font-semibold text-[#FD8500] mb-4">5. Privacidade e Dados</h2>
              <div className="text-gray-300 space-y-4">
                <p>
                  Coletamos apenas as informações necessárias para o funcionamento do servidor:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Nome de usuário do Minecraft</li>
                  <li>UUID do jogador</li>
                  <li>Endereço IP para segurança</li>
                  <li>Logs de ações para moderação</li>
                </ul>
                <p>
                  Para mais detalhes, consulte nossa <a href="/privacy" className="text-[#9bf401] hover:underline">Política de Privacidade</a>.
                </p>
              </div>
            </section>

            {/* Seção 6 */}
            <section className="bg-[#1c2230]/50 rounded-xl p-6 border border-[#1b202d]">
              <h2 className="text-2xl font-semibold text-[#9bf401] mb-4">6. Limitação de Responsabilidade</h2>
              <div className="text-gray-300 space-y-4">
                <p>
                  O CraftCity é fornecido "como está" sem garantias. Não nos responsabilizamos por:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Perda de itens, progresso ou construções</li>
                  <li>Interrupções no serviço ou downtime</li>
                  <li>Danos causados por outros jogadores</li>
                  <li>Bugs ou problemas técnicos</li>
                </ul>
              </div>
            </section>

            {/* Contato */}
            <section className="bg-gradient-to-r from-[#9bf401]/10 to-[#FD8500]/10 rounded-xl p-6 border border-[#9bf401]/20">
              <h2 className="text-2xl font-semibold text-white mb-4">Precisa de Ajuda?</h2>
              <p className="text-gray-300 mb-4">
                Dúvidas sobre os termos? Nossa equipe está pronta para ajudar!
              </p>
              <a 
                href="/support" 
                className="inline-flex items-center gap-2 bg-[#9bf401] text-[#151923] px-6 py-3 rounded-lg font-semibold hover:bg-[#8ae000] transition-colors"
              >
                Fale Conosco
              </a>
            </section>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}