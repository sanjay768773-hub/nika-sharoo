const API = "https://wallhaven.cc/api/v1/search";

const grid = document.getElementById("wallpaperGrid");
const searchInput = document.getElementById("searchInput");
const sectionTitle = document.getElementById("sectionTitle");
const loading = document.getElementById("loading");
const empty = document.getElementById("empty");

async function searchWallpapers(query = "anime") {

    if (!grid) return;

    loading?.classList.remove("hidden");
    empty?.classList.add("hidden");
    grid.innerHTML = "";

    if (sectionTitle) {
        sectionTitle.textContent =
            query === "anime"
            ? "Latest Anime Wallpapers"
            : "Results: " + query;
    }

    try {

        const url =
            API +
            "?q=" + encodeURIComponent(query) +
            "&categories=010" +
            "&purity=100" +
            "&atleast=1920x1080" +
            "&sorting=relevance" +
            "&page=1";

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("API Error");
        }

        const result = await response.json();

        loading?.classList.add("hidden");

        if (!result.data || result.data.length === 0) {
            empty?.classList.remove("hidden");
            return;
        }

        result.data.forEach(wallpaper => {

            const card = document.createElement("div");
            card.className = "wallpaper-card";

            card.innerHTML = `
                <img
                    src="${wallpaper.thumbs.large}"
                    alt="Anime Wallpaper"
                    loading="lazy"
                >

                <div class="card-overlay">
                    <h3>${wallpaper.resolution}</h3>
                    <p>Download Wallpaper</p>
                </div>
            `;

            card.addEventListener("click", () => {
                openWallpaper(wallpaper);
            });

            grid.appendChild(card);
        });

    } catch (error) {

        console.error(error);

        loading?.classList.add("hidden");

        if (empty) {
            empty.classList.remove("hidden");

            const h3 = empty.querySelector("h3");
            const p = empty.querySelector("p");

            if (h3) h3.textContent = "Unable to load wallpapers";
            if (p) p.textContent = "Please try again.";
        }
    }
}


// Wallpaper open
function openWallpaper(wallpaper) {

    const modal = document.getElementById("modal");

    if (!modal) {
        // If modal doesn't exist, open image directly
        window.open(wallpaper.path, "_blank");
        return;
    }

    const image = document.getElementById("modalImage");
    const resolution = document.getElementById("modalResolution");
    const download = document.getElementById("downloadBtn");

    if (image) image.src = wallpaper.path;

    if (resolution) {
        resolution.textContent = wallpaper.resolution;
    }

    if (download) {
        download.href = wallpaper.path;
        download.download = "nika-sharo-wallpaper.jpg";
    }

    modal.classList.add("active");
}


// Search
function searchNow() {
    const query = searchInput?.value.trim() || "anime";
    searchWallpapers(query);
}


// Quick search
function quickSearch(name) {

    if (searchInput) {
        searchInput.value = name;
    }

    searchWallpapers(name);
}


// HOME
function showHome() {
    searchWallpapers("anime");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


// RECENT
function showRecent() {

    if (sectionTitle) {
        sectionTitle.textContent = "Recent Wallpapers";
    }

    searchWallpapers("anime");
}


// CATEGORIES
function showCategories() {

    const categories = [
        "Naruto",
        "One Piece",
        "Jujutsu Kaisen",
        "Demon Slayer",
        "Solo Leveling",
        "Dragon Ball",
        "Bleach",
        "Attack on Titan"
    ];

    const choice = prompt(
        "Choose Category:\n\n" +
        categories.map((x, i) => `${i + 1}. ${x}`).join("\n")
    );

    const index = Number(choice) - 1;

    if (categories[index]) {
        quickSearch(categories[index]);
    }
}


// Close modal
function closeModal() {

    const modal = document.getElementById("modal");

    if (modal) {
        modal.classList.remove("active");
    }
}


// Enter search
if (searchInput) {

    searchInput.addEventListener("keydown", function(event) {

        if (event.key === "Enter") {
            searchNow();
        }

    });
}


// ESC
document.addEventListener("keydown", function(event) {

    if (event.key === "Escape") {
        closeModal();
    }

});


// Load wallpapers automatically
window.addEventListener("load", function() {
    searchWallpapers("anime");
});
