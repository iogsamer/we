import { useState, useEffect, useRef, useCallback } from 'react'
import { useStore, useAdmin } from '../store'
import { ils, sha256, safeUrl, dateStr, genOrderId } from '../security'
import { ADMIN_HASH, FALLBACK_IMG, STATUS_FLOW, SESSION_TTL, MAX_ATTEMPTS, LOCKOUT_MS, DEFAULT_SETTINGS } from '../defaults'
import { api } from '../api'
import { toast } from '../toast'
import type { Product, OrderStatus, StoreSettings } from '../types'

type AdminTab = 'dash' | 'orders' | 'products' | 'settings'

// ─── Login ────────────────────────────────────────────────
function AdminLogin({ onClose }: { onClose: () => void }) {
  const setSession = useAdmin(s => s.setSession)
  const [pw, setPw]       = useState('')
  const [errMsg, setErrMsg]     = useState('')
  const [lockMsg, setLockMsg]   = useState('')
  const [attempts, setAttempts] = useState(0)
  const [busy, setBusy]         = useState(false)
  const lockUntil = useRef(0)
  const inputRef  = useRef<HTMLInputElement>(null)

  useEffect(() => { inputRef.current?.focus() }, [])

  const submit = async () => {
    const now = Date.now()
    if (lockUntil.current > now) {
      const secs = Math.ceil((lockUntil.current - now) / 1000)
      setLockMsg(`Too many attempts. Try again in ${secs}s.`)
      return
    }
    if (!pw) return
    setBusy(true)
    const hash = await sha256(pw)
    setBusy(false)
    if (hash === ADMIN_HASH) {
      setSession({ token: hash, expiresAt: Date.now() + SESSION_TTL })
      onClose()
    } else {
      const next = attempts + 1
      setAttempts(next)
      setPw('')
      setErrMsg('Incorrect password.')
      if (next >= MAX_ATTEMPTS) {
        lockUntil.current = Date.now() + LOCKOUT_MS
        setLockMsg('Too many attempts. Locked for 30 seconds.')
        setErrMsg('')
        setAttempts(0)
      }
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }

  return (
    <div className="admin-login-ov open" onClick={e => { if (e.target === e.currentTarget) onClose() }}
         role="dialog" aria-modal="true" aria-label="Admin login">
      <div className="login-box">
        <div style={{ fontSize: '2.4rem', marginBottom: 16 }}>🔐</div>
        <h2>Admin Access</h2>
        <p>Enter your password to continue</p>
        {lockMsg && <div className="login-msg warn">{lockMsg}</div>}
        {errMsg  && <div className="login-msg err">{errMsg}</div>}
        <div className="fg" style={{ textAlign: 'left' }}>
          <label htmlFor="adminPw">Password</label>
          <input id="adminPw" ref={inputRef} type="password" placeholder="••••••••••••"
                 value={pw} onChange={e => setPw(e.target.value)}
                 onKeyDown={e => e.key === 'Enter' && submit()}
                 autoComplete="current-password"/>
        </div>
        {attempts > 0 && (
          <div className="login-attempts">{MAX_ATTEMPTS - attempts} attempt{MAX_ATTEMPTS - attempts !== 1 ? 's' : ''} remaining</div>
        )}
        <button className="btn btn-or btn-full" style={{ marginTop: 14 }} onClick={submit} disabled={busy}>
          {busy ? <><div className="spin"/>&nbsp;Checking…</> : 'Sign In'}
        </button>
        <button className="btn-back" style={{ width: '100%', marginTop: 8 }} onClick={onClose}>Cancel</button>
      </div>
    </div>
  )
}

// ─── Product edit modal ───────────────────────────────────
function ProdModal({ id, onClose }: { id: string | null; onClose: () => void }) {
  const products   = useStore(s => s.products)
  const setProducts = useStore(s => s.setProducts)
  const token      = useAdmin(s => s.getToken())
  const p          = id ? products.find(x => x.id === id) : null

  const [form, setForm] = useState<Partial<Product>>({
    name: p?.name ?? '', category: p?.category ?? 'Accessories',
    price: p?.price ?? 0, stock: p?.stock ?? 0,
    image: p?.image ?? '', badge: p?.badge ?? '',
    stars: p?.stars ?? 5, desc: p?.desc ?? '',
  })
  const [err, setErr] = useState('')

  const set = (k: keyof Product, v: unknown) => setForm(f => ({ ...f, [k]: v }))

  const save = () => {
    if (!form.name || (form.name as string).length < 2) { setErr('Name is required (min 2 chars).'); return }
    if (!form.price || (form.price as number) <= 0)     { setErr('Valid price is required.'); return }
    setErr('')
    const prod: Product = {
      id:       id ?? `p${Date.now()}`,
      name:     (form.name as string).trim(),
      category: form.category as string,
      price:    Number(form.price),
      stock:    Number(form.stock) || 0,
      image:    safeUrl(form.image as string, FALLBACK_IMG),
      badge:    (form.badge as string) || '',
      stars:    Math.min(5, Math.max(1, Number(form.stars) || 5)),
      desc:     (form.desc as string) || '',
    }
    const next = id ? products.map(x => x.id === id ? prod : x) : [...products, prod]
    setProducts(next)
    if (token) api.saveProducts(next, token)
    toast.ok(id ? 'Product updated' : 'Product added')
    onClose()
  }

  const cats = ['Accessories','Electronics','Fragrance','Fashion','Watches','Home','Health','Sports','Other']

  return (
    <div className="adm-modal-ov open" onClick={e => { if (e.target === e.currentTarget) onClose() }}
         role="dialog" aria-modal="true" aria-label="Edit product">
      <div className="adm-modal">
        <div className="modal-hd"><h3>{id ? 'Edit Product' : 'Add Product'}</h3><button className="x-btn" onClick={onClose}>✕</button></div>
        <div className="modal-bd">
          <div className="fgrow">
            <div className="fg"><label>Name *</label><input type="text" value={form.name as string} onChange={e => set('name', e.target.value)} maxLength={80}/></div>
            <div className="fg"><label>Category</label>
              <select value={form.category as string} onChange={e => set('category', e.target.value)}>
                {cats.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="fgrow">
            <div className="fg"><label>Price (₪) *</label><input type="number" min="1" step="0.01" value={form.price as number} onChange={e => set('price', e.target.value)}/></div>
            <div className="fg"><label>Stock</label><input type="number" min="0" value={form.stock as number} onChange={e => set('stock', e.target.value)}/></div>
          </div>
          <div className="fg"><label>Image URL</label><input type="url" value={form.image as string} onChange={e => set('image', e.target.value)} placeholder="https://images.unsplash.com/..."/></div>
          <div className="fgrow">
            <div className="fg"><label>Badge</label><input type="text" value={form.badge as string} onChange={e => set('badge', e.target.value)} maxLength={20} placeholder="New, Hot, Sale…"/></div>
            <div className="fg"><label>Stars (1–5)</label><input type="number" min="1" max="5" value={form.stars as number} onChange={e => set('stars', e.target.value)}/></div>
          </div>
          <div className="fg"><label>Description</label><textarea value={form.desc as string} onChange={e => set('desc', e.target.value)} maxLength={300}/></div>
          {err && <div className="form-err">{err}</div>}
          <button className="btn btn-or btn-full" onClick={save}>Save Product</button>
        </div>
      </div>
    </div>
  )
}

// ─── Order detail modal ───────────────────────────────────
function OrderModal({ id, onClose }: { id: string; onClose: () => void }) {
  const orders     = useStore(s => s.orders)
  const updateOrderStatus = useStore(s => s.updateOrderStatus)
  const cancelOrder = useStore(s => s.cancelOrder)
  const settings   = useStore(s => s.settings)
  const token      = useAdmin(s => s.getToken())
  const o = orders.find(x => x.id === id)
  if (!o) return null

  const advance = async () => {
    const idx = STATUS_FLOW.indexOf(o.status as typeof STATUS_FLOW[number])
    if (idx < 0 || idx >= STATUS_FLOW.length - 1) return
    const next = STATUS_FLOW[idx + 1] as OrderStatus
    updateOrderStatus(id, next)
    if (token) await api.updateOrderStatus(id, next, token)
    toast.ok(`Order → ${next}`)
    onClose()
  }

  const cancel = async () => {
    if (!confirm(`Cancel order ${id}?`)) return
    cancelOrder(id)
    if (token) await api.updateOrderStatus(id, 'Cancelled', token)
    toast.ok('Order cancelled, stock restored')
    onClose()
  }

  const print = () => {
    const w = window.open('', '_blank', 'width=700,height=600')
    if (!w) return
    w.document.write(`<!DOCTYPE html><html><head><title>MTFLIX Order ${o.id}</title>
    <style>body{font-family:sans-serif;padding:28px;color:#111;max-width:600px;margin:0 auto;}
    h2{margin-bottom:4px;}table{width:100%;border-collapse:collapse;}
    th,td{padding:8px 10px;border:1px solid #ddd;font-size:13px;text-align:left;}th{background:#f5f5f5;}
    .total{font-weight:700;font-size:15px;}</style></head><body>
    <h2>MTFLIX — Order Receipt</h2>
    <p><b>Order:</b> ${o.id} | <b>Date:</b> ${dateStr(o.date)}</p>
    <p><b>Name:</b> ${o.customer.first} ${o.customer.last} | <b>Phone:</b> ${o.customer.phone}</p>
    <p><b>Address:</b> ${o.customer.address}, ${o.customer.city} ${o.customer.region}</p>
    ${o.customer.notes ? `<p><b>Notes:</b> ${o.customer.notes}</p>` : ''}
    <p><b>Payment:</b> ${o.payMethod} | <b>Status:</b> ${o.status}</p>
    <table><thead><tr><th>Product</th><th>Qty</th><th>Price</th><th>Total</th></tr></thead><tbody>
    ${o.items.map(i => `<tr><td>${i.name}</td><td>${i.qty}</td><td>₪${i.price.toLocaleString()}</td><td>₪${(i.price*i.qty).toLocaleString()}</td></tr>`).join('')}
    </tbody></table>
    ${o.discount > 0 ? `<p style="color:green"><b>Discount (${o.discount}%):</b> −₪${(o.originalTotal - o.total).toLocaleString()}</p>` : ''}
    <p class="total"><b>Total: ₪${o.total.toLocaleString()}</b></p>
    <script>window.onload=()=>window.print();<\/script></body></html>`)
    w.document.close()
  }

  const wa = settings.wa ? `https://wa.me/${settings.wa.replace(/\D/g, '')}?text=${encodeURIComponent(`Hi, regarding order ${o.id}:`)}` : null

  return (
    <div className="adm-modal-ov open" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="adm-modal" style={{ maxWidth: 520 }}>
        <div className="modal-hd"><h3>Order Details</h3><button className="x-btn" onClick={onClose}>✕</button></div>
        <div className="modal-bd">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
            <div><div style={{ fontSize: '.7rem', color: 'var(--tx2)', marginBottom: 3 }}>ORDER ID</div>
              <div style={{ fontFamily: 'monospace', color: 'var(--or)', fontSize: '.85rem' }}>{o.id}</div></div>
            <div><div style={{ fontSize: '.7rem', color: 'var(--tx2)', marginBottom: 3 }}>DATE</div>
              <div style={{ fontSize: '.82rem' }}>{dateStr(o.date)}</div></div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
            <div><div style={{ fontSize: '.7rem', color: 'var(--tx2)', marginBottom: 3 }}>CUSTOMER</div><div>{o.customer.first} {o.customer.last}</div></div>
            <div><div style={{ fontSize: '.7rem', color: 'var(--tx2)', marginBottom: 3 }}>PHONE</div><div>{o.customer.phone}</div></div>
          </div>
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: '.7rem', color: 'var(--tx2)', marginBottom: 3 }}>ADDRESS</div>
            <div style={{ fontSize: '.88rem' }}>{o.customer.address}, {o.customer.city} {o.customer.region}</div>
          </div>
          {o.customer.notes && <div style={{ marginBottom: 14 }}><div style={{ fontSize: '.7rem', color: 'var(--tx2)', marginBottom: 3 }}>NOTES</div><div style={{ fontSize: '.84rem', color: 'var(--tx2)' }}>{o.customer.notes}</div></div>}
          <div style={{ marginBottom: 14 }}>
            {o.items.map(i => (
              <div key={i.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid var(--bd)', fontSize: '.84rem' }}>
                <span>{i.name} ×{i.qty}</span><span style={{ color: 'var(--or)' }}>₪{(i.price*i.qty).toLocaleString()}</span>
              </div>
            ))}
            {o.discount > 0 && <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: '.82rem', color: 'var(--grn)' }}><span>Discount ({o.discount}%)</span><span>−₪{(o.originalTotal - o.total).toLocaleString()}</span></div>}
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', fontWeight: 700 }}><span>Total</span><span style={{ color: 'var(--or)' }}>₪{o.total.toLocaleString()}</span></div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 16 }}>
            <span className={`badge b-${o.status.toLowerCase()}`}>{o.status}</span>
            <span className={`badge ${o.paid ? 'b-visa' : 'b-cod'}`}>{o.paid ? 'Visa' : 'COD'}</span>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {o.status !== 'Delivered' && o.status !== 'Cancelled' && <button className="a-btn grn" onClick={advance}>Advance Status</button>}
            {o.status !== 'Delivered' && o.status !== 'Cancelled' && <button className="a-btn red" onClick={cancel}>Cancel</button>}
            <button className="a-btn" onClick={print}>🖨️ Print</button>
            {wa && <a href={wa} target="_blank" rel="noopener" className="a-btn blu">💬 WhatsApp</a>}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Main Admin Panel ─────────────────────────────────────
interface Props { open: boolean; onClose: () => void }

export function Admin({ open, onClose }: Props) {
  const isLoggedIn = useAdmin(s => s.isLoggedIn())
  const getToken   = useAdmin(s => s.getToken)
  const setSession = useAdmin(s => s.setSession)
  const [showLogin, setShowLogin] = useState(false)
  const [tab, setTab]   = useState<AdminTab>('dash')
  const [editProd, setEditProd]   = useState<string | null | 'new'>('new') // null=closed, 'new'=add, id=edit
  const [viewOrder, setViewOrder] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState('')
  const [ordersSource, setOrdersSource] = useState<'local' | 'live'>('local')
  const [sessionRem, setSessionRem] = useState('')

  const products    = useStore(s => s.products)
  const setProducts = useStore(s => s.setProducts)
  const orders      = useStore(s => s.orders)
  const settings    = useStore(s => s.settings)
  const setSettings = useStore(s => s.setSettings)
  const updateOrderStatus = useStore(s => s.updateOrderStatus)
  const cancelOrder = useStore(s => s.cancelOrder)

  // Settings form state
  const [sForm, setSForm] = useState<StoreSettings>(settings)
  useEffect(() => { setSForm(settings) }, [settings])

  // Session timer
  useEffect(() => {
    if (!open || !isLoggedIn) return
    const iv = setInterval(() => {
      const token = getToken()
      if (!token) { logoutAdmin(); return }
      const exp = useAdmin.getState().session?.expiresAt ?? 0
      const rem = Math.round((exp - Date.now()) / 60000)
      setSessionRem(`${rem}m`)
    }, 30_000)
    return () => clearInterval(iv)
  }, [open, isLoggedIn, getToken])

  // Load orders from KV on orders tab open
  useEffect(() => {
    if (tab !== 'orders') return
    const token = getToken()
    if (!token) return
    api.getOrders(token).then(remote => {
      if (remote) {
        // Merge: remote is source of truth
        useStore.setState({ orders: remote })
        setOrdersSource('live')
      }
    })
  }, [tab, getToken])

  const logoutAdmin = useCallback(() => {
    setSession(null)
    onClose()
    toast.ok('Logged out')
  }, [setSession, onClose])

  useEffect(() => {
    if (open && !isLoggedIn) setShowLogin(true)
  }, [open, isLoggedIn])

  const handleLoginClose = () => {
    setShowLogin(false)
    if (!useAdmin.getState().isLoggedIn()) onClose()
  }

  const advOrder = async (id: string) => {
    const o = orders.find(x => x.id === id)
    if (!o) return
    const idx = STATUS_FLOW.indexOf(o.status as typeof STATUS_FLOW[number])
    if (idx < 0 || idx >= STATUS_FLOW.length - 1) return
    const next = STATUS_FLOW[idx + 1] as OrderStatus
    updateOrderStatus(id, next)
    const token = getToken()
    if (token) await api.updateOrderStatus(id, next, token)
    toast.ok(`Order → ${next}`)
  }

  const canOrder = orders.filter(o => statusFilter ? o.status === statusFilter : true)
  const revenue  = orders.filter(o => o.status === 'Delivered').reduce((s,o) => s + o.total, 0)
  const STATUS_COLORS: Record<string, string> = { Pending:'var(--ylw)', Processing:'var(--or2)', Shipped:'var(--blu)', Delivered:'var(--grn)' }
  const maxRev = Math.max(1, ...STATUS_FLOW.map(s => orders.filter(o => o.status === s).reduce((a,o) => a+o.total,0)))

  const exportCSV = () => {
    const rows = [['Order ID','Customer','Phone','Address','City','Items','Total (₪)','Payment','Status','Date']]
    orders.forEach(o => rows.push([o.id, `${o.customer.first} ${o.customer.last}`, o.customer.phone,
      o.customer.address, o.customer.city, o.items.map(i=>`${i.name} x${i.qty}`).join('; '),
      String(o.total), o.payMethod, o.status, dateStr(o.date)]))
    const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g,'""')}"`).join(',')).join('\n')
    const a = document.createElement('a')
    a.href = 'data:text/csv;charset=utf-8,\uFEFF' + encodeURIComponent(csv)
    a.download = `mtflix-orders-${new Date().toISOString().slice(0,10)}.csv`
    a.click()
    toast.ok('Orders exported')
  }

  const delProd = (id: string) => {
    if (!confirm('Delete this product?')) return
    const next = products.filter(p => p.id !== id)
    setProducts(next)
    const token = getToken()
    if (token) api.saveProducts(next, token)
    toast.ok('Product deleted')
  }

  const saveSetts = () => {
    setSettings(sForm)
    toast.ok('Settings saved ✅')
  }

  if (!open) return null

  return (
    <>
      {showLogin && <AdminLogin onClose={handleLoginClose}/>}

      {isLoggedIn && (
        <div className="admin-panel" role="main" aria-label="Admin panel">
          <div className="adm-nav">
            <h2>🛍️ MTFLIX Admin</h2>
            <div className="adm-nav-r">
              {sessionRem && <span className="adm-session">Session: {sessionRem}</span>}
              <button className="a-btn" onClick={exportCSV}>📥 Export CSV</button>
              <button className="a-btn" onClick={() => orders.length ? setViewOrder(orders[0].id) : toast.err('No orders yet')}>🖨️ Print Last</button>
              <button className="a-btn red" onClick={logoutAdmin}>Sign Out</button>
            </div>
          </div>

          <div className="adm-tabs">
            {(['dash','orders','products','settings'] as AdminTab[]).map(t => (
              <button key={t} className={`adm-tab ${tab === t ? 'on' : ''}`} onClick={() => setTab(t)}>
                {t === 'dash' ? '📊 Dashboard' : t === 'orders' ? '📦 Orders' : t === 'products' ? '🏪 Products' : '⚙️ Settings'}
              </button>
            ))}
          </div>

          <div className="adm-body">
            {/* ── Dashboard ── */}
            {tab === 'dash' && (
              <>
                <div className="adm-stats">
                  {[
                    { lbl: 'Total Orders',   val: orders.length,                             color: 'var(--or)' },
                    { lbl: 'Pending',        val: orders.filter(o=>o.status==='Pending').length, color: 'var(--ylw)' },
                    { lbl: 'Revenue (₪)',    val: `₪${revenue.toLocaleString()}`,             color: 'var(--grn)' },
                    { lbl: 'Visa Payments',  val: orders.filter(o=>o.paid).length,            color: 'var(--blu)' },
                  ].map(s => (
                    <div key={s.lbl} className="adm-stat">
                      <div className="adm-stat-lbl">{s.lbl}</div>
                      <div className="adm-stat-val" style={{ color: s.color }}>{s.val}</div>
                    </div>
                  ))}
                </div>
                <div className="rev-chart">
                  <div className="rev-chart-title">Revenue by Status</div>
                  <div className="rev-bars">
                    {STATUS_FLOW.map(s => {
                      const v = orders.filter(o=>o.status===s).reduce((a,o)=>a+o.total,0)
                      return (
                        <div key={s} className="rev-bar-col">
                          <div className="rev-bar-val">₪{v ? Math.round(v/1000)+'k' : '0'}</div>
                          <div className="rev-bar" style={{ height: `${Math.round((v/maxRev)*84)+3}px`, background: STATUS_COLORS[s] ?? 'var(--or)' }}/>
                          <div className="rev-bar-lbl">{s}</div>
                        </div>
                      )
                    })}
                  </div>
                </div>
                <div className="tbl-card">
                  <div className="tbl-hd"><h4>Recent Orders</h4></div>
                  <div className="tbl-scroll">
                    <table><thead><tr><th>ID</th><th>Customer</th><th>Total</th><th>Payment</th><th>Status</th><th>Date</th></tr></thead>
                    <tbody>{orders.slice(0,8).map(o => (
                      <tr key={o.id}>
                        <td style={{ fontFamily:'monospace', fontSize:'.74rem', color:'var(--or)' }}>{o.id}</td>
                        <td>{o.customer.first} {o.customer.last}</td>
                        <td style={{ fontWeight:700 }}>₪{o.total.toLocaleString()}</td>
                        <td><span className={`badge ${o.paid?'b-visa':'b-cod'}`}>{o.paid?'Visa':'COD'}</span></td>
                        <td><span className={`badge b-${o.status.toLowerCase()}`}>{o.status}</span></td>
                        <td style={{ color:'var(--tx2)', fontSize:'.76rem' }}>{dateStr(o.date)}</td>
                      </tr>
                    ))}{!orders.length && <tr><td colSpan={6} style={{ textAlign:'center', padding:24, color:'var(--tx2)' }}>No orders yet.</td></tr>}</tbody>
                    </table>
                  </div>
                </div>
              </>
            )}

            {/* ── Orders ── */}
            {tab === 'orders' && (
              <div className="tbl-card">
                <div className="tbl-hd">
                  <h4>All Orders</h4>
                  <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                    <span style={{ fontSize:'.76rem', color: ordersSource==='live'?'var(--grn)':'var(--tx3)' }}>
                      {ordersSource==='live' ? '✅ Live from server' : '📦 Local data'}
                    </span>
                    <select className="adm-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                      <option value="">All Statuses</option>
                      {['Pending','Processing','Shipped','Delivered','Cancelled'].map(s=><option key={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
                <div className="tbl-scroll">
                  <table><thead><tr><th>ID</th><th>Customer</th><th>Phone</th><th>City</th><th>Total</th><th>Payment</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead>
                  <tbody>{canOrder.map(o=>(
                    <tr key={o.id}>
                      <td style={{ fontFamily:'monospace', fontSize:'.72rem', color:'var(--or)' }}>{o.id}</td>
                      <td>{o.customer.first} {o.customer.last}</td>
                      <td>{o.customer.phone}</td>
                      <td>{o.customer.city}</td>
                      <td style={{ fontWeight:700 }}>₪{o.total.toLocaleString()}</td>
                      <td><span className={`badge ${o.paid?'b-visa':'b-cod'}`}>{o.paid?'Visa':'COD'}</span></td>
                      <td><span className={`badge b-${o.status.toLowerCase()}`}>{o.status}</span></td>
                      <td style={{ color:'var(--tx2)', fontSize:'.74rem' }}>{dateStr(o.date)}</td>
                      <td style={{ display:'flex', gap:4, flexWrap:'wrap' }}>
                        <button className="a-btn" onClick={()=>setViewOrder(o.id)}>View</button>
                        {o.status!=='Delivered'&&o.status!=='Cancelled'&&<button className="a-btn grn" onClick={()=>advOrder(o.id)}>Advance</button>}
                        {o.status!=='Delivered'&&o.status!=='Cancelled'&&<button className="a-btn red" onClick={async()=>{if(!confirm(`Cancel ${o.id}?`))return;cancelOrder(o.id);const t=getToken();if(t)await api.updateOrderStatus(o.id,'Cancelled',t);toast.ok('Cancelled')}}>Cancel</button>}
                      </td>
                    </tr>
                  ))}{!canOrder.length&&<tr><td colSpan={9} style={{ textAlign:'center', padding:22, color:'var(--tx2)' }}>No orders found.</td></tr>}</tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ── Products ── */}
            {tab === 'products' && (
              <div className="tbl-card">
                <div className="tbl-hd"><h4>Products</h4><button className="btn btn-or" style={{ padding:'7px 18px', fontSize:'.8rem' }} onClick={()=>setEditProd('new')}>+ Add Product</button></div>
                <div className="tbl-scroll">
                  <table><thead><tr><th>Img</th><th>Name</th><th>Category</th><th>Price (₪)</th><th>Stock</th><th>Status</th><th>Actions</th></tr></thead>
                  <tbody>{products.map(p=>(
                    <tr key={p.id}>
                      <td><img src={safeUrl(p.image, FALLBACK_IMG)} style={{ width:46,height:46,objectFit:'cover',borderRadius:6 }} loading="lazy" onError={e=>{(e.target as HTMLImageElement).src=FALLBACK_IMG}} alt={p.name}/></td>
                      <td style={{ fontWeight:600, maxWidth:140, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{p.name}</td>
                      <td><span style={{ background:'rgba(232,98,10,.1)',color:'var(--or)',padding:'2px 8px',borderRadius:10,fontSize:'.7rem',fontWeight:700 }}>{p.category}</span></td>
                      <td style={{ fontWeight:700, color:'var(--or)' }}>₪{p.price.toLocaleString()}</td>
                      <td style={{ color: p.stock<=5?'var(--red)':p.stock<=15?'var(--ylw)':'var(--grn)', fontWeight:700 }}>{p.stock}</td>
                      <td><span className={`badge ${p.stock>0?'b-instock':'b-oos'}`}>{p.stock>0?'In Stock':'Out of Stock'}</span></td>
                      <td style={{ display:'flex', gap:5 }}><button className="a-btn" onClick={()=>setEditProd(p.id)}>Edit</button><button className="a-btn red" onClick={()=>delProd(p.id)}>Delete</button></td>
                    </tr>
                  ))}</tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ── Settings ── */}
            {tab === 'settings' && (
              <div className="tbl-card" style={{ padding:22 }}>
                <h4 style={{ marginBottom:18 }}>Store Settings</h4>
                <div className="settings-grid">
                  <div className="fg"><label>Store Name</label><input type="text" value={sForm.name} onChange={e=>setSForm(f=>({...f,name:e.target.value}))}/></div>
                  <div className="fg"><label>WhatsApp Number</label><input type="text" value={sForm.wa} onChange={e=>setSForm(f=>({...f,wa:e.target.value}))} placeholder="+972 50 000 0000"/></div>
                  <div className="fg"><label>Stripe Publishable Key</label><input type="text" value={sForm.stripePk} onChange={e=>setSForm(f=>({...f,stripePk:e.target.value}))} placeholder="pk_live_..."/></div>
                  <div className="fg"><label>Promo Code</label><input type="text" value={sForm.promoCode} onChange={e=>setSForm(f=>({...f,promoCode:e.target.value.toUpperCase()}))} placeholder="SAVE10"/></div>
                  <div className="fg"><label>Discount (%)</label><input type="number" min="1" max="99" value={sForm.promoDisc} onChange={e=>setSForm(f=>({...f,promoDisc:Number(e.target.value)}))}/></div>
                </div>
                <button className="btn btn-or" style={{ marginTop:4, padding:'11px 28px' }} onClick={saveSetts}>Save Settings</button>
                <div style={{ marginTop:20, padding:16, background:'var(--bg)', border:'1px solid var(--bd)', borderRadius:'var(--rs)' }}>
                  <p style={{ fontSize:'.8rem', color:'var(--tx2)', lineHeight:1.6 }}>
                    <strong style={{ color:'var(--tx)' }}>Admin password:</strong> Mohammed@2024 &nbsp;|&nbsp;
                    <strong style={{ color:'var(--tx)' }}>Access:</strong> Click logo 7× &nbsp;|&nbsp;
                    <strong style={{ color:'var(--tx)' }}>Session:</strong> 2 hours auto-logout
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Product edit modal */}
      {editProd !== null && editProd !== undefined && (
        <ProdModal id={editProd === 'new' ? null : editProd} onClose={() => setEditProd(null)}/>
      )}

      {/* Order detail modal */}
      {viewOrder && <OrderModal id={viewOrder} onClose={() => setViewOrder(null)}/>}
    </>
  )
}
