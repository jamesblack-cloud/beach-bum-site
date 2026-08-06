
let products=[];
fetch('assets/products.json').then(r=>r.json()).then(data=>{products=data; initSite();}).catch(()=>{initSite();});

function initSite(){
  const gate=document.querySelector('.age-gate');
  const prov=document.querySelector('#age-province');
  const confirmBtn=document.querySelector('#age-confirm');
  const note=document.querySelector('#age-note');
  const store=(k,v)=>{ try{ localStorage.setItem(k,v); }catch(e){} };
  const read=k=>{ try{ return localStorage.getItem(k); }catch(e){ return null; } };

  if(gate && !read('bb-age')) gate.hidden=false;

  if(prov && confirmBtn){
    prov.addEventListener('change',()=>{
      const opt=prov.selectedOptions[0];
      const min=opt && opt.dataset.min;
      confirmBtn.disabled=!min;
      if(note) note.textContent = min
        ? `You must be ${min} or older to enter this website in ${opt.textContent}.`
        : 'You must be of legal age in your province or territory to enter this website.';
    });
  }

  document.querySelectorAll('.age-actions [data-age]').forEach(b=>b.addEventListener('click',()=>{
    if(b.dataset.age==='yes'){
      if(prov && !prov.value) return;
      store('bb-age','yes');
      if(prov && prov.value) store('bb-province', prov.value);
      if(gate) gate.hidden=true;
    } else {
      location.href='https://www.canada.ca/en/health-canada/services/drugs-medication/cannabis.html';
    }
  }));

  const menu=document.querySelector('.menu'), nav=document.querySelector('#site-nav');
  if(menu) menu.addEventListener('click',()=>{ nav.classList.toggle('open'); menu.setAttribute('aria-expanded',nav.classList.contains('open')); });

  const io=new IntersectionObserver(entries=>entries.forEach(e=>{ if(e.isIntersecting) e.target.classList.add('in'); }),{threshold:.12});
  document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

  document.querySelectorAll('[data-filter]').forEach(btn=>btn.addEventListener('click',()=>{
    document.querySelectorAll('[data-filter]').forEach(x=>x.classList.remove('active'));
    btn.classList.add('active');
    const key=btn.dataset.filter;
    document.querySelectorAll('.product-card').forEach(c=>{
      let show = key==='all' || c.dataset.type===key || c.dataset.status===key || c.dataset.series===key;
      c.style.display = show ? '' : 'none';
    });
  }));

  if(document.body.classList.contains('product-page')) renderProductPage();

  window.addEventListener('scroll',()=>{
    const hero=document.querySelector('.hero-media');
    if(hero && !window.matchMedia('(prefers-reduced-motion: reduce)').matches){ hero.style.transform=`translateY(${window.scrollY*0.05}px)`; }
  }, {passive:true});
}

function renderProductPage(){
  const query=new URLSearchParams(location.search).get('id')||'wave-riders';
  const product=products.find(p=>p.slug===query) || products[0];
  if(!product) return;
  document.title = `${product.name} | Beach Bum Cannabis`;
  const image=document.querySelector('#product-image');
  if(product.image && image){ image.src=product.image; image.alt=`${product.name} Beach Bum Cannabis`; }
  const set=(sel,val)=>{ const el=document.querySelector(sel); if(el) el.textContent=val; };
  set('#product-name',product.name);
  set('#product-pack',product.pack);
  set('#product-desc',product.description);
  const type=document.querySelector('#product-type');
  if(type){ type.textContent=product.type; type.className=`type ${product.type.toLowerCase()}`; }
  const status=document.querySelector('#product-status');
  if(status){ status.textContent = product.status==='live' ? `Available now in ${product.provinces_live.join(', ')} · Coming soon to ${product.provinces_coming.join(' and ')}` : `Coming soon · Planned for ${product.provinces_coming.join(', ')}`; }
  const formatCallout=document.querySelector('#format-callout span');
  if(formatCallout){
    const label = product.series==='hemp-paper' ? 'Hemp paper' : product.series==='wood-tip' ? 'Blunt / wood-tipped cone' : 'Premium pre-rolls';
    formatCallout.textContent = label;
  }
  const gallery=document.querySelector('.gallery-shell');
  if(!product.image && gallery){
    gallery.innerHTML=`<div class="coming-card-art" style="aspect-ratio:1/1;border-radius:28px;"><span>${product.name}</span></div>`;
  }
  const related=document.querySelector('#related-products');
  if(related){
    const items=products.filter(p=>p.slug!==product.slug).slice(0,6).map(p=>{
      const img = p.image ? `<img src="${p.image}" alt="${p.name}" loading="lazy">` : `<div class="coming-card-art"><span>Coming Soon</span></div>`;
      const status = p.status==='live' ? 'Available now' : 'Coming soon';
      return `<article class="product-card"><a href="product.html?id=${p.slug}"><div class="card-image">${img}<span class="status-chip ${p.status}">${status}</span></div><div class="card-copy"><span class="type ${p.type.toLowerCase()}">${p.type}</span><h3>${p.name}</h3><p>${p.pack}</p></div></a></article>`;
    }).join('');
    related.innerHTML=items;
  }
}
