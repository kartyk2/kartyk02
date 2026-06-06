# Personal Knowledge Hub

A personal digital workspace built with React + Vite for learning, building, and organizing knowledge.

## Pages

### Home
Landing page and navigation hub.

- Overview of the system
- Quick access to all sections

### Revision Mapper
Spaced repetition and knowledge tracking.

- Track concepts and topics
- Schedule reviews (7d, 30d, 45d, etc.)
- Monitor revision progress
- Maintain long-term retention

Examples:
- Dynamic Programming
- Rust Ownership
- QRDA Parsing
- LoRA Fine-Tuning

### Projects
Portfolio and project tracker.

- Active projects
- Experiments and ideas
- Technology tags
- Project links and status

Statuses:
- Active
- Shipped
- Paused
- Idea

### Media & Docs
Personal resource library.

- PDFs
- Images
- Videos
- Links

Used for storing documentation, notes, references, tutorials, and research materials.

## Stack

- React
- Vite
- React Router
- Cloudflare Pages

## Purpose

A single place to manage:

- Learning
- Revision
- Projects
- Documentation
- Reference material


create table study_sessions (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  notes text,
  duration integer,
  study_date date not null,
  created_at timestamptz default now()
);

create table session_tags (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references study_sessions(id),
  tag text not null
);

create table revisions (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references study_sessions(id),
  interval_days integer not null,
  due_date date not null,
  completed boolean default false
);

P0u2CeO8QbyiBRTO