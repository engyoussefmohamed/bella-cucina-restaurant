// ============================================================
//  BELLA CUCINA — MENU PAGE
//  100% JavaScript — zero CSS files or <style> tags
//  All styling done via element.style
// ============================================================

// ─────────────────────────────────────────────────────────────
//  THEME ENGINE
// ─────────────────────────────────────────────────────────────
let theme = localStorage.getItem('theme') || 'light';

const COLORS = {
  light: {
    bg:      '#ffffff', bg2: '#f8f4f0',
    text:    '#1a1a1a', muted: '#666666',
    primary: '#c8762b', priD: '#a85e1e',
    card:    '#ffffff', border: '#e5e5e5',
    nav:     'rgba(255,255,255,0.95)',
    shadow:  '0 4px 20px rgba(0,0,0,0.08)',
    footBg:  '#1a1a1a', footTxt: '#aaaaaa',
  },
  dark: {
    bg:      '#121212', bg2: '#1e1e1e',
    text:    '#f0f0f0', muted: '#aaaaaa',
    primary: '#e08c3a', priD: '#c8762b',
    card:    '#242424', border: '#333333',
    nav:     'rgba(18,18,18,0.95)',
    shadow:  '0 4px 20px rgba(0,0,0,0.4)',
    footBg:  '#0a0a0a', footTxt: '#666666',
  }
};

const _reg = [];
function c(k) { return COLORS[theme][k]; }
function reg(el, fn) { _reg.push({ el, fn }); Object.assign(el.style, fn()); return el; }
function refreshTheme() { _reg.forEach(({ el, fn }) => Object.assign(el.style, fn())); }

// ─────────────────────────────────────────────────────────────
//  HELPERS
// ─────────────────────────────────────────────────────────────
function mk(tag)        { return document.createElement(tag); }
function st(el, obj)    { Object.assign(el.style, obj); return el; }
function app(p, ...kids){ kids.forEach(k => p.appendChild(k)); return p; }
function onHover(el, inFn, outFn) {
  el.addEventListener('mouseenter', inFn);
  el.addEventListener('mouseleave', outFn);
}

// Scroll animation
const _animObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.opacity = '1';
      e.target.style.transform = 'translateY(0)';
      _animObs.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });

function anim(el) {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  _animObs.observe(el);
  return el;
}

// Responsive grids
const _grids = [];
function makeGrid(d = 2, t = 1, m = 1) {
  const g = mk('div');
  st(g, { display: 'grid', gap: '20px' });
  _grids.push({ el: g, d, t, m });
  return g;
}
function updateGrids() {
  const w = window.innerWidth;
  _grids.forEach(({ el, d, t, m }) => {
    el.style.gridTemplateColumns = w <= 768 ? `repeat(${m},1fr)` : w <= 992 ? `repeat(${t},1fr)` : `repeat(${d},1fr)`;
  });
}
window.addEventListener('resize', () => { updateGrids(); updateResponsive(); });

// ─────────────────────────────────────────────────────────────
//  BASE
// ─────────────────────────────────────────────────────────────
document.documentElement.style.scrollBehavior = 'smooth';
reg(document.body, () => ({
  fontFamily: "'Segoe UI', Tahoma, sans-serif",
  backgroundColor: c('bg'), color: c('text'),
  margin: '0', padding: '0', lineHeight: '1.6',
  transition: 'background-color 0.3s, color 0.3s',
}));

// ─────────────────────────────────────────────────────────────
//  NAVBAR
// ─────────────────────────────────────────────────────────────
const navbar = mk('nav');
reg(navbar, () => ({
  position: 'fixed', top: '0', left: '0', right: '0', zIndex: '1000',
  background: c('nav'), backdropFilter: 'blur(10px)',
  borderBottom: `1px solid ${c('border')}`, transition: 'background 0.3s, box-shadow 0.3s',
}));

const navInner = mk('div');
st(navInner, { maxWidth: '1200px', margin: '0 auto', padding: '0 24px', height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' });

const logoEl = mk('a');
logoEl.href = 'index.html';
logoEl.innerHTML = '🍽️&nbsp;Bella';
const logoCucina = mk('span');
logoCucina.textContent = 'Cucina';
reg(logoCucina, () => ({ color: c('text') }));
logoEl.appendChild(logoCucina);
reg(logoEl, () => ({ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '1.5rem', fontWeight: '700', color: c('primary'), textDecoration: 'none' }));

const navLinks = mk('ul');
st(navLinks, { display: 'flex', gap: '32px', listStyle: 'none', margin: '0', padding: '0' });

const NAV = [
  { href: 'index.html', label: 'Home' },
  { href: 'menu.html',  label: 'Menu', active: true },
  { href: 'index.html#about',   label: 'About' },
  { href: 'index.html#contact', label: 'Contact' },
];

NAV.forEach(({ href, label, active }) => {
  const li = mk('li'); const a = mk('a');
  a.href = href; a.textContent = label;
  reg(a, () => ({ fontSize: '.95rem', fontWeight: '500', color: active ? c('primary') : c('muted'), textDecoration: 'none', transition: 'color 0.2s' }));
  onHover(a, () => (a.style.color = c('primary')), () => (a.style.color = active ? c('primary') : c('muted')));
  li.appendChild(a); navLinks.appendChild(li);
});

const navRight = mk('div');
st(navRight, { display: 'flex', alignItems: 'center', gap: '14px' });

const themeBtn = mk('button');
const themeIcon  = mk('span'); themeIcon.textContent  = theme === 'dark' ? '☀️' : '🌙';
const themeLabel = mk('span'); themeLabel.textContent = theme === 'dark' ? 'Light' : 'Dark';
app(themeBtn, themeIcon, themeLabel);
reg(themeBtn, () => ({ backgroundColor: c('bg2'), border: `1px solid ${c('border')}`, borderRadius: '50px', padding: '7px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '.85rem', color: c('text'), transition: 'all 0.3s' }));
onHover(themeBtn,
  () => st(themeBtn, { backgroundColor: c('primary'), color: '#fff', borderColor: c('primary') }),
  () => st(themeBtn, { backgroundColor: c('bg2'), color: c('text'), borderColor: c('border') })
);

const burgerBtn = mk('button');
st(burgerBtn, { flexDirection: 'column', gap: '5px', cursor: 'pointer', background: 'none', border: 'none', padding: '4px' });
const burgerBars = [];
for (let i = 0; i < 3; i++) {
  const bar = mk('span');
  reg(bar, () => ({ display: 'block', width: '24px', height: '2px', backgroundColor: c('text'), borderRadius: '2px', transition: 'all 0.3s' }));
  burgerBtn.appendChild(bar); burgerBars.push(bar);
}

app(navRight, themeBtn, burgerBtn);
app(navInner, logoEl, navLinks, navRight);
navbar.appendChild(navInner);

const mobMenu = mk('div');
st(mobMenu, { display: 'none', padding: '16px 24px' });
reg(mobMenu, () => ({ background: c('nav'), borderTop: `1px solid ${c('border')}` }));
const mobList = mk('ul');
st(mobList, { listStyle: 'none', margin: '0', padding: '0', display: 'flex', flexDirection: 'column', gap: '16px' });
NAV.forEach(({ href, label, active }) => {
  const li = mk('li'); const a = mk('a');
  a.href = href; a.textContent = label;
  reg(a, () => ({ fontSize: '1rem', fontWeight: '500', color: active ? c('primary') : c('muted'), textDecoration: 'none', transition: 'color 0.2s' }));
  onHover(a, () => (a.style.color = c('primary')), () => (a.style.color = active ? c('primary') : c('muted')));
  a.addEventListener('click', closeMenu);
  li.appendChild(a); mobList.appendChild(li);
});
mobMenu.appendChild(mobList);
navbar.appendChild(mobMenu);
document.body.appendChild(navbar);

// ─────────────────────────────────────────────────────────────
//  PAGE HEADER
// ─────────────────────────────────────────────────────────────
const pageHeader = mk('div');
reg(pageHeader, () => ({ backgroundColor: c('bg2'), borderBottom: `1px solid ${c('border')}` }));
st(pageHeader, { padding: '140px 24px 80px', textAlign: 'center', transition: 'background-color 0.3s' });

const phTag = mk('div');
phTag.textContent = 'Explore';
st(phTag, { display: 'inline-block', backgroundColor: 'rgba(200,118,43,0.12)', color: '#c8762b', padding: '6px 16px', borderRadius: '50px', fontSize: '.8rem', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '16px' });

const phTitle = mk('h1');
phTitle.innerHTML = 'Our <span style="color:#c8762b">Menu</span>';
reg(phTitle, () => ({ color: c('text') }));
st(phTitle, { fontSize: '3rem', fontWeight: '800', margin: '0 0 12px', lineHeight: '1.2' });

const phSub = mk('p');
phSub.textContent = 'Crafted with passion, served with love';
reg(phSub, () => ({ color: c('muted') }));
st(phSub, { fontSize: '1rem', margin: '0' });

app(pageHeader, phTag, phTitle, phSub);
document.body.appendChild(pageHeader);

// ─────────────────────────────────────────────────────────────
//  MENU SECTION WRAPPER
// ─────────────────────────────────────────────────────────────
const menuMain = mk('section');
st(menuMain, { padding: '60px 24px' });
reg(menuMain, () => ({ backgroundColor: c('bg') }));
const menuCont = mk('div');
st(menuCont, { maxWidth: '1200px', margin: '0 auto' });
menuMain.appendChild(menuCont);
document.body.appendChild(menuMain);

// ─────────────────────────────────────────────────────────────
//  FILTER BAR
// ─────────────────────────────────────────────────────────────
const filterBar = mk('div');
st(filterBar, { display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '48px' });

const FILTERS = [
  { label: '🍴 All',      value: 'all' },
  { label: '🥗 Starters', value: 'starters' },
  { label: '🍝 Pasta',    value: 'pasta' },
  { label: '🍕 Pizza',    value: 'pizza' },
  { label: '🥩 Grill',    value: 'grill' },
  { label: '🍮 Desserts', value: 'desserts' },
  { label: '🍷 Drinks',   value: 'drinks' },
];

const filterBtns = [];

FILTERS.forEach(({ label, value }, i) => {
  const btn = mk('button');
  btn.textContent = label;
  btn.dataset.filter = value;
  const isActive = i === 0;

  const applyActive = (active) => {
    st(btn, {
      backgroundColor: active ? '#c8762b' : c('card'),
      color:           active ? '#fff'     : c('muted'),
      borderColor:     active ? '#c8762b'  : c('border'),
    });
  };

  reg(btn, () => ({
    border: `2px solid ${c('border')}`,
    backgroundColor: c('card'),
    color: c('muted'),
  }));

  st(btn, { padding: '10px 22px', borderRadius: '50px', fontSize: '.9rem', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s' });

  if (isActive) applyActive(true);

  btn.addEventListener('click', () => {
    filterBtns.forEach((b, j) => applyActive(j === filterBtns.indexOf(btn)));
    const filter = btn.dataset.filter;
    menuSections.forEach(({ el, cat }) => {
      el.style.display = (filter === 'all' || cat === filter) ? 'block' : 'none';
    });
  });

  filterBtns.push({ btn, applyActive });
  filterBar.appendChild(btn);
});

menuCont.appendChild(filterBar);

// ─────────────────────────────────────────────────────────────
//  MENU ITEM BUILDER
// ─────────────────────────────────────────────────────────────
function makeBadge(text, type) {
  const badge = mk('span');
  badge.textContent = text;
  const colors = {
    veg:   { bg: 'rgba(34,197,94,0.15)',   color: '#16a34a' },
    spicy: { bg: 'rgba(239,68,68,0.15)',   color: '#dc2626' },
    pop:   { bg: 'rgba(200,118,43,0.15)',  color: '#c8762b' },
    new:   { bg: 'rgba(99,102,241,0.15)',  color: '#4f46e5' },
  };
  const col = colors[type] || colors.pop;
  st(badge, { padding: '2px 8px', borderRadius: '20px', fontSize: '.7rem', fontWeight: '600', backgroundColor: col.bg, color: col.color });
  return badge;
}

function makeMenuItem(emoji, name, desc, price, badges = []) {
  const item = mk('div');
  reg(item, () => ({
    backgroundColor: c('card'), border: `1px solid ${c('border')}`,
    boxShadow: c('shadow'), transition: 'all 0.3s',
  }));
  st(item, { display: 'flex', alignItems: 'center', gap: '20px', padding: '20px', borderRadius: '16px' });
  onHover(item,
    () => st(item, { transform: 'translateY(-4px)', boxShadow: '0 8px 28px rgba(0,0,0,.1)' }),
    () => st(item, { transform: 'translateY(0)', boxShadow: c('shadow') })
  );

  const imgEl = mk('div');
  imgEl.textContent = emoji;
  reg(imgEl, () => ({ backgroundColor: c('bg2') }));
  st(imgEl, { width: '80px', height: '80px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.4rem', flexShrink: '0', transition: 'background-color 0.3s' });

  const info = mk('div');
  st(info, { flex: '1' });

  const top = mk('div');
  st(top, { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', marginBottom: '6px' });

  const nameEl = mk('span');
  nameEl.textContent = name;
  reg(nameEl, () => ({ color: c('text') }));
  st(nameEl, { fontSize: '1rem', fontWeight: '700' });

  const priceEl = mk('span');
  priceEl.textContent = price;
  st(priceEl, { fontSize: '1.1rem', fontWeight: '800', color: '#c8762b', whiteSpace: 'nowrap' });

  app(top, nameEl, priceEl);

  const descEl = mk('p');
  descEl.textContent = desc;
  reg(descEl, () => ({ color: c('muted') }));
  st(descEl, { fontSize: '.83rem', lineHeight: '1.5', margin: '0 0 10px' });

  const badgesDiv = mk('div');
  st(badgesDiv, { display: 'flex', gap: '6px', flexWrap: 'wrap' });
  badges.forEach(([txt, type]) => badgesDiv.appendChild(makeBadge(txt, type)));

  app(info, top, descEl, badgesDiv);
  app(item, imgEl, info);
  return item;
}

// ─────────────────────────────────────────────────────────────
//  MENU DATA & SECTIONS
// ─────────────────────────────────────────────────────────────
const MENU_DATA = [
  {
    cat: 'starters', icon: '🥗', title: 'Starters',
    items: [
      ['🥗', 'Caprese Salad',       'Fresh mozzarella, tomatoes, basil, and extra virgin olive oil.',     '$12', [['Vegetarian','veg'],['Popular','pop']]],
      ['🍞', 'Bruschetta al Pomodoro','Toasted ciabatta with garlic, vine tomatoes, and fresh herbs.',     '$10', [['Vegetarian','veg']]],
      ['🦑', 'Calamari Fritti',     'Crispy fried calamari with marinara sauce and lemon.',               '$15', [['Popular','pop']]],
      ['🧅', 'Burrata & Prosciutto','Creamy burrata cheese with aged prosciutto and fig jam.',            '$18', [['New','new']]],
    ]
  },
  {
    cat: 'pasta', icon: '🍝', title: 'Pasta',
    items: [
      ['🍝', 'Tagliatelle al Tartufo',    'Handmade tagliatelle with black truffle, cream, and parmesan.',       '$24', [['Vegetarian','veg'],['Popular','pop']]],
      ['🍜', 'Spaghetti Carbonara',       'Classic Roman carbonara with guanciale, egg yolk, and pecorino.',    '$20', [['Popular','pop']]],
      ['🫙', "Penne all'Arrabbiata",      'Penne in spicy tomato sauce with garlic, chili, and basil.',          '$17', [['Vegetarian','veg'],['Spicy','spicy']]],
      ['🦞', 'Linguine ai Frutti di Mare','Linguine with fresh seafood in white wine and cherry tomato sauce.', '$32', [['New','new']]],
    ]
  },
  {
    cat: 'pizza', icon: '🍕', title: 'Pizza',
    items: [
      ['🍕', 'Margherita Suprema',    'San Marzano tomatoes, buffalo mozzarella, basil, olive oil.',           '$18', [['Vegetarian','veg'],['Popular','pop']]],
      ['🫒', 'Pizza Quattro Stagioni','Four sections: ham, artichokes, mushrooms, and olives.',               '$22', [['Popular','pop']]],
      ['🌶️', 'Diavola Piccante',     'Spicy salami, chili flakes, mozzarella, and tomato base.',              '$21', [['Spicy','spicy']]],
      ['🧄', 'Pizza Bianca al Tartufo','White base with truffle oil, ricotta, mushrooms, and arugula.',       '$28', [['Vegetarian','veg'],['New','new']]],
    ]
  },
  {
    cat: 'grill', icon: '🥩', title: 'Grill',
    items: [
      ['🥩', 'Bistecca Fiorentina','T-bone steak with rosemary, garlic, and Tuscan olive oil.',         '$48', [['Popular','pop']]],
      ['🍗', 'Pollo alla Griglia', 'Grilled chicken breast with lemon, capers, and herb butter.',       '$26', [['New','new']]],
      ['🦐', 'Gamberi alla Brace', 'Chargrilled king prawns with garlic, white wine, and parsley.',     '$36', [['Popular','pop']]],
      ['🥦', 'Verdure alla Griglia','Seasonal grilled vegetables with balsamic glaze and fresh herbs.', '$16', [['Vegetarian','veg']]],
    ]
  },
  {
    cat: 'desserts', icon: '🍮', title: 'Desserts',
    items: [
      ['☕', 'Tiramisù Classico',       'Espresso-soaked ladyfingers, mascarpone cream, and cocoa.',   '$11', [['Vegetarian','veg'],['Popular','pop']]],
      ['🍮', 'Panna Cotta al Frutti',  'Vanilla cream with seasonal berry coulis and mint.',           '$9',  [['Vegetarian','veg']]],
      ['🍫', 'Fondente al Cioccolato', 'Warm dark chocolate lava cake with vanilla gelato.',           '$13', [['Vegetarian','veg'],['New','new']]],
      ['🍦', 'Selezione di Gelati',    'Three scoops of artisan gelato — ask for today\'s flavors.',  '$8',  [['Vegetarian','veg']]],
    ]
  },
  {
    cat: 'drinks', icon: '🍷', title: 'Drinks',
    items: [
      ['🍷', 'Chianti Classico DOCG','Renowned Tuscan red with cherry, leather, and earthy notes.',    '$14/glass', [['Popular','pop']]],
      ['🥂', 'Prosecco Superiore',   'Crisp and bubbly with hints of apple and white peach.',         '$12/glass', [['Popular','pop']]],
      ['🍋', 'Limonata Fresca',      'House-made sparkling lemonade with mint and Sicilian lemons.',  '$6',        [['Vegan','veg']]],
      ['☕', 'Espresso & Caffè',      'Espresso, cappuccino, macchiato, or americano.',                '$4',        [['Vegan','veg']]],
    ]
  },
];

// Build menu sections
const menuSections = [];

MENU_DATA.forEach(({ cat, icon, title, items }) => {
  const sec = mk('div');
  sec.id = cat;
  st(sec, { marginBottom: '64px' });

  // Section heading
  const heading = mk('div');
  reg(heading, () => ({ borderBottom: `2px solid ${c('border')}` }));
  st(heading, { display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1.4rem', fontWeight: '700', marginBottom: '28px', paddingBottom: '16px', transition: 'border-color 0.3s' });
  const headIcon = mk('span');
  headIcon.textContent = icon;
  st(headIcon, { fontSize: '1.6rem' });
  const headTitle = mk('span');
  headTitle.textContent = title;
  reg(headTitle, () => ({ color: c('text') }));
  app(heading, headIcon, headTitle);

  const grid = makeGrid(2, 1, 1);
  items.forEach(([emoji, name, desc, price, badges]) => {
    grid.appendChild(makeMenuItem(emoji, name, desc, price, badges));
  });

  anim(sec);
  app(sec, heading, grid);
  menuCont.appendChild(sec);
  menuSections.push({ el: sec, cat });
});

// ─────────────────────────────────────────────────────────────
//  FOOTER
// ─────────────────────────────────────────────────────────────
const footer = mk('footer');
reg(footer, () => ({ backgroundColor: c('footBg'), color: c('footTxt'), transition: 'background-color 0.3s' }));
st(footer, { padding: '60px 24px 30px' });

const footGrid = mk('div');
st(footGrid, { maxWidth: '1200px', margin: '0 auto', display: 'grid', gap: '48px', paddingBottom: '48px', borderBottom: '1px solid #333' });
_grids.push({ el: footGrid, d: 3, t: 2, m: 1 });

const footBrand = mk('div');
const footLogoEl = mk('div');
footLogoEl.innerHTML = '🍽️ Bella<span style="color:#aaa">Cucina</span>';
st(footLogoEl, { fontSize: '1.4rem', fontWeight: '700', color: '#c8762b', marginBottom: '12px' });
const footBrandP = mk('p');
footBrandP.textContent = 'Bringing the heart of Italy to your table since 2009. Authentic flavors, unforgettable memories.';
reg(footBrandP, () => ({ color: c('footTxt') }));
st(footBrandP, { fontSize: '.9rem', lineHeight: '1.7', maxWidth: '280px', margin: '0' });
app(footBrand, footLogoEl, footBrandP);

const footNavCol = mk('div');
const footNavH = mk('h4');
footNavH.textContent = 'Navigate';
st(footNavH, { color: '#fff', fontSize: '1rem', margin: '0 0 20px', fontWeight: '600' });
const footNavUl = mk('ul');
st(footNavUl, { listStyle: 'none', margin: '0', padding: '0', display: 'flex', flexDirection: 'column', gap: '10px' });
[['index.html','Home'],['menu.html','Menu'],['index.html#about','About'],['index.html#contact','Contact']].forEach(([href, lbl]) => {
  const li = mk('li'); const a = mk('a');
  a.href = href; a.textContent = lbl;
  reg(a, () => ({ color: c('footTxt') }));
  st(a, { fontSize: '.9rem', textDecoration: 'none', transition: 'color 0.2s' });
  onHover(a, () => (a.style.color = '#c8762b'), () => (a.style.color = c('footTxt')));
  li.appendChild(a); footNavUl.appendChild(li);
});
app(footNavCol, footNavH, footNavUl);

const footHrsCol = mk('div');
const footHrsH = mk('h4');
footHrsH.textContent = 'Hours';
st(footHrsH, { color: '#fff', fontSize: '1rem', margin: '0 0 20px', fontWeight: '600' });
const footHrsUl = mk('ul');
st(footHrsUl, { listStyle: 'none', margin: '0', padding: '0', display: 'flex', flexDirection: 'column', gap: '10px' });
['Mon–Fri: 11am – 11pm','Sat–Sun: 10am – 12am','Kitchen closes 30 min early'].forEach(t => {
  const li = mk('li'); const span = mk('span');
  span.textContent = t;
  reg(span, () => ({ color: c('footTxt') }));
  st(span, { fontSize: '.9rem' });
  li.appendChild(span); footHrsUl.appendChild(li);
});
app(footHrsCol, footHrsH, footHrsUl);

app(footGrid, footBrand, footNavCol, footHrsCol);
const footBottom = mk('div');
footBottom.textContent = '© 2025 BellaCucina. Made with ❤️ and a lot of pasta.';
st(footBottom, { maxWidth: '1200px', margin: '28px auto 0', textAlign: 'center', fontSize: '.85rem', color: '#555' });
app(footer, footGrid, footBottom);
document.body.appendChild(footer);

// ─────────────────────────────────────────────────────────────
//  BACK TO TOP
// ─────────────────────────────────────────────────────────────
const topBtn = mk('button');
topBtn.textContent = '↑';
st(topBtn, { position: 'fixed', bottom: '32px', right: '32px', zIndex: '999', width: '48px', height: '48px', backgroundColor: '#c8762b', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '1.4rem', cursor: 'pointer', opacity: '0', visibility: 'hidden', transform: 'translateY(16px)', transition: 'all 0.3s', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 16px rgba(200,118,43,.4)' });
onHover(topBtn,
  () => st(topBtn, { backgroundColor: '#a85e1e', transform: 'translateY(-4px)' }),
  () => st(topBtn, { backgroundColor: '#c8762b', transform: 'translateY(0)' })
);
topBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
document.body.appendChild(topBtn);

// ─────────────────────────────────────────────────────────────
//  EVENT LISTENERS
// ─────────────────────────────────────────────────────────────

// Theme
themeBtn.addEventListener('click', () => {
  theme = theme === 'dark' ? 'light' : 'dark';
  localStorage.setItem('theme', theme);
  themeIcon.textContent  = theme === 'dark' ? '☀️' : '🌙';
  themeLabel.textContent = theme === 'dark' ? 'Light' : 'Dark';
  refreshTheme();
  // Re-apply active filter button colors after theme change
  filterBtns.forEach(({ btn, applyActive }, i) => applyActive(btn.dataset.filter === currentFilter));
});

// Hamburger
let menuOpen = false;
function closeMenu() {
  menuOpen = false;
  mobMenu.style.display = 'none';
  burgerBars[0].style.transform = 'none';
  burgerBars[1].style.opacity   = '1';
  burgerBars[2].style.transform = 'none';
}
burgerBtn.addEventListener('click', () => {
  menuOpen = !menuOpen;
  if (menuOpen) {
    mobMenu.style.display = 'block';
    burgerBars[0].style.transform = 'translateY(7px) rotate(45deg)';
    burgerBars[1].style.opacity   = '0';
    burgerBars[2].style.transform = 'translateY(-7px) rotate(-45deg)';
  } else closeMenu();
});

// Track current filter for theme refresh
let currentFilter = 'all';
filterBtns.forEach(({ btn, applyActive }, i) => {
  btn.addEventListener('click', () => {
    currentFilter = btn.dataset.filter;
    filterBtns.forEach(({ btn: b, applyActive: ap }) => ap(b.dataset.filter === currentFilter));
  }, true); // use capture to run before existing listener
});

// Scroll
window.addEventListener('scroll', () => {
  const s = window.scrollY > 400;
  topBtn.style.opacity    = s ? '1' : '0';
  topBtn.style.visibility = s ? 'visible' : 'hidden';
  topBtn.style.transform  = s ? 'translateY(0)' : 'translateY(16px)';
  navbar.style.boxShadow  = window.scrollY > 20 ? '0 2px 20px rgba(0,0,0,.1)' : 'none';
});

// Responsive
function updateResponsive() {
  const mobile = window.innerWidth <= 768;
  navLinks.style.display  = mobile ? 'none' : 'flex';
  burgerBtn.style.display = mobile ? 'flex' : 'none';
}

// Init
updateResponsive();
updateGrids();
