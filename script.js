const wallpapers = [

  {
    id: 1,
    title: "Naruto",
    anime: "Naruto",
    image: "wallpapers/naruto.jpg"
  },

  {
    id: 2,
    title: "Gojo Satoru",
    anime: "Jujutsu Kaisen",
    image: "wallpapers/gojo.jpg"
  },

  {
    id: 3,
    title: "Monkey D. Luffy",
    anime: "One Piece",
    image: "wallpapers/luffy.jpg"
  },

  {
    id: 4,
    title: "Tanjiro Kamado",
    anime: "Demon Slayer",
    image: "wallpapers/tanjiro.jpg"
  },

  {
    id: 5,
    title: "Sung Jin-Woo",
    anime: "Solo Leveling",
    image: "wallpapers/solo-leveling.jpg"
  },

  {
    id: 6,
    title: "Itachi Uchiha",
    anime: "Naruto",
    image: "wallpapers/itachi.jpg"
  },

  {
    id: 7,
    title: "Zoro",
    anime: "One Piece",
    image: "wallpapers/zoro.jpg"
  },

  {
    id: 8,
    title: "Sukuna",
    anime: "Jujutsu Kaisen",
    image: "wallpapers/sukuna.jpg"
  }

];


let currentWallpaper = null;


/* DISPLAY WALLPAPERS */

function displayWallpapers(list = wallpapers) {

  const grid = document.getElementById("wallpaperGrid");

  grid.innerHTML = "";

  if (list.length === 0) {
    grid.innerHTML = `<p class="empty">No wallpapers found.</p>`;
    return;
  }

  list.forEach((wallpaper, index) => {

    const card = document.createElement("div");

    card.className = "wallpaper-card";

    card.style.animationDelay = `${index * 0.05}s`;

    card.innerHTML = `

      <img
        src="${wallpaper.image}"
        alt="${wallpaper.title}"
        loading="lazy"
      >

      <div class="card-overlay">

        <h3>${wallpaper.title}</h3>

        <p>
          ${wallpaper.anime} • 4K
        </p>

      </div>

    `;

    card.onclick = () => openWallpaper(wallpaper);

    grid.appendChild(card);

  });

}


/* OPEN WALLPAPER */

function openWallpaper(wallpaper) {

  currentWallpaper = wallpaper;

  document.getElementById("modalImage").src = wallpaper.image;

  document.getElementById("modalTitle").textContent =
    wallpaper.title;

  document.getElementById("modalCategory").textContent =
    wallpaper.anime;

  document.getElementById("downloadBtn").href =
    wallpaper.image;

  document.getElementById("wallpaperModal")
    .classList.add("show");

  addRecent(wallpaper);

  updateFavoriteButton();

  document.body.style.overflow = "hidden";
}


/* CLOSE WALLPAPER */

function closeWallpaper() {

  document.getElementById("wallpaperModal")
    .classList.remove("show");

  document.body.style.overflow = "";

}


/* FAVORITES */

function getFavorites() {

  return JSON.parse(
    localStorage.getItem("nikaFavorites") || "[]"
  );

}


function toggleFavorite() {

  if (!currentWallpaper) return;

  let favorites = getFavorites();

  const exists =
    favorites.includes(currentWallpaper.id);

  if (exists) {

    favorites =
      favorites.filter(id => id !== currentWallpaper.id);

  } else {

    favorites.push(currentWallpaper.id);

  }

  localStorage.setItem(
    "nikaFavorites",
    JSON.stringify(favorites)
  );

  updateFavoriteButton();

}


function updateFavoriteButton() {

  const button =
    document.getElementById("favoriteBtn");

  const favorites = getFavorites();

  if (
    currentWallpaper &&
    favorites.includes(currentWallpaper.id)
  ) {

    button.textContent = "♥";
    button.classList.add("liked");

  } else {

    button.textContent = "♡";
    button.classList.remove("liked");

  }

}


/* RECENT */

function addRecent(wallpaper) {

  let recent =
    JSON.parse(
      localStorage.getItem("nikaRecent") || "[]"
    );

  recent =
    recent.filter(id => id !== wallpaper.id);

  recent.unshift(wallpaper.id);

  recent = recent.slice(0, 8);

  localStorage.setItem(
    "nikaRecent",
    JSON.stringify(recent)
  );

  displayRecent();

}


function displayRecent() {

  const grid =
    document.getElementById("recentGrid");

  const recent =
    JSON.parse(
      localStorage.getItem("nikaRecent") || "[]"
    );

  const items =
    recent
      .map(id =>
        wallpapers.find(w => w.id === id)
      )
      .filter(Boolean);

  if (!items.length) {

    grid.innerHTML =
      `<p class="empty">No wallpapers viewed yet.</p>`;

    return;

  }

  grid.innerHTML = "";

  items.forEach(wallpaper => {

    const card =
      document.createElement("div");

    card.className = "wallpaper-card";

    card.innerHTML = `

      <img
        src="${wallpaper.image}"
        alt="${wallpaper.title}"
        loading="lazy"
      >

      <div class="card-overlay">

        <h3>${wallpaper.title}</h3>

        <p>${wallpaper.anime}</p>

      </div>

    `;

    card.onclick =
      () => openWallpaper(wallpaper);

    grid.appendChild(card);

  });

}


/* SEARCH */

function openSearch() {

  document
    .getElementById("searchOverlay")
    .classList.add("open");

  setTimeout(() => {

    document
      .getElementById("searchInput")
      .focus();

  }, 400);

}


function closeSearch() {

  document
    .getElementById("searchOverlay")
    .classList.remove("open");

}


function searchWallpapers() {

  const query =
    document
      .getElementById("searchInput")
      .value
      .toLowerCase()
      .trim();

  const results =
    wallpapers.filter(w =>
      w.title.toLowerCase().includes(query) ||
      w.anime.toLowerCase().includes(query)
    );

  const container =
    document.getElementById("searchResults");

  container.innerHTML = "";

  results.forEach(wallpaper => {

    const card =
      document.createElement("div");

    card.className = "wallpaper-card";

    card.style.display = "inline-block";
    card.style.width = "230px";
    card.style.margin = "8px";

    card.innerHTML = `

      <img
        src="${wallpaper.image}"
        alt="${wallpaper.title}"
      >

      <div class="card-overlay">

        <h3>${wallpaper.title}</h3>

        <p>${wallpaper.anime}</p>

      </div>

    `;

    card.onclick = () => {

      closeSearch();
      openWallpaper(wallpaper);

    };

    container.appendChild(card);

  });

}


/* CATEGORY */

function filterCategory(category) {

  let filtered;

  if (category === "All") {

    filtered = wallpapers;

  } else {

    filtered =
      wallpapers.filter(
        w => w.anime === category
      );

  }

  displayWallpapers(filtered);

  document
    .getElementById("wallpapers")
    .scrollIntoView({
      behavior: "smooth"
    });

}


/* VIEW ALL */

function showAll() {

  displayWallpapers(wallpapers);

  document
    .getElementById("wallpapers")
    .scrollIntoView({
      behavior: "smooth"
    });

}


/* ESC KEY */

document.addEventListener("keydown", event => {

  if (event.key === "Escape") {

    closeSearch();
    closeWallpaper();

  }

});


/* INITIALIZE */

displayWallpapers();
displayRecent();
