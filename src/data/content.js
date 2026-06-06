// src/data/content.js

export const PDFS = [
  {
    id: "rust-book",
    title: "Rust Book",
    src: "/pdfs/rust-book.pdf",
    description: "Core Rust reference and notes."
  },
  {
    id: "system-design",
    title: "System Design Notes",
    src: "/pdfs/system-design.pdf",
    description: "Distributed systems concepts."
  }
];

export const IMAGES = [
  {
    id: "architecture",
    src: "/images/architecture.png",
    caption: "Node architecture diagram"
  }
];

export const VIDEOS = [
  {
    id: "rust",
    title: "Rust Ownership Explained",
    youtubeId: "VFIOSWy93H0",
    desc: "Great ownership walkthrough."
  }
];

export const LINKS = [
  {
    id: "rust-docs",
    title: "Rust Documentation",
    url: "https://doc.rust-lang.org",
    desc: "Official Rust docs",
    tag: "reference"
  },
  {
    id: "leetcode",
    title: "LeetCode",
    url: "https://leetcode.com",
    desc: "DSA practice platform",
    tag: "learning"
  },
  {
    id: "cloudflare",
    title: "Cloudflare Docs",
    url: "https://developers.cloudflare.com",
    desc: "Workers, Pages and platform docs",
    tag: "tool"
  }
];

export const STATUS_STYLE = {
  active: { label: "Active" },
  shipped: { label: "Shipped" },
  paused: { label: "Paused" },
  idea: { label: "Idea" }
};

export const PROJECTS = [
  {
    id: "revision-mapper",
    title: "Revision Mapper",
    status: "active",
    desc: "Spaced repetition dashboard for long-term learning.",
    tags: ["React", "Vite", "Cloudflare"],
    link: ""
  }
];