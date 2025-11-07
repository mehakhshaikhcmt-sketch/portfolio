/* script.js
 - Loads data.json to populate:
   - hero background
   - carousel
   - albums grid & album lightbox
   - filter templates (applies CSS filters to carousel)
   - stories list
 - All media paths are relative (e.g. images/your.jpg)
*/

const state = {
  carouselIndex: 0,
  carouselInterval: null,
  currentFilter: null,
  lbIndex: 0,
  lbImages: []
};

// helper
const el = (sel) => document.querySelector(sel);
const els = (sel) => Array.from(document.querySelectorAll(sel));

// initialize
window.addEventListener('DOMContentLoaded', () => {
  fetch('data.json')
    .then(r => r.json())
    .then(initFromData)
    .catch(err => console.error('Failed to load data.json', err));

  // footer year
  document.getElementById('year').textContent = new Date().getFullYear();
});

function initFromData(data){
  setupHero(data.hero);
  setupCarousel(data.showcase || []);
  setupAlbums(data.albums || []);
  setupFilters(data.filters || []);
  setupStories(data.stories || []);
  setupSocials(data.socials || []);
}

/* HERO */
function setupHero(h){
  const hero = el('#hero');
  if(h && h.background){
    hero.style.backgroundImage = `url(${h.background})`;
  } else {
    hero.style.backgroundImage = `linear-gradient(90deg, rgba(10,10,10,0.5), rgba(10,10,10,0.6))`;
  }
  if(h && h.logo){
    const logo = el('.logo');
    logo.src = h.logo;
  }
}

/* CAROUSEL */
function setupCarousel(items){
  const track = el('#carousel-track');
  const dots = el('#carousel-dots');
  track.innerHTML = '';
  dots.innerHTML = '';

  items.forEach((it, i) => {
    const slide = document.createElement('div');
    slide.className = 'slide';
    const img = document.createElement('img');
    img.src = it.url;
    img.alt = it.title || `Slide ${i+1}`;
    slide.appendChild(img);
    track.appendChild(slide);

    const dot = document.createElement('div');
    dot.className = 'carousel-dot';
    dot.addEventListener('click', ()=> goToSlide(i));
    dots.appendChild(dot);
  });

  // arrows
  el('.carousel .prev').addEventListener('click', ()=> goToSlide(state.carouselIndex -1));
  el('.carousel .next').addEventListener('click', ()=> goToSlide(state.carouselIndex +1));

  // auto-play
  startCarousel();
  updateCarousel();
}

function startCarousel(){
  stopCarousel();
  state.carouselInterval = setInterval(()=> goToSlide(state.carouselIndex +1), 5000);
}
function stopCarousel(){ if(state.carouselInterval) clearInterval(state.carouselInterval); }

function goToSlide(idx){
  const track = el('#carousel-track');
  const slides = Array.from(track.children);
  if(slides.length === 0) return;
  const n = slides.length;
  state.carouselIndex = ((idx % n) + n) % n;
  const offset = slides[state.carouselIndex].offsetLeft;
  track.scrollTo({left: offset - 10, behavior: 'smooth'});
  updateCarousel();
}

function updateCarousel(){
  const dots = els('.carousel-dot');
  dots.forEach(d => d.classList.remove('active'));
  if(dots[state.carouselIndex]) dots[state.carouselIndex].classList.add('active');
  applyFilterToCarousel(state.currentFilter);
}

/* ALBUMS & LIGHTBOX */
function setupAlbums(albums){
  const grid = el('#albums-grid');
  grid.innerHTML = '';
  albums.forEach((a, idx) => {
    const card = document.createElement('div');
    card.className = 'album-card';
    card.innerHTML = `<img src="${a.cover}" alt="${a.title}"><div class="album-title">${a.title}</div>`;
    card.addEventListener('click', ()=> openAlbum(a));
    grid.appendChild(card);
  });
}

function openAlbum(album){
  state.lbImages = album.items || [];
  state.lbIndex = 0;
  const lb = el('#lightbox');
  const track = el('#lb-track');
  track.innerHTML = '';
  state.lbImages.forEach(src => {
    const img = document.createElement('img');
    img.src = src;
    track.appendChild(img);
  });
  lb.classList.add('active');
  lb.setAttribute('aria-hidden','false');

  // next/prev handlers
  el('.lb-close').onclick = closeLightbox;
  el('.lb-prev').onclick = ()=> lbNav(-1);
  el('.lb-next').onclick = ()=> lbNav(1);
  document.addEventListener('keydown', lbKeyHandler);
}

function closeLightbox(){
  const lb = el('#lightbox');
  lb.classList.remove('active');
  lb.setAttribute('aria-hidden','true');
  document.removeEventListener('keydown', lbKeyHandler);
}

function lbNav(delta){
  const imgs = els('#lb-track img');
  if(!imgs.length) return;
  state.lbIndex = ((state.lbIndex + delta) % imgs.length + imgs.length) % imgs.length;
  const left = imgs[state.lbIndex].offsetLeft;
  el('#lb-track').scrollTo({left, behavior:'smooth'});
}
function lbKeyHandler(e){
  if(e.key === 'Escape') closeLightbox();
  if(e.key === 'ArrowLeft') lbNav(-1);
  if(e.key === 'ArrowRight') lbNav(1);
}

/* FILTERS */
function setupFilters(filters){
  const grid = el('#filters-grid');
  grid.innerHTML = '';
  filters.forEach(f => {
    const card = document.createElement('div');
    card.className = 'filter-card';
    card.innerHTML = `<img src="${f.preview}" alt="${f.name}"><div class="filter-name">${f.name}</div>`;
    card.addEventListener('click', ()=> {
      applyFilterToCarousel(f);
      highlightActiveFilter(f.name);
    });
    grid.appendChild(card);
  });
}

function highlightActiveFilter(name){
  els('.filter-card').forEach(c=>{
    const nm = c.querySelector('.filter-name')?.textContent || '';
    c.style.outline = (nm===name) ? '2px solid rgba(255,255,255,0.12)' : 'none';
  });
}

/* Apply CSS filter to all carousel images based on template object */
function applyFilterToCarousel(filter){
  state.currentFilter = filter;
  const imgs = els('.carousel-track img');
  imgs.forEach(img=>{
    if(!filter || !filter.css) img.style.filter = '';
    else img.style.filter = filter.css;
  });
}

/* STORIES */
function setupStories(stories){
  const list = el('#stories-list');
  list.innerHTML = '';
  stories.forEach(s=>{
    const card = document.createElement('div');
    card.className = 'story';
    card.innerHTML = `<img class="story-media" src="${s.media}" alt="${s.title}"><div class="story-body"><div class="story-title">${s.title}</div><div class="story-desc">${s.desc || ''}</div></div>`;
    list.appendChild(card);
  });
}

/* SOCIALS */
function setupSocials(socials){
  const wrap = el('#socials');
  wrap.innerHTML = '';
  socials.forEach(s=>{
    const a = document.createElement('a');
    a.href = s.url; a.target = '_blank'; a.rel='noopener noreferrer';
    a.textContent = s.name;
    a.style.marginRight = '10px';
    a.style.color = '#fff';
    wrap.appendChild(a);
  });
}

/* small UX: pause carousel while hovering */
document.addEventListener('mouseover', (e)=>{
  if(e.target.closest('.carousel')) stopCarousel();
});
document.addEventListener('mouseleave', (e)=>{
  if(e.target.closest('.carousel')) startCarousel();
});
