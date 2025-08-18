// SIMPLE: Each subfolder in /Vacations is a trip
// You add folders manually below (one line per trip)

const trips = [
  { id:"aulani-2024", title:"Aulani 2024", folder:"Aulani 2024" },
  { id:"germany-2025", title:"Germany 2025", folder:"Germany 2025" }
];

const els = {
  list: document.getElementById('v-list'),
  detail: document.getElementById('v-detail'),
  back: document.getElementById('v-back'),
  dTitle: document.getElementById('d-title'),
  dGallery: document.getElementById('d-gallery'),
  lb: document.getElementById('v-lightbox'),
  lbImg: document.getElementById('lb-img'),
  lbClose: document.getElementById('lb-close')
};

// Render trips list
function renderList(){
  els.detail.hidden = true;
  els.list.innerHTML = "";
  trips.forEach(t=>{
    const card=document.createElement('div');
    card.className="v-card";
    const img=document.createElement('img');
    img.src=`${t.folder}/cover.JPG`; // expects one cover.JPG in each trip folder
    const h=document.createElement('h3'); h.textContent=t.title;
    card.appendChild(img); card.appendChild(h);
    card.addEventListener('click',()=>openTrip(t));
    els.list.appendChild(card);
  });
}

// Render a trip gallery
function openTrip(trip){
  els.list.innerHTML="";
  els.detail.hidden=false;
  els.dTitle.textContent=trip.title;
  els.dGallery.innerHTML="";

  // simple: just list every file in the folder we know about
  // For GitHub Pages, easiest is to hand-maintain an array of filenames
  // Example: add images to your folder and list them here
  const images = trip.folder==="Aulani 2024" ? [
    "cover.JPG",
    "374985EF-39BC-4AC9-B2E8-7D4A3F132AEC.png",
    "Snorkel.png",
    "IMG_0027.mov"
  ] : trip.folder==="Germany 2025" ? [
    "photo1.jpeg",
    "photo2.jpeg"
  ] : [];

  images.forEach(f=>{
    const src=`${trip.folder}/${f}`;
    const img=document.createElement('img');
    img.src=src; img.alt=trip.title;
    img.addEventListener('click',()=>openLightbox(src));
    els.dGallery.appendChild(img);
  });
}

// Lightbox
function openLightbox(src){
  els.lb.hidden=false;
  els.lbImg.src=src;
}
function closeLB(){els.lb.hidden=true;}

els.back.addEventListener('click',renderList);
els.lbClose.addEventListener('click',closeLB);

// Init
renderList();