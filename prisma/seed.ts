import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const productsRaw = [
  // Passes
  { 
    name: "Apoiar 🤝 1 mês", 
    price: "R$ 4,99", 
    description: "Acesso Apoiador por 30 dias.", 
    category: "Passes",
    image: "/products/pass/product-apoiador.png"
  },
  { 
    name: "Craft Club ⛏️ 1 mês", 
    price: "R$ 9,99", 
    description: "Acesso Craft Club por 30 dias.", 
    category: "Passes",
    image: "/products/pass/product-craftclub.png"
  },
  { 
    name: "VIP 💎 1 mês", 
    price: "R$ 14,99", 
    description: "Acesso VIP por 30 dias.", 
    category: "Passes" ,
    image: "/products/pass/product-vip.png"
  },

  // Pacotes
  { 
    name: "G Coin 320", 
    price: "R$ 1,99", 
    description: "Pacote com 320 moedas.", 
    category: "Pacotes", 
    subcategory: "Pacote de Moeda", 
    image: "/products/packs/product-coin-low.png" 
  },
  { 
    name: "G Coin 860", 
    price: "R$ 5,38", 
    description: "Pacote com 860 + 40 moedas.", 
    category: "Pacotes", 
    subcategory: "Pacote de Moeda", 
    image: "/products/packs/product-coin-medium.png" 
  },
  { 
    name: "G Coin 2700", 
    price: "R$ 29,99", 
    discountPrice: "R$ 24,99", 
    description: "Pacote com 2700 + 300 moedas.", 
    category: "Pacotes", 
    subcategory: "Pacote de Moeda", 
    image: "/products/packs/product-coin-high.png" 
  },
  { 
    name: "Cash 💵 320", 
    price: "R$ 7,99", 
    description: "Pacote com 320 dinheiro.", 
    category: "Pacotes", 
    subcategory: "Pacote de Dinheiro", 
    image: "/products/packs/product-money-low.png" 
  },
  { 
    name: "Cash 💵 860 + 40", 
    price: "R$ 21,50", 
    description: "Pacote com 860 + 40 dinheiro.", 
    category: "Pacotes", 
    subcategory: "Pacote de Dinheiro", 
    image: "/products/packs/product-money-medium.png" 
  },
  { 
    name: "Cash 💵 2700 + 300", 
    price: "R$ 67,50", 
    description: "Pacote com 2700 + 300 dinheiro.", 
    category: "Pacotes", 
    subcategory: "Pacote de Dinheiro", 
    image: "/products/packs/product-money-high.png" 
  },

  // Boosters
  { 
    name: "Experience Booster", 
    price: "R$ 18,99", 
    description: "Multiplicador de experiência por 24 horas.", 
    category: "Boosters" 
  },

  // Diversos
  { 
    name: "Teleport Scroll", 
    price: "R$ 12,99", 
    description: "Pergaminho mágico para teletransporte instantâneo.", 
    category: "Diversos" 
  },
  { 
    name: "Magic Potion Pack", 
    price: "R$ 15,99", 
    description: "Pacote com 10 poções mágicas variadas.", 
    category: "Diversos" 
  },
];

async function main() {
  console.log('Seeding products...')
  
  // Clear existing products
  await prisma.product.deleteMany()
  
  // Insert products
  for (const product of productsRaw) {
    await prisma.product.create({
      data: product
    })
  }
  
  console.log('Products seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })