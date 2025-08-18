/* Vacations: folders-as-trips, no admin, no JSON.
   Configure your GitHub Pages repo once below. */

(function(){
  // Set these to your Pages repo. Public repos work with no token.
  const GH = {
    owner: 'YOUR_GITHUB_USERNAME_OR_ORG',
    repo:  'YOUR_REPO_NAME',   // e.g. fionaandcody.github.io
    branch:'main',
    token: ''                  // leave empty if public
  };

  const IMG = /\.(png|jpe?g|gif|webp|bmp|svg)$/i;
  const VID = /\.(mp4|webm|mov|m4v)$/i;
  const isVideo = p => VID.test(p);

  const els = {
    list: document.getElementById('v-list'),
    detail: document.getElementById('v-detail'),
    back: document.getElementById('v-back'),
    dTitle: document.getElementById('d-title'),
    dMeta: document.getElementById('d-meta'),
    dGallery: document.getElementById('d-gallery'),

    lb: document.getElementById('v-lightbox'),
    lbImg: document.getElementById('lb-img'),
    lbVideo: document.getElementById('lb-video'),
    lbCap: document.getElementById('lb-cap'),
    lbPrev: document.getElementById('lb-prev'),
    lbNext: document.getElementById('lb-next'),
    lbClose: document.getElementById('lb-close')
  };

  const state = { trips: [], route: {name:'list', id:null}, lightbox:{items:[],index:0,title:''} };

  // ---- GitHub API helpers
  function ghHeaders(){
    const h = { Accept: 'application/vnd.github+json' };
    if(GH.token) h.Authorization = `Bearer ${GH.token}`;
    return h;
  }
  async function list(path){ // repo-relative path, no leading slash
    const url = `https://api.github.com/repos/${GH.owner}/${GH.repo}/contents/${encodeURIComponent(path)}?ref=${encodeURIComponent(GH.branch)}`;
    const res = await fetch(url, { headers: ghHeaders() });
    if(!res.ok) throw new Error(`GitHub API ${res.status}: ${path}`);
    return res.json();
  }
  async function listMediaRecursive(path, acc=[]){
    const items = await list(path);
    for(const it of items){
      if(it.type === 'file'){
        if(IMG.test(it.name) || VID.test(it.name)) acc.push('/' + it.path);
      }else if(it.type === 'dir'){
        await listMediaRecursive(it.path, acc);
      }
    }
    return acc;
  }

  // ---- Build trips from folders
  function pretty(name){
    // "Aulani 2024" or "Germany-2025" -> "Aulani 2024" "Germany 2025"
    return name.replace(/[-_]+/g,' ').replace(/\s+/g,' ').trim();
  }
  function yearFrom(name){
    const m = name.match(/(19|20)\d{2}/);
    return m ? parseInt(m[0],10) : '';
  }

  async function loadTripsFromFolders(){
    const root = 'Vacations'; // the folder this page lives in
    const items = await list(root);
    const dirs = items.filter(i => i.type === 'dir' && !/^data$/i.test(i.name));
    // Make each directory a trip
    state.trips = await Promise.all(dirs.map(async d=>{
      const media = await listMediaRecursive(`${root}/${d.name}`, []);
      media.sort();
      return {
        id: encodeURIComponent(d.name),       // use folder name as id
        title: pretty(d.name),
        folder: `/${root}/${d.name}`,
        year: yearFrom(d.name),
        cover: media[0] || '',
        media
      };
    }));
    // Sort by year desc, then alpha
    state.trips.sort((a,b)=>{
      const ya = a.year || 0, yb = b.year || 0;
      if(yb !== ya) return yb - ya;
      return a.title.localeCompare(b.title);
    });
  }

  // ---- Render list
  function renderList(){
    els.detail.hidden = true;
    els.list.innerHTML = '';
    const frag = document.createDocumentFragment();

    state.trips.forEach(t=>{
      const card = document.createElement('article');
      card.className = 'v-card';

      const media = document.createElement('div');
      media.className = 'v-cover';
      if(isVideo(t.cover)){
        const v = document.createElement('video'); v.src = t.cover; v.muted=true; v.playsInline=true;
        media.appendChild(v);
      }else{
        const i = document.createElement('img'); i.src = t.cover || ''; i.alt = `${t.title} cover`;
        media.appendChild(i);
      }

      const body = document.createElement('div');
      body.className = 'v-body';
      const h = document.createElement('h3'); h.className = 'v-name'; h.textContent = t.title;
      const p = document.createElement('p'); p.className = 'v-small'; p.textContent = [t.year, t.folder].filter(Boolean).join(' · ');
      const btn = document.createElement('button'); btn.className = 'v-btn v-open'; btn.textContent = 'Open';
      btn.addEventListener('click', ()=>navigate('trip', t.id));

      body.appendChild(h); body.appendChild(p); body.appendChild(btn);
      card.appendChild(media); card.appendChild(body);
      // clicking anywhere opens
      card.addEventListener('click', e=>{ if(e.target !== btn) navigate('trip', t.id); });

      frag.appendChild(card);
    });

    els.list.appendChild(frag);
  }

  // ---- Render detail
  function renderDetail(trip){
    els.list.innerHTML = '';
    els.detail.hidden = false;

    els.dTitle.textContent = trip.title;
    els.dMeta.textContent = `${trip.folder}${trip.year ? ` · ${trip.year}` : ''}`;

    els.dGallery.innerHTML = '';
    const frag = document.createDocumentFragment();
    const items = trip.media.length ? trip.media : (trip.cover ? [trip.cover] : []);
    items.forEach((src, idx)=>{
      const t = document.createElement('div'); t.className = 'v-thumb';
      if(isVideo(src)){ const v=document.createElement('video'); v.src=src; v.muted=true; v.playsInline=true; t.appendChild(v); }
      else { const i=document.createElement('img'); i.loading='lazy'; i.alt=`${trip.title} ${idx+1}`; i.src=src; t.appendChild(i); }
      t.addEventListener('click', ()=>openLB(items, idx, trip.title));
      frag.appendChild(t);
    });
    els.dGallery.appendChild(frag);
  }

  // ---- Router
  function parseHash(){
    const h = location.hash.replace(/^#\/?/, '');
    if(h.startsWith('trip/')){
      const id = decodeURIComponent(h.slice(5));
      const trip = state.trips.find(t=>t.id===id);
      if(trip) renderDetail(trip);
      else renderList();
    }else{
      renderList();
    }
  }
  function navigate(name, id){ location.hash = name === 'trip' ? `#/trip/${id}` : '#/'; }

  // ---- Lightbox
  function openLB(items, index, title){
    state.lightbox = { items, index, title };
    updateLB();
    els.lb.hidden = false; document.body.style.overflow = 'hidden';
  }
  function updateLB(){
    const { items, index, title } = state.lightbox;
    const src = items[index]; const video = isVideo(src);
    els.lbImg.hidden = video; els.lbVideo.hidden = !video;
    if(video){ els.lbVideo.src = src; els.lbVideo.play().catch(()=>{}); }
    else { els.lbImg.src = src; }
    els.lbCap.textContent = `${title} · ${index+1} / ${items.length}`;
  }
  function closeLB(){ els.lb.hidden=true; document.body.style.overflow=''; if(!els.lbVideo.hidden){ els.lbVideo.pause(); } }
  function nextLB(){ const l=state.lightbox; l.index=(l.index+1)%l.items.length; updateLB(); }
  function prevLB(){ const l=state.lightbox; l.index=(l.index-1+l.items.length)%l.items.length; updateLB(); }

  // ---- Events
  function bind(){
    els.back.addEventListener('click', ()=>navigate('list'));
    window.addEventListener('hashchange', parseHash);

    els.lbClose.addEventListener('click', closeLB);
    els.lbNext.addEventListener('click', nextLB);
    els.lbPrev.addEventListener('click', prevLB);
    document.addEventListener('keydown', e=>{
      if(els.lb.hidden) return;
      if(e.key === 'Escape') closeLB();
      if(e.key === 'ArrowRight') nextLB();
      if(e.key === 'ArrowLeft') prevLB();
    });
  }

  // ---- Init
  (async function init(){
    bind();
    try{
      await loadTripsFromFolders();
    }catch(err){
      console.error(err);
      els.list.innerHTML = `<p style="color:#ffbdbd">Could not list /Vacations folders. Check GH owner, repo, and branch in vacations.js.</p>`;
      return;
    }
    parseHash(); // renders list
  })();
})();