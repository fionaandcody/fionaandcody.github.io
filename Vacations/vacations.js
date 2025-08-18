const GH = {
  owner: "fionaandcody",
  repo: "fionaandcody.github.io",
  branch: "main"
};

const IMG = /\.(png|jpe?g|gif|webp)$/i;
const VID = /\.(mp4|webm|mov|m4v)$/i;
const IGNORE = ["data", "admin", ".github"];

const els = {
  list: document.getElementById("trip-list"),
  detail: document.getElementById("trip-detail"),
  back: document.getElementById("back-to-trips"),
  title: document.getElementById("trip-title"),
  gallery: document.getElementById("trip-gallery"),
  lightbox: document.getElementById("lightbox"),
  lightboxImg: document.getElementById("lightbox-img"),
  lightboxClose: document.getElementById("lightbox-close")
};

async function list(path) {
  const url = `https://api.github.com/repos/${GH.owner}/${GH.repo}/contents/${encodeURIComponent(path)}?ref=${GH.branch}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`GitHub API ${res.status}`);
  return res.json();
}

async function loadTrips() {
  const root = "Vacations";
  const items = await list(root);
  return items
    .filter(i => i.type === "dir" && !IGNORE.includes(i.name.toLowerCase()))
    .map(d => ({ title: d.name, folder: `${root}/${d.name}` }));
}

async function renderList() {
  els.detail.hidden = true;
  els.list.innerHTML = "";

  const trips = await loadTrips();

  for (const t of trips) {
    const files = await list(t.folder);
    const cover = files.find(f => IMG.test(f.name)) || files.find(f => VID.test(f.name));

    if (!cover) continue;

    const card = document.createElement("div");
    card.className = "photo-card";

    const thumb = document.createElement("img");
    thumb.src = `/${t.folder}/${cover.name}`;
    thumb.alt = t.title;
    card.appendChild(thumb);

    const caption = document.createElement("div");
    caption.className = "caption";
    caption.textContent = t.title;
    card.appendChild(caption);

    card.addEventListener("click", () => openTrip(t));
    els.list.appendChild(card);
  }
}

async function openTrip(trip) {
  els.detail.hidden = false;
  els.list.innerHTML = "";
  els.title.textContent = trip.title;
  els.gallery.innerHTML = "";

  const files = await list(trip.folder);
  files.filter(f => IMG.test(f.name) || VID.test(f.name)).forEach(f => {
    const src = `/${trip.folder}/${f.name}`;
    if (VID.test(f.name)) {
      const v = document.createElement("video");
      v.src = src;
      v.controls = true;
      els.gallery.appendChild(v);
    } else {
      const i = document.createElement("img");
      i.src = src;
      i.alt = trip.title;
      i.addEventListener("click", () => openLightbox(src));
      els.gallery.appendChild(i);
    }
  });
}

function openLightbox(src) {
  els.lightbox.hidden = false;
  els.lightboxImg.src = src;
}
els.lightboxClose.addEventListener("click", () => els.lightbox.hidden = true);
els.lightbox.addEventListener("click", e => {
  if (e.target === els.lightbox) els.lightbox.hidden = true;
});

document.addEventListener("DOMContentLoaded", () => {
  els.back.addEventListener("click", renderList);
  renderList();
});