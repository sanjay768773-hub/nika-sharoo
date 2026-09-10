const API =
  "https://wallhaven.cc/api/v1/search";

const grid = document.getElementById("wallpaperGrid");
const loading = document.getElementById("loading");
const empty = document.getElementById("empty");

const searchInput =
  document.getElementById("searchInput");

const sectionTitle =
  document.getElementById("sectionTitle");

let recent = JSON.parse(
  localStorage.getItem("nikaRecent") || "[]"
);


/* =========================
   LOAD WALLPAPERS
========================= */

async function loadWallpapers(query = "") {

  showLoading();

  grid.innerHTML = "";
  empty.classList.add("hidden");

  try {

    let url =
      API +
      "?sorting=relevance" +
      "&purity=100" +
      "&atleast=3840x2160" +
      "&categories=010" +
      "&page=1";

    if (query.trim()) {

      url +=
        "&q=" +
        encodeURIComponent(query.trim());

      sectionTitle.textContent =
        "Results for " + query;

    } else {

      sectionTitle.textContent =
        "Latest 4K Wallpapers";
    }

    const response =
      await fetch(url);

    if (!response.ok) {
      throw new Error("API error");
    }

    const data =
      await response.json();

    hideLoading();

    if (!data.data || data.data.length === 0) {

      empty.classList.remove("hidden");

      return;
    }

    data.data.forEach(
      wallpaper => {

        createCard(wallpaper);

      }
    );

  } catch (error) {

    hideLoading();

    console.error(error);

    empty.classList.remove("hidden");

    empty.querySelector("h3").textContent =
      "Unable to load wallpapers";

    empty.querySelector("p").textContent =
      "Try again in a moment.";

  }

}


/* =========================
   CREATE CARD
========================= */

function createCard(wallpaper) {

  const card =
    document.createElement("div");

  card.className =
    "wallpaper-card";

  const image =
    document.createElement("img");

  image.loading = "lazy";

  image.src =
    wallpaper.thumbs.large ||
    wallpaper.path;

  image.alt =
    wallpaper.category ||
    "Anime Wallpaper";

  const overlay =
    document.createElement("div");

  overlay.className =
    "card-overlay";

  const title =
    document.createElement("h3");

  title.textContent =
    "4K Wallpaper";

  const resolution =
    document.createElement("p");

  resolution.textContent =
    wallpaper.resolution || "High Resolution";

  overlay.appendChild(title);

  overlay.appendChild(resolution);

  card.appendChild(image);

  card.appendChild(overlay);

  card.onclick = () =>
    openModal(wallpaper);

  grid.appendChild(card);

}


/* =========================
   SEARCH
========================= */

function searchWallpapers() {

  const query =
    searchInput.value.trim();

  if (!query) {

    loadLatest();

    return;
  }

  saveRecent(query);

  loadWallpapers(query);

}


function quickSearch(name) {

  searchInput.value =
    name;

  searchWallpapers();

}


searchInput.addEventListener(
  "keydown",
  event => {

    if (event.key === "Enter") {

      searchWallpapers();

    }

  }
);


/* =========================
   LATEST
========================= */

function loadLatest() {

  searchInput.value = "";

  loadWallpapers();

}


/* =========================
   HOME
========================= */

function showHome() {

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

  loadLatest();

}


/* =========================
   RECENT
========================= */

function showRecent() {

  if (recent.length === 0) {

    sectionTitle.textContent =
      "Recent Searches";

    grid.innerHTML = `
      <div class="empty">
        <h3>No recent searches</h3>
        <p>Search for your favorite anime.</p>
      </div>
    `;

    return;
  }

  sectionTitle.textContent =
    "Recent Searches";

  grid.innerHTML = "";

  recent.forEach(name => {

    const card =
      document.createElement("div");

    card.className =
      "wallpaper-card";

    card.style.height =
      "150px";

    card.innerHTML = `
      <div class="card-overlay"
           style="background:#111;justify-content:center">
        <h3>🔍 ${escapeHtml(name)}</h3>
        <p>Search again</p>
      </div>
    `;

    card.onclick = () => {

      searchInput.value =
        name;

      loadWallpapers(name);

    };

    grid.appendChild(card);

  });

}


/* =========================
   CATEGORIES
========================= */

function showCategories() {

  sectionTitle.textContent =
    "Anime Categories";

  grid.innerHTML = "";

  const categories = [

    "Naruto",
    "One Piece",
    "Jujutsu Kaisen",
    "Demon Slayer",
    "Solo Leveling",
    "Dragon Ball",
    "Bleach",
    "Attack on Titan",
    "My Hero Academia",
    "Chainsaw Man",
    "Tokyo Ghoul",
    "One Punch Man"

  ];

  categories.forEach(name => {

    const card =
      document.createElement("div");

    card.className =
      "wallpaper-card";

    card.style.height =
      "150px";

    card.innerHTML = `
      <div class="card-overlay"
           style="background:linear-gradient(135deg,#111,#19111f);justify-content:center">
        <h3>${escapeHtml(name)}</h3>
        <p>View wallpapers →</p>
      </div>
    `;

    card.onclick = () => {

      searchInput.value =
        name;

      loadWallpapers(name);

    };

    grid.appendChild(card);

  });

}


/* =========================
   MODAL
========================= */

function openModal(wallpaper) {

  const modal =
    document.getElementById("modal");

  const image =
    document.getElementById("modalImage");

  const title =
    document.getElementById("modalTitle");

  const resolution =
    document.getElementById("modalResolution");

  const download =
    document.getElementById("downloadBtn");

  image.src =
    wallpaper.path;

  title.textContent =
    "Anime Wallpaper";

  resolution.textContent =
    wallpaper.resolution ||
    "High Resolution";

  download.href =
    wallpaper.path;

  modal.classList.add("active");

  document.body.style.overflow =
    "hidden";

}


function closeModal() {

  document
    .getElementById("modal")
    .classList.remove("active");

  document.body.style.overflow =
    "";

}


document
  .getElementById("modal")
  .addEventListener(
    "click",
    event => {

      if (
        event.target.id ===
        "modal"
      ) {

        closeModal();

      }

    }
  );


document.addEventListener(
  "keydown",
  event => {

    if (event.key === "Escape") {

      closeModal();

    }

  }
);


/* =========================
   RECENT SEARCHES
========================= */

function saveRecent(query) {

  recent =
    recent.filter(
      item =>
        item.toLowerCase() !==
        query.toLowerCase()
    );

  recent.unshift(query);

  recent =
    recent.slice(0, 10);

  localStorage.setItem(
    "nikaRecent",
    JSON.stringify(recent)
  );

}


/* =========================
   UI
========================= */

function showLoading() {

  loading.classList.remove(
    "hidden"
  );

}


function hideLoading() {

  loading.classList.add(
    "hidden"
  );

}


function escapeHtml(text) {

  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

}


/* =========================
   START WEBSITE
========================= */

loadLatest();
