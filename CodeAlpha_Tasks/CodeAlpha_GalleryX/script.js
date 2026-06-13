/* =========================
   GALLERYX V1
========================= */

const body = document.body;

const fileInput = document.getElementById("fileInput");
const uploadTrigger = document.getElementById("uploadTrigger");
const uploadDropBtn = document.getElementById("uploadDropBtn");
const emptyUploadBtn = document.getElementById("emptyUploadBtn");

const galleryGrid = document.getElementById("galleryGrid");
const emptyState = document.getElementById("emptyState");

const themeToggle = document.getElementById("themeToggle");

const sidebar = document.getElementById("sidebar");
const sidebarOverlay = document.getElementById("sidebarOverlay");
const mobileMenuBtn = document.getElementById("mobileMenuBtn");

const dropzone = document.getElementById("dropzone");
const searchInput = document.getElementById("searchInput");
const sectionTitle = document.getElementById("sectionTitle");
const mediaCount = document.getElementById("mediaCount");

const navItems = document.querySelectorAll(".nav-item");

const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxClose = document.querySelector(".lightbox-close");

const contextMenu = document.getElementById("contextMenu");
const toastContainer = document.getElementById("toastContainer");

let mediaFiles = [];
let currentSection = "all";
let selectedMediaId = null;

/* =========================
   THEME
========================= */

loadTheme();

themeToggle.addEventListener("click", () => {
    body.classList.toggle("light-theme");
    body.classList.toggle("dark-theme");

    const currentTheme = body.classList.contains("light-theme")
        ? "light"
        : "dark";

    localStorage.setItem("galleryx-theme", currentTheme);

    updateThemeIcon();
});

function loadTheme() {
    const savedTheme =
        localStorage.getItem("galleryx-theme") || "dark";

    body.classList.remove("light-theme", "dark-theme");
    body.classList.add(`${savedTheme}-theme`);

    updateThemeIcon();
}

function updateThemeIcon() {
    const icon = themeToggle.querySelector("i");

    if (body.classList.contains("light-theme")) {
        icon.className = "fa-solid fa-sun";
    } else {
        icon.className = "fa-solid fa-moon";
    }
}

/* =========================
   MOBILE SIDEBAR
========================= */

mobileMenuBtn.addEventListener("click", () => {
    sidebar.classList.add("active");
    sidebarOverlay.classList.add("active");
});

sidebarOverlay.addEventListener("click", () => {
    sidebar.classList.remove("active");
    sidebarOverlay.classList.remove("active");
});

/* =========================
   UPLOAD BUTTONS
========================= */

uploadTrigger.addEventListener("click", () => fileInput.click());
uploadDropBtn.addEventListener("click", () => fileInput.click());
emptyUploadBtn.addEventListener("click", () => fileInput.click());

fileInput.addEventListener("change", (e) => {
    handleFiles(e.target.files);
});

/* =========================
   DRAG & DROP
========================= */

dropzone.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropzone.style.borderColor = "var(--accent)";
});

dropzone.addEventListener("dragleave", () => {
    dropzone.style.borderColor = "";
});

dropzone.addEventListener("drop", (e) => {
    e.preventDefault();

    dropzone.style.borderColor = "";

    handleFiles(e.dataTransfer.files);
});

/* =========================
   HANDLE FILES
========================= */

function handleFiles(files) {

    [...files].forEach(file => {

        const type = detectType(file);

        const mediaObject = {
            id: Date.now() + Math.random(),
            name: file.name,
            type,
            src: URL.createObjectURL(file),
            favorite: false,
            deleted: false,
            uploadDate: new Date().toISOString()
        };

        mediaFiles.push(mediaObject);
    });

    renderGallery();
    showToast("Media uploaded successfully");
}

/* =========================
   DETECT TYPE
========================= */

function detectType(file) {

    if (file.type.startsWith("image/")) {

        if (file.type === "image/gif") {
            return "gif";
        }

        return "image";
    }

    if (file.type.startsWith("video/")) {
        return "video";
    }

    return "image";
}

/* =========================
   NAVIGATION
========================= */

navItems.forEach(item => {

    item.addEventListener("click", () => {

        navItems.forEach(btn =>
            btn.classList.remove("active")
        );

        item.classList.add("active");

        currentSection = item.dataset.section;

        updateSectionTitle();
        renderGallery();

        sidebar.classList.remove("active");
        sidebarOverlay.classList.remove("active");
    });
});

function updateSectionTitle() {

    const titles = {
        all: "All Media",
        images: "Images",
        gifs: "GIFs",
        videos: "Videos",
        albums: "Albums",
        favorites: "Favorites",
        trash: "Trash"
    };

    sectionTitle.textContent =
        titles[currentSection];
}

/* =========================
   SEARCH
========================= */

searchInput.addEventListener("input", renderGallery);

/* =========================
   FILTER
========================= */

function getFilteredMedia() {

    let filtered = [...mediaFiles];

    const search =
        searchInput.value.toLowerCase();

    if (search) {
        filtered = filtered.filter(item =>
            item.name.toLowerCase().includes(search)
        );
    }

    switch (currentSection) {

        case "images":
            filtered = filtered.filter(
                item => item.type === "image"
            );
            break;

        case "gifs":
            filtered = filtered.filter(
                item => item.type === "gif"
            );
            break;

        case "videos":
            filtered = filtered.filter(
                item => item.type === "video"
            );
            break;

        case "favorites":
            filtered = filtered.filter(
                item => item.favorite
            );
            break;

        case "trash":
            filtered = filtered.filter(
                item => item.deleted
            );
            break;

        case "albums":
            filtered = [];
            break;
    }

    return filtered;
}

/* =========================
   RENDER GALLERY
========================= */

function renderGallery() {

    const data = getFilteredMedia();

    galleryGrid.innerHTML = "";

    mediaCount.textContent =
        `${mediaFiles.length} Files`;

    if (!data.length) {

        galleryGrid.classList.add("hidden");
        emptyState.style.display = "block";
        return;
    }

    galleryGrid.classList.remove("hidden");
    emptyState.style.display = "none";

    data.forEach(media => {

        const card = document.createElement("div");
        card.className = "media-card";

        let preview = "";

        if (
            media.type === "image" ||
            media.type === "gif"
        ) {

            preview = `
                <img src="${media.src}" alt="${media.name}">
            `;

        } else {

            preview = `
                <video
                    src="${media.src}"
                    muted
                    preload="metadata"
                    controls
                ></video>
            `;
        }

        card.innerHTML = `
            <div class="media-preview">
                ${preview}
            </div>

            <div class="media-info">

                <div class="media-name">
                    ${media.name}
                </div>

                <button
                    class="media-menu-btn"
                    data-id="${media.id}">
                    <i class="fa-solid fa-ellipsis"></i>
                </button>

            </div>
        `;

        galleryGrid.appendChild(card);

        card.addEventListener("click", (e) => {

            if (
                e.target.closest(".media-menu-btn")
            ) return;

            openMedia(media);
        });
    });

    initializeMenus();
}

/* =========================
   OPEN MEDIA
========================= */

function openMedia(media) {

    if (media.type === "video") {

        const videoWindow = window.open("");

        videoWindow.document.write(`
            <html>
            <body style="
                margin:0;
                background:black;
                display:flex;
                justify-content:center;
                align-items:center;
                height:100vh;">
                <video
                    src="${media.src}"
                    controls
                    autoplay
                    style="
                        max-width:100%;
                        max-height:100%;">
                </video>
            </body>
            </html>
        `);

        return;
    }

    lightboxImage.src = media.src;
    lightbox.classList.add("active");
}

/* =========================
   LIGHTBOX
========================= */

lightboxClose.addEventListener("click", () => {
    lightbox.classList.remove("active");
});

lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) {
        lightbox.classList.remove("active");
    }
});

/* =========================
   CONTEXT MENU
========================= */

function initializeMenus() {

    document
        .querySelectorAll(".media-menu-btn")
        .forEach(btn => {

            btn.addEventListener("click", (e) => {

                e.stopPropagation();

                selectedMediaId =
                    btn.dataset.id;

                contextMenu.style.display = "block";

                contextMenu.style.left =
                    `${e.pageX}px`;

                contextMenu.style.top =
                    `${e.pageY}px`;
            });
        });
}

document.addEventListener("click", () => {
    contextMenu.style.display = "none";
});

const menuButtons =
    contextMenu.querySelectorAll("button");

menuButtons.forEach(button => {

    button.addEventListener("click", () => {

        const media = mediaFiles.find(
            item => item.id == selectedMediaId
        );

        if (!media) return;

        const action =
            button.textContent.trim().toLowerCase();

        if (action.includes("favorite")) {

            media.favorite =
                !media.favorite;

            renderGallery();

            showToast(
                media.favorite
                    ? "Added to favorites"
                    : "Removed from favorites"
            );
        }

        if (action.includes("delete")) {

            media.deleted = true;

            renderGallery();

            showToast("Moved to trash");
        }
    });
});

/* =========================
   TOAST
========================= */

function showToast(message) {

    const toast =
        document.createElement("div");

    toast.className = "toast";
    toast.textContent = message;

    toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}

/* =========================
   KEYBOARD
========================= */

document.addEventListener("keydown", (e) => {

    if (e.key === "Escape") {

        lightbox.classList.remove("active");
        contextMenu.style.display = "none";
    }
});

/* =========================
   START
========================= */

renderGallery();