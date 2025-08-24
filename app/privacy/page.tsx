import { Header } from '@/components/header/header'
import { Footer } from '@/components/footer/footer'
import { Shield, Database, Eye, Lock, UserCheck, Globe } from 'lucide-react'

export default function Privacy() {
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
              <Shield className="w-8 h-8 text-[#9bf401]" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-[#9bf401]">Política</span> de Privacidade
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Como protegemos e utilizamos suas informações no CraftCity
            </p>
            <div className="mt-4 text-sm text-gray-500">
              Última atualização: Janeiro de 2025
            </div>
          </div>

          {/* Content */}
          <div className="space-y-8">
            
            {/* Introdução */}
            <section className="bg-[#1c2230]/50 rounded-xl p-6 border border-[#1b202d]">
              <div className="flex items-center gap-3 mb-4">
                <UserCheck className="w-6 h-6 text-[#9bf401]" />
                <h2 className="text-2xl font-semibold text-[#9bf401]">Compromisso com sua Privacidade</h2>
              </div>
              <div className="text-gray-300 space-y-4">
                <p>
                  No CraftCity, levamos sua privacidade a sério. Esta política explica como coletamos, 
                  usamos, protegemos e compartilhamos suas informações quando você usa nosso servidor 
                  de Minecraft e serviços relacionados.
                </p>
                <p>
                  Ao usar nossos serviços, você concorda com as práticas descritas nesta política.
                </p>
              </div>
            </section>

            {/* Informações Coletadas */}
            <section className="bg-[#1c2230]/50 rounded-xl p-6 border border-[#1b202d]">
              <div className="flex items-center gap-3 mb-4">
                <Database className="w-6 h-6 text-[#FD8500]" />
                <h2 className="text-2xl font-semibold text-[#FD8500]">Informações que Coletamos</h2>
              </div>
              <div className="text-gray-300 space-y-6">
                
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Informações do Minecraft</h3>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li><strong>Nome de usuário:</strong> Seu nickname do Minecraft</li>
                    <li><strong>UUID:</strong> Identificador único do jogador</li>
                    <li><strong>Skin:</strong> Aparência do seu personagem</li>
                    <li><strong>Estatísticas de jogo:</strong> Tempo jogado, blocos quebrados, etc.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Informações Técnicas</h3>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li><strong>Endereço IP:</strong> Para segurança e prevenção de abuse</li>
                    <li><strong>Logs de conexão:</strong> Horários de entrada e saída</li>
                    <li><strong>Comandos executados:</strong> Para moderação e suporte</li>
                    <li><strong>Mensagens do chat:</strong> Para moderação (armazenadas temporariamente)</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Informações da Loja</h3>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li><strong>Dados de pagamento:</strong> Processados pelo MercadoPago (não armazenamos cartões)</li>
                    <li><strong>Histórico de compras:</strong> Itens adquiridos e datas</li>
                    <li><strong>Email:</strong> Para recibos e comunicações</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Como Usamos */}
            <section className="bg-[#1c2230]/50 rounded-xl p-6 border border-[#1b202d]">
              <div className="flex items-center gap-3 mb-4">
                <Eye className="w-6 h-6 text-[#9bf401]" />
                <h2 className="text-2xl font-semibold text-[#9bf401]">Como Usamos suas Informações</h2>
              </div>
              <div className="text-gray-300 space-y-4">
                <p>Utilizamos suas informações para:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Operação do servidor:</strong> Identificação, autenticação e progressão</li>
                  <li><strong>Moderação:</strong> Aplicação de regras e prevenção de abuse</li>
                  <li><strong>Suporte técnico:</strong> Resolução de problemas e bugs</li>
                  <li><strong>Melhorias:</strong> Análise de uso para aprimorar os serviços</li>
                  <li><strong>Segurança:</strong> Detecção de atividades suspeitas</li>
                  <li><strong>Transações:</strong> Processamento de compras na loja</li>
                  <li><strong>Comunicação:</strong> Avisos importantes sobre o servidor</li>
                </ul>
              </div>
            </section>

            {/* Proteção */}
            <section className="bg-[#1c2230]/50 rounded-xl p-6 border border-[#1b202d]">
              <div className="flex items-center gap-3 mb-4">
                <Lock className="w-6 h-6 text-[#FD8500]" />
                <h2 className="text-2xl font-semibold text-[#FD8500]">Como Protegemos seus Dados</h2>
              </div>
              <div className="text-gray-300 space-y-4">
                <p>Implementamos várias medidas de segurança:</p>
                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  <div className="bg-[#151923]/50 p-4 rounded-lg">
                    <h4 className="font-semibold text-[#9bf401] mb-2">Técnicas</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Criptografia SSL/TLS</li>
                      <li>• Senhas criptografadas</li>
                      <li>• Backups regulares</li>
                      <li>• Servidores seguros</li>
                    </ul>
                  </div>
                  <div className="bg-[#151923]/50 p-4 rounded-lg">
                    <h4 className="font-semibold text-[#FD8500] mb-2">Administrativas</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Acesso limitado aos dados</li>
                      <li>• Treinamento da equipe</li>
                      <li>• Auditoria regular</li>
                      <li>• Políticas internas</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Compartilhamento */}
            <section className="bg-[#1c2230]/50 rounded-xl p-6 border border-[#1b202d]">
              <div className="flex items-center gap-3 mb-4">
                <Globe className="w-6 h-6 text-[#9bf401]" />
                <h2 className="text-2xl font-semibold text-[#9bf401]">Compartilhamento de Dados</h2>
              </div>
              <div className="text-gray-300 space-y-4">
                <p>Não vendemos nem compartilhamos seus dados pessoais. Compartilhamento limitado ocorre apenas:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Processador de pagamentos:</strong> MercadoPago para transações</li>
                  <li><strong>Serviços técnicos:</strong> Hospedagem e infraestrutura</li>
                  <li><strong>Obrigação legal:</strong> Quando exigido por lei</li>
                  <li><strong>Proteção:</strong> Para prevenir fraud ou abuse</li>
                </ul>
                
                <div className="bg-[#9bf401]/10 border border-[#9bf401]/20 rounded-lg p-4 mt-6">
                  <p className="text-[#9bf401] font-semibold mb-2">🔒 Garantia de Privacidade</p>
                  <p className="text-sm">
                    Nunca compartilhamos seus dados com terceiros para marketing ou publicidade.
                  </p>
                </div>
              </div>
            </section>

            {/* Cookies */}
            <section className="bg-[#1c2230]/50 rounded-xl p-6 border border-[#1b202d]">
              <h2 className="text-2xl font-semibold text-[#FD8500] mb-4">Cookies e Tecnologias</h2>
              <div className="text-gray-300 space-y-4">
                <p>Nosso site usa cookies para:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Funcionamento:</strong> Login e preferências do usuário</li>
                  <li><strong>Análise:</strong> Entender como o site é usado</li>
                  <li><strong>Segurança:</strong> Prevenir ataques e fraud</li>
                </ul>
                <p className="text-sm bg-[#FD8500]/10 border border-[#FD8500]/20 rounded p-3">
                  <strong>Controle:</strong> Você pode desabilitar cookies no seu navegador, mas isso pode afetar a funcionalidade do site.
                </p>
              </div>
            </section>

            {/* Direitos */}
            <section className="bg-[#1c2230]/50 rounded-xl p-6 border border-[#1b202d]">
              <h2 className="text-2xl font-semibold text-[#9bf401] mb-4">Seus Direitos</h2>
              <div className="text-gray-300 space-y-4">
                <p>Você tem direito a:</p>
                <div className="grid md:grid-cols-2 gap-4">
                  <ul className="list-disc list-inside space-y-2">
                    <li>Acessar seus dados</li>
                    <li>Corrigir informações</li>
                    <li>Excluir sua conta</li>
                    <li>Exportar dados</li>
                  </ul>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Limitar processamento</li>
                    <li>Portabilidade de dados</li>
                    <li>Fazer reclamações</li>
                  </ul>
                </div>
                <p className="mt-4">
                  Para exercer esses direitos, entre em contato através do nosso 
                  <a href="/support" className="text-[#9bf401] hover:underline ml-1">sistema de suporte</a>.
                </p>
              </div>
            </section>

            {/* Retenção */}
            <section className="bg-[#1c2230]/50 rounded-xl p-6 border border-[#1b202d]">
              <h2 className="text-2xl font-semibold text-[#FD8500] mb-4">Retenção de Dados</h2>
              <div className="text-gray-300 space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-[#151923]/50 p-4 rounded-lg text-center">
                    <h4 className="font-semibold text-[#9bf401] mb-2">Dados de Jogo</h4>
                    <p className="text-sm">Mantidos enquanto a conta estiver ativa</p>
                  </div>
                  <div className="bg-[#151923]/50 p-4 rounded-lg text-center">
                    <h4 className="font-semibold text-[#FD8500] mb-2">Logs</h4>
                    <p className="text-sm">30-90 dias dependendo do tipo</p>
                  </div>
                  <div className="bg-[#151923]/50 p-4 rounded-lg text-center">
                    <h4 className="font-semibold text-[#9bf401] mb-2">Compras</h4>
                    <p className="text-sm">5 anos para fins fiscais</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Contato */}
            <section className="bg-gradient-to-r from-[#9bf401]/10 to-[#FD8500]/10 rounded-xl p-6 border border-[#9bf401]/20">
              <h2 className="text-2xl font-semibold text-white mb-4">Dúvidas sobre Privacidade?</h2>
              <p className="text-gray-300 mb-4">
                Nossa equipe de privacidade está disponível para esclarecer qualquer questão sobre como tratamos seus dados.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a 
                  href="/support" 
                  className="inline-flex items-center justify-center gap-2 bg-[#9bf401] text-[#151923] px-6 py-3 rounded-lg font-semibold hover:bg-[#8ae000] transition-colors"
                >
                  Contatar Suporte
                </a>
                <a 
                  href="/terms" 
                  className="inline-flex items-center justify-center gap-2 border border-[#9bf401] text-[#9bf401] px-6 py-3 rounded-lg font-semibold hover:bg-[#9bf401]/10 transition-colors"
                >
                  Ver Termos de Uso
                </a>
              </div>
            </section>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}