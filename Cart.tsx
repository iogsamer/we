import { useMemo } from 'react'
import { useStore } from '../store'
import { ils, safeUrl } from '../security'
import { toast } from '../toast'
import { FALLBACK_IMG } from '../defaults'

function starsHtml(n: number): string {
  const full = Math.min(5, Math.max(0, Math.round(n)))
  return '⭐'.repeat(full) + '☆'.repeat(5 - full)
}

export function Products() {
  const products    = useStore(s => s.products)
  const filter      = useStore(s => s.filter)
  const search      = useStore(s => s.search)
  const setFilter   = useStore(s => s.setFilter)
  const addToCart   = useStore(s => s.addToCart)

  const categories = useMemo(
    () => ['All', ...Array.from(new Set(products.map(p => p.category)))],
    [products]
  )

  const visible = useMemo(() => {
    let list = filter === 'All' ? products : products.filter(p => p.category === filter)
    if (search) {
      const q = search.toLowerCase()
      list = list.filter(p => `${p.name} ${p.desc} ${p.category}`.toLowerCase().includes(q))
    }
    return list
  }, [products, filter, search])

  const handleAdd = (id: string, name: string) => {
    const err = addToCart(id)
    if (err) toast.err(err)
    else toast.ok(`${name} added to cart`)
  }

  return (
    <section className="section" id="products" aria-label="Products">
      <div className="products-inner">
        <div className="sec-head">
          <span className="sec-eye">Curated Selection</span>
          <h2>Premium Collection</h2>
          <p>Handpicked products of exceptional quality</p>
        </div>

        {/* Filter chips */}
        <div className="filters" role="group" aria-label="Filter by category">
          {categories.map(cat => (
            <button
              key={cat}
              className={`chip ${cat === filter ? 'active' : ''}`}
              onClick={() => setFilter(cat)}
              aria-pressed={cat === filter}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        {visible.length === 0 ? (
          <div className="no-results">
            <h3>No products found</h3>
            <p>Try a different search or filter.</p>
          </div>
        ) : (
          <div className="products-grid">
            {visible.map((p, idx) => {
              const imgSrc = safeUrl(p.image, FALLBACK_IMG)
              const inStock = p.stock > 0
              return (
                <article key={p.id} className="p-card">
                  <div className="p-img">
                    <img
                      src={imgSrc}
                      alt={p.name}
                      loading={idx < 4 ? 'eager' : 'lazy'}
                      decoding="async"
                      onError={e => { (e.target as HTMLImageElement).src = FALLBACK_IMG }}
                    />
                    {p.badge && <span className="p-badge">{p.badge}</span>}
                    {inStock && (
                      <button
                        className="p-quick"
                        onClick={() => handleAdd(p.id, p.name)}
                        aria-label={`Quick add ${p.name}`}
                      >+</button>
                    )}
                  </div>
                  <div className="p-body">
                    <div className="p-cat">{p.category}</div>
                    <div className="p-name">{p.name}</div>
                    <div className="p-desc">{p.desc}</div>
                    <div className="p-stars" aria-label={`${p.stars} stars`}>
                      <span>{starsHtml(p.stars)}</span>
                      <span>({p.stars}.0)</span>
                    </div>
                    <div className="p-foot">
                      <div className="p-price">{ils(p.price)}</div>
                      {inStock ? (
                        <button
                          className="p-add"
                          onClick={() => handleAdd(p.id, p.name)}
                          aria-label={`Add ${p.name} to cart`}
                        >+</button>
                      ) : (
                        <span className="p-oos">Out of Stock</span>
                      )}
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
