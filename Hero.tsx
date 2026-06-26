import { useRef, useState, useCallback } from 'react'
import { useStore } from '../store'

interface Props {
  onAdminTrigger: () => void
  onScrollTo: (id: string) => void
}

export function Nav({ onAdminTrigger, onScrollTo }: Props) {
  const cartCount  = useStore(s => s.cartCount())
  const openCart   = useStore(s => s.openCart)
  const setSearch  = useStore(s => s.setSearch)

  const [menuOpen, setMenuOpen] = useState(false)
  const logoClicks = useRef(0)
  const logoTimer  = useRef<ReturnType<typeof setTimeout>>()

  /* Secret: click logo 7× in 2.5s → admin */
  const handleLogoClick = useCallback(() => {
    logoClicks.current++
    clearTimeout(logoTimer.current)
    logoTimer.current = setTimeout(() => { logoClicks.current = 0 }, 2500)
    if (logoClicks.current >= 7) { logoClicks.current = 0; onAdminTrigger() }
  }, [onAdminTrigger])

  const closeMob = () => setMenuOpen(false)

  const navTo = (id: string) => { closeMob(); onScrollTo(id) }

  return (
    <>
      <nav className="nav">
        {/* Logo */}
        <div className="nav-logo" onClick={handleLogoClick} role="button" tabIndex={0}
             onKeyDown={e => e.key === 'Enter' && handleLogoClick()}
             aria-label="MTFLIX home">
          <div className="logo-mark">M</div>
          <div className="logo-text"><em>MT</em>FLIX</div>
        </div>

        {/* Desktop search */}
        <div className="nav-search" role="search">
          <svg className="nav-search-ico" width="14" height="14" viewBox="0 0 24 24"
               fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input type="search" placeholder="Search products…" aria-label="Search products"
                 onChange={e => setSearch(e.target.value)} autoComplete="off"/>
        </div>

        {/* Desktop links */}
        <nav className="nav-links" aria-label="Main navigation">
          <a href="#products" onClick={e => { e.preventDefault(); navTo('products') }}>Collection</a>
          <a href="#about"    onClick={e => { e.preventDefault(); navTo('about') }}>About</a>
          <a href="#footer"   onClick={e => { e.preventDefault(); navTo('footer') }}>Contact</a>
        </nav>

        {/* Right actions */}
        <div className="nav-right">
          <button className="cart-fab" onClick={openCart} aria-label={`Open cart, ${cartCount} items`}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
            Cart
            {cartCount > 0 && (
              <span className="cart-pip" aria-live="polite">{cartCount}</span>
            )}
          </button>
          <button className={`hamburger ${menuOpen ? 'open' : ''}`}
                  onClick={() => setMenuOpen(v => !v)}
                  aria-label="Toggle menu" aria-expanded={menuOpen}>
            <span/><span/><span/>
          </button>
        </div>
      </nav>

      {/* Mobile overlay */}
      <div className={`mob-overlay ${menuOpen ? 'open' : ''}`} onClick={closeMob}/>

      {/* Mobile menu */}
      <div className={`mob-menu ${menuOpen ? 'open' : ''}`} role="navigation" aria-label="Mobile menu">
        <div className="mob-search">
          <input type="search" placeholder="Search products…" aria-label="Search"
                 onChange={e => setSearch(e.target.value)}/>
        </div>
        <a href="#products" onClick={e => { e.preventDefault(); navTo('products') }}>Collection</a>
        <a href="#about"    onClick={e => { e.preventDefault(); navTo('about') }}>About</a>
        <a href="#footer"   onClick={e => { e.preventDefault(); navTo('footer') }}>Contact</a>
        <button onClick={() => { closeMob(); openCart() }}>🛒 Cart</button>
      </div>
    </>
  )
}
