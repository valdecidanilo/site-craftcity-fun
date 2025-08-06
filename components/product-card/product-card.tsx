import { Button } from "@/components/button/button"
import * as style from "@/components/product-card/styles"

interface ProductCardProps {
  id: number
  name: string
  price: string
  image?: string
  description: string
}

export function ProductCard({ id, name, price, image, description }: ProductCardProps) {
  return (
    <div className={style.cardWrapper}>
      <div className={style.imagePlaceholder}></div>

      <div className={style.contentWrapper}>
        <h3 className={style.title}>{name}</h3>
        <p className={style.description}>{description}</p>
        <div className={style.footerRow}>
          <span className={style.price}>{price}</span>
          <Button className={style.buyButton}>
            Comprar
          </Button>
        </div>
      </div>
    </div>
  )
}
