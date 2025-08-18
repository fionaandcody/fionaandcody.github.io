// Auto gallery for Vacations — matches main site look
const GH = {
  owner: "fionaandcody",
  repo: "fionaandcody.github.io",
  branch: "main"
};

const IMG = /\.(png|jpe?g|gif|webp)$/i;
const VID = /\.(mp4|webm|mov|m4v)$/i;
const IGNORE = ["data", "admin", ".github"];

const els = {
  list: document.getElementById("v-list"),
  detail: document.getElementById("v-detail"),
  back: document.getElementById("v-back"),
  dTitle: document.getElementById("d-title"),
  dGallery: document.getElementById("d-gallery")
};

async function list(path){
  const url = `https://api.github.com/repos/${GH.owner}/${GH.repo}/contents/${encodeURIComponent(path)}?ref=${GH.branch}`;
  const res = await fetch(url);
  if(!res.ok) throw new Error(`GitHub API ${res.status}`);
  return res.json();
}

async function loadTrips(){
  const root = "Vacations";   // must match repo folder exactly!
  const items = await list(root);
  return items
    .filter(i => i.type==="dir" && !IGNORE.includes(i.name.toLowerCase()))
    .map(d=>({ title: d.name, folder: `${root}/${d.name}` }));
}

async function renderList(){
  els.detail.hidden = true;
  els.list.innerHTML = "";
  const trips = await loadTrips();

  for(const t of trips){
    const files = await list(t.folder);
    const cover = files.find(f=>IMG.test(f.name)) || files.find(f=>VID.test(f.name));

    const card=document.createElement("div");
    card.className="photo-card";

    if(cover && IMG.test(cover.name)){
      const i=document.createElement("img");
      i.src=`/${t.folder}/${cover.name}`;
      card.appendChild(i);
    }

    const caption=document.createElement("div");
    caption.className="caption";
    caption.textContent=t.title;
    card.appendChild(caption);

    card.addEventListener("click",()=>openTrip(t));
    els.list.appendChild(card);
  }
}

async function openTrip(trip){
  els.detail.hidden=false;
  els.list.innerHTML="";
  els.dTitle.textContent=trip.title;
  els.dGallery.innerHTML="";

  const files = await list(trip.folder);
  files.filter(f=>IMG.test(f.name)||VID.test(f.name)).forEach(f=>{
    const src=`/${trip.folder}/${f.name}`;
    if(VID.test(f.name)){
      const v=document.createElement("video");
      v.src=src; v.controls=true;
      v.className="gallery-item";
      els.dGallery.appendChild(v);
    } else {
      const i=document.createElement("img");
      i.src=src; i.alt=trip.title;
      i.className="gallery-item";
      i.addEventListener("click",()=>openLightbox(src));
      els.dGallery.appendChild(i);
    }
  });
}

function openLightbox(src){
  const modal=document.createElement("div");
  modal.className="modal";
  modal.innerHTML=`
    <span class="close">&times;</span>
    <img class="modal-content" src="${src}">
  `;
  document.body.appendChild(modal);
  modal.querySelector(".close").onclick=()=>modal.remove();
  modal.onclick=(e)=>{ if(e.target===modal) modal.remove(); };
}

document.addEventListener("DOMContentLoaded", () => {
  if(els.back){
    els.back.addEventListener("click",renderList);
  }
  renderList();
});