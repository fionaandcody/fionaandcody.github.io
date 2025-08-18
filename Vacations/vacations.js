// Vacations auto-gallery using GitHub API
// Public repos need no token

const GH = {
  owner: "fionaandcody",       // your GitHub username
  repo: "fionaandcody.github.io", // repo name
  branch: "main"               // your branch
};

const IMG = /\.(png|jpe?g|gif|webp)$/i;
const VID = /\.(mp4|webm|mov|m4v)$/i;

const els = {
  list: document.getElementById("v-list"),
  detail: document.getElementById("v-detail"),
  back: document.getElementById("v-back"),
  dTitle: document.getElementById("d-title"),
  dGallery: document.getElementById("d-gallery"),
  lb: document.getElementById("v-lightbox"),
  lbImg: document.getElementById("lb-img"),
  lbClose: document.getElementById("lb-close")
};

// ---- GitHub API helpers
async function list(path){
  const url = `https://api.github.com/repos/${GH.owner}/${GH.repo}/contents/${encodeURIComponent(path)}?ref=${GH.branch}`;
  const res = await fetch(url);
  if(!res.ok) throw new Error(`GitHub API ${res.status}`);
  return res.json();
}

// ---- Build trips from folders
async function loadTrips(){
  const root = "Vacations";
  const items = await list(root);
  return items.filter(i => i.type==="dir").map(d=>({id:d.name, title:d.name, folder:`${root}/${d.name}`}));
}

// ---- Render trips list
async function renderList(){
  els.detail.hidden = true;
  els.list.innerHTML = "";
  const trips = await loadTrips();
  for(const t of trips){
    const files = await list(t.folder);
    const cover = files.find(f=>IMG.test(f.name)) || files.find(f=>VID.test(f.name));
    const card=document.createElement("div");
    card.className="v-card";
    if(cover){
      if(VID.test(cover.name)){
        const v=document.createElement("video"); v.src=`/${t.folder}/${cover.name}`; v.muted=true; v.playsInline=true;
        card.appendChild(v);
      } else {
        const i=document.createElement("img"); i.src=`/${t.folder}/${cover.name}`; card.appendChild(i);
      }
    }
    const h=document.createElement("h3"); h.textContent=t.title;
    card.appendChild(h);
    card.addEventListener("click",()=>openTrip(t));
    els.list.appendChild(card);
  }
}

// ---- Render a trip gallery
async function openTrip(trip){
  els.detail.hidden=false;
  els.list.innerHTML="";
  els.dTitle.textContent=trip.title;
  els.dGallery.innerHTML="";
  const files = await list(trip.folder);
  files.filter(f=>IMG.test(f.name)||VID.test(f.name)).forEach(f=>{
    const src=`/${trip.folder}/${f.name}`;
    const el=VID.test(f.name)?document.createElement("video"):document.createElement("img");
    el.src=src; el.controls=VID.test(f.name);
    el.addEventListener("click",()=>openLightbox(src));
    els.dGallery.appendChild(el);
  });
}

// ---- Lightbox
function openLightbox(src){ els.lb.hidden=false; els.lbImg.src=src; }
function closeLB(){ els.lb.hidden=true; els.lbImg.src=""; }

els.back.addEventListener("click",renderList);
els.lbClose.addEventListener("click",closeLB);

// Init
renderList();