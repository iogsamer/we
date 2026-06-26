import { useEffect, useState, useCallback, useRef } from 'react'
import { useStore } from './store'
import { api } from './api'
import { Nav }      from './components/Nav'
import { Hero }     from './components/Hero'
import { Products } from './components/Products'
import { Cart }     from './components/Cart'
import { Checkout } from './components/Checkout'
import { Admin }    from './components/Admin'
import { Toasts }   from './components/Toast'
import { toast }    from './toast'

export default function App() {
  const setProducts = useStore(s => s.setProducts)
  const settings    = useStore(s => s.settings)
  const closeCart   = useStore(s => s.closeCart)

  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [adminOpen, setAdminOpen]       = useState(false)
  const waRef = useRef<HTMLAnchorElement>(null)

  /* ── Load products from KV on mount (non-blocking) ── */
  useEffect(() => {
    api.getProducts().then(remote => {
      if (remote && remote.length > 0) setProducts(remote)
    })
  }, [setProducts])

  /* ── Update WhatsApp button ── */
  useEffect(() => {
    if (!waRef.current) return
    const num  = settings.wa.replace(/\D/g, '')
    const msg  = encodeURIComponent(`Hi! I'm interested in ordering from ${settings.name}`)
    waRef.current.href = settings.wa ? `https://wa.me/${num}?text=${msg}` : '#'
  }, [settings.wa, settings.name])

  /* ── ESC key closes everything ── */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      closeCart()
      setCheckoutOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [closeCart])

  /* ── Scroll to section ── */
  const scrollTo = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  const handleShop = useCallback(() => {
    scrollTo('products')
  }, [scrollTo])

  return (
    <>
      <Nav
        onAdminTrigger={() => setAdminOpen(true)}
        onScrollTo={scrollTo}
      />

      <main>
        <Hero onShop={handleShop}/>

        <Products/>

        {/* About */}
        <section className="section about" id="about">
          <div className="about-inner">
            <span className="sec-eye">Our Promise</span>
            <h2 style={{ marginBottom: 14 }}>
              Zero Risk.{' '}
              <em style={{ fontStyle: 'italic', color: 'var(--or)' }}>Premium Quality.</em>
            </h2>
            <p>
              MTFLIX is built on trust. Pay when your order arrives, or securely
              online with Visa. Your money, your rules — every time.
            </p>
            <div className="pillars">
              <div className="pillar">
                <div className="pillar-ico">🚚</div>
                <h4>Same-Day Delivery</h4>
                <p>Orders dispatched immediately, delivered fast across all of Israel.</p>
              </div>
              <div className="pillar">
                <div className="pillar-ico">💳</div>
                <h4>Visa &amp; COD</h4>
                <p>Stripe-secured card payment or cash on delivery — your choice at checkout.</p>
              </div>
              <div className="pillar">
                <div className="pillar-ico">✅</div>
                <h4>Quality Guaranteed</h4>
                <p>Every product inspected before dispatch. Not happy? We fix it, period.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer" id="footer">
        <div className="ft-grid">
          <div className="ft-brand">
            <h4>MTFLIX</h4>
            <p>Your premium drop. Fast delivery, secure payment, zero compromise.</p>
          </div>
          <div className="ft-col">
            <h5>Shop</h5>
            <ul>
              <li><a href="#products" onClick={e=>{e.preventDefault();scrollTo('products')}}>All Products</a></li>
              <li><a href="#" onClick={e=>{e.preventDefault();useStore.getState().setFilter('Accessories');scrollTo('products')}}>Accessories</a></li>
              <li><a href="#" onClick={e=>{e.preventDefault();useStore.getState().setFilter('Electronics');scrollTo('products')}}>Electronics</a></li>
              <li><a href="#" onClick={e=>{e.preventDefault();useStore.getState().setFilter('Fragrance');scrollTo('products')}}>Fragrance</a></li>
            </ul>
          </div>
          <div className="ft-col">
            <h5>Info</h5>
            <ul>
              <li><a href="#about" onClick={e=>{e.preventDefault();scrollTo('about')}}>About Us</a></li>
              <li><a href="#" onClick={e=>{e.preventDefault();toast.info('Cash on Delivery — pay when your order arrives.',5000)}}>Delivery Policy</a></li>
              <li><a href="#" onClick={e=>{e.preventDefault();toast.info('All items quality-checked before dispatch.',5000)}}>Returns</a></li>
              <li><a ref={waRef} href="#" target="_blank" rel="noopener noreferrer">WhatsApp Us</a></li>
            </ul>
          </div>
        </div>
        <div className="ft-bottom">
          <span className="ft-copy" onClick={() => setAdminOpen(true)} title="Admin access">
            © 2025 MTFLIX. All rights reserved.
          </span>
          <span>
            Secured by <span style={{ color:'var(--blu)' }}>Stripe</span>
            {' · '}
            Powered by <span style={{ color:'var(--or)' }}>Cloudflare</span>
          </span>
        </div>
      </footer>

      {/* WhatsApp FAB */}
      <a ref={waRef} className="wa-fab" href="#" target="_blank" rel="noopener noreferrer"
         aria-label="Contact via WhatsApp">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
        </svg>
      </a>

      {/* Cart sidebar */}
      <Cart onCheckout={() => setCheckoutOpen(true)}/>

      {/* Checkout modal */}
      <Checkout open={checkoutOpen} onClose={() => setCheckoutOpen(false)}/>

      {/* Admin panel */}
      <Admin open={adminOpen} onClose={() => setAdminOpen(false)}/>

      {/* Toasts */}
      <Toasts/>
    </>
  )
}
