(function(){
  const state = {
    trips: [],
    filtered: [],
    theme: localStorage.getItem('vc-theme') || 'neon', // neon, pixel, clean
    search: '',
    year: '',
    tag: '',
    routeTripId: null,
    lightbox: { items: [], index: 0, tripTitle: '' }
  };

  const els = {
    grid: document.getElementById('vc-grid'),
    cardTpl: document.getElementById('vc-card-tpl'),
    search: document.getElementById('vc-search'),
    yearFilter: document.getElementById('vc-year-filter'),
    tagFilter: document.getElementById('vc-tag-filter'),
    themeToggle: document.getElementById('vc-theme-toggle'),
    achievements: document.getElementById('vc-achievements'),
    lb: document.getElementById('vc-lightbox'),
    lbImg: document.getElementById('vc-lb-img'),
    lbVideo: document.getElementById('vc-lb-video'),
    lbCaption: document.getElementById('vc-lb-caption'),
    lbPrev: document.querySelector('.vc-lightbox-prev'),
    lbNext: document.querySelector('.vc-lightbox-next'),
    lbClose: document.querySelector('.vc-lightbox-close')
  };

  // Theme
  function applyTheme(){ document.documentElement.setAttribute('data-theme', state.theme); localStorage.setItem('vc-theme', state.theme); }
  function toggleTheme(){ const order=['neon','pixel','clean']; state.theme = order[(order.indexOf(state.theme)+1)%order.length]; applyTheme(); }

  // Helpers
  function isVideo(path){
    return /\.(mp4|webm|mov|m4v)$/i.test(path);
  }

  // Fetch trips
  async function loadTrips(){
    const res = await fetch('data/trips.json?v=' + Date.now());
    const json = await res.json();
    state.trips = json.map(t => ({
      id: t.id,
      title: t.title,
      location: t.location || '',
      dates: t.dates,
      year: t.year,
      summary: t.summary || '',
      cover: t.cover,
      media: t.media || [],   // array of paths, images or videos
      tags: t.tags || []
    })).sort((a,b)=>b.year - a.year);
  }

  // Filters and achievements
  function buildFilters(){
    const years = Array.from(new Set(state.trips.map(t=>t.year))).sort((a,b)=>b-a);
    years.forEach(y=>{
      const opt=document.createElement('option'); opt.value=y; opt.textContent=y; els.yearFilter.appendChild(opt);
    });
    const tags = Array.from(new Set(state.trips.flatMap(t=>t.tags))).sort();
    tags.forEach(tag=>{
      const opt=document.createElement('option'); opt.value=tag; opt.textContent=tag; els.tagFilter.appendChild(opt);
    });
    const achievements = computeAchievements(state.trips);
    els.achievements.innerHTML = '';
    achievements.forEach(a=>{
      const chip=document.createElement('span'); chip.className='vc-achievement'; chip.textContent=`${a.name} · ${a.count}`;
      els.achievements.appendChild(chip);
    });
  }
  function computeAchievements(trips){
    const rules=[
      {name:'Beach Lover', test:t=>t.tags.includes('beach')},
      {name:'Theme Park Pro', test:t=>t.tags.includes('theme-park')},
      {name:'Drone Pilot', test:t=>t.tags.includes('drone')},
      {name:'Ceremony Crew', test:t=>t.tags.includes('wedding')},
      {name:'Snorkel Squad', test:t=>t.tags.includes('snorkel')},
      {name:'International', test:t=>t.tags.includes('international')}
    ];
    return rules.map(r=>({name:r.name, count: trips.filter(r.test).length})).filter(x=>x.count>0);
  }
  function applyFilter(){
    const s=state.search.toLowerCase();
    state.filtered = state.trips.filter(t=>{
      const text=[t.title,t.location,t.summary,t.tags.join(' ')].join(' ').toLowerCase();
      const searchHit=!s||text.includes(s);
      const yearHit=!state.year||String(t.year)===String(state.year);
      const tagHit=!state.tag||t.tags.includes(state.tag);
      return searchHit && yearHit && tagHit;
    });
  }

  // Render
  function render(){
    els.grid.innerHTML='';
    const frag=document.createDocumentFragment();
    state.filtered.forEach(t=>{
      const card=els.cardTpl.content.firstElementChild.cloneNode(true);
      const img=card.querySelector('img');
      const yearChip=card.querySelector('.vc-year');
      const title=card.querySelector('.vc-card-title');
      const meta=card.querySelector('.vc-card-meta');
      const tags=card.querySelector('.vc-tags');
      const btn=card.querySelector('.vc-view-btn');

      img.src = t.cover;
      img.alt = `${t.title} cover`;
      yearChip.textContent = t.year;
      title.textContent = t.title;
      meta.textContent = [t.location, t.dates].filter(Boolean).join(' · ');
      t.tags.forEach(tag=>{
        const span=document.createElement('span'); span.className='vc-tag'; span.textContent=tag; tags.appendChild(span);
      });

      const open = ()=>openTrip(t.id);
      btn.addEventListener('click', open);
      card.addEventListener('click', e=>{ if(e.target!==btn) open(); });
      frag.appendChild(card);
    });
    els.grid.appendChild(frag);
  }

  // Routing
  function parseHash(){
    const h=location.hash.replace('#','').trim();
    if(h.startsWith('trip=')){ state.routeTripId=decodeURIComponent(h.split('=')[1]); openTrip(state.routeTripId); }
  }
  function openTrip(id){
    const trip = state.trips.find(x=>x.id===id);
    if(!trip) return;
    location.hash='trip='+encodeURIComponent(id);
    openLightbox(trip);
  }

  // Lightbox
  function openLightbox(trip){
    state.lightbox.items = trip.media.length ? trip.media : [trip.cover];
    state.lightbox.index = 0;
    state.lightbox.tripTitle = trip.title;
    updateLightbox();
    els.lb.hidden=false; document.body.style.overflow='hidden';
  }
  function updateLightbox(){
    const i=state.lightbox.index;
    const item=state.lightbox.items[i];
    const showVideo=isVideo(item);
    els.lbImg.hidden = showVideo;
    els.lbVideo.hidden = !showVideo;

    if(showVideo){
      els.lbVideo.src = item;
      els.lbVideo.play().catch(()=>{});
    }else{
      els.lbImg.src = item;
    }
    els.lbCaption.textContent = `${state.lightbox.tripTitle} · ${i+1} / ${state.lightbox.items.length}`;
  }
  function closeLightbox(){
    els.lb.hidden=true; document.body.style.overflow='';
    if(!els.lbVideo.hidden){ els.lbVideo.pause(); }
    if(location.hash.startsWith('#trip=')) history.replaceState(null,'',location.pathname);
  }
  function nextItem(){ state.lightbox.index=(state.lightbox.index+1)%state.lightbox.items.length; updateLightbox(); }
  function prevItem(){ state.lightbox.index=(state.lightbox.index-1+state.lightbox.items.length)%state.lightbox.items.length; updateLightbox(); }

  // Events
  function bind(){
    els.search.addEventListener('input', e=>{ state.search=e.target.value; applyFilter(); render(); });
    els.yearFilter.addEventListener('change', e=>{ state.year=e.target.value; applyFilter(); render(); });
    els.tagFilter.addEventListener('change', e=>{ state.tag=e.target.value; applyFilter(); render(); });
    els.themeToggle.addEventListener('click', toggleTheme);

    els.lbClose.addEventListener('click', closeLightbox);
    els.lbNext.addEventListener('click', nextItem);
    els.lbPrev.addEventListener('click', prevItem);

    document.addEventListener('keydown', e=>{
      if(els.lb.hidden) return;
      if(e.key==='Escape') closeLightbox();
      if(e.key==='ArrowRight') nextItem();
      if(e.key==='ArrowLeft') prevItem();
    });
    window.addEventListener('hashchange', parseHash);
  }

  // Init
  (async function init(){
    applyTheme();
    bind();
    await loadTrips();
    buildFilters();
    applyFilter();
    render();
    parseHash();
  })();
})();