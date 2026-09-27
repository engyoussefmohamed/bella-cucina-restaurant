// ============================================================
//  BELLA CUCINA — HOME PAGE
//  100% JavaScript — zero CSS files or <style> tags
//  All styling done via element.style
// ============================================================

// ─────────────────────────────────────────────────────────────
//  THEME ENGINE
// ─────────────────────────────────────────────────────────────
let theme = localStorage.getItem('theme') || 'light';

const COLORS = {
  light: {
    bg:      '#ffffff',
    bg2:     '#f8f4f0',
    text:    '#1a1a1a',
    muted:   '#666666',
    primary: '#c8762b',
    priD:    '#a85e1e',
    card:    '#ffffff',
    border:  '#e5e5e5',
    nav:     'rgba(255,255,255,0.95)',
    shadow:  '0 4px 20px rgba(0,0,0,0.08)',
    footBg:  '#1a1a1a',
    footTxt: '#aaaaaa',
  },
  dark: {
    bg:      '#121212',
    bg2:     '#1e1e1e',
    text:    '#f0f0f0',
    muted:   '#aaaaaa',
    primary: '#e08c3a',
    priD:    '#c8762b',
    card:    '#242424',
    border:  '#333333',
    nav:     'rgba(18,18,18,0.95)',
    shadow:  '0 4px 20px rgba(0,0,0,0.4)',
    footBg:  '#0a0a0a',
    footTxt: '#666666',
  }
};

// Registry: [{el, fn}] — fn() returns a style object for current theme
const _reg = [];
function c(k) { return COLORS[theme][k]; }

function reg(el, fn) {
  _reg.push({ el, fn });
  Object.assign(el.style, fn());
  return el;
}

function refreshTheme() {
  _reg.forEach(({ el, fn }) => Object.assign(el.style, fn()));
}

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

// Scroll-in animation (uses JS to set/unset inline styles)
const _animObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.opacity = '1';
      e.target.style.transform = 'translateY(0)';
      _animObs.unobserve(e.target);
    }
  });
}, { threshold: 0.15 });

function anim(el) {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  _animObs.observe(el);
  return el;
}

// Responsive grids — updated on resize
const _grids = [];
function makeGrid(colsDesktop = 3, colsTablet = 2, colsMobile = 1) {
  const g = mk('div');
  st(g, { display: 'grid', gap: '28px' });
  _grids.push({ el: g, d: colsDesktop, t: colsTablet, m: colsMobile });
  return g;
}

function updateGrids() {
  const w = window.innerWidth;
  _grids.forEach(({ el, d, t, m }) => {
    el.style.gridTemplateColumns = w <= 768
      ? `repeat(${m}, 1fr)`
      : w <= 992
      ? `repeat(${t}, 1fr)`
      : `repeat(${d}, 1fr)`;
  });
}

window.addEventListener('resize', () => { updateGrids(); updateResponsive(); });

// ─────────────────────────────────────────────────────────────
//  BASE — BODY
// ─────────────────────────────────────────────────────────────
document.documentElement.style.scrollBehavior = 'smooth';

reg(document.body, () => ({
  fontFamily: "'Segoe UI', Tahoma, sans-serif",
  backgroundColor: c('bg'),
  color: c('text'),
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
  borderBottom: `1px solid ${c('border')}`,
  transition: 'background 0.3s, box-shadow 0.3s',
}));

const navInner = mk('div');
st(navInner, {
  maxWidth: '1200px', margin: '0 auto', padding: '0 24px',
  height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
});

// Logo
const logoEl = mk('a');
logoEl.href = 'index.html';
logoEl.innerHTML = '🍽️&nbsp;Bella';
const logoCucina = mk('span');
logoCucina.textContent = 'Cucina';
reg(logoCucina, () => ({ color: c('text') }));
logoEl.appendChild(logoCucina);
reg(logoEl, () => ({
  display: 'flex', alignItems: 'center', gap: '4px',
  fontSize: '1.5rem', fontWeight: '700', color: c('primary'),
  textDecoration: 'none', cursor: 'pointer',
}));

// Desktop nav links
const navLinks = mk('ul');
st(navLinks, { display: 'flex', gap: '32px', listStyle: 'none', margin: '0', padding: '0' });

const NAV_ITEMS = [
  { href: 'index.html', label: 'Home',    active: true },
  { href: 'menu.html',  label: 'Menu' },
  { href: '#about',     label: 'About' },
  { href: '#contact',   label: 'Contact' },
];

NAV_ITEMS.forEach(({ href, label, active }) => {
  const li = mk('li');
  const a  = mk('a');
  a.href = href;
  a.textContent = label;
  reg(a, () => ({
    fontSize: '.95rem', fontWeight: '500',
    color: active ? c('primary') : c('muted'),
    textDecoration: 'none', transition: 'color 0.2s',
  }));
  onHover(a,
    () => (a.style.color = c('primary')),
    () => (a.style.color = active ? c('primary') : c('muted'))
  );
  li.appendChild(a);
  navLinks.appendChild(li);
});

// Nav right
const navRight = mk('div');
st(navRight, { display: 'flex', alignItems: 'center', gap: '14px' });

// Theme button
const themeBtn = mk('button');
const themeIcon  = mk('span'); themeIcon.textContent  = theme === 'dark' ? '☀️' : '🌙';
const themeLabel = mk('span'); themeLabel.textContent = theme === 'dark' ? 'Light' : 'Dark';
app(themeBtn, themeIcon, themeLabel);
reg(themeBtn, () => ({
  backgroundColor: c('bg2'), border: `1px solid ${c('border')}`,
  borderRadius: '50px', padding: '7px 16px', cursor: 'pointer',
  display: 'flex', alignItems: 'center', gap: '8px',
  fontSize: '.85rem', color: c('text'), transition: 'all 0.3s',
}));
onHover(themeBtn,
  () => st(themeBtn, { backgroundColor: c('primary'), color: '#fff', borderColor: c('primary') }),
  () => st(themeBtn, { backgroundColor: c('bg2'),     color: c('text'), borderColor: c('border') })
);

// Hamburger
const burgerBtn = mk('button');
st(burgerBtn, { flexDirection: 'column', gap: '5px', cursor: 'pointer', background: 'none', border: 'none', padding: '4px' });
const burgerBars = [];
for (let i = 0; i < 3; i++) {
  const bar = mk('span');
  reg(bar, () => ({ display: 'block', width: '24px', height: '2px', backgroundColor: c('text'), borderRadius: '2px', transition: 'all 0.3s' }));
  burgerBtn.appendChild(bar);
  burgerBars.push(bar);
}

app(navRight, themeBtn, burgerBtn);
app(navInner, logoEl, navLinks, navRight);
navbar.appendChild(navInner);

// Mobile menu
const mobMenu = mk('div');
st(mobMenu, { display: 'none', padding: '16px 24px' });
reg(mobMenu, () => ({ background: c('nav'), borderTop: `1px solid ${c('border')}` }));

const mobList = mk('ul');
st(mobList, { listStyle: 'none', margin: '0', padding: '0', display: 'flex', flexDirection: 'column', gap: '16px' });

NAV_ITEMS.forEach(({ href, label, active }) => {
  const li = mk('li');
  const a  = mk('a');
  a.href = href;
  a.textContent = label;
  reg(a, () => ({ fontSize: '1rem', fontWeight: '500', color: active ? c('primary') : c('muted'), textDecoration: 'none', transition: 'color 0.2s' }));
  onHover(a, () => (a.style.color = c('primary')), () => (a.style.color = active ? c('primary') : c('muted')));
  a.addEventListener('click', closeMenu);
  li.appendChild(a);
  mobList.appendChild(li);
});
mobMenu.appendChild(mobList);
navbar.appendChild(mobMenu);
document.body.appendChild(navbar);

// ─────────────────────────────────────────────────────────────
//  HERO
// ─────────────────────────────────────────────────────────────
const heroSec = mk('section');
st(heroSec, { minHeight: '100vh', display: 'flex', alignItems: 'center', paddingTop: '70px', overflow: 'hidden', position: 'relative' });
reg(heroSec, () => ({ backgroundColor: c('bg') }));

// Background glow (replaces ::before)
const glow = mk('div');
st(glow, { position: 'absolute', top: '-100px', right: '-100px', width: '600px', height: '600px', pointerEvents: 'none', background: 'radial-gradient(circle, rgba(200,118,43,0.12) 0%, transparent 70%)' });
heroSec.appendChild(glow);

const heroInner = mk('div');
st(heroInner, { maxWidth: '1200px', margin: '0 auto', padding: '60px 24px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '64px', alignItems: 'center', width: '100%' });

// Hero text (left)
const heroTxt = mk('div');

// Hero entry animation via JS keyframe
const kfStyle = mk('style');
kfStyle.textContent = '@keyframes fadeUp { from { opacity:0; transform:translateY(30px); } to { opacity:1; transform:translateY(0); } }';
document.head.appendChild(kfStyle);
heroTxt.style.animation = 'fadeUp 0.8s ease both';

// Tag
const heroTagEl = mk('div');
heroTagEl.textContent = '🌟 Fine Dining Experience';
st(heroTagEl, { display: 'inline-flex', alignItems: 'center', backgroundColor: 'rgba(200,118,43,0.12)', color: '#c8762b', padding: '8px 18px', borderRadius: '50px', fontSize: '.85rem', fontWeight: '600', marginBottom: '24px' });

// Title
const heroTitleEl = mk('h1');
heroTitleEl.textContent = 'Taste the Art ';
const heroTitleSpan = mk('span');
heroTitleSpan.textContent = 'of Italian Cuisine';
st(heroTitleSpan, { color: '#c8762b', display: 'block' });
heroTitleEl.appendChild(heroTitleSpan);
reg(heroTitleEl, () => ({ color: c('text') }));
st(heroTitleEl, { fontSize: '3.8rem', fontWeight: '900', lineHeight: '1.1', margin: '0 0 24px' });

// Desc
const heroDescEl = mk('p');
heroDescEl.textContent = 'Experience authentic Italian flavors crafted with love, using the finest ingredients sourced from across the Mediterranean.';
reg(heroDescEl, () => ({ color: c('muted') }));
st(heroDescEl, { fontSize: '1.1rem', margin: '0 0 40px', maxWidth: '460px', lineHeight: '1.8' });

// Buttons
const heroBtnsDiv = mk('div');
st(heroBtnsDiv, { display: 'flex', gap: '16px', flexWrap: 'wrap' });
heroBtnsDiv.appendChild(makeBtn('Explore Menu →', 'menu.html', true));
heroBtnsDiv.appendChild(makeBtn('About Us', '#about', false));

app(heroTxt, heroTagEl, heroTitleEl, heroDescEl, heroBtnsDiv);

// Hero card (right)
const heroCardWrap = mk('div');
st(heroCardWrap, { display: 'flex', justifyContent: 'center' });

const heroCard = mk('div');
heroCard.style.animation = 'fadeUp 0.8s 0.2s ease both';
reg(heroCard, () => ({
  backgroundColor: c('card'), borderRadius: '24px', padding: '48px',
  boxShadow: c('shadow'), border: `1px solid ${c('border')}`,
  textAlign: 'center', maxWidth: '360px', width: '100%',
  transition: 'background-color 0.3s, border-color 0.3s, box-shadow 0.3s',
}));

const emojiEl = mk('div');
emojiEl.textContent = '🍝';
st(emojiEl, { fontSize: '6rem', marginBottom: '24px' });

const hcTitle = mk('h3');
hcTitle.textContent = "Today's Special";
reg(hcTitle, () => ({ color: c('text') }));
st(hcTitle, { fontSize: '1.5rem', fontWeight: '700', margin: '0 0 12px' });

const hcDesc = mk('p');
hcDesc.textContent = 'Handmade pasta with truffle cream sauce and parmesan shavings';
reg(hcDesc, () => ({ color: c('muted') }));
st(hcDesc, { fontSize: '.95rem', margin: '0' });

const statsDiv = mk('div');
reg(statsDiv, () => ({ borderTop: `1px solid ${c('border')}` }));
st(statsDiv, { display: 'flex', gap: '32px', marginTop: '24px', paddingTop: '24px', transition: 'border-color 0.3s' });

[['4.9★', 'Rating'], ['200+', 'Dishes'], ['15+', 'Years']].forEach(([val, lbl]) => {
  const stat = mk('div');
  st(stat, { textAlign: 'center', flex: '1' });
  const strong = mk('strong');
  strong.textContent = val;
  st(strong, { display: 'block', fontSize: '1.6rem', fontWeight: '800', color: '#c8762b' });
  const small = mk('small');
  small.textContent = lbl;
  reg(small, () => ({ color: c('muted'), fontSize: '.8rem' }));
  app(stat, strong, small);
  statsDiv.appendChild(stat);
});

app(heroCard, emojiEl, hcTitle, hcDesc, statsDiv);
heroCardWrap.appendChild(heroCard);
app(heroInner, heroTxt, heroCardWrap);
heroSec.appendChild(heroInner);
document.body.appendChild(heroSec);

// ─────────────────────────────────────────────────────────────
//  SHARED BUILDERS
// ─────────────────────────────────────────────────────────────
function makeBtn(label, href, primary) {
  const btn = mk('a');
  btn.href = href;
  btn.textContent = label;
  st(btn, { display: 'inline-flex', alignItems: 'center', padding: '12px 28px', borderRadius: '8px', fontSize: '.95rem', fontWeight: '600', cursor: 'pointer', textDecoration: 'none', transition: 'all 0.3s' });
  if (primary) {
    st(btn, { backgroundColor: '#c8762b', color: '#fff', border: 'none' });
    onHover(btn,
      () => st(btn, { backgroundColor: '#a85e1e', transform: 'translateY(-2px)', boxShadow: '0 6px 20px rgba(200,118,43,.35)' }),
      () => st(btn, { backgroundColor: '#c8762b', transform: 'translateY(0)', boxShadow: 'none' })
    );
  } else {
    st(btn, { backgroundColor: 'transparent', color: '#c8762b', border: '2px solid #c8762b' });
    onHover(btn,
      () => st(btn, { backgroundColor: '#c8762b', color: '#fff', transform: 'translateY(-2px)' }),
      () => st(btn, { backgroundColor: 'transparent', color: '#c8762b', transform: 'translateY(0)' })
    );
  }
  return btn;
}

function makeSectionTag(text) {
  const tag = mk('div');
  tag.textContent = text;
  st(tag, { display: 'inline-block', backgroundColor: 'rgba(200,118,43,0.12)', color: '#c8762b', padding: '6px 16px', borderRadius: '50px', fontSize: '.8rem', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '16px' });
  return tag;
}

function makeSectionTitle(htmlStr) {
  const h = mk('h2');
  h.innerHTML = htmlStr;
  reg(h, () => ({ color: c('text') }));
  st(h, { fontSize: '2.5rem', fontWeight: '800', lineHeight: '1.2', margin: '0 0 16px' });
  h.querySelectorAll('span').forEach(s => (s.style.color = '#c8762b'));
  return h;
}

function makeCard() {
  const card = mk('div');
  reg(card, () => ({
    backgroundColor: c('card'), borderRadius: '16px',
    boxShadow: c('shadow'), border: `1px solid ${c('border')}`, overflow: 'hidden',
    transition: 'background-color 0.3s, border-color 0.3s, box-shadow 0.3s, transform 0.3s',
  }));
  onHover(card,
    () => st(card, { transform: 'translateY(-6px)', boxShadow: '0 12px 36px rgba(0,0,0,.12)' }),
    () => st(card, { transform: 'translateY(0)', boxShadow: c('shadow') })
  );
  return card;
}

function makeSection(id, bg2 = false) {
  const sec = mk('section');
  sec.id = id;
  st(sec, { padding: '100px 24px' });
  reg(sec, () => ({ backgroundColor: bg2 ? c('bg2') : c('bg'), transition: 'background-color 0.3s' }));
  const cont = mk('div');
  st(cont, { maxWidth: '1200px', margin: '0 auto' });
  sec.appendChild(cont);
  document.body.appendChild(sec);
  return cont;
}

// ─────────────────────────────────────────────────────────────
//  FEATURES
// ─────────────────────────────────────────────────────────────
const featCont = makeSection('about', true);

const featHeader = mk('div');
st(featHeader, { textAlign: 'center', marginBottom: '64px' });
const featDesc = mk('p');
featDesc.textContent = 'We combine tradition with innovation to deliver an unforgettable dining experience every single time.';
reg(featDesc, () => ({ color: c('muted') }));
st(featDesc, { fontSize: '1.05rem', maxWidth: '560px', margin: '0 auto' });
app(featHeader, makeSectionTag('Why Choose Us'), makeSectionTitle('The <span>Bella Cucina</span> Difference'), featDesc);
anim(featHeader);
featCont.appendChild(featHeader);

const feats = [
  ['🌿', 'Fresh Ingredients', 'Finest, freshest ingredients sourced daily from local farms and trusted Mediterranean suppliers.'],
  ['👨‍🍳', 'Master Chefs', 'World-class chefs bring decades of culinary expertise and passion to every plate.'],
  ['🍷', 'Curated Wine List', 'Hand-picked selection of 100+ premium wines perfectly matched to our cuisine.'],
  ['🕯️', 'Intimate Ambiance', 'Every corner designed to create the perfect atmosphere for any occasion.'],
  ['🚚', 'Fast Delivery', 'Enjoy Bella Cucina from home — hot, fresh, and on time, guaranteed.'],
  ['🎂', 'Private Events', 'Celebrate life\'s moments with exclusive private dining rooms and custom menus.'],
];

const featGrid = makeGrid(3, 2, 1);
feats.forEach(([icon, title, desc]) => {
  const card = makeCard();
  st(card, { padding: '36px 28px', textAlign: 'center' });
  const iconEl = mk('div');
  iconEl.textContent = icon;
  st(iconEl, { width: '72px', height: '72px', backgroundColor: 'rgba(200,118,43,0.1)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', margin: '0 auto 24px' });
  const titleEl = mk('h3');
  titleEl.textContent = title;
  reg(titleEl, () => ({ color: c('text') }));
  st(titleEl, { fontSize: '1.2rem', fontWeight: '700', margin: '0 0 12px' });
  const descEl = mk('p');
  descEl.textContent = desc;
  reg(descEl, () => ({ color: c('muted') }));
  st(descEl, { fontSize: '.9rem', lineHeight: '1.7', margin: '0' });
  app(card, iconEl, titleEl, descEl);
  anim(card);
  featGrid.appendChild(card);
});
featCont.appendChild(featGrid);

// ─────────────────────────────────────────────────────────────
//  SPECIALS
// ─────────────────────────────────────────────────────────────
const specCont = makeSection('specials', false);

const specHead = mk('div');
st(specHead, { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '48px', flexWrap: 'wrap', gap: '16px' });
const specLeft = mk('div');
app(specLeft, makeSectionTag("Chef's Picks"), makeSectionTitle("Today's <span>Specials</span>"));
[specLeft, makeBtn('Full Menu →', 'menu.html', false)].forEach(el => { anim(el); specHead.appendChild(el); });
specCont.appendChild(specHead);

const specials = [
  ['🍝', 'Pasta', 'Truffle Tagliatelle', 'Fresh egg pasta with black truffle, butter, and aged parmesan.', '$24'],
  ['🍕', 'Pizza', 'Margherita Suprema', 'Wood-fired pizza with San Marzano tomatoes and buffalo mozzarella.', '$18'],
  ['🥩', 'Grill', 'Bistecca Fiorentina', 'Grilled T-bone with rosemary, garlic, and Tuscan olive oil.', '$48'],
];

const specGrid = makeGrid(3, 2, 1);
specials.forEach(([emoji, tag, title, desc, price]) => {
  const card = makeCard();

  const imgDiv = mk('div');
  imgDiv.textContent = emoji;
  reg(imgDiv, () => ({ backgroundColor: c('bg2') }));
  st(imgDiv, { height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '5rem', transition: 'transform 0.3s, background-color 0.3s' });
  onHover(card, () => (imgDiv.style.transform = 'scale(1.05)'), () => (imgDiv.style.transform = 'scale(1)'));

  const body = mk('div');
  st(body, { padding: '24px' });

  const tagEl = mk('span');
  tagEl.textContent = tag;
  st(tagEl, { display: 'inline-block', backgroundColor: 'rgba(200,118,43,0.1)', color: '#c8762b', padding: '3px 10px', borderRadius: '20px', fontSize: '.75rem', fontWeight: '600', marginBottom: '10px' });

  const titleEl = mk('h3');
  titleEl.textContent = title;
  reg(titleEl, () => ({ color: c('text') }));
  st(titleEl, { fontSize: '1.1rem', fontWeight: '700', margin: '0 0 8px' });

  const descEl = mk('p');
  descEl.textContent = desc;
  reg(descEl, () => ({ color: c('muted') }));
  st(descEl, { fontSize: '.87rem', margin: '0 0 16px', lineHeight: '1.6' });

  const foot = mk('div');
  st(foot, { display: 'flex', justifyContent: 'space-between', alignItems: 'center' });
  const priceEl = mk('span');
  priceEl.textContent = price;
  st(priceEl, { fontSize: '1.3rem', fontWeight: '800', color: '#c8762b' });
  const orderBtn = makeBtn('Order', 'menu.html', true);
  st(orderBtn, { padding: '8px 18px', fontSize: '.85rem' });
  app(foot, priceEl, orderBtn);

  app(body, tagEl, titleEl, descEl, foot);
  app(card, imgDiv, body);
  anim(card);
  specGrid.appendChild(card);
});
specCont.appendChild(specGrid);

// ─────────────────────────────────────────────────────────────
//  TESTIMONIALS
// ─────────────────────────────────────────────────────────────
const testCont = makeSection('reviews', true);

const testHeader = mk('div');
st(testHeader, { textAlign: 'center', marginBottom: '56px' });
app(testHeader, makeSectionTag('Reviews'), makeSectionTitle('What Our <span>Guests Say</span>'));
anim(testHeader);
testCont.appendChild(testHeader);

const reviews = [
  ['S', 'Sarah Mitchell', 'Food Blogger', '"Absolutely the best Italian food I\'ve had outside of Rome. The truffle pasta is out of this world!"'],
  ['J', 'James & Clara', 'Regular Guests', '"We had our anniversary dinner here and it was magical. The ambiance, the food, the service — perfection."'],
  ['R', 'Rami Al-Hassan', 'Verified Customer', '"Their delivery service is just as impressive as dining in. Food arrived hot and tasted incredible."'],
];

const testGrid = makeGrid(3, 2, 1);
reviews.forEach(([init, name, role, quote]) => {
  const card = makeCard();
  st(card, { padding: '32px' });
  const stars = mk('div');
  stars.textContent = '★★★★★';
  st(stars, { color: '#f59e0b', marginBottom: '16px' });
  const quoteEl = mk('p');
  quoteEl.textContent = quote;
  reg(quoteEl, () => ({ color: c('muted') }));
  st(quoteEl, { fontSize: '.95rem', lineHeight: '1.7', margin: '0 0 24px', fontStyle: 'italic' });
  const author = mk('div');
  st(author, { display: 'flex', alignItems: 'center', gap: '12px' });
  const avatar = mk('div');
  avatar.textContent = init;
  st(avatar, { width: '44px', height: '44px', borderRadius: '50%', backgroundColor: '#c8762b', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: '700', flexShrink: '0' });
  const info = mk('div');
  const nameEl = mk('div');
  nameEl.textContent = name;
  reg(nameEl, () => ({ color: c('text') }));
  st(nameEl, { fontWeight: '600', fontSize: '.95rem' });
  const roleEl = mk('div');
  roleEl.textContent = role;
  reg(roleEl, () => ({ color: c('muted') }));
  st(roleEl, { fontSize: '.8rem' });
  app(info, nameEl, roleEl);
  app(author, avatar, info);
  app(card, stars, quoteEl, author);
  anim(card);
  testGrid.appendChild(card);
});
testCont.appendChild(testGrid);

// ─────────────────────────────────────────────────────────────
//  CTA
// ─────────────────────────────────────────────────────────────
const ctaSec = mk('section');
ctaSec.id = 'contact';
st(ctaSec, { background: 'linear-gradient(135deg, #c8762b 0%, #a85e1e 100%)', textAlign: 'center', padding: '100px 24px' });
const ctaCont = mk('div');
st(ctaCont, { maxWidth: '1200px', margin: '0 auto' });

const ctaTag = makeSectionTag('Reserve a Table');
st(ctaTag, { backgroundColor: 'rgba(255,255,255,0.2)', color: '#fff' });

const ctaTitle = mk('h2');
ctaTitle.innerHTML = 'Ready for an Unforgettable<br>Dining Experience?';
st(ctaTitle, { fontSize: '2.5rem', fontWeight: '800', color: '#fff', margin: '16px 0', lineHeight: '1.2' });

const ctaDesc = mk('p');
ctaDesc.innerHTML = 'Call us at <strong>+1 (555) 123-4567</strong> · 42 Via Roma Street, New York';
st(ctaDesc, { color: 'rgba(255,255,255,0.85)', fontSize: '1.05rem', margin: '0 0 40px' });

const ctaBtn = mk('a');
ctaBtn.href = 'tel:+15551234567';
ctaBtn.textContent = '📞 Book a Table';
st(ctaBtn, { backgroundColor: '#fff', color: '#c8762b', padding: '14px 36px', borderRadius: '8px', fontSize: '1rem', fontWeight: '700', display: 'inline-block', textDecoration: 'none', transition: 'all 0.3s' });
onHover(ctaBtn,
  () => st(ctaBtn, { transform: 'translateY(-3px)', boxShadow: '0 8px 24px rgba(0,0,0,.2)' }),
  () => st(ctaBtn, { transform: 'translateY(0)', boxShadow: 'none' })
);

app(ctaCont, ctaTag, ctaTitle, ctaDesc, ctaBtn);
ctaSec.appendChild(ctaCont);
document.body.appendChild(ctaSec);

// ─────────────────────────────────────────────────────────────
//  FOOTER
// ─────────────────────────────────────────────────────────────
const footer = mk('footer');
reg(footer, () => ({ backgroundColor: c('footBg'), color: c('footTxt'), transition: 'background-color 0.3s' }));
st(footer, { padding: '60px 24px 30px' });

const footGrid = mk('div');
st(footGrid, { maxWidth: '1200px', margin: '0 auto', display: 'grid', gap: '48px', paddingBottom: '48px', borderBottom: '1px solid #333' });
_grids.push({ el: footGrid, d: 3, t: 2, m: 1 });

// Brand
const footBrand = mk('div');
const footLogoEl = mk('div');
footLogoEl.innerHTML = '🍽️ Bella<span style="color:#aaa">Cucina</span>';
st(footLogoEl, { fontSize: '1.4rem', fontWeight: '700', color: '#c8762b', marginBottom: '12px' });
const footBrandP = mk('p');
footBrandP.textContent = 'Bringing the heart of Italy to your table since 2009. Authentic flavors, unforgettable memories.';
reg(footBrandP, () => ({ color: c('footTxt') }));
st(footBrandP, { fontSize: '.9rem', lineHeight: '1.7', maxWidth: '280px', margin: '0' });
app(footBrand, footLogoEl, footBrandP);

// Nav column
const footNavCol = mk('div');
const footNavH = mk('h4');
footNavH.textContent = 'Navigate';
st(footNavH, { color: '#fff', fontSize: '1rem', margin: '0 0 20px', fontWeight: '600' });
const footNavUl = mk('ul');
st(footNavUl, { listStyle: 'none', margin: '0', padding: '0', display: 'flex', flexDirection: 'column', gap: '10px' });
[['index.html','Home'],['menu.html','Menu'],['#about','About'],['#contact','Contact']].forEach(([href, lbl]) => {
  const li = mk('li'); const a = mk('a');
  a.href = href; a.textContent = lbl;
  reg(a, () => ({ color: c('footTxt') }));
  st(a, { fontSize: '.9rem', textDecoration: 'none', transition: 'color 0.2s' });
  onHover(a, () => (a.style.color = '#c8762b'), () => (a.style.color = c('footTxt')));
  li.appendChild(a); footNavUl.appendChild(li);
});
app(footNavCol, footNavH, footNavUl);

// Hours column
const footHrsCol = mk('div');
const footHrsH = mk('h4');
footHrsH.textContent = 'Hours';
st(footHrsH, { color: '#fff', fontSize: '1rem', margin: '0 0 20px', fontWeight: '600' });
const footHrsUl = mk('ul');
st(footHrsUl, { listStyle: 'none', margin: '0', padding: '0', display: 'flex', flexDirection: 'column', gap: '10px' });
['Mon–Fri: 11am – 11pm', 'Sat–Sun: 10am – 12am', 'Kitchen closes 30 min early'].forEach(t => {
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
//  BACK TO TOP BUTTON
// ─────────────────────────────────────────────────────────────
const topBtn = mk('button');
topBtn.textContent = '↑';
st(topBtn, {
  position: 'fixed', bottom: '32px', right: '32px', zIndex: '999',
  width: '48px', height: '48px', backgroundColor: '#c8762b', color: '#fff',
  border: 'none', borderRadius: '12px', fontSize: '1.4rem', cursor: 'pointer',
  opacity: '0', visibility: 'hidden', transform: 'translateY(16px)',
  transition: 'all 0.3s', display: 'flex', alignItems: 'center', justifyContent: 'center',
  boxShadow: '0 4px 16px rgba(200,118,43,.4)',
});
onHover(topBtn,
  () => st(topBtn, { backgroundColor: '#a85e1e', transform: 'translateY(-4px)' }),
  () => st(topBtn, { backgroundColor: '#c8762b', transform: 'translateY(0)' })
);
topBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
document.body.appendChild(topBtn);

// ─────────────────────────────────────────────────────────────
//  EVENT LISTENERS
// ─────────────────────────────────────────────────────────────

// Theme toggle
themeBtn.addEventListener('click', () => {
  theme = theme === 'dark' ? 'light' : 'dark';
  localStorage.setItem('theme', theme);
  themeIcon.textContent  = theme === 'dark' ? '☀️' : '🌙';
  themeLabel.textContent = theme === 'dark' ? 'Light' : 'Dark';
  refreshTheme();
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
  } else {
    closeMenu();
  }
});

// Scroll
window.addEventListener('scroll', () => {
  const scrolled = window.scrollY > 400;
  topBtn.style.opacity    = scrolled ? '1' : '0';
  topBtn.style.visibility = scrolled ? 'visible' : 'hidden';
  topBtn.style.transform  = scrolled ? 'translateY(0)' : 'translateY(16px)';
  navbar.style.boxShadow  = window.scrollY > 20 ? '0 2px 20px rgba(0,0,0,.1)' : 'none';
});

// Responsive
function updateResponsive() {
  const mobile = window.innerWidth <= 768;
  navLinks.style.display  = mobile ? 'none' : 'flex';
  burgerBtn.style.display = mobile ? 'flex' : 'none';
  heroInner.style.gridTemplateColumns = mobile ? '1fr' : 'repeat(2, 1fr)';
  if (mobile) {
    heroTxt.style.textAlign = 'center';
    heroDescEl.style.margin = '0 auto 40px';
    heroBtnsDiv.style.justifyContent = 'center';
  } else {
    heroTxt.style.textAlign = 'left';
    heroDescEl.style.margin = '0 0 40px';
    heroBtnsDiv.style.justifyContent = 'flex-start';
  }
}

// Init
updateResponsive();
updateGrids();
