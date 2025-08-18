/* Minimal Vacations loader: trips point to a folder, media is auto-listed from GitHub */

(function(){
  // --- ONE-TIME CONFIG: set your GitHub repo that serves fionaandcody.com
  // If your site is public, no token needed. If private, add a classic PAT with repo scope.
  const GH = {
    owner: 'YOUR_GITHUB_USERNAME_OR_ORG',
    repo:  'YOUR_REPO_NAME',      // e.g. fionaandcody.github.io or the repo that builds the site
    branch:'main',
    token: ''                     // leave empty for public repo
  };

  const state = {
    trips: [],
    filtered: [],
    theme: localStorage.getItem('vc-theme') || 'neon',
    search: '',
    year: '',
    tag: '',
    route: { name: 'list', id: null },
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
    // lightbox
    lb: document.getElementById('vc-lightbox'),
    lbImg: document.getElementById('vc-lb-img'),
    lbVideo: document.getElementById('vc-lb-video'),
    lbCaption: document.getElementById('vc-lb-caption'),
    lbPrev: document.querySelector('.vc-lightbox-prev'),
    lbNext: document.querySelector('.vc-lightbox-next'),
    lbClose: document.querySelector('.vc-lightbox-close'),
    // detail
    detail: document.getElementById('vc-detail'),
    back: document.getElementById('vc-back'),
    dCover: document.getElementById('vc-detail-cover'),
    dTitle: document.getElementById('vc-detail-title'),
    dMeta: document.getElementById('vc-detail-meta'),
    dTags: document.getElementById('vc-detail-tags'),
    dStats: document.getElementById('vc-detail-stats'),
    dLinks: document.getElementById('vc-detail-links'),
    dGallery: document.getElementById('vc-detail-gallery'),
    mapSection: document.getElementById('vc-map-section'),
    dMap: document.getElementById('vc-detail-map'),
    itinSection: document.getElementById('vc-itinerary-section'),
    itin: document.getElementById('vc-itinerary'),
    storySection: document.getElementById('vc-story-section'),
    story: document.getElementById('vc-story')
  };

  // Theme
  function applyTheme(){ document.documentElement.setAttribute('data-theme', state.theme); localStorage.setItem('vc-theme', state.theme); }
  function toggleTheme(){ const order=['neon','pixel','clean']; state.theme = order[(order.indexOf(state.theme)+1)%order.length]; applyTheme(); }

  // Utils
  const IMG = /\.(png|jpe?g|gif|webp|bmp|svg)$/i;
  const VID = /\.(mp4|webm|mov|m4v)$/i;
  const isVideo = p => VID.test(p);
  function daysBetween(range){
    if(!range) return null;
    const parts = String(range).split(' to ');
    if(parts.length!==2) return null;
    const a = new Date(parts[0]); const b = new Date(parts[1]);
    if(isNaN(a) || isNaN(b)) return null;
    return Math.max(1, Math.round((b-a)/86400000)+1);
  }

  // GitHub API helpers
  function ghHeaders(){
    const h = { Accept:'application/vnd.github+json' };
    if(GH.token) h.Authorization = `Bearer ${GH.token}`;
    return h;
  }
  async function listFolderRecursive(path, acc=[]){
    // path must be repo-relative without leading slash
    const url = `https://api.github.com/repos/${GH.owner}/${GH.repo}/contents/${encodeURIComponent(path)}?ref=${encodeURIComponent(GH.branch)}`;
    const res = await fetch(url, { headers: ghHeaders() });
    if(!res.ok) throw new Error(`GitHub API ${res.status} for ${path}`);
    const items = await res.json();
    for(const it of items){
      if(it.type === 'file'){
        if(IMG.test(it.name) || VID.test(it.name)) acc.push('/' + it.path); // site-relative path
      }else if(it.type === 'dir'){
        await listFolderRecursive(it.path, acc);
      }
    }
    return acc;
  }

  // Data
  async function loadTrips(){
    const res = await fetch('data/trips.json?v='+Date.now());
    const raw = await res.json();
    // Normalize, and lazy-fill media if a folder is provided
    state.trips = raw.map(t=>({
      id: t.id,
      title: t.title,
      location: t.location || '',
      dates: t.dates || '',
      year: t.year,
      summary: t.summary || '',
      cover: t.cover || '',
      tags: t.tags || [],
      links: t.links || [],
      story: t.story || '',
      itinerary: t.itinerary || [],
      mapQuery: t.mapQuery || '',
      folder: t.folder || '',        // NEW: repo folder, e.g. "/Vacations/Aulani 2024"
      media: t.media || []           // optional override; if empty and folder exists, we will fill it
    })).sort((a,b)=>b.year-a.year);

    // For each trip with a folder and empty media, populate from GitHub
    for(const trip of state.trips){
      if(trip.folder && (!trip.media || trip.media.length===0)){
        const repoPath = trip.folder.replace(/^\//,''); // remove leading slash
        try{
          const files = await listFolderRecursive(repoPath, []);
          files.sort();
          trip.media = files;
          if(!trip.cover && files.length) trip.cover = files[0];
        }catch(e){
          // Non-fatal: leave media empty if listing fails
          console.warn('Folder listing failed for', trip.folder, e);
        }
      }
    }
  }

  // Filters & achievements
  function buildFilters(){
    const years=[...new Set(state.trips.map(t=>t.year))].sort((a,b)=>b-a);
    years.forEach(y=>{ const o=document.createElement('option'); o.value=y; o.textContent=y; els.yearFilter.appendChild(o); });
    const tags=[...new Set(state.trips.flatMap(t=>t.tags))].sort();
    tags.forEach(tag=>{ const o=document.createElement('option'); o.value=tag; o.textContent=tag; els.tagFilter.appendChild(o); });
    const achievements = [
      {name:'Beach Lover', test:t=>t.tags.includes('beach')},
      {name:'Theme Park Pro', test:t=>t.tags.includes('theme-park')},
      {name:'Drone Pilot', test:t=>t.tags.includes('drone')},
      {name:'Snorkel Squad', test:t=>t.tags.includes('snorkel')},
      {name:'International', test:t=>t.tags.includes('international')}
    ].map(r=>({name:r.name, count: state.trips.filter(r.test).length})).filter(x=>x.count>0);
    els.achievements.innerHTML='';
    achievements.forEach(a=>{ const chip=document.createElement('span'); chip.className='vc-achievement'; chip.textContent=`${a.name} · ${a.count}`; els.achievements.appendChild(chip); });
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

  // List render
  function renderList(){
    els.detail.hidden=true;
    document.getElementById('vc-achievements').hidden=false;
    document.getElementById('vc-grid').hidden=false;

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

      img.src=t.cover || '';
      img.alt=`${t.title} cover`;
      yearChip.textContent=t.year;
      title.textContent=t.title;
      meta.textContent=[t.location,t.dates].filter(Boolean).join(' · ');
      t.tags.forEach(tag=>{ const s=document.createElement('span'); s.className='vc-tag'; s.textContent=tag; tags.appendChild(s); });

      const open=()=>navigate('trip', t.id);
      btn.addEventListener('click', open);
      card.addEventListener('click', e=>{ if(e.target!==btn) open(); });
      frag.appendChild(card);
    });
    els.grid.appendChild(frag);
  }

  // Detail render
  function renderDetail(trip){
    document.getElementById('vc-achievements').hidden=true;
    document.getElementById('vc-grid').hidden=true;
    els.detail.hidden=false;

    els.dCover.src = trip.cover || '';
    els.dCover.alt = `${trip.title} cover`;
    els.dTitle.textContent = trip.title;
    els.dMeta.textContent = [trip.location, trip.dates].filter(Boolean).join(' · ');

    els.dTags.innerHTML='';
    trip.tags.forEach(tag=>{ const s=document.createElement('span'); s.className='vc-tag'; s.textContent=tag; els.dTags.appendChild(s); });

    // stats
    const photoCount = trip.media.filter(x=>!isVideo(x)).length || (trip.cover?1:0);
    const videoCount = trip.media.filter(isVideo).length;
    const days = daysBetween(trip.dates);
    els.dStats.innerHTML='';
    const pushStat = t=>{ const d=document.createElement('div'); d.className='vc-stat'; d.textContent=t; els.dStats.appendChild(d); };
    if(days) pushStat(`${days} days`);
    pushStat(`${photoCount} photos`);
    if(videoCount) pushStat(`${videoCount} videos`);

    // links
    els.dLinks.innerHTML='';
    (trip.links||[]).forEach(l=>{ const a=document.createElement('a'); a.href=l.url; a.target='_blank'; a.rel='noopener'; a.textContent=l.label; els.dLinks.appendChild(a); });

    // gallery
    els.dGallery.innerHTML='';
    const items = trip.media.length ? trip.media : (trip.cover? [trip.cover] : []);
    items.forEach((src,idx)=>{
      const t=document.createElement('div'); t.className='vc-thumb';
      if(isVideo(src)){ const v=document.createElement('video'); v.muted=true; v.playsInline=true; v.src=src; t.appendChild(v); }
      else{ const i=document.createElement('img'); i.loading='lazy'; i.alt=`${trip.title} ${idx+1}`; i.src=src; t.appendChild(i); }
      t.addEventListener('click', ()=>openLightbox(trip, idx));
      els.dGallery.appendChild(t);
    });

    // map
    if(trip.mapQuery){
      els.mapSection.hidden=false;
      const q=encodeURIComponent(trip.mapQuery);
      els.dMap.src = `https://www.openstreetmap.org/export/embed.html?bbox=&layer=mapnik&marker=&query=${q}`;
    }else{ els.mapSection.hidden=true; }

    // itinerary and notes
    if(trip.itinerary && trip.itinerary.length){
      els.itinSection.hidden=false; els.itin.innerHTML='';
      trip.itinerary.forEach(day=>{
        const c=document.createElement('div'); c.className='vc-itin-day';
        const h=document.createElement('h4'); h.textContent = day.title || `Day ${day.day}`; c.appendChild(h);
        const ul=document.createElement('ul'); (day.items||[]).forEach(x=>{ const li=document.createElement('li'); li.textContent=x; ul.appendChild(li); });
        c.appendChild(ul); els.itin.appendChild(c);
      });
    }else{ els.itinSection.hidden=true; }
    if(trip.story){
      els.storySection.hidden=false; els.story.innerHTML = `<p>${String(trip.story).replace(/\n\n/g,'</p><p>').replace(/\n/g,'<br>')}</p>`;
    }else{ els.storySection.hidden=true; }
  }

  // Router
  function parseHash(){
    const h = location.hash.replace(/^#\/?/, '');
    if(h.startsWith('trip/')){
      const id = decodeURIComponent(h.slice(5));
      const trip = state.trips.find(t=>t.id===id);
      if(trip){ state.route={name:'trip', id}; renderDetail(trip); }
      else { state.route={name:'list', id:null}; renderList(); }
    }else{ state.route={name:'list', id:null}; renderList(); }
  }
  function navigate(name, id){ if(name==='trip'){ location.hash = `#/trip/${encodeURIComponent(id)}`; } else { location.hash = '#/'; } }

  // Lightbox
  function openLightbox(trip, startIndex){
    state.lightbox.items = trip.media.length ? trip.media : (trip.cover? [trip.cover] : []);
    state.lightbox.index = startIndex||0;
    state.lightbox.tripTitle = trip.title;
    updateLightbox();
    els.lb.hidden=false; document.body.style.overflow='hidden';
  }
  function updateLightbox(){
    const i=state.lightbox.index; const item=state.lightbox.items[i]; const video=isVideo(item);
    els.lbImg.hidden = video; els.lbVideo.hidden = !video;
    if(video){ els.lbVideo.src=item; els.lbVideo.play().catch(()=>{}); }
    else { els.lbImg.src=item; }
    els.lbCaption.textContent = `${state.lightbox.tripTitle} · ${i+1} / ${state.lightbox.items.length}`;
  }
  function closeLightbox(){ els.lb.hidden=true; document.body.style.overflow=''; if(!els.lbVideo.hidden){ els.lbVideo.pause(); } }
  function nextItem(){ state.lightbox.index=(state.lightbox.index+1)%state.lightbox.items.length; updateLightbox(); }
  function prevItem(){ state.lightbox.index=(state.lightbox.index-1+state.lightbox.items.length)%state.lightbox.items.length; updateLightbox(); }

  // Events
  function bind(){
    els.search.addEventListener('input', e=>{ state.search=e.target.value; applyFilter(); renderList(); });
    els.yearFilter.addEventListener('change', e=>{ state.year=e.target.value; applyFilter(); renderList(); });
    els.tagFilter.addEventListener('change', e=>{ state.tag=e.target.value; applyFilter(); renderList(); });
    els.themeToggle.addEventListener('click', toggleTheme);

    els.lbClose.addEventListener('click', closeLightbox);
    els.lbNext.addEventListener('click', nextItem);
    els.lbPrev.addEventListener('click', prevItem);
    document.addEventListener('keydown', e=>{ if(els.lb.hidden) return; if(e.key==='Escape') closeLightbox(); if(e.key==='ArrowRight') nextItem(); if(e.key==='ArrowLeft') prevItem(); });

    els.back.addEventListener('click', ()=>navigate('list'));
    window.addEventListener('hashchange', parseHash);
  }

  // Init
  (async function init(){
    applyTheme();
    bind();
    await loadTrips();
    buildFilters();
    applyFilter();
    renderList();
    parseHash();
  })();
})();