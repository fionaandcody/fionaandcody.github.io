(function(){
  const els = {
    list: document.getElementById('trip-list'),
    search: document.getElementById('search'),
    form: document.getElementById('trip-form'),
    id: document.getElementById('id'),
    title: document.getElementById('title'),
    location: document.getElementById('location'),
    dates: document.getElementById('dates'),
    year: document.getElementById('year'),
    summary: document.getElementById('summary'),
    cover: document.getElementById('cover'),
    tags: document.getElementById('tags'),
    linksWrap: document.getElementById('links'),
    itinWrap: document.getElementById('itinerary'),
    mediaWrap: document.getElementById('media'),
    drop: document.getElementById('drop-zone'),
    addLink: document.getElementById('add-link'),
    addItin: document.getElementById('add-itin'),
    addMedia: document.getElementById('add-media'),
    story: document.getElementById('story'),
    mapQuery: document.getElementById('mapQuery'),
    btnNew: document.getElementById('btn-new'),
    btnDel: document.getElementById('btn-delete'),
    btnSave: document.getElementById('btn-save'),
    btnDL: document.getElementById('btn-download'),
    btnSaveGH: document.getElementById('btn-save-github'),
    ghOwner: document.getElementById('gh-owner'),
    ghRepo: document.getElementById('gh-repo'),
    ghBranch: document.getElementById('gh-branch'),
    ghPath: document.getElementById('gh-path'),
    ghToken: document.getElementById('gh-token'),
    tplLink: document.getElementById('row-link'),
    tplItin: document.getElementById('row-itin'),
    tplMedia: document.getElementById('row-media')
  };

  let trips = [];
  let selected = null;

  // Persist GitHub settings locally
  ;(['ghOwner','ghRepo','ghBranch','ghPath','ghToken']).forEach(k=>{
    const key = 'vc_'+k; const el = els[k]; const v = localStorage.getItem(key);
    if(v) el.value = v;
    el.addEventListener('input', ()=>localStorage.setItem(key, el.value));
  });

  // Helpers
  function uidFrom(title, year){
    const base = (title||'trip').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');
    return `${year||new Date().getFullYear()}-${base}`;
  }
  function clone(tpl){ return tpl.content.firstElementChild.cloneNode(true); }
  function toCSV(text){ return (text||'').split(',').map(s=>s.trim()).filter(Boolean); }

  async function load(){
    const res = await fetch('data/trips.json?v='+Date.now());
    trips = await res.json();
    renderList();
    if(trips.length){ select(0); }
  }

  function renderList(){
    const q = (els.search.value||'').toLowerCase();
    els.list.innerHTML='';
    trips.map((t,i)=>({t,i}))
      .filter(({t})=>!q || (t.title+" "+t.location+" "+(t.tags||[]).join(' ')).toLowerCase().includes(q))
      .sort((a,b)=>b.t.year - a.t.year)
      .forEach(({t,i})=>{
        const li=document.createElement('li');
        const left=document.createElement('div');
        const right=document.createElement('div');
        left.innerHTML = `<div><strong>${t.title||'(untitled)'}</strong></div><div class="meta">${t.location||''} · ${t.year||''}</div>`;
        const btn=document.createElement('button'); btn.textContent='Edit'; btn.addEventListener('click',()=>select(i));
        right.appendChild(btn);
        li.appendChild(left); li.appendChild(right);
        els.list.appendChild(li);
      });
  }

  function select(i){
    selected = i;
    const t = trips[i];
    els.id.value = t.id||''; els.title.value = t.title||''; els.location.value = t.location||'';
    els.dates.value = t.dates||''; els.year.value = t.year||''; els.summary.value = t.summary||'';
    els.cover.value = t.cover||''; els.tags.value = (t.tags||[]).join(', ');
    els.mapQuery.value = t.mapQuery||''; els.story.value = t.story||'';

    els.linksWrap.innerHTML=''; (t.links||[]).forEach(addLinkRow);
    els.itinWrap.innerHTML=''; (t.itinerary||[]).forEach(addItinRow);
    els.mediaWrap.innerHTML=''; (t.media||[]).forEach(src=>addMediaRow(src));
  }

  function collectForm(){
    const title = els.title.value.trim();
    const year = parseInt(els.year.value,10)||new Date().getFullYear();
    const id = els.id.value || uidFrom(title, year);
    const obj = {
      id,
      title,
      location: els.location.value.trim(),
      dates: els.dates.value.trim(),
      year,
      summary: els.summary.value.trim(),
      cover: els.cover.value.trim(),
      tags: toCSV(els.tags.value),
      links: Array.from(els.linksWrap.querySelectorAll('.row')).map(r=>({
        label:r.querySelector('.link-label').value.trim(),
        url:r.querySelector('.link-url').value.trim()
      })).filter(x=>x.label&&x.url),
      itinerary: Array.from(els.itinWrap.querySelectorAll('.row')).map((r,idx)=>({
        day:idx+1,
        title:r.querySelector('.itin-title').value.trim(),
        items: toCSV(r.querySelector('.itin-items').value)
      })).filter(d=>d.title||d.items.length),
      story: els.story.value,
      mapQuery: els.mapQuery.value.trim(),
      media: Array.from(els.mediaWrap.querySelectorAll('.media-src')).map(i=>i.value.trim()).filter(Boolean)
    };
    if(!obj.cover && obj.media.length) obj.cover = obj.media[0];
    return obj;
  }

  function addLinkRow(link){
    const row = clone(els.tplLink);
    if(link){ row.querySelector('.link-label').value = link.label||''; row.querySelector('.link-url').value = link.url||''; }
    row.querySelector('.del').addEventListener('click',()=>row.remove());
    els.linksWrap.appendChild(row);
  }
  function addItinRow(day){
    const row = clone(els.tplItin);
    if(day){ row.querySelector('.itin-title').value = day.title||''; row.querySelector('.itin-items').value = (day.items||[]).join(', '); }
    row.querySelector('.del').addEventListener('click',()=>row.remove());
    els.itinWrap.appendChild(row);
  }
  function addMediaRow(src){
    const row = clone(els.tplMedia);
    const input = row.querySelector('.media-src'); input.value = src||'';
    row.querySelector('.del').addEventListener('click',()=>row.remove());
    row.querySelector('.up').addEventListener('click',()=>{ const prev=row.previousElementSibling; if(prev){ row.parentNode.insertBefore(row, prev); } });
    row.querySelector('.down').addEventListener('click',()=>{ const next=row.nextElementSibling; if(next){ row.parentNode.insertBefore(next, row); } });
    els.mediaWrap.appendChild(row);
  }

  // Drag&drop convenience for media paths
  els.drop.addEventListener('dragover', e=>{ e.preventDefault(); els.drop.classList.add('hover'); });
  els.drop.addEventListener('dragleave', ()=>els.drop.classList.remove('hover'));
  els.drop.addEventListener('drop', e=>{
    e.preventDefault(); els.drop.classList.remove('hover');
    for(const f of e.dataTransfer.files||[]){ addMediaRow(`/uploads/${f.name}`); }
  });

  // Buttons
  els.addLink.addEventListener('click', ()=>addLinkRow());
  els.addItin.addEventListener('click', ()=>addItinRow());
  els.addMedia.addEventListener('click', ()=>addMediaRow(''));
  els.search.addEventListener('input', renderList);

  els.btnNew.addEventListener('click', ()=>{
    const t = { id: uidFrom('new-trip', new Date().getFullYear()), title:'New Trip', year: new Date().getFullYear(), media:[], tags:[] };
    trips.unshift(t); renderList(); select(0);
  });

  els.form.addEventListener('submit', e=>{
    e.preventDefault();
    const obj = collectForm();
    if(selected==null){ trips.push(obj); selected = trips.length-1; }
    else { trips[selected] = obj; }
    renderList();
    alert('Saved locally. Use Download or Save to GitHub to persist.');
  });

  els.btnDel.addEventListener('click', ()=>{
    if(selected==null) return;
    if(confirm('Delete this trip?')){ trips.splice(selected,1); selected=null; renderList(); els.form.reset(); }
  });

  els.btnDL.addEventListener('click', ()=>{
    const blob = new Blob([JSON.stringify(trips, null, 2)], {type:'application/json'});
    const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='trips.json'; a.click(); URL.revokeObjectURL(a.href);
  });

  // Save to GitHub (optional)
  els.btnSaveGH.addEventListener('click', async ()=>{
    const owner=els.ghOwner.value.trim(); const repo=els.ghRepo.value.trim(); const branch=els.ghBranch.value.trim(); const path=els.ghPath.value.trim(); const token=els.ghToken.value.trim();
    if(!owner||!repo||!branch||!path||!token){ alert('Please fill GitHub settings and token.'); return; }
    try{
      const getRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${encodeURIComponent(path)}?ref=${encodeURIComponent(branch)}`, { headers:{Authorization:`Bearer ${token}`, Accept:'application/vnd.github+json'} });
      if(!getRes.ok){ throw new Error('Failed to fetch file metadata: '+getRes.status); }
      const meta = await getRes.json();
      const content = btoa(unescape(encodeURIComponent(JSON.stringify(trips, null, 2))));
      const putRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${encodeURIComponent(path)}`, {
        method:'PUT', headers:{Authorization:`Bearer ${token}`, Accept:'application/vnd.github+json'},
        body: JSON.stringify({ message:`Update trips.json via admin UI`, content, sha: meta.sha, branch })
      });
      if(!putRes.ok){ throw new Error('Commit failed: '+putRes.status); }
      alert('Committed to GitHub successfully.');
    }catch(err){ alert('Error: '+err.message); }
  });

  // Paste multiple media paths
  els.mediaWrap.addEventListener('paste', e=>{
    const text = (e.clipboardData||window.clipboardData).getData('text');
    if(text){ text.split(/\n+/).forEach(line=>{ line=line.trim(); if(line) addMediaRow(line); }); }
  });

  load();
})();