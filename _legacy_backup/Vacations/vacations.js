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

// New vacation folder loading code
document.addEventListener('DOMContentLoaded', () => {
    // Check authentication
    const params = new URLSearchParams(window.location.search);
    if (!params.has('auth')) {
        window.location.href = '/index.html';
        return;
    }

    // Fetch vacation folders
    fetchVacations();
});

async function fetchVacations() {
    try {
        const response = await fetch('/api/vacations');
        const vacations = await response.json();
        renderVacations(vacations);
    } catch (error) {
        console.error('Error loading vacations:', error);
        // Fallback to demo data if API fails
        const demoVacations = [
            { name: 'Hawaii 2023', cover: 'Hawaii/cover.jpg' },
            { name: 'Mexico 2022', cover: 'Mexico/cover.jpg' },
            { name: 'Europe 2021', cover: 'Europe/cover.jpg' }
        ];
        renderVacations(demoVacations);
    }
}

function renderVacations(vacations) {
    const tripList = document.getElementById('trip-list');
    tripList.innerHTML = '';

    vacations.forEach(vacation => {
        const card = document.createElement('div');
        card.className = 'vacation-card';
        card.innerHTML = `
            <img src="${vacation.cover}" alt="${vacation.name}">
            <div class="vacation-info">
                <h3>${vacation.name}</h3>
            </div>
        `;
        
        card.addEventListener('click', () => loadVacationDetails(vacation.name));
        tripList.appendChild(card);
    });
}

async function loadVacationDetails(vacationName) {
    const tripList = document.getElementById('trip-list');
    const tripDetail = document.getElementById('trip-detail');
    const tripTitle = document.getElementById('trip-title');
    const tripGallery = document.getElementById('trip-gallery');

    tripList.hidden = true;
    tripDetail.hidden = false;
    tripTitle.textContent = vacationName;

    try {
        const response = await fetch(`/api/vacations/${vacationName}/photos`);
        const photos = await response.json();
        renderGallery(photos);
    } catch (error) {
        console.error('Error loading vacation photos:', error);
        tripGallery.innerHTML = '<p>Error loading photos</p>';
    }
}

document.getElementById('back-to-trips').addEventListener('click', () => {
    document.getElementById('trip-list').hidden = false;
    document.getElementById('trip-detail').hidden = true;
});

// Lightbox functionality
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');

document.getElementById('lightbox-close').addEventListener('click', () => {
    lightbox.hidden = true;
});

function showLightbox(imgSrc) {
    lightboxImg.src = imgSrc;
    lightbox.hidden = false;
}