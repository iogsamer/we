import { useState, useEffect, useRef, useCallback } from 'react'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { loadStripe, type Stripe } from '@stripe/stripe-js'
import { useStore } from '../store'
import { ils, validPhone, genOrderId } from '../security'
import { api } from '../api'
import { toast } from '../toast'
import type { CheckoutStep, PayChoice, Order, CustomerInfo } from '../types'

// ─── Step indicator ──────────────────────────────────────
function Steps({ step }: { step: CheckoutStep }) {
  return (
    <div className="steps-bar">
      <div className="steps-dots">
        {([1, 2, 3] as CheckoutStep[]).map((n, i) => (
          <>
            <div key={n} className={`s-dot ${n < step ? 'done' : n === step ? 'active' : ''}`}>
              {n < step ? '✓' : n}
            </div>
            {i < 2 && <div key={`l${n}`} className={`s-line ${n < step ? 'done' : ''}`}/>}
          </>
        ))}
      </div>
      <div className="steps-labels">
        <span>Details</span><span>Payment</span><span>Confirm</span>
      </div>
    </div>
  )
}

// ─── Stripe payment form (inner) ─────────────────────────
function StripeForm({ onSuccess, onError }: { onSuccess: () => void; onError: (msg: string) => void }) {
  const stripe   = useStripe()
  const elements = useElements()
  const [busy, setBusy] = useState(false)

  const submit = async () => {
    if (!stripe || !elements) return
    setBusy(true)
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: window.location.href },
      redirect: 'if_required',
    })
    setBusy(false)
    if (error) onError(error.message ?? 'Payment failed')
    else onSuccess()
  }

  return (
    <div>
      <PaymentElement/>
      <button
        className="btn btn-or btn-full"
        style={{ marginTop: 16 }}
        onClick={submit}
        disabled={!stripe || busy}
      >
        {busy ? <><div className="spin"/>&nbsp;Processing…</> : 'Pay Now →'}
      </button>
    </div>
  )
}

// ─── Main Checkout component ─────────────────────────────
interface Props { open: boolean; onClose: () => void }

export function Checkout({ open, onClose }: Props) {
  const products     = useStore(s => s.products)
  const cart         = useStore(s => s.cart)
  const cartTotal    = useStore(s => s.cartTotal())
  const settings     = useStore(s => s.settings)
  const clearCart    = useStore(s => s.clearCart)
  const setProducts  = useStore(s => s.setProducts)
  const addOrder     = useStore(s => s.addOrder)

  const [step, setStep]     = useState<CheckoutStep>(1)
  const [pay, setPay]       = useState<PayChoice>('cod')
  const [promo, setPromo]   = useState('')
  const [promoOk, setPromoOk] = useState(false)
  const [promoMsg, setPromoMsg] = useState('')
  const [errMsg, setErrMsg] = useState('')
  const [busy, setBusy]     = useState(false)
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [stripePromise, setStripePromise] = useState<Promise<Stripe | null> | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)
  const [lastOrder, setLastOrder]     = useState<Order | null>(null)

  // Form refs
  const fnRef  = useRef<HTMLInputElement>(null)
  const lnRef  = useRef<HTMLInputElement>(null)
  const phRef  = useRef<HTMLInputElement>(null)
  const adRef  = useRef<HTMLInputElement>(null)
  const ciRef  = useRef<HTMLInputElement>(null)
  const reRef  = useRef<HTMLInputElement>(null)
  const noRef  = useRef<HTMLTextAreaElement>(null)

  const discount     = promoOk ? settings.promoDisc : 0
  const finalTotal   = discount > 0 ? Math.round(cartTotal * (1 - discount / 100)) : cartTotal
  const discountAmt  = cartTotal - finalTotal

  // Reset on open
  useEffect(() => {
    if (open) {
      setStep(1); setPay('cod'); setPromo(''); setPromoOk(false)
      setPromoMsg(''); setErrMsg(''); setClientSecret(null)
      setStripePromise(null); setBusy(false)
    }
  }, [open])

  // Load Stripe when card is selected
  useEffect(() => {
    if (pay === 'card' && step === 2 && settings.stripePk && !settings.stripePk.includes('REPLACE')) {
      setStripePromise(loadStripe(settings.stripePk))
      api.createPaymentIntent(finalTotal).then(cs => {
        if (cs) setClientSecret(cs)
        else setErrMsg('Could not load payment form. Check Stripe configuration.')
      })
    }
  }, [pay, step, finalTotal, settings.stripePk])

  // Promo code
  const applyPromo = useCallback((code: string) => {
    setPromo(code)
    const c = code.trim().toUpperCase()
    const valid = c && c === (settings.promoCode || '').toUpperCase() && settings.promoDisc > 0
    setPromoOk(valid)
    if (c) setPromoMsg(valid ? `✅ ${settings.promoDisc}% discount applied!` : '❌ Invalid promo code.')
    else setPromoMsg('')
  }, [settings.promoCode, settings.promoDisc])

  // Step 1 → 2
  const goStep2 = () => {
    const fn = fnRef.current?.value.trim() ?? ''
    const ln = lnRef.current?.value.trim() ?? ''
    const ph = phRef.current?.value.trim() ?? ''
    const ad = adRef.current?.value.trim() ?? ''
    const ci = ciRef.current?.value.trim() ?? ''
    if (!fn || fn.length < 2)      { setErrMsg('First name is required (min 2 chars).'); return }
    if (!ln || ln.length < 2)      { setErrMsg('Last name is required.'); return }
    if (!ph)                        { setErrMsg('Phone number is required.'); return }
    if (!validPhone(ph))            { setErrMsg('Enter a valid phone number.'); return }
    if (!ad || ad.length < 5)       { setErrMsg('Full address is required.'); return }
    if (!ci)                        { setErrMsg('City is required.'); return }
    setErrMsg('')
    setStep(2)
  }

  // Finalize order (COD or after Stripe success)
  const finalizeOrder = useCallback((paid: boolean) => {
    setStep(3)
    const id    = genOrderId()
    const items = cart.map(ci => {
      const p = products.find(x => x.id === ci.id)
      return p ? { id: ci.id, name: p.name, price: p.price, qty: ci.qty } : null
    }).filter(Boolean) as Order['items']

    // Deduct stock
    setProducts(products.map(p => {
      const ci = cart.find(i => i.id === p.id)
      return ci ? { ...p, stock: Math.max(0, p.stock - ci.qty) } : p
    }))

    const customer: CustomerInfo = {
      first:   fnRef.current?.value.trim() ?? '',
      last:    lnRef.current?.value.trim() ?? '',
      phone:   phRef.current?.value.trim() ?? '',
      address: adRef.current?.value.trim() ?? '',
      city:    ciRef.current?.value.trim() ?? '',
      region:  reRef.current?.value.trim() ?? '',
      notes:   noRef.current?.value.trim() ?? '',
    }

    const order: Order = {
      id, customer, items,
      originalTotal: cartTotal,
      discount,
      total: finalTotal,
      payMethod: paid ? 'Visa (Stripe)' : 'Cash on Delivery',
      paid,
      status: 'Pending',
      date: Date.now(),
    }

    addOrder(order)
    api.createOrder(order)   // fire-and-forget KV save
    clearCart()
    setLastOrder(order)
    setTimeout(() => { onClose(); setShowSuccess(true) }, 700)
  }, [cart, products, cartTotal, discount, finalTotal, addOrder, clearCart, setProducts, onClose])

  const orderSummary = (
    <div className="o-sum">
      {cart.map(ci => {
        const p = products.find(x => x.id === ci.id)
        if (!p) return null
        return (
          <div key={ci.id} className="o-sum-row">
            <span>{p.name} ×{ci.qty}</span>
            <span>{ils(p.price * ci.qty)}</span>
          </div>
        )
      })}
      {discount > 0 && (
        <div className="o-sum-row"><span>Promo ({discount}% off)</span><span style={{ color: 'var(--grn)' }}>−{ils(discountAmt)}</span></div>
      )}
      <div className="o-sum-row total"><span>Total</span><span>{ils(finalTotal)}</span></div>
    </div>
  )

  const stripeAppearance = {
    theme: 'night' as const,
    variables: {
      colorPrimary: '#E8620A', colorBackground: '#0D0D0D',
      colorText: '#F0ECE6', colorDanger: '#EF4444',
      fontFamily: 'Inter, system-ui, sans-serif', borderRadius: '7px',
    },
  }

  return (
    <>
      {/* ── Checkout modal ── */}
      <div className={`modal-ov ${open ? 'open' : ''}`}
           onClick={e => { if (e.target === e.currentTarget) onClose() }}
           role="dialog" aria-modal="true" aria-label="Checkout" aria-hidden={!open}>
        <div className="modal">
          <div className="modal-hd">
            <h3>Checkout</h3>
            <button className="x-btn" onClick={onClose} aria-label="Close">✕</button>
          </div>
          <div className="modal-bd">
            <Steps step={step}/>

            {/* Step 1 */}
            {step === 1 && (
              <div>
                <div className="fgrow">
                  <div className="fg"><label htmlFor="cFN">First Name *</label><input id="cFN" ref={fnRef} type="text" placeholder="Ahmed" autoComplete="given-name" maxLength={50}/></div>
                  <div className="fg"><label htmlFor="cLN">Last Name *</label><input id="cLN" ref={lnRef} type="text" placeholder="Mohammed" autoComplete="family-name" maxLength={50}/></div>
                </div>
                <div className="fg"><label htmlFor="cPh">Phone *</label><input id="cPh" ref={phRef} type="tel" placeholder="+972 05X-XXX-XXXX" autoComplete="tel" maxLength={20}/></div>
                <div className="fg"><label htmlFor="cAd">Address *</label><input id="cAd" ref={adRef} type="text" placeholder="Street, building" autoComplete="street-address" maxLength={120}/></div>
                <div className="fgrow">
                  <div className="fg"><label htmlFor="cCi">City *</label><input id="cCi" ref={ciRef} type="text" placeholder="Tel Aviv" autoComplete="address-level2" maxLength={60}/></div>
                  <div className="fg"><label htmlFor="cRe">Region</label><input id="cRe" ref={reRef} type="text" placeholder="District" autoComplete="address-level1" maxLength={60}/></div>
                </div>
                <div className="fg">
                  <label htmlFor="cCode">Promo Code</label>
                  <input id="cCode" type="text" placeholder="Enter code (optional)" value={promo} onChange={e => applyPromo(e.target.value)} maxLength={30} autoComplete="off"/>
                  {promoMsg && <div style={{ fontSize: '.76rem', marginTop: 4, color: promoOk ? 'var(--grn)' : 'var(--red)' }}>{promoMsg}</div>}
                </div>
                <div className="fg"><label htmlFor="cNo">Order Notes</label><textarea id="cNo" ref={noRef} placeholder="Special delivery instructions…" maxLength={500}/></div>
                {errMsg && <div className="form-err">{errMsg}</div>}
                <button className="btn btn-or btn-full" onClick={goStep2}>Continue to Payment →</button>
              </div>
            )}

            {/* Step 2 */}
            {step === 2 && (
              <div>
                {orderSummary}
                <p style={{ fontSize: '.84rem', color: 'var(--tx2)', marginBottom: 13, fontWeight: 500 }}>
                  How would you like to pay?
                </p>
                <div className="pay-opts">
                  <div className={`pay-opt ${pay === 'cod' ? 'sel' : ''}`} onClick={() => setPay('cod')} role="radio" aria-checked={pay === 'cod'} tabIndex={0} onKeyDown={e => e.key === ' ' && setPay('cod')}>
                    <div className="pay-opt-ico">💵</div>
                    <div className="pay-opt-title">Cash on Delivery</div>
                    <div className="pay-opt-sub">Pay when it arrives</div>
                  </div>
                  <div className={`pay-opt ${pay === 'card' ? 'sel' : ''}`} onClick={() => setPay('card')} role="radio" aria-checked={pay === 'card'} tabIndex={0} onKeyDown={e => e.key === ' ' && setPay('card')}>
                    <div className="pay-opt-ico">💳</div>
                    <div className="pay-opt-title">Visa / Debit Card</div>
                    <div className="pay-opt-sub">Secured by Stripe</div>
                  </div>
                </div>

                {pay === 'cod' && (
                  <div className="note-green">💵 You'll pay <strong>cash</strong> when the order arrives. No card needed.</div>
                )}

                {pay === 'card' && (
                  <div>
                    <div className="note-blue">🔒 Powered by <strong>Stripe</strong> — your card details are never stored by us.</div>
                    {clientSecret && stripePromise ? (
                      <div className="stripe-wrap ready">
                        <Elements stripe={stripePromise} options={{ clientSecret, appearance: stripeAppearance }}>
                          <StripeForm
                            onSuccess={() => finalizeOrder(true)}
                            onError={msg  => setErrMsg(msg)}
                          />
                        </Elements>
                      </div>
                    ) : (
                      <div className="stripe-wrap">
                        {errMsg ? (
                          <p style={{ color: 'var(--red)', fontSize: '.82rem' }}>❌ {errMsg}</p>
                        ) : (
                          <><div className="spin"/>&nbsp;<span style={{ color: 'var(--tx2)', fontSize: '.84rem' }}>Loading secure payment…</span></>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {errMsg && pay === 'cod' && <div className="form-err">{errMsg}</div>}

                <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                  <button className="btn-back" onClick={() => setStep(1)}>← Back</button>
                  {pay === 'cod' && (
                    <button className="btn btn-or" style={{ flex: 1, justifyContent: 'center', padding: 13 }}
                            onClick={() => { setBusy(true); finalizeOrder(false) }} disabled={busy}>
                      {busy ? <><div className="spin"/>&nbsp;Processing…</> : 'Place Order →'}
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Step 3 */}
            {step === 3 && (
              <div style={{ textAlign: 'center', padding: '44px 0' }}>
                <div style={{ fontSize: '2.4rem', marginBottom: 14 }}>⏳</div>
                <h3 style={{ marginBottom: 10 }}>Processing…</h3>
                <p style={{ color: 'var(--tx2)', fontSize: '.88rem' }}>Confirming your order, please wait.</p>
                <div style={{ marginTop: 22, display: 'flex', justifyContent: 'center' }}>
                  <div className="spin" style={{ width: 30, height: 30, borderWidth: 3 }}/>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Success modal ── */}
      {showSuccess && lastOrder && (
        <div className="modal-ov open" onClick={e => { if (e.target === e.currentTarget) setShowSuccess(false) }}
             role="dialog" aria-modal="true" aria-label="Order confirmed">
          <div className="modal" style={{ maxWidth: 420 }}>
            <div className="success-bd">
              <div className={`s-ico ${lastOrder.paid ? 'visa' : 'cod'}`}>
                {lastOrder.paid ? '💳' : '✅'}
              </div>
              <h3>{lastOrder.paid ? 'Payment Confirmed!' : 'Order Confirmed!'}</h3>
              <p style={{ marginBottom: 6 }}>
                {lastOrder.paid
                  ? "Your payment was processed. We'll prepare your order immediately."
                  : "Thank you! We'll contact you shortly to confirm delivery."}
              </p>
              <div className="oid-box">Order ID: {lastOrder.id}</div>
              <p style={{ marginTop: 6 }}>
                {lastOrder.paid
                  ? <span style={{ color: 'var(--blu)' }}>💳 Paid via Stripe.</span>
                  : <>Pay <strong>cash</strong> when your order arrives at the door.</>}
              </p>
              <button className="btn btn-or" style={{ marginTop: 24 }} onClick={() => setShowSuccess(false)}>
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
