# My Digital Space — Site README

A static personal site. No framework, no build step, no dependencies.
Deploy to Cloudflare Pages by pushing this folder to a GitHub repo and connecting it.

---

## Folder structure

```
site/
├── index.html              ← Landing page
├── style.css               ← Shared styles (edit here for theme changes)
├── README.md               ← This file
│
├── journals/
│   └── index.html          ← Journal entries (add new entries here)
│
├── projects/
│   └── index.html          ← Projects (add new cards here)
│
├── media/
│   └── index.html          ← Images, audio, YouTube, PDFs, links
│
└── assets/
    ├── images/             ← Put .jpg / .png files here
    ├── audio/              ← Put .mp3 files here
    └── pdfs/               ← Put .pdf files here
```

---

## How to add things

### New journal entry
Open `journals/index.html`. Copy this block and paste it above the last entry:

```html
<div class="entry fade-up" data-tags="learning work">
  <div class="entry-date">2025 · 06 · 15</div>
  <div class="entry-title">Your title here</div>
  <div class="entry-body">
    Your text here.
  </div>
  <div class="entry-tags">
    <span class="tag tag-accent">learning</span>
    <span class="tag tag-amber">work</span>
  </div>
</div>
```

`data-tags` controls the filter buttons. Use: `learning`, `reflection`, `health`, `work`, `ideas`.

### New project
Open `projects/index.html`. Copy a `.proj-card` block. Set `data-status` to:
`active` | `shipped` | `paused` | `idea`

### New image
Drop file into `assets/images/`. Copy an `.img-item` block in `media/index.html`
and update the `src` and caption.

### New audio file
Drop `.mp3` into `assets/audio/`. Copy an `.audio-row` block and update the `src`.

### New YouTube embed
In `media/index.html` → Videos tab. Copy a `.yt-embed` block.
Replace `VIDEO_ID` in the iframe src with the YouTube video ID.

### New PDF
Drop `.pdf` into `assets/pdfs/`. Copy an `.embed-box` block and update the `src`.

### New link / bookmark
In `media/index.html` → Links tab. Copy a `.link-card` block.

---

## Deploy to Cloudflare Pages

1. Push this folder to a GitHub (or GitLab) repo.
2. Go to Cloudflare Dashboard → Pages → Create a project.
3. Connect your repo. Build settings: **none** (no build command, no output directory).
4. Deploy. Cloudflare gives you a `*.pages.dev` URL instantly.
5. Add a custom domain in Pages → Custom Domains if you have one.

Every `git push` auto-deploys.

---

## Theme changes

All colors are CSS variables in `style.css` under `:root { ... }`.
Key ones:

| Variable    | What it controls        |
|-------------|-------------------------|
| `--accent`  | Purple highlight color  |
| `--bg`      | Page background         |
| `--surface` | Card backgrounds        |
| `--text`    | Main text color         |
| `--muted`   | Secondary text          |
