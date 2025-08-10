import { Button } from "@/components/button/button"
import * as style from "@/components/product-card/styles"
import { ShoppingCart } from "lucide-react"
import { useCart } from "../cart/CartContext"
import { useRouter } from "next/navigation"
import { pagarProduto } from "@/lib/api"
import Image from "next/image"
import DefaultImage from "@/public/products/product-default.png"

export interface ProductCardProps {
  id: string
  name: string
  price: number
  discountPrice?: number
  image?: string
  description: string
  [key: string]: any
}

const brl = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
})

export function ProductCard(props: ProductCardProps) {
  const { id, name, price, discountPrice, image, description } = props
  const { addToCart } = useCart()
  const router = useRouter()

  const hasDiscount = typeof discountPrice === "number" && !Number.isNaN(discountPrice)
  const effectivePrice = hasDiscount ? (discountPrice as number) : price

  return (
    <div className={style.cardWrapper}>
      {image ? (
        <div className={style.imagePlaceholder + " flex items-center justify-center"}>
          <img src={image} alt={name} className="rounded-xl h-36 w-auto object-contain" />
        </div>
      ) : (
        <div className={style.imagePlaceholder + " flex items-center justify-center"}>
          <Image
            src={DefaultImage}
            alt={name}
            width={144}
            height={144}
            className="rounded-xl h-36 w-auto object-contain"
            priority={false}
          />
        </div>
      )}

      <div className={style.contentWrapper}>
        <h3 className={style.title}>{name}</h3>
        <p className={style.description}>{description}</p>

        {/* Preço */}
        <div className="w-full mb-4 flex flex-col">
          {hasDiscount ? (
            <>
              <span className={style.price + " line-through text-red-400 mr-2"} style={{ fontSize: "15px" }}>
                {brl.format(price)}
              </span>
              <span className={style.price + " text-[#9bf401] font-bold"} style={{ fontSize: "20px" }}>
                {brl.format(discountPrice as number)}
              </span>
            </>
          ) : (
            <span className={style.price} style={{ fontSize: "20px" }}>
              {brl.format(price)}
            </span>
          )}
        </div>

        {/* Ações */}
        <div className="w-full flex flex-col gap-4 mt-2">
          <Button
            className={style.buyButton + " flex-1"}
            style={{ fontSize: "20px" }}
            onClick={() => {
              addToCart({
                ...props,
                price: Number(effectivePrice),
              })
              router.push("/cart")
            }}
          >
            Adicionar ao carrinho
          </Button>

          <Button
            className={style.buyButton + " flex-1"}
            icon={<ShoppingCart size={22} />}
            style={{ fontSize: "20px" }}
            onClick={async () => {
              try {
                const result = await pagarProduto({ ...props, category: props.category })
                const url =
                  result?.point_of_interaction?.transaction_data?.ticket_url ||
                  result?.init_point ||
                  result?.sandbox_init_point
                if (url) window.open(url, "mercadopago", "width=600,height=800")
                else alert("Erro ao gerar pagamento!")
              } catch {
                alert("Erro ao gerar pagamento!")
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
