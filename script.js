const API = "https://wallhaven.cc/api/v1/search";

const grid = document.getElementById("wallpaperGrid");
const loading = document.getElementById("loading");
const empty = document.getElementById("empty");
const searchInput = document.getElementById("searchInput");
const sectionTitle = document.getElementById("sectionTitle");

async function searchWallpapers() {

    const query = searchInput.value.trim() || "anime";

    loading.classList.remove("hidden");
    empty.classList.add("hidden");
    grid.innerHTML = "";

    sectionTitle.textContent =
        query === "anime"
        ? "Latest Anime Wallpapers"
        : "Results: " + query;

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
            throw new Error("API request failed");
        }

        const result = await response.json();

        loading.classList.add("hidden");

        if (!result.data || result.data.length === 0) {

            empty.classList.remove("hidden");
            return;
        }

        result.data.forEach(wallpaper => {

            const card =
                document.createElement("div");

            card.className = "wallpaper-card";

            card.innerHTML = `
                <img
                    src="${wallpaper.thumbs.large}"
                    alt="Anime Wallpaper"
                    loading="lazy"
                >

                <div class="card-overlay">

                    <h3>
                        ${wallpaper.resolution}
                    </h3>

                    <p>
                        Anime Wallpaper
                    </p>

                </div>
            `;

            card.onclick = () => {

                document.getElementById("modalImage").src =
                    wallpaper.path;

                document.getElementById("modalResolution").textContent =
                    wallpaper.resolution;

                document.getElementById("downloadBtn").href =
                    wallpaper.path;

                document.getElementById("modal").classList.add("active");
            };

            grid.appendChild(card);

        });

    } catch (error) {

        console.error(error);

        loading.classList.add("hidden");

        empty.classList.remove("hidden");

        empty.querySelector("h3").textContent =
            "Wallpaper loading failed";

        empty.querySelector("p").textContent =
            "Please try again.";

    }
}


function quickSearch(name) {

    searchInput.value = name;

    searchWallpapers();

}


function loadLatest() {

    searchInput.value = "anime";

    searchWallpapers();

}


function showHome() {

    loadLatest();

}


function showRecent() {

    alert("Search history will be added soon!");

}


function showCategories() {

    alert(
        "Try searching: Naruto, One Piece, Gojo, Demon Slayer, Solo Leveling"
    );

}


function closeModal() {

    document.getElementById("modal")
        .classList.remove("active");

}


searchInput.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Enter") {

            searchWallpapers();

        }

    }
);


document.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Escape") {

            closeModal();

        }

    }
);


loadLatest();
