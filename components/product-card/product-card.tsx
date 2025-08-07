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
        <div className={style.footerRow + ' gap-4'}>
          <div className="flex-1 flex flex-col items-start">
            {discountPrice ? (
              <>
                <span className={style.price + ' line-through text-red-400'} style={{ fontSize: '20px' }}>{price}</span>
                <span className={style.price + ' text-green-400 font-bold'} style={{ fontSize: '22px' }}>{discountPrice}</span>
              </>
            ) : (
              <span className={style.price} style={{ fontSize: '20px' }}>{price}</span>
            )}
          </div>
          <div className="flex items-end justify-end" style={{ flex: 'none', width: 'auto' }}>
            <Button
              className={style.buyButton}
              icon={<ShoppingCart size={22} />}
              style={{ fontSize: '20px', width: '120px' }}
              onClick={async () => {
                try {
                  const url = await pagarProduto({ ...props, category: props.category })
                  if (url) window.open(url, '_blank')
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
    </div>
  )
}
