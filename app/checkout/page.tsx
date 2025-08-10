'use client'
import { useCart } from '@/components/cart/CartContext';
import { useState, useEffect } from 'react';
import { Header } from '@/components/header/header';
import { useSession } from 'next-auth/react';

// Modal PIX Component
function PixModal({ isOpen, onClose, pixData }: any) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const copyPixCode = async () => {
    if (pixData?.qr_code) {
      try {
        await navigator.clipboard.writeText(pixData.qr_code);
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      } catch (err) {
        console.error('Erro ao copiar:', err);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#181c2b] rounded-xl max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-6">Pagamento via PIX</h2>

          {pixData?.qr_code_base64 && (
            <div className="mb-6">
              <img
                src={`data:image/png;base64,${pixData.qr_code_base64}`}
                alt="QR Code PIX"
                className="mx-auto rounded-lg bg-white p-4"
                style={{ maxWidth: '200px' }}
              />
              <p className="text-sm text-gray-400 mt-2">
                Escaneie o QR Code com seu app bancário
              </p>
            </div>
          )}

          {pixData?.qr_code && (
            <div className="mb-6">
              <p className="text-sm text-gray-400 mb-2">Ou copie o código PIX:</p>
              <div className="bg-[#151923] p-3 rounded-lg border border-gray-600">
                <p className="text-xs text-gray-300 break-all font-mono">
                  {pixData.qr_code.substring(0, 50)}...
                </p>
              </div>
              <button
                onClick={copyPixCode}
                className={`mt-2 px-4 py-2 rounded-lg font-semibold transition ${
                  copied
                    ? 'bg-green-500 text-white'
                    : 'bg-[#9bf401] text-gray-900 hover:bg-[#bfff5a]'
                }`}
              >
                {copied ? 'Copiado!' : 'Copiar Código PIX'}
              </button>
            </div>
          )}

          {pixData?.ticket_url && (
            <div className="mb-6">
              <a
                href={pixData.ticket_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
              >
                Abrir no App do Banco
              </a>
            </div>
          )}

          <div className="bg-orange-500/20 border border-orange-500 rounded-lg p-4 mb-4">
            <p className="text-sm text-orange-200">
              <strong>Importante:</strong> Após o pagamento, você será redirecionado automaticamente.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState('pix');
  const [isClient, setIsClient] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPixModal, setShowPixModal] = useState(false);
  const [pixData, setPixData] = useState<any>(null);
  const { data: session } = useSession();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  async function handleConfirm() {
    if (cart.length === 0) return;
    
    setLoading(true);
    
    try {
      // Validar dados antes de enviar
      if (!session?.user?.email) {
        alert('Você precisa estar logado para finalizar a compra.');
        setLoading(false);
        return;
      }

      // Validar itens do carrinho
      const validItems = cart.filter(item => {
        const price = Number(item.price);
        return item.name && price > 0;
      });

      if (validItems.length === 0) {
        alert('Há itens inválidos no carrinho. Remova-os e tente novamente.');
        setLoading(false);
        return;
      }

      console.log('Enviando pagamento:', {
        itemsCount: validItems.length,
        paymentMethod,
        total: calculateTotal()
      });

      const response = await fetch('/api/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: validItems.map(item => ({
            id: item.id,
            name: item.name,
            price: Number(item.price),
            quantity: Number(item.quantity || 1),
            image: item.image,
            category: item.category || 'others'
          })),
          paymentMethod,
          buyer: {
            email: session.user.email,
            name: session.user.name || 'Cliente',
          },
          description: `Pedido CraftCity - ${validItems.length} item(s)`,
          external_reference: `craftcity_${Date.now()}`,
        }),
      });

      const data = await response.json();
      console.log('API Response:', { status: response.status, data });

      if (!response.ok) {
        const msg = data?.message || data?.error || data?.detail || `Erro HTTP ${response.status}`;
        console.error('Payment API Error:', msg);
        
        // Mostrar erro mais específico
        if (response.status === 502) {
          alert('Erro no Mercado Pago: ' + msg + '\n\nVerifique:\n- Tokens configurados\n- Conexão com internet');
        } else {
          alert('Erro ao processar pagamento: ' + msg);
        }
        return;
      }

      // 1) CHECKOUT PRO (redirect)
      if (data?.init_point || data?.sandbox_init_point) {
        const redirectUrl = data.sandbox_init_point || data.init_point;
        console.log('Redirecting to:', redirectUrl);
        window.location.href = redirectUrl;
        return;
      }

      // 2) PIX DIRETO (modal)
      if (paymentMethod === 'pix') {
        console.log('PIX Response received:', {
          hasQrCode: !!data?.qr_code,
          hasQrCodeBase64: !!data?.qr_code_base64,
          hasTicketUrl: !!data?.ticket_url,
          status: data?.status
        });
        
        if (data?.qr_code || data?.qr_code_base64 || data?.ticket_url) {
          setPixData(data);
          setShowPixModal(true);
          return;
        } else {
          console.error('PIX created but no QR code data:', data);
          alert('PIX gerado, mas sem dados de QR Code. Verifique os logs.');
          return;
        }
      }

      // 3) CARTÃO DIRETO (resultado)
      if (paymentMethod === 'card' && data?.status) {
        const statusMessages = {
          approved: 'Pagamento aprovado! ✅',
          pending: 'Pagamento pendente. Aguarde confirmação.',
          in_process: 'Pagamento em processamento...',
          rejected: 'Pagamento rejeitado. Tente novamente.'
        };
        
        alert(statusMessages[data.status as keyof typeof statusMessages] || `Status: ${data.status}`);
        
        if (data.status === 'approved') {
          clearCart();
        }
        return;
      }

      // Se chegou aqui, resposta inesperada
      console.error('Unexpected response:', data);
      alert('Resposta inesperada do servidor. Dados recebidos: ' + JSON.stringify(data).substring(0, 100));
      
    } catch (err) {
      console.error('Checkout error:', err);
      alert('Erro ao conectar com o servidor: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setLoading(false);
    }
  }

  if (!isClient) {
    return null;
  }

  return (
    <div className="min-h-screen text-white flex flex-col" style={{ background: '#151923' }}>
      <div className="w-full fixed top-0 left-0 z-50">
        <Header />
      </div>
      
      <div className="pt-20 lg:pt-24 flex flex-col items-center justify-center px-4 flex-1">
        <div className="w-full max-w-2xl mx-auto p-4 lg:p-8 bg-[#181c2b] rounded-xl shadow-lg mt-8 lg:mt-12 mb-8 lg:mb-12">
          <h2 className="text-2xl lg:text-3xl font-bold mb-6 lg:mb-8 text-center">
            Confirmação de Compra
          </h2>
          
          {cart.length === 0 ? (
            <div className="text-center">
              <p className="text-lg mb-6">Seu carrinho está vazio.</p>
              <button
                onClick={() => window.location.href = '/'}
                className="bg-[#9bf401] text-gray-900 px-6 py-3 rounded-lg font-bold hover:bg-[#bfff5a] transition"
              >
                Continuar Comprando
              </button>
            </div>
          ) : (
            <>
              {/* Lista de itens */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">Itens do pedido:</h3>
                <ul className="divide-y divide-gray-700">
                  {cart.map(item => (
                    <li key={item.id} className="flex justify-between items-center py-4">
                      <div className="flex items-center gap-4">
                        {item.image && (
                          <img 
                            src={item.image} 
                            alt={item.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                        )}
                        <div>
                          <span className="font-semibold block">{item.name}</span>
                          <span className="text-gray-400 text-sm">Qtd: {item.quantity}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">
                          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.price)}
                        </div>
                        <div className="text-sm text-gray-400">
                          Total: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.price * item.quantity)}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
                
                {/* Total */}
                <div className="border-t border-gray-700 pt-4 mt-4">
                  <div className="flex justify-between items-center text-xl font-bold">
                    <span>Total:</span>
                    <span className="text-[#9bf401]">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(calculateTotal())}
                    </span>
                  </div>
                </div>
              </div>

              {/* Métodos de pagamento */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">Método de pagamento:</h3>
                <div className="flex flex-col sm:flex-row gap-4">
                  <label className="flex items-center gap-3 cursor-pointer p-4 border border-gray-600 rounded-lg hover:border-green-500 transition-colors">
                    <input
                      type="radio"
                      name="payment"
                      value="pix"
                      checked={paymentMethod === 'pix'}
                      onChange={() => setPaymentMethod('pix')}
                      className="accent-green-500"
                    />
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">🏦</span>
                      <span className="font-medium">PIX</span>
                    </div>
                  </label>
                  
                  <label className="flex items-center gap-3 cursor-pointer p-4 border border-gray-600 rounded-lg hover:border-blue-500 transition-colors">
                    <input
                      type="radio"
                      name="payment"
                      value="checkout_pro"
                      checked={paymentMethod === 'checkout_pro'}
                      onChange={() => setPaymentMethod('checkout_pro')}
                      className="accent-blue-500"
                    />
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">💳</span>
                      <span className="font-medium">Cartão / Outros</span>
                    </div>
                  </label>
                </div>
                
                {/* Descrição do método selecionado */}
                <div className="mt-4 p-3 bg-[#151923] rounded-lg">
                  {paymentMethod === 'pix' ? (
                    <p className="text-sm text-gray-300">
                      💡 Pagamento instantâneo via PIX. Você receberá um QR Code para escanear.
                    </p>
                  ) : (
                    <p className="text-sm text-gray-300">
                      💡 Você será redirecionado para o Mercado Pago para escolher cartão, boleto ou outras opções.
                    </p>
                  )}
                </div>
              </div>

              {/* Botão finalizar */}
              <button
                className={`w-full px-6 py-4 rounded-lg font-bold text-lg shadow transition ${
                  loading 
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                    : 'bg-[#9bf401] text-gray-900 hover:bg-[#bfff5a]'
                }`}
                onClick={handleConfirm}
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-400"></div>
                    Processando...
                  </div>
                ) : (
                  <>
                    {paymentMethod === 'pix' ? '🏦 Gerar PIX' : '💳 Ir para Pagamento'} 
                    - {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(calculateTotal())}
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Modal PIX */}
      <PixModal 
        isOpen={showPixModal} 
        onClose={() => setShowPixModal(false)} 
        pixData={pixData} 
      />
    </div>
  );
}