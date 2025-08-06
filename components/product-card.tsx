import { Button } from "@/components/ui/button"

interface ProductCardProps {
  id: number
  name: string
  price: string
  image?: string
  description: string
}

export function ProductCard({ id, name, price, image, description }: ProductCardProps) {
  return (
    <div className="bg-[#1c2230]/90 backdrop-blur-sm rounded-xl p-6 border border-[#1b202d] hover:border-[#9bf401]/50 transition-colors">
      <div className="bg-[#d9d9d9] rounded-lg h-48 w-full mb-4"></div>
      <div className="space-y-3">
        <h3 className="text-white font-bold text-xl">{name}</h3>
        <p className="text-[#8f8f8f] text-sm leading-relaxed">{description}</p>
        <div className="flex items-center justify-between">
          <span className="text-[#9bf401] font-bold text-lg">{price}</span>
          <Button className="bg-[#9bf401] hover:bg-[#354b24] text-black font-semibold px-4 py-2 rounded-lg">
            Comprar
          </Button>
        </div>
      </div>
    </div>
  )
}
