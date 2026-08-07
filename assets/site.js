
let products=[];
fetch('assets/products.json').then(r=>r.json()).then(data=>{products=data;initSite();}).catch(()=>initSite());

function initAgeGate(){
  const gate=document.querySelector('.age-gate');
  if(!gate) return;
  let accepted=false;
  try{accepted=localStorage.getItem('bb-age-confirmed')==='yes';}catch(e){}
  gate.hidden=accepted;
  const select=gate.querySelector('#age-province');
  const confirm=gate.querySelector('#age-confirm');
  const minimum=gate.querySelector('#age-minimum');
  const support=gate.querySelector('#age-support');
  const ages={Alberta:18,Quebec:21};
  const update=()=>{
    const province=select.value;
    confirm.disabled=!province;
    if(!province){minimum.textContent='';return;}
    const age=ages[province]||19;
    minimum.textContent=`You must be at least ${age} years old in ${province}.`;
    support.textContent='Confirm that you meet the legal age requirement where you live.';
  };
  select.addEventListener('change',update);
  confirm.addEventListener('click',()=>{
    const province=select.value;
    if(!province) return;
    try{localStorage.setItem('bb-age-confirmed','yes');localStorage.setItem('bb-province',province);}catch(e){}
    gate.hidden=true;
  });
  gate.querySelector('[data-age-exit]')?.addEventListener('click',()=>{location.href='https://www.canada.ca/en/health-canada/services/drugs-medication/cannabis.html';});
}

function initSite(){
  initHeaderScroll();
  initAgeGate();
  const menu=document.querySelector('.menu'),nav=document.querySelector('#site-nav');
  if(menu&&nav) menu.addEventListener('click',()=>{nav.classList.toggle('open');menu.setAttribute('aria-expanded',nav.classList.contains('open'));});
  if('IntersectionObserver' in window){const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('in');}),{threshold:.12});document.querySelectorAll('.reveal').forEach(el=>io.observe(el));}else{document.querySelectorAll('.reveal').forEach(el=>el.classList.add('in'));}
  document.querySelectorAll('[data-filter]').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('[data-filter]').forEach(x=>x.classList.remove('active'));btn.classList.add('active');const key=btn.dataset.filter;document.querySelectorAll('.product-card').forEach(c=>{const show=key==='all'||c.dataset.type===key||c.dataset.status===key||c.dataset.series===key;c.hidden=!show;});}));
  if(document.body.classList.contains('product-page')) renderProductPage();
  window.addEventListener('scroll',()=>{const hero=document.querySelector('.hero-media');if(hero&&!matchMedia('(prefers-reduced-motion: reduce)').matches)hero.style.transform=`translateY(${scrollY*.04}px)`;},{passive:true});
}

function renderProductPage(){
  const id=new URLSearchParams(location.search).get('id')||'wave-riders';
  const p=products.find(x=>x.slug===id)||products[0];
  if(!p)return;
  document.title=`${p.name} | Beach Bum Cannabis`;
  const image=document.querySelector('#product-image');
  if(image&&p.image){image.src=p.image;image.alt=`${p.name} Beach Bum Cannabis`;}
  const set=(s,v)=>{const e=document.querySelector(s);if(e)e.textContent=v;};
  set('#product-name',p.name);set('#product-pack',p.pack);set('#product-desc',p.description);
  const t=document.querySelector('#product-type');if(t){t.textContent=p.type;t.className=`type ${p.type.toLowerCase()}`;}
  set('#product-status',p.status==='live'?`Available now in ${p.provinces_live.join(', ')} · Coming soon to ${p.provinces_coming.join(' and ')}`:`Coming soon · Planned for ${p.provinces_coming.join(', ')}`);
  const fc=document.querySelector('#format-callout span');if(fc)fc.textContent=p.series==='hemp-paper'?'Hemp blunt':p.series==='wood-tip'?'Wood-tipped blunt':'Pre-roll in a hemp cone';
  const gallery=document.querySelector('.gallery-shell');if(!p.image&&gallery)gallery.innerHTML=`<div class="coming-card-art" style="aspect-ratio:1/1;border-radius:28px"><span>${p.name}</span></div>`;
  const related=document.querySelector('#related-products');if(related)related.innerHTML=products.filter(x=>x.slug!==p.slug).slice(0,6).map(x=>{const img=x.image?`<img src="${x.image}" alt="${x.name}" loading="lazy">`:`<div class="coming-card-art"><span>Coming Soon</span></div>`;return `<article class="product-card"><a href="product.html?id=${x.slug}"><div class="card-image">${img}<span class="status-chip ${x.status}">${x.status==='live'?'Available now':'Coming soon'}</span></div><div class="card-copy"><span class="type ${x.type.toLowerCase()}">${x.type}</span><h3>${x.name}</h3><p>${x.pack}</p></div></a></article>`;}).join('');
}

function initHeaderScroll(){
  const header=document.querySelector('.site-header');
  if(!header)return;
  let lastY=window.scrollY;
  let ticking=false;
  const update=()=>{
    const y=window.scrollY;
    if(y>140 && y>lastY+4) header.classList.add('header-hidden');
    else if(y<lastY-4 || y<80) header.classList.remove('header-hidden');
    lastY=y;
    ticking=false;
  };
  window.addEventListener('scroll',()=>{if(!ticking){requestAnimationFrame(update);ticking=true;}},{passive:true});
}

/* ---- v7: nav dropdowns + deep-linked catalogue filter ---------------- */
(function(){
  function boot(){
    var nav   = document.querySelector('#site-nav');
    var items = [].slice.call(document.querySelectorAll('.nav-item'));
    if(!items.length) return;
    function closeAll(except){
      items.forEach(function(i){
        if(i!==except){
          i.classList.remove('open');
          var b=i.querySelector('.nav-caret');
          if(b) b.setAttribute('aria-expanded','false');
        }
      });
    }
    var hoverNav = window.matchMedia('(hover:hover) and (min-width:901px)').matches;
    items.forEach(function(item){
      var btn=item.querySelector('.nav-caret');
      function set(open){
        item.classList.toggle('open',open);
        if(btn) btn.setAttribute('aria-expanded',String(open));
      }
      if(btn) btn.addEventListener('click',function(e){
        e.preventDefault(); e.stopPropagation();
        var willOpen=!item.classList.contains('open');
        closeAll(item); set(willOpen);
      });
      if(hoverNav){
        item.addEventListener('mouseenter',function(){ closeAll(item); set(true); });
        item.addEventListener('mouseleave',function(){ set(false); });
      }
    });
    document.addEventListener('click',function(e){ if(!e.target.closest('.nav-item')) closeAll(null); });
    document.addEventListener('keydown',function(e){
      if(e.key==='Escape'){ closeAll(null); if(nav) nav.classList.remove('open'); }
    });

    var wanted=new URLSearchParams(location.search).get('filter');
    if(wanted){
      var apply=function(){
        var cards=document.querySelectorAll('.product-card');
        if(!cards.length) return false;
        document.querySelectorAll('[data-filter]').forEach(function(x){
          x.classList.toggle('active', x.dataset.filter===wanted);
        });
        cards.forEach(function(c){
          var show = wanted==='all' || c.dataset.type===wanted ||
                     c.dataset.status===wanted || c.dataset.series===wanted;
          c.hidden = !show;
        });
        return true;
      };
      if(!apply()){
        var tries=0, iv=setInterval(function(){ if(apply() || ++tries>20) clearInterval(iv); },100);
      }
    }
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot);
  else boot();
})();

