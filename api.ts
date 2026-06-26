/* ════════════════════════════════════════
   MTFLIX DESIGN SYSTEM — ILS Edition
════════════════════════════════════════ */

/* ── Tokens ─────────────────────────── */
:root {
  --bg:    #070707;
  --s1:    #0D0D0D;
  --s2:    #131313;
  --s3:    #1A1A1A;
  --bd:    #222222;
  --bd2:   #2C2C2C;
  --tx:    #F0ECE6;
  --tx2:   #8A8480;
  --tx3:   #484542;
  --or:    #E8620A;
  --or2:   #F97316;
  --or3:   #B34E08;
  --glow:  rgba(232,98,10,.17);
  --grn:   #22C55E;
  --red:   #EF4444;
  --ylw:   #F59E0B;
  --blu:   #6366F1;
  --r:     11px;
  --rs:    7px;
  --rf:    9999px;
  --t:     .22s ease;
  --shadow: 0 20px 56px rgba(0,0,0,.6);
}

/* ── Reset ───────────────────────────── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html  { scroll-behavior: smooth; -webkit-text-size-adjust: 100%; }
body  {
  font-family: 'Inter', system-ui, sans-serif;
  background: var(--bg); color: var(--tx);
  overflow-x: hidden; min-height: 100svh;
  -webkit-font-smoothing: antialiased;
}
h1, h2, h3, h4 { font-family: 'Playfair Display', Georgia, serif; line-height: 1.15; }
img    { display: block; max-width: 100%; height: auto; }
button { cursor: pointer; font-family: inherit; border: none; background: none; color: inherit; }
input, select, textarea { font-family: inherit; font-size: inherit; color: inherit; }
a { text-decoration: none; color: inherit; }
ul { list-style: none; }

::-webkit-scrollbar       { width: 5px; }
::-webkit-scrollbar-track { background: var(--bg); }
::-webkit-scrollbar-thumb { background: var(--or3); border-radius: 3px; }

/* ── Global utilities ────────────────── */
.sr-only {
  position: absolute; width: 1px; height: 1px;
  padding: 0; overflow: hidden; clip: rect(0,0,0,0);
  white-space: nowrap; border: 0;
}

/* ════════════════════════════════════════
   BUTTONS
════════════════════════════════════════ */
.btn {
  display: inline-flex; align-items: center; gap: 8px;
  font-weight: 600; font-size: .9rem; border-radius: var(--rs);
  transition: all var(--t); cursor: pointer; border: none;
  font-family: 'Inter', sans-serif;
}
.btn-or {
  background: var(--or); color: #fff; padding: 13px 30px;
}
.btn-or:hover:not(:disabled) { background: var(--or2); transform: translateY(-1px); box-shadow: 0 8px 26px var(--glow); }
.btn-or:active                { transform: translateY(0); }
.btn-or:disabled              { background: var(--s3); color: var(--tx3); cursor: not-allowed; }
.btn-or.btn-full              { width: 100%; justify-content: center; padding: 14px; font-size: .93rem; }
.btn-ghost {
  background: transparent; color: var(--tx); border: 1px solid var(--bd); padding: 12px 24px;
}
.btn-ghost:hover { border-color: var(--or); color: var(--or); }
.btn-back {
  background: var(--s3); color: var(--tx2); border: 1px solid var(--bd);
  padding: 12px 16px; border-radius: var(--rs); font-size: .86rem;
  font-weight: 500; cursor: pointer; transition: all var(--t);
}
.btn-back:hover { border-color: var(--or); color: var(--or); }
.x-btn {
  width: 32px; height: 32px; background: var(--s3); border-radius: 6px;
  display: flex; align-items: center; justify-content: center;
  font-size: .95rem; color: var(--tx2); flex-shrink: 0;
  transition: all var(--t); cursor: pointer;
}
.x-btn:hover { background: var(--bd); color: var(--tx); }
.a-btn {
  background: var(--s3); border: 1px solid var(--bd); color: var(--tx2);
  padding: 5px 11px; border-radius: 6px; font-size: .73rem;
  font-weight: 600; cursor: pointer; transition: all var(--t); white-space: nowrap;
}
.a-btn:hover      { border-color: var(--or); color: var(--or); }
.a-btn.red:hover  { border-color: var(--red); color: var(--red); }
.a-btn.grn:hover  { border-color: var(--grn); color: var(--grn); }
.a-btn.blu:hover  { border-color: var(--blu); color: var(--blu); }

/* ════════════════════════════════════════
   FORM ELEMENTS
════════════════════════════════════════ */
.fg { margin-bottom: 15px; }
.fg label {
  display: block; font-size: .75rem; font-weight: 600;
  color: var(--tx2); letter-spacing: .06em; text-transform: uppercase; margin-bottom: 6px;
}
.fg input, .fg select, .fg textarea {
  width: 100%; background: var(--bg); border: 1.5px solid var(--bd);
  color: var(--tx); padding: 11px 13px; border-radius: var(--rs);
  font-size: .9rem; transition: border-color var(--t), box-shadow var(--t);
}
.fg input:focus, .fg select:focus, .fg textarea:focus {
  outline: none; border-color: var(--or); box-shadow: 0 0 0 3px rgba(232,98,10,.12);
}
.fg input.err, .fg textarea.err { border-color: var(--red); }
.fg .ferr { font-size: .74rem; color: var(--red); margin-top: 4px; }
.fg textarea { resize: vertical; min-height: 72px; }
.fg select option { background: var(--s2); }
.fgrow { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.form-err {
  background: rgba(239,68,68,.1); border: 1px solid rgba(239,68,68,.3);
  border-radius: var(--rs); padding: 10px 13px; font-size: .82rem; color: var(--red);
  margin-bottom: 12px;
}

/* ════════════════════════════════════════
   BADGES & STATUS
════════════════════════════════════════ */
.badge {
  padding: 3px 9px; border-radius: var(--rf);
  font-size: .67rem; font-weight: 700; letter-spacing: .04em; text-transform: uppercase;
}
.b-pending    { background: rgba(245,158,11,.14); color: var(--ylw); }
.b-processing { background: rgba(249,115,22,.14); color: var(--or2); }
.b-shipped    { background: rgba(99,102,241,.14);  color: var(--blu); }
.b-delivered  { background: rgba(34,197,94,.14);   color: var(--grn); }
.b-cancelled  { background: rgba(239,68,68,.14);   color: var(--red); }
.b-cod        { background: rgba(34,197,94,.1);    color: var(--grn); }
.b-visa       { background: rgba(99,102,241,.1);   color: var(--blu); }
.b-instock    { background: rgba(34,197,94,.1);    color: var(--grn); }
.b-oos        { background: rgba(239,68,68,.1);    color: var(--red); }

/* ════════════════════════════════════════
   SPINNER
════════════════════════════════════════ */
.spin {
  width: 18px; height: 18px; border: 2.5px solid rgba(255,255,255,.2);
  border-top-color: #fff; border-radius: 50%;
  animation: spinning .65s linear infinite; display: inline-block; flex-shrink: 0;
}
@keyframes spinning { to { transform: rotate(360deg); } }

/* ════════════════════════════════════════
   NOTE BOXES
════════════════════════════════════════ */
.note-green {
  background: rgba(34,197,94,.09); border: 1px solid rgba(34,197,94,.25);
  border-radius: var(--rs); padding: 11px 14px; font-size: .82rem; color: var(--grn);
  display: flex; align-items: center; gap: 9px; margin-bottom: 16px;
}
.note-blue {
  background: rgba(99,102,241,.09); border: 1px solid rgba(99,102,241,.25);
  border-radius: var(--rs); padding: 11px 14px; font-size: .82rem; color: var(--blu);
  display: flex; align-items: center; gap: 9px; margin-bottom: 16px;
}

/* ════════════════════════════════════════
   NAVIGATION
════════════════════════════════════════ */
.nav {
  position: fixed; inset: 0 0 auto; z-index: 100; height: 66px;
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 30px; gap: 20px;
  background: rgba(7,7,7,.92); backdrop-filter: blur(18px);
  border-bottom: 1px solid var(--bd); transition: background .3s;
}
.nav-logo {
  display: flex; align-items: center; gap: 10px;
  cursor: pointer; user-select: none; flex-shrink: 0;
}
.logo-mark {
  width: 36px; height: 36px; background: var(--or); border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  font-family: 'Playfair Display', serif; font-size: 1.1rem;
  font-weight: 700; color: #fff; box-shadow: 0 4px 16px rgba(232,98,10,.4);
  flex-shrink: 0;
}
.logo-text {
  font-family: 'Playfair Display', serif; font-size: 1.35rem; font-weight: 700;
}
.logo-text em { font-style: normal; color: var(--or); }
.nav-search { flex: 1; max-width: 340px; position: relative; }
.nav-search input {
  width: 100%; background: var(--s2); border: 1px solid var(--bd);
  color: var(--tx); padding: 9px 13px 9px 36px; border-radius: var(--rf);
  font-size: .84rem; transition: border-color var(--t);
}
.nav-search input:focus { outline: none; border-color: var(--or); }
.nav-search input::placeholder { color: var(--tx3); }
.nav-search-ico {
  position: absolute; left: 12px; top: 50%; transform: translateY(-50%);
  color: var(--tx3); pointer-events: none;
}
.nav-links { display: flex; gap: 26px; }
.nav-links a {
  font-size: .83rem; font-weight: 500; color: var(--tx2);
  letter-spacing: .04em; text-transform: uppercase; transition: color var(--t);
}
.nav-links a:hover { color: var(--tx); }
.nav-right { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }
.cart-fab {
  position: relative; display: flex; align-items: center; gap: 7px;
  background: var(--s2); border: 1px solid var(--bd); color: var(--tx);
  padding: 8px 15px; border-radius: var(--rf); font-size: .84rem;
  font-weight: 500; cursor: pointer; transition: all var(--t);
}
.cart-fab:hover { border-color: var(--or); color: var(--or); }
.cart-pip {
  position: absolute; top: -4px; right: -4px;
  background: var(--or); color: #fff; font-size: .6rem; font-weight: 800;
  min-width: 18px; height: 18px; padding: 0 4px;
  border-radius: var(--rf); display: flex; align-items: center; justify-content: center;
  animation: popIn .2s ease;
}
@keyframes popIn { from { transform: scale(.4); } to { transform: scale(1); } }
.hamburger {
  display: none; flex-direction: column; justify-content: center;
  gap: 5px; padding: 8px; border-radius: 6px; transition: background var(--t);
}
.hamburger:hover { background: var(--s2); }
.hamburger span {
  display: block; width: 20px; height: 2px; background: var(--tx);
  border-radius: 2px; transition: all .3s;
}
.hamburger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
.hamburger.open span:nth-child(2) { opacity: 0; }
.hamburger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

/* Mobile menu */
.mob-overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,.62); z-index: 90;
  opacity: 0; pointer-events: none; transition: opacity .25s;
}
.mob-overlay.open { opacity: 1; pointer-events: all; }
.mob-menu {
  position: fixed; left: 0; top: 66px; bottom: 0; width: 280px;
  background: var(--s1); border-right: 1px solid var(--bd); z-index: 95;
  padding: 22px 18px; display: flex; flex-direction: column; gap: 4px;
  transform: translateX(-100%); transition: transform .3s cubic-bezier(.32,.72,0,1);
}
.mob-menu.open { transform: translateX(0); }
.mob-menu a, .mob-menu button {
  display: block; padding: 12px 14px; font-size: 1rem; color: var(--tx2);
  font-weight: 500; border-radius: var(--rs); transition: all .15s;
  background: none; text-align: left; width: 100%; border: none; cursor: pointer;
}
.mob-menu a:hover, .mob-menu button:hover { background: var(--s3); color: var(--tx); }
.mob-search { margin-bottom: 10px; }
.mob-search input {
  width: 100%; background: var(--s2); border: 1px solid var(--bd);
  color: var(--tx); padding: 11px 14px; border-radius: var(--rs); font-size: .9rem;
}
.mob-search input:focus { outline: none; border-color: var(--or); }

/* ════════════════════════════════════════
   HERO
════════════════════════════════════════ */
.hero {
  min-height: 100svh; display: flex; align-items: center; justify-content: center;
  padding: 80px 30px; position: relative; overflow: hidden; text-align: center;
}
.hero-ambient {
  position: absolute; inset: 0; pointer-events: none;
  background: radial-gradient(ellipse 75% 50% at 50% 55%, rgba(232,98,10,.16) 0%, transparent 68%);
  animation: ambientPulse 5s ease-in-out infinite;
}
@keyframes ambientPulse { 0%,100%{opacity:.8;} 50%{opacity:1;} }
.hero-grid-bg {
  position: absolute; inset: 0; opacity: .038; pointer-events: none;
  background-image: linear-gradient(var(--bd) 1px,transparent 1px),
                    linear-gradient(90deg,var(--bd) 1px,transparent 1px);
  background-size: 56px 56px;
}
.hero-content {
  position: relative; z-index: 1; max-width: 760px;
  animation: riseUp .85s cubic-bezier(.22,.68,0,1.1) both;
}
@keyframes riseUp { from { opacity:0; transform:translateY(28px); } to { opacity:1; transform:none; } }
.hero-eyebrow {
  display: inline-flex; align-items: center; gap: 7px; margin-bottom: 26px;
  font-size: .72rem; font-weight: 700; letter-spacing: .18em; text-transform: uppercase;
  color: var(--or); border: 1px solid rgba(232,98,10,.28); padding: 6px 16px;
  border-radius: var(--rf); background: rgba(232,98,10,.07);
}
.hero h1 {
  font-size: clamp(2.8rem, 8vw, 5.6rem); font-weight: 700;
  letter-spacing: -.025em; margin-bottom: 20px;
}
.hero h1 em { font-style: italic; color: var(--or); }
.hero-sub {
  font-size: 1.05rem; color: var(--tx2); line-height: 1.8;
  max-width: 480px; margin: 0 auto 36px; font-weight: 300;
}
.hero-btns { display: flex; align-items: center; justify-content: center; gap: 12px; flex-wrap: wrap; }
.hero-pills {
  display: flex; justify-content: center; gap: 10px;
  flex-wrap: wrap; margin-top: 50px; padding-top: 34px; border-top: 1px solid var(--bd);
}
.pill {
  background: var(--s2); border: 1px solid var(--bd); padding: 9px 18px;
  border-radius: var(--rf); font-size: .8rem; color: var(--tx2);
  display: flex; align-items: center; gap: 8px;
}
.pill strong { color: var(--tx); }

/* ════════════════════════════════════════
   SECTION
════════════════════════════════════════ */
.section { padding: 80px 30px; }
.sec-head { text-align: center; margin-bottom: 50px; }
.sec-eye {
  display: block; font-size: .72rem; font-weight: 700; letter-spacing: .2em;
  text-transform: uppercase; color: var(--or); margin-bottom: 11px;
}
.sec-head h2 { font-size: clamp(1.9rem, 3.5vw, 2.8rem); font-weight: 700; margin-bottom: 9px; }
.sec-head p  { color: var(--tx2); font-size: .93rem; }

/* ════════════════════════════════════════
   FILTERS
════════════════════════════════════════ */
.filters { display: flex; gap: 7px; flex-wrap: wrap; justify-content: center; margin-bottom: 36px; }
.chip {
  background: var(--s2); border: 1px solid var(--bd); color: var(--tx2);
  padding: 7px 17px; border-radius: var(--rf); font-size: .79rem; font-weight: 500;
  cursor: pointer; transition: all var(--t);
}
.chip.active, .chip:hover { background: var(--or); border-color: var(--or); color: #fff; }

/* ════════════════════════════════════════
   PRODUCTS GRID
════════════════════════════════════════ */
.products-inner { max-width: 1240px; margin: 0 auto; }
.products-grid  {
  display: grid; grid-template-columns: repeat(auto-fill, minmax(268px, 1fr)); gap: 18px;
}
.products-grid .p-card:first-child           { grid-column: span 2; }
.products-grid .p-card:first-child .p-img    { height: 280px; }

.p-card {
  background: var(--s1); border: 1px solid var(--bd); border-radius: var(--r);
  overflow: hidden; transition: border-color var(--t), transform .28s, box-shadow .28s;
  position: relative;
}
.p-card:hover { border-color: rgba(232,98,10,.45); transform: translateY(-4px); box-shadow: var(--shadow); }
.p-img { height: 220px; overflow: hidden; position: relative; background: var(--s2); }
.p-img img { width: 100%; height: 100%; object-fit: cover; transition: transform .55s cubic-bezier(.22,.68,0,1.2); }
.p-card:hover .p-img img { transform: scale(1.06); }
.p-img::after {
  content: ''; position: absolute; inset: 0;
  background: linear-gradient(to top, rgba(7,7,7,.75) 0%, transparent 55%);
  opacity: 0; transition: opacity .3s;
}
.p-card:hover .p-img::after { opacity: 1; }
.p-badge {
  position: absolute; top: 12px; left: 12px; z-index: 1;
  background: var(--or); color: #fff; font-size: .67rem; font-weight: 800;
  padding: 4px 10px; border-radius: var(--rf); letter-spacing: .04em; text-transform: uppercase;
}
.p-quick {
  position: absolute; bottom: 14px; right: 14px; z-index: 2;
  background: var(--or); color: #fff; width: 38px; height: 38px;
  border-radius: 8px; font-size: 1.4rem;
  display: flex; align-items: center; justify-content: center;
  opacity: 0; transform: translateY(10px); transition: all .28s; cursor: pointer;
  border: none;
}
.p-quick:hover { background: var(--or2); }
.p-quick:disabled { background: var(--s3); cursor: not-allowed; }
.p-card:hover .p-quick { opacity: 1; transform: translateY(0); }
.p-body { padding: 18px 16px 16px; }
.p-cat  { font-size: .68rem; color: var(--or); letter-spacing: .12em; text-transform: uppercase; font-weight: 700; margin-bottom: 6px; }
.p-name { font-family: 'Playfair Display', serif; font-size: 1.08rem; font-weight: 600; margin-bottom: 6px; line-height: 1.35; }
.p-desc { font-size: .81rem; color: var(--tx2); line-height: 1.6; margin-bottom: 12px; }
.p-stars { font-size: .75rem; color: var(--ylw); margin-bottom: 12px; display: flex; align-items: center; gap: 5px; }
.p-stars span { color: var(--tx3); }
.p-foot { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
.p-price { font-size: 1.35rem; font-weight: 700; color: var(--or); }
.p-add {
  width: 38px; height: 38px; background: var(--or); color: #fff; border-radius: 8px;
  font-size: 1.35rem; display: flex; align-items: center; justify-content: center;
  flex-shrink: 0; transition: all .2s; cursor: pointer; border: none;
}
.p-add:hover { background: var(--or2); transform: scale(1.08); }
.p-add:disabled { background: var(--s3); cursor: not-allowed; transform: none; }
.p-oos {
  font-size: .74rem; color: var(--tx3); font-weight: 600;
  background: var(--s3); border: 1px solid var(--bd); padding: 6px 12px; border-radius: 6px;
}
.no-results { grid-column: 1/-1; text-align: center; padding: 70px; color: var(--tx2); }
.no-results h3 { font-size: 1.3rem; margin-bottom: 8px; }

/* ════════════════════════════════════════
   ABOUT
════════════════════════════════════════ */
.about { background: var(--s1); border-top: 1px solid var(--bd); border-bottom: 1px solid var(--bd); }
.about-inner { max-width: 880px; margin: 0 auto; text-align: center; }
.about-inner > p { color: var(--tx2); font-size: .98rem; line-height: 1.82; max-width: 600px; margin: 0 auto 46px; font-weight: 300; }
.pillars { display: grid; grid-template-columns: repeat(3,1fr); gap: 18px; text-align: left; }
.pillar { background: var(--bg); border: 1px solid var(--bd); border-radius: var(--r); padding: 26px 20px; transition: border-color var(--t); }
.pillar:hover { border-color: rgba(232,98,10,.3); }
.pillar-ico { font-size: 2rem; margin-bottom: 12px; }
.pillar h4  { font-family: 'Playfair Display', serif; font-size: .98rem; font-weight: 600; margin-bottom: 7px; }
.pillar p   { font-size: .82rem; color: var(--tx2); line-height: 1.65; }

/* ════════════════════════════════════════
   FOOTER
════════════════════════════════════════ */
.footer { background: var(--s1); border-top: 1px solid var(--bd); padding: 48px 30px 26px; }
.ft-grid { display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 36px; max-width: 1160px; margin: 0 auto; }
.ft-brand h4  { font-size: 1.3rem; margin-bottom: 10px; }
.ft-brand p   { color: var(--tx2); font-size: .84rem; line-height: 1.75; max-width: 270px; }
.ft-col h5    { font-size: .73rem; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; color: var(--tx2); margin-bottom: 14px; }
.ft-col li    { margin-bottom: 9px; }
.ft-col a     { font-size: .84rem; color: var(--tx2); transition: color var(--t); }
.ft-col a:hover { color: var(--or); }
.ft-bottom {
  border-top: 1px solid var(--bd); padding-top: 20px; margin-top: 34px;
  max-width: 1160px; margin-left: auto; margin-right: auto;
  display: flex; justify-content: space-between; align-items: center; font-size: .79rem; color: var(--tx3);
}
.ft-copy { cursor: default; user-select: none; transition: color var(--t); }
.ft-copy:hover { color: var(--tx2); }

/* ════════════════════════════════════════
   CART
════════════════════════════════════════ */
.cart-overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,.72); z-index: 200;
  opacity: 0; pointer-events: none; transition: opacity .25s;
}
.cart-overlay.open { opacity: 1; pointer-events: all; }
.cart-panel {
  position: fixed; right: 0; top: 0; bottom: 0; width: 390px;
  background: var(--s1); border-left: 1px solid var(--bd); z-index: 210;
  display: flex; flex-direction: column;
  transform: translateX(100%); transition: transform .32s cubic-bezier(.32,.72,0,1);
}
.cart-panel.open { transform: translateX(0); }
.cart-hd { display: flex; align-items: center; justify-content: space-between; padding: 20px 20px 16px; border-bottom: 1px solid var(--bd); }
.cart-hd h3 { font-size: 1.15rem; }
.cart-body  { flex: 1; overflow-y: auto; padding: 12px 20px; }
.cart-empty { text-align: center; padding: 60px 0; color: var(--tx2); }
.cart-empty-ico { font-size: 3rem; margin-bottom: 14px; opacity: .5; }
.c-item { display: flex; gap: 12px; padding: 13px 0; border-bottom: 1px solid var(--bd); }
.c-item:last-child { border-bottom: none; }
.c-thumb { width: 64px; height: 64px; border-radius: 8px; overflow: hidden; background: var(--s2); flex-shrink: 0; }
.c-thumb img { width: 100%; height: 100%; object-fit: cover; }
.c-info { flex: 1; min-width: 0; }
.c-name  { font-size: .87rem; font-weight: 600; margin-bottom: 3px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.c-price { font-size: .88rem; color: var(--or); font-weight: 700; }
.c-ctrl  { display: flex; align-items: center; gap: 8px; margin-top: 9px; }
.q-btn {
  width: 26px; height: 26px; background: var(--s3); border: 1px solid var(--bd);
  border-radius: 6px; display: flex; align-items: center; justify-content: center;
  font-size: .9rem; cursor: pointer; transition: all .15s;
}
.q-btn:hover { border-color: var(--or); color: var(--or); }
.q-num { font-size: .86rem; font-weight: 700; min-width: 22px; text-align: center; }
.c-rm { background: none; border: none; color: var(--tx3); font-size: .76rem; margin-left: auto; cursor: pointer; transition: color var(--t); }
.c-rm:hover { color: var(--red); }
.cart-ft { padding: 14px 20px 22px; border-top: 1px solid var(--bd); }
.cart-row { display: flex; justify-content: space-between; font-size: .86rem; color: var(--tx2); margin-bottom: 6px; }
.cart-row.total { font-size: 1.08rem; font-weight: 700; color: var(--tx); margin-top: 10px; margin-bottom: 16px; }
.cart-row.total span:last-child { color: var(--or); }

/* ════════════════════════════════════════
   MODAL
════════════════════════════════════════ */
.modal-ov {
  position: fixed; inset: 0; background: rgba(0,0,0,.84); z-index: 300;
  display: flex; align-items: center; justify-content: center; padding: 16px;
  opacity: 0; pointer-events: none; transition: opacity .28s;
}
.modal-ov.open { opacity: 1; pointer-events: all; }
.modal {
  background: var(--s1); border: 1px solid var(--bd); border-radius: var(--r);
  width: 100%; max-width: 510px; max-height: 92vh; overflow-y: auto;
  transform: scale(.96) translateY(8px); transition: transform .28s;
}
.modal-ov.open .modal { transform: scale(1) translateY(0); }
.modal-hd {
  display: flex; align-items: center; justify-content: space-between;
  padding: 22px 24px 16px; border-bottom: 1px solid var(--bd); position: sticky; top: 0;
  background: var(--s1); z-index: 1;
}
.modal-hd h3  { font-size: 1.2rem; }
.modal-bd { padding: 20px 24px; }

/* Step indicator */
.steps-bar { margin-bottom: 22px; }
.steps-dots { display: flex; align-items: center; }
.s-dot {
  width: 27px; height: 27px; border-radius: 50%;
  background: var(--s3); border: 2px solid var(--bd);
  display: flex; align-items: center; justify-content: center;
  font-size: .7rem; font-weight: 700; color: var(--tx3); flex-shrink: 0; transition: all .3s;
}
.s-dot.active { background: var(--or); border-color: var(--or); color: #fff; }
.s-dot.done   { background: var(--grn); border-color: var(--grn); color: #fff; font-size: .75rem; }
.s-line       { flex: 1; height: 2px; background: var(--bd); transition: background .3s; }
.s-line.done  { background: var(--grn); }
.steps-labels { display: flex; justify-content: space-between; margin-top: 5px; }
.steps-labels span { font-size: .68rem; color: var(--tx3); }

/* Payment method */
.pay-opts { display: grid; grid-template-columns: 1fr 1fr; gap: 11px; margin-bottom: 18px; }
.pay-opt {
  border: 2px solid var(--bd); border-radius: var(--r); padding: 15px 12px;
  cursor: pointer; transition: all var(--t); text-align: center; background: var(--bg);
}
.pay-opt:hover  { border-color: rgba(232,98,10,.4); }
.pay-opt.sel    { border-color: var(--or); background: rgba(232,98,10,.07); }
.pay-opt-ico    { font-size: 1.7rem; margin-bottom: 7px; }
.pay-opt-title  { font-size: .86rem; font-weight: 700; margin-bottom: 2px; }
.pay-opt-sub    { font-size: .73rem; color: var(--tx2); }

/* Stripe wrapper */
.stripe-wrap {
  background: var(--bg); border: 1px solid var(--bd); border-radius: var(--r);
  padding: 16px; margin-bottom: 16px; min-height: 120px;
  display: flex; align-items: center; justify-content: center;
}
.stripe-wrap.ready { display: block; }

/* Order summary */
.o-sum { background: var(--bg); border: 1px solid var(--bd); border-radius: var(--rs); padding: 13px; margin-bottom: 16px; }
.o-sum-row { display: flex; justify-content: space-between; font-size: .84rem; padding: 4px 0; color: var(--tx2); }
.o-sum-row.total { border-top: 1px solid var(--bd); margin-top: 8px; padding-top: 10px; font-weight: 700; font-size: .98rem; color: var(--tx); }

/* Success modal */
.success-bd { text-align: center; padding: 40px 24px; }
.s-ico { width: 74px; height: 74px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 2rem; margin: 0 auto 20px; }
.s-ico.cod  { background: rgba(34,197,94,.12);  border: 2px solid rgba(34,197,94,.3); }
.s-ico.visa { background: rgba(99,102,241,.12); border: 2px solid rgba(99,102,241,.3); }
.success-bd h3  { font-size: 1.7rem; margin-bottom: 10px; }
.success-bd p   { color: var(--tx2); font-size: .88rem; line-height: 1.7; }
.oid-box {
  background: var(--bg); border: 1px solid var(--bd); border-radius: var(--rs);
  padding: 9px 15px; font-family: monospace; font-size: .88rem;
  color: var(--or); margin: 15px auto; display: inline-block; letter-spacing: .04em;
}

/* ════════════════════════════════════════
   ADMIN LOGIN
════════════════════════════════════════ */
.admin-login-ov {
  position: fixed; inset: 0; background: rgba(0,0,0,.95); z-index: 900;
  display: flex; align-items: center; justify-content: center;
  opacity: 0; pointer-events: none; transition: opacity .28s;
}
.admin-login-ov.open { opacity: 1; pointer-events: all; }
.login-box {
  background: var(--s1); border: 1px solid var(--bd); border-radius: var(--r);
  padding: 44px 40px; width: 100%; max-width: 390px; text-align: center;
}
.login-box h2    { margin-bottom: 7px; }
.login-box > p   { color: var(--tx2); font-size: .86rem; margin-bottom: 28px; }
.login-msg {
  border-radius: var(--rs); padding: 10px 13px; font-size: .8rem; margin-bottom: 12px;
}
.login-msg.err  { background: rgba(239,68,68,.1); border: 1px solid rgba(239,68,68,.3); color: var(--red); }
.login-msg.warn { background: rgba(245,158,11,.1); border: 1px solid rgba(245,158,11,.3); color: var(--ylw); }
.login-attempts { font-size: .74rem; color: var(--tx3); margin-top: 8px; }

/* ════════════════════════════════════════
   ADMIN PANEL
════════════════════════════════════════ */
.admin-panel {
  position: fixed; inset: 0; background: var(--bg); z-index: 800;
  display: flex; flex-direction: column; overflow: hidden;
}
.adm-nav {
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 26px; height: 60px; background: var(--s1);
  border-bottom: 1px solid var(--bd); flex-shrink: 0;
}
.adm-nav h2 { font-size: 1.05rem; font-weight: 700; }
.adm-nav-r  { display: flex; align-items: center; gap: 10px; }
.adm-session { font-size: .76rem; color: var(--tx3); }
.adm-tabs {
  display: flex; gap: 2px; padding: 0 26px; background: var(--s1);
  border-bottom: 1px solid var(--bd); flex-shrink: 0;
}
.adm-tab {
  padding: 12px 17px; font-size: .84rem; font-weight: 600; color: var(--tx2);
  background: none; border: none; cursor: pointer; border-bottom: 2px solid transparent;
  transition: all var(--t);
}
.adm-tab.on { color: var(--or); border-bottom-color: var(--or); }
.adm-body   { flex: 1; overflow-y: auto; padding: 24px 26px; }
.adm-stats  { display: grid; grid-template-columns: repeat(4,1fr); gap: 13px; margin-bottom: 22px; }
.adm-stat   { background: var(--s1); border: 1px solid var(--bd); border-radius: var(--rs); padding: 17px; }
.adm-stat-lbl { font-size: .72rem; color: var(--tx2); text-transform: uppercase; letter-spacing: .08em; margin-bottom: 7px; }
.adm-stat-val { font-size: 1.6rem; font-weight: 700; font-family: 'Playfair Display', serif; }
.rev-chart { background: var(--s1); border: 1px solid var(--bd); border-radius: var(--rs); padding: 20px; margin-bottom: 20px; }
.rev-chart-title { font-size: .82rem; font-weight: 600; color: var(--tx2); margin-bottom: 16px; }
.rev-bars  { display: flex; align-items: flex-end; gap: 10px; height: 90px; }
.rev-bar-col { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 4px; }
.rev-bar-val { font-size: .62rem; color: var(--tx3); }
.rev-bar     { width: 100%; min-height: 3px; border-radius: 3px 3px 0 0; transition: height .6s ease; }
.rev-bar-lbl { font-size: .62rem; color: var(--tx3); text-align: center; }
.tbl-card    { background: var(--s1); border: 1px solid var(--bd); border-radius: var(--r); overflow: hidden; margin-bottom: 20px; }
.tbl-hd      { display: flex; align-items: center; justify-content: space-between; padding: 15px 17px; border-bottom: 1px solid var(--bd); }
.tbl-hd h4   { font-size: .92rem; font-weight: 700; }
.tbl-scroll  { overflow-x: auto; }
table        { width: 100%; border-collapse: collapse; }
thead tr     { background: var(--s2); }
th           { padding: 10px 13px; text-align: left; font-size: .7rem; font-weight: 700; color: var(--tx2); text-transform: uppercase; letter-spacing: .07em; white-space: nowrap; }
td           { padding: 11px 13px; font-size: .84rem; vertical-align: middle; border-top: 1px solid var(--bd); }
tr:hover td  { background: rgba(255,255,255,.015); }
.adm-select  { background: var(--bg); border: 1px solid var(--bd); color: var(--tx); padding: 7px 11px; border-radius: var(--rs); font-size: .8rem; cursor: pointer; }
.adm-select:focus { outline: none; border-color: var(--or); }
.settings-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.adm-modal-ov {
  position: fixed; inset: 0; background: rgba(0,0,0,.88); z-index: 850;
  display: flex; align-items: center; justify-content: center; padding: 16px;
  opacity: 0; pointer-events: none; transition: opacity .22s;
}
.adm-modal-ov.open { opacity: 1; pointer-events: all; }
.adm-modal {
  background: var(--s1); border: 1px solid var(--bd); border-radius: var(--r);
  width: 100%; max-width: 550px; max-height: 90vh; overflow-y: auto;
}

/* ════════════════════════════════════════
   TOAST
════════════════════════════════════════ */
.toasts {
  position: fixed; bottom: 22px; left: 22px; z-index: 1000;
  display: flex; flex-direction: column; gap: 8px; max-width: 300px;
  pointer-events: none;
}
.toast {
  background: var(--s1); border: 1px solid var(--bd); border-radius: var(--rs);
  padding: 12px 16px; font-size: .84rem; font-weight: 500;
  display: flex; align-items: center; gap: 9px;
  animation: toastIn .28s ease both;
  box-shadow: 0 8px 30px rgba(0,0,0,.5); pointer-events: all;
}
.toast.ok   { border-color: rgba(34,197,94,.35); }
.toast.err  { border-color: rgba(239,68,68,.35); }
.toast.info { border-color: rgba(232,98,10,.35); }
@keyframes toastIn  { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:none; } }
@keyframes toastOut { to   { opacity:0; transform:translateY(-8px); } }

/* ════════════════════════════════════════
   WHATSAPP FAB
════════════════════════════════════════ */
.wa-fab {
  position: fixed; bottom: 22px; right: 22px; z-index: 150;
  width: 52px; height: 52px; border-radius: 50%; background: #25D366;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 6px 22px rgba(37,211,102,.42); transition: all .25s;
  animation: waPulse 3s ease infinite;
}
.wa-fab:hover { transform: scale(1.1); box-shadow: 0 8px 28px rgba(37,211,102,.62); }
@keyframes waPulse { 0%,100%{box-shadow:0 6px 22px rgba(37,211,102,.42);}50%{box-shadow:0 6px 28px rgba(37,211,102,.65);} }
.wa-fab svg { width: 27px; height: 27px; fill: #fff; }

/* ════════════════════════════════════════
   RESPONSIVE
════════════════════════════════════════ */
@media (max-width: 900px) {
  .nav-links, .nav-search { display: none; }
  .hamburger { display: flex; }
  .section, .hero { padding: 56px 20px; }
  .nav { padding: 0 18px; }
  .ft-grid   { grid-template-columns: 1fr; gap: 24px; }
  .footer    { padding: 38px 20px 22px; }
  .adm-stats { grid-template-columns: repeat(2,1fr); }
  .pillars   { grid-template-columns: 1fr; }
  .fgrow     { grid-template-columns: 1fr; }
  .pay-opts  { grid-template-columns: 1fr; }
  .settings-grid { grid-template-columns: 1fr; }
  .adm-body  { padding: 18px 16px; }
}
@media (max-width: 600px) {
  .hero h1   { font-size: 2.5rem; }
  .cart-panel{ width: 100%; }
  .adm-stats { grid-template-columns: 1fr 1fr; }
  .adm-nav   { padding: 0 16px; }
  .login-box { padding: 32px 22px; }
  th, td     { padding: 9px 10px; }
  .products-grid .p-card:first-child { grid-column: span 1; }
}
