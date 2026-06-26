import type { Product, StoreSettings } from './types'

export const DEFAULT_PRODUCTS: Product[] = [
  { id:'p1',  name:'Royal Oud Perfume',          category:'Fragrance',    price:329,  stock:20, badge:'Bestseller', stars:5, image:'https://images.unsplash.com/photo-1541643600914-78b084683702?w=700&q=80', desc:'Aged oud, amber & rose. 100ml luxury fragrance for the discerning.' },
  { id:'p2',  name:'Gold Chronograph Watch',     category:'Watches',      price:1099, stock:8,  badge:'Premium',    stars:5, image:'https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=700&q=80', desc:'Swiss-inspired, gold PVD coating, sapphire crystal, 5ATM water resistant.' },
  { id:'p3',  name:'Italian Leather Wallet',     category:'Accessories',  price:289,  stock:35, badge:'New',        stars:4, image:'https://images.unsplash.com/photo-1627123424574-724758594785?w=700&q=80', desc:'Full-grain Italian leather with RFID blocking and 8 card slots.' },
  { id:'p4',  name:'Noise-Canceling Headphones', category:'Electronics',  price:549,  stock:15, badge:'Hot',        stars:5, image:'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=700&q=80', desc:'40-hour battery, active noise cancellation, premium audio drivers.' },
  { id:'p5',  name:'Silk Tie Collection',        category:'Fashion',      price:219,  stock:25, badge:'',           stars:4, image:'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=700&q=80', desc:'100% mulberry silk. Classic patterns for business and formal occasions.' },
  { id:'p6',  name:'Aviator Sunglasses',         category:'Accessories',  price:479,  stock:18, badge:'Trending',   stars:5, image:'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=700&q=80', desc:'Polarized UV400, titanium frame, premium leather case included.' },
  { id:'p7',  name:'Carbon Fiber Phone Case',    category:'Electronics',  price:179,  stock:50, badge:'',           stars:4, image:'https://images.unsplash.com/photo-1601972599720-36938d4ecd31?w=700&q=80', desc:'Real carbon fiber texture with military-grade drop protection.' },
  { id:'p8',  name:'Italian Leather Belt',       category:'Fashion',      price:249,  stock:30, badge:'',           stars:4, image:'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=700&q=80', desc:'Full-grain leather, brushed steel buckle. Available in black and cognac.' },
  { id:'p9',  name:'Executive Pen Set',          category:'Accessories',  price:139,  stock:40, badge:'',           stars:4, image:'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=700&q=80', desc:'Matte black ballpoint, engraved barrel, luxury gift box included.' },
  { id:'p10', name:'Premium Weekender Bag',      category:'Accessories',  price:739,  stock:12, badge:'Limited',    stars:5, image:'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=700&q=80', desc:'Full-grain leather duffel, brass hardware, dedicated shoe compartment.' },
]

export const DEFAULT_SETTINGS: StoreSettings = {
  name:      'MTFLIX',
  wa:        '+972500000000',
  stripePk:  'pk_test_REPLACE_WITH_YOUR_STRIPE_KEY',
  promoCode: 'SAVE10',
  promoDisc: 10,
}

export const ADMIN_HASH = '5782ca441bdbc59a3726c1a6d74df86f405b2ac8780d56a0529555a80565a3cc'
// Password: Mohammed@2024

export const FALLBACK_IMG = 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=700&q=80'
export const STATUS_FLOW  = ['Pending', 'Processing', 'Shipped', 'Delivered'] as const
export const SESSION_TTL  = 2 * 60 * 60 * 1000   // 2 hours
export const MAX_ATTEMPTS = 5
export const LOCKOUT_MS   = 30_000                // 30 seconds
