import { Button } from "@/components/button/button"
import * as style from "@/components/product-card/styles"
import { ShoppingCart } from "lucide-react"

import { pagarProduto } from '@/lib/api'


export interface ProductCardProps {
  id: number
  name: string
  price: string
  discountPrice?: string
  image?: string
  description: string
  [key: string]: any // Permite passar o objeto completo
}


export function ProductCard(props: ProductCardProps) {
  const { id, name, price, discountPrice, image, description } = props;
  return (
    <div className={style.cardWrapper}>
      {image ? (
        <div className={style.imagePlaceholder + ' flex items-center justify-center bg-white'}>
          <img src={image} alt={name} className="h-36 w-auto object-contain" />
        </div>
      ) : (
        <div className={style.imagePlaceholder}></div>
      )}

      <div className={style.contentWrapper}>
        <h3 className={style.title}>{name}</h3>
        <p className={style.description}>{description}</p>

        {/* Preço em cima, largura total, alinhado à esquerda */}
        <div className="w-full mb-4 flex flex-col">
          {discountPrice ? (
            <>
              <span className={style.price + ' line-through text-red-400 mr-2'} style={{ fontSize: '15px' }}>{price}</span>
              <span className={style.price + ' text-[#9bf401] font-bold'} style={{ fontSize: '20px' }}>{discountPrice}</span>
            </>
          ) : (
            <span className={style.price} style={{ fontSize: '20px' }}>{price}</span>
          )}
        </div>

        {/* Botões em uma row, largura total, abaixo do preço */}
        <div className="w-full flex flex-col gap-4 mt-2">
          <Button
            className={style.buyButton + ' flex-1'}
            style={{ fontSize: '20px' }}
            onClick={async () => {
              try {
                const result = await pagarProduto({ ...props, category: props.category })
                const url = result?.point_of_interaction?.transaction_data?.ticket_url || 
                  result?.init_point || result?.sandbox_init_point
                if (url) window.open(url, 'mercadopago', 'width=600,height=800');
                else alert('Erro ao gerar pagamento!')
              } catch (err) {
                alert('Erro ao gerar pagamento!')
              }
            }}
          >
            Adicionar ao carrinho
          </Button>
          <Button
            className={style.buyButton + ' flex-1'}
            icon={<ShoppingCart size={22} />}
            style={{ fontSize: '20px' }}
            onClick={async () => {
              try {
                const result = await pagarProduto({ ...props, category: props.category })
                const url = result?.point_of_interaction?.transaction_data?.ticket_url || 
                  result?.init_point || result?.sandbox_init_point
                if (url) window.open(url, 'mercadopago', 'width=600,height=800');
                else alert('Erro ao gerar pagamento!')
              } catch (err) {
                alert('Erro ao gerar pagamento!')
              }
            }}
          >
            Comprar
          </Button>
        </div>
      </div>
    </div>
  )
}
