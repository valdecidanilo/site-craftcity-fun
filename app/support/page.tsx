import { Header } from '@/components/header/header'
import { Footer } from '@/components/footer/footer'
import { 
  HeadphonesIcon, 
  MessageSquare, 
  Mail, 
  Clock, 
  HelpCircle,
  AlertTriangle,
  ShoppingCart,
  Settings,
  MessageCircle,
  Users,
  ExternalLink
} from 'lucide-react'



export default function Support() {
  const faqs = [
    {
      question: "Como faço para entrar no servidor?",
      answer: "Use o IP 'craftcity.fun' na versão 1.20.x do Minecraft Java Edition. Certifique-se de que seu Minecraft seja original."
    },
    {
      question: "Como protejo meu terreno?",
      answer: "Use o comando /claim com uma pá dourada na mão. Clique nos dois pontos opostos da área que deseja proteger."
    },
    {
      question: "Posso usar mods?",
      answer: "Apenas mods de interface (minimap, inventário) são permitidos. Mods que dão vantagens são proibidos e resultam em ban."
    },
    {
      question: "Como funciona a economia do servidor?",
      answer: "Você ganha dinheiro vendendo itens no /shop, completando jobs (/jobs) ou negociando com outros jogadores."
    },
    {
      question: "Perdi meus itens, podem recuperar?",
      answer: "Dependendo da situação (bug, rollback do servidor), podemos ajudar. Abra um ticket explicando o que aconteceu."
    },
    {
      question: "Como faço um appeal de ban?",
      answer: "Entre em contato através do Discord ou abra um ticket. Explique sua situação e aguarde a análise da staff."
    }
  ]

  const supportChannels = [
    {
      title: "Grupo Whatsapp",
      description: "Use nosso grupo de whatsapp para suporte direto",
      icon: MessageCircle,
      color: "#9bf401",
      link: "#",
      status: "Quando o staff estiver online"
    },
    {
      title: "Discord",
      description: "Canal oficial para suporte rápido e comunidade",
      icon: MessageSquare,
      color: "#FD8500",
      link: "#",
      status: "Resposta em horas"
    },
    {
      title: "Email",
      description: "Para questões formais e detalhadas",
      icon: Mail,
      color: "#9bf401", 
      link: "mailto:suporte@craftcity.fun",
      status: "Resposta em 24h"
    },
    {
      title: "Tickets In-Game",
      description: "Use /ticket no servidor para suporte direto",
      icon: Settings,
      color: "#FD8500",
      link: "#",
      status: "Quando o staff estiver online"
    }
  ]

  return (
    <div className="min-h-screen text-white flex flex-col" style={{ background: '#151923' }}>
      {/* Header fixo */}
      <div className="w-full fixed top-0 left-0 z-50">
        <Header />
      </div>

      {/* Main Content */}
      <main className="flex-1 pt-20 pb-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Hero Section */}
          <div className="text-center mb-12 pt-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#9bf401]/20 mb-6">
              <HeadphonesIcon className="w-8 h-8 text-[#9bf401]" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-[#9bf401]">Suporte</span> CraftCity
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Estamos aqui para ajudar! Encontre respostas ou entre em contato conosco
            </p>
          </div>

          {/* Status do Servidor */}
          <section className="mb-12">
            <div className="bg-gradient-to-r from-[#9bf401]/10 to-[#FD8500]/10 rounded-xl p-6 border border-[#9bf401]/20">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-[#9bf401] rounded-full animate-pulse"></div>
                    <span className="text-lg font-semibold">Servidor Online</span>
                  </div>
                  <div className="text-gray-400">|</div>
                  <div className="text-[#FD8500] font-semibold">craftcity.fun</div>
                </div>
                <div className="flex items-center gap-6 text-sm">
                  <div className="text-center">
                    <div className="text-[#9bf401] font-bold">50+</div>
                    <div className="text-gray-400">Jogadores</div>
                  </div>
                  <div className="text-center">
                    <div className="text-[#FD8500] font-bold">1.20.x</div>
                    <div className="text-gray-400">Versão</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Canais de Suporte */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-center mb-8">
              <span className="text-[#9bf401]">Como</span> Podemos Ajudar
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {supportChannels.map((channel, index) => (
                <div key={index} className="bg-[#1c2230]/50 rounded-xl p-6 border border-[#1b202d] hover:border-opacity-60 transition-all group">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`p-2 rounded-lg`} style={{ backgroundColor: `${channel.color}20` }}>
                      <channel.icon className="w-6 h-6" style={{ color: channel.color }} />
                    </div>
                    <h3 className="text-xl font-semibold text-white">{channel.title}</h3>
                  </div>
                  <p className="text-gray-300 mb-4">{channel.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400 flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {channel.status}
                    </span>
                    <a 
                      href={channel.link}
                      className="text-sm font-semibold hover:underline flex items-center gap-1 group-hover:text-[#9bf401] transition-colors"
                      style={{ color: channel.color }}
                    >
                      Acessar <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Tipos de Suporte */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-center mb-8">
              <span className="text-[#FD8500]">Tipos</span> de Suporte
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              
              <div className="bg-[#1c2230]/50 rounded-xl p-4 border border-[#1b202d] text-center">
                <AlertTriangle className="w-8 h-8 text-[#FD8500] mx-auto mb-3" />
                <h4 className="font-semibold mb-2">Problemas Técnicos</h4>
                <p className="text-sm text-gray-400">Bugs, crashes, lag, perda de itens</p>
              </div>

              <div className="bg-[#1c2230]/50 rounded-xl p-4 border border-[#1b202d] text-center">
                <Users className="w-8 h-8 text-[#9bf401] mx-auto mb-3" />
                <h4 className="font-semibold mb-2">Appeals</h4>
                <p className="text-sm text-gray-400">Contestar bans, mutes, punições</p>
              </div>

              <div className="bg-[#1c2230]/50 rounded-xl p-4 border border-[#1b202d] text-center">
                <ShoppingCart className="w-8 h-8 text-[#FD8500] mx-auto mb-3" />
                <h4 className="font-semibold mb-2">Loja</h4>
                <p className="text-sm text-gray-400">Problemas com compras, não recebimento</p>
              </div>

              <div className="bg-[#1c2230]/50 rounded-xl p-4 border border-[#1b202d] text-center">
                <HelpCircle className="w-8 h-8 text-[#9bf401] mx-auto mb-3" />
                <h4 className="font-semibold mb-2">Dúvidas Gerais</h4>
                <p className="text-sm text-gray-400">Como jogar, comandos, regras</p>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-center mb-8">
              <span className="text-[#9bf401]">Perguntas</span> Frequentes
            </h2>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <details 
                  key={index} 
                  className="bg-[#1c2230]/50 rounded-xl border border-[#1b202d] overflow-hidden group"
                >
                  <summary className="p-6 cursor-pointer hover:bg-[#1c2230]/70 transition-colors">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-lg text-white group-hover:text-[#9bf401]">{faq.question}</h3>
                      <div className="transform transition-transform group-open:rotate-45">
                        <div className="w-6 h-6 flex items-center justify-center">
                          <div className="w-4 h-0.5 bg-[#9bf401] absolute"></div>
                          <div className="w-0.5 h-4 bg-[#9bf401] absolute"></div>
                        </div>
                      </div>
                    </div>
                  </summary>
                  <div className="px-6 pb-6">
                    <p className="text-gray-300 leading-relaxed">{faq.answer}</p>
                  </div>
                </details>
              ))}
            </div>
          </section>

          {/* Informações Adicionais */}
          <section className="mb-12">
            <div className="grid md:grid-cols-2 gap-8">
              
              {/* Horários de Atendimento */}
              <div className="bg-[#1c2230]/50 rounded-xl p-6 border border-[#1b202d]">
                <div className="flex items-center gap-3 mb-4">
                  <Clock className="w-6 h-6 text-[#9bf401]" />
                  <h3 className="text-xl font-semibold">Horários de Atendimento</h3>
                </div>
                <div className="space-y-3 text-gray-300">
                  <div className="flex justify-between">
                    <span>Segunda - Sexta:</span>
                    <span className="text-[#9bf401]">14:00 - 23:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sábado - Domingo:</span>
                    <span className="text-[#9bf401]">10:00 - 24:00</span>
                  </div>
                  <div className="text-sm text-gray-400 mt-4">
                    <span className="text-[#FD8500]">*</span> Horário de Brasília (BRT/GMT-3)
                  </div>
                </div>
              </div>

              {/* Antes de Contatar */}
              <div className="bg-[#1c2230]/50 rounded-xl p-6 border border-[#1b202d]">
                <div className="flex items-center gap-3 mb-4">
                  <HelpCircle className="w-6 h-6 text-[#FD8500]" />
                  <h3 className="text-xl font-semibold">Antes de Contatar</h3>
                </div>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-[#9bf401] mt-1">•</span>
                    Verifique se o problema persiste após reconectar
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#9bf401] mt-1">•</span>
                    Consulte as FAQs acima
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#9bf401] mt-1">•</span>
                    Tenha seu nickname e descrição detalhada do problema
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#9bf401] mt-1">•</span>
                    Para bugs, inclua prints se possível
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Call to Action */}
          <section className="text-center">
            <div className="bg-gradient-to-r from-[#9bf401]/10 to-[#FD8500]/10 rounded-xl p-8 border border-[#9bf401]/20">
              <h2 className="text-2xl font-bold mb-4">Não encontrou a resposta?</h2>
              <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                Nossa equipe está sempre pronta para ajudar você a ter a melhor experiência no CraftCity. 
                Entre em contato através do canal que preferir!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="#" 
                  className="inline-flex items-center justify-center gap-2 bg-[#9bf401] text-[#151923] px-8 py-3 rounded-lg font-bold hover:bg-[#8ae000] transition-colors"
                >
                  <MessageSquare className="w-5 h-5" />
                  Acessar Discord
                </a>
                <a 
                  href="mailto:suporte@craftcity.fun" 
                  className="inline-flex items-center justify-center gap-2 border border-[#FD8500] text-[#FD8500] px-8 py-3 rounded-lg font-bold hover:bg-[#FD8500]/10 transition-colors"
                >
                  <Mail className="w-5 h-5" />
                  Enviar Email
                </a>
              </div>
            </div>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  )
}