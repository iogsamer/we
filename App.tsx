import { useStore } from '../store'

interface Props { onShop: () => void }

export function Hero({ onShop }: Props) {
  const openCart = useStore(s => s.openCart)

  return (
    <section className="hero" id="home" aria-label="Hero">
      <div className="hero-bg" aria-hidden="true">
        <div className="hero-ambient"/>
        <div className="hero-grid-bg"/>
      </div>

      <div className="hero-content">
        <div className="hero-eyebrow">✦ Premium · Visa &amp; Cash on Delivery</div>

        <h1>
          The Drop You've<br/>
          Been <em>Waiting For</em>
        </h1>

        <p className="hero-sub">
          Curated premium products delivered across Israel.
          Pay on delivery or securely online — zero risk, full quality.
        </p>

        <div className="hero-btns">
          <button className="btn btn-or" onClick={onShop}>
            Browse Collection
          </button>
          <button className="btn btn-ghost" onClick={openCart}>
            View Cart
          </button>
        </div>

        <div className="hero-pills">
          <div className="pill">💳 <span><strong>Visa Accepted</strong> · Stripe secured</span></div>
          <div className="pill">💵 <span><strong>Cash on Delivery</strong> · Zero risk</span></div>
          <div className="pill">🚚 <span><strong>Fast Delivery</strong> · Across Israel</span></div>
        </div>
      </div>
    </section>
  )
}
