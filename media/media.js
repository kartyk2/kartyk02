let mediaData = {};

async function loadMedia() {

    const response = await fetch("./media.json");

    mediaData = await response.json();

    renderImages();
    renderPages();
    renderVideos();
    renderPDFs();
    renderLinks();
}

function renderImages() {

    document.getElementById("panel-images").innerHTML = `
        <div class="divider">
            <div class="divider-label">Gallery</div>
            <div class="divider-line"></div>
        </div>

        <div class="img-gallery">

            ${mediaData.images.map(item => `
                <div class="img-item">
                    <img
                        src="../assets/images/${item.file}"
                        alt="${item.caption}"
                        loading="lazy"
                    >

                    <div class="img-item-cap">
                        ${item.caption}
                    </div>
                </div>
            `).join("")}

        </div>
    `;
}


function renderVideos() {

    document.getElementById("panel-videos").innerHTML = `
        <div class="divider">
            <div class="divider-label">Videos</div>
            <div class="divider-line"></div>
        </div>

        <div class="yt-grid">

            ${mediaData.videos.map(item => `
                <div class="yt-embed">

                    <iframe
                        src="https://www.youtube.com/embed/${item.youtubeId}"
                        allowfullscreen
                        loading="lazy">
                    </iframe>

                    <div class="yt-cap">
                        ${item.caption}
                    </div>

                </div>
            `).join("")}

        </div>
    `;
}

function renderFileCatalog(panelId, title, items, folder, icon) {

    document.getElementById(panelId).innerHTML = `
        <div class="divider">
            <div class="divider-label">${title}</div>
            <div class="divider-line"></div>
        </div>

        <div class="grid-2">

            ${items.map(item => `
                <a
                    class="card"
                    href="../assets/${folder}/${item.file}"
                    target="_blank"
                >
                    <div class="card-icon">${icon}</div>

                    <div class="card-title">
                        ${item.title}
                    </div>

                    <div class="card-desc">
                        ${item.description || ""}
                    </div>

                    <div class="card-meta">
                        ${item.file}
                    </div>
                </a>
            `).join("")}

        </div>
    `;
}


function renderPages() {
    renderFileCatalog(
        "panel-pages",
        "Pages",
        mediaData.pages,
        "pages",
        "📄"
    );
}

function renderPDFs() {
    renderFileCatalog(
        "panel-pdfs",
        "PDF Library",
        mediaData.pdfs,
        "pdfs",
        "📕"
    );
}

function renderLinks() {

    document.getElementById("panel-links").innerHTML = `
        <div class="divider">
            <div class="divider-label">Bookmarks</div>
            <div class="divider-line"></div>
        </div>

        <div class="link-list">

            ${mediaData.links.map(item => `

                <div class="link-card">

                    <a href="${item.url}"
                       target="_blank"
                       rel="noopener">

                        ${item.title}

                    </a>

                    <div class="link-url">
                        ${item.url}
                    </div>

                    <div class="link-note">
                        ${item.description}
                    </div>

                    <div class="tag-row">
                        ${item.tags.map(tag =>
                            `<span class="tag">${tag}</span>`
                        ).join("")}
                    </div>

                </div>

            `).join("")}

        </div>
    `;
}

function setupTabs() {

    const tabs = document.querySelectorAll(".tab-btn");

    tabs.forEach(tab => {

        tab.addEventListener("click", () => {

            document
                .querySelectorAll(".tab-btn")
                .forEach(btn => btn.classList.remove("active"));

            document
                .querySelectorAll(".tab-panel")
                .forEach(panel => panel.classList.remove("active"));

            tab.classList.add("active");

            document
                .getElementById(`panel-${tab.dataset.tab}`)
                .classList.add("active");
        });
    });
}

window.addEventListener("DOMContentLoaded", async () => {

    setupTabs();

    await loadMedia();
});