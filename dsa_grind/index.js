// ============================================================
//  SUPABASE CONFIG  ← only place you need to edit
// ============================================================
const SB_URL = "https://srzrtmazxwcvpcfzqjpy.supabase.co";
const SB_ANON = "sb_publishable__8sfKhg2n9ZVL5s1eXCXlw_mEhjKie3";

// ============================================================
//  SUPABASE REST HELPERS
// ============================================================
const sbHeaders = {
  "Content-Type": "application/json",
  "apikey": SB_ANON,
  "Authorization": `Bearer ${SB_ANON}`,
};

// GET  /rest/v1/<table>?<qs>
async function sbGet(table, qs = "") {
  const res = await fetch(`${SB_URL}/rest/v1/${table}?${qs}`, { headers: sbHeaders });
  if (!res.ok) throw new Error(`sbGet ${table}: ${res.status} ${await res.text()}`);
  return res.json();
}

// POST /rest/v1/<table>   — returns inserted row(s) via Prefer: return=representation
async function sbPost(table, body) {
  const res = await fetch(`${SB_URL}/rest/v1/${table}`, {
    method: "POST",
    headers: { ...sbHeaders, "Prefer": "return=representation" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`sbPost ${table}: ${res.status} ${await res.text()}`);
  return res.json();        // array
}

// PATCH /rest/v1/<table>?<qs>
async function sbPatch(table, qs, body) {
  const res = await fetch(`${SB_URL}/rest/v1/${table}?${qs}`, {
    method: "PATCH",
    headers: { ...sbHeaders, "Prefer": "return=representation" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`sbPatch ${table}: ${res.status} ${await res.text()}`);
  return res.json();
}

// DELETE /rest/v1/<table>?<qs>
async function sbDelete(table, qs) {
  const res = await fetch(`${SB_URL}/rest/v1/${table}?${qs}`, {
    method: "DELETE",
    headers: sbHeaders,
  });
  if (!res.ok) throw new Error(`sbDelete ${table}: ${res.status} ${await res.text()}`);
}

// ============================================================
//  STATE
// ============================================================
let allSessions = [];   // [{id, topic, notes, duration, date, revisions:[…]}]
let calYear, calMonth;
let calSelectedDate = null; // date string YYYY-MM-DD | null
let rescheduleTarget = null; // { revisionId, topic }

// ============================================================
//  INIT
// ============================================================
document.addEventListener("DOMContentLoaded", async () => {
  const today = new Date();
  document.getElementById("today-date").textContent =
    today.toLocaleDateString("en-IN", { weekday: "short", year: "numeric", month: "short", day: "numeric" });
  document.getElementById("date-input").value = toDateStr(today);

  calYear = today.getFullYear();
  calMonth = today.getMonth();

  wireChips();
  wireLogBtn();
  wireCalNav();
  wireSearch();
  wireModal();

  await loadAll();
});

// ============================================================
//  LOAD ALL
//  Single join-style fetch: sessions + their revisions in 2 parallel calls
// ============================================================
async function loadAll() {
  const dot = document.getElementById("conn-dot");
  try {
    // Fetch sessions ordered newest first
    const sessions = await sbGet(
      "sessions",
      "select=id,topic,notes,duration,date,created_at&order=date.desc,created_at.desc"
    );

    // Fetch ALL revisions in one call (more efficient than per-session)
    const revisions = await sbGet(
      "revisions",
      "select=id,session_id,interval_days,due_date,done&order=interval_days.asc"
    );

    // Join client-side: attach revisions to their sessions
    const revMap = {};
    revisions.forEach(r => {
      if (!revMap[r.session_id]) revMap[r.session_id] = [];
      revMap[r.session_id].push(r);
    });

    allSessions = sessions.map(s => ({
      ...s,
      revisions: revMap[s.id] || [],
    }));

    dot.classList.remove("error");
    dot.classList.add("connected");
    renderAll();
  } catch (err) {
    dot.classList.add("error");
    dot.classList.remove("connected");
    console.error("Supabase load failed:", err);
    document.getElementById("notes-list").innerHTML =
      `<p class="empty-state" style="color:var(--danger)">⚠ Could not connect to Supabase.<br>Check SB_URL and SB_ANON in study-tracker.js</p>`;
  }
}

function renderAll() {
  renderRevisionsBanner();
  renderCalendar();
  renderNotes(filteredSessions());
}

// ============================================================
//  LOG STUDY SESSION
// ============================================================
function wireLogBtn() {
  document.getElementById("log-btn").addEventListener("click", async () => {
    const topic = document.getElementById("topic-input").value.trim();
    const notes = document.getElementById("notes-input").value.trim();
    const duration = parseInt(document.getElementById("duration-input").value) || null;
    const date = document.getElementById("date-input").value;
    const fb = document.getElementById("log-feedback");
    const loader = document.querySelector(".btn-loader");
    const btnText = document.querySelector(".btn-text");

    if (!topic) { showFeedback(fb, "Please enter a topic.", "err"); return; }
    if (!date) { showFeedback(fb, "Please pick a date.", "err"); return; }

    const activeIntervals = [...document.querySelectorAll(".chip.active")]
      .map(c => parseInt(c.dataset.day));
    if (!activeIntervals.length) {
      showFeedback(fb, "Select at least one revision interval.", "err"); return;
    }

    btnText.classList.add("hidden");
    loader.classList.remove("hidden");

    try {
      // 1. Insert session
      const [session] = await sbPost("sessions", { topic, notes, duration, date });

      // 2. Insert all revisions in one batch
      const revRows = activeIntervals.map(interval => {
        const due = new Date(date);
        due.setDate(due.getDate() + interval);
        return {
          session_id: session.id,
          interval_days: interval,
          due_date: toDateStr(due),
          done: false
        };
      });
      const savedRevs = await sbPost("revisions", revRows);

      // 3. Update local state immediately (no reload needed)
      allSessions.unshift({ ...session, revisions: savedRevs });

      showFeedback(fb, `✓ "${topic}" logged with ${activeIntervals.length} revision(s).`, "ok");
      document.getElementById("topic-input").value = "";
      document.getElementById("notes-input").value = "";
      document.getElementById("duration-input").value = "";
      renderAll();
    } catch (err) {
      showFeedback(fb, "Save failed — check console.", "err");
      console.error(err);
    }

    btnText.classList.remove("hidden");
    loader.classList.add("hidden");
  });
}

// ============================================================
//  CHIP TOGGLE
// ============================================================
function wireChips() {
  document.querySelectorAll(".chip").forEach(c =>
    c.addEventListener("click", () => c.classList.toggle("active"))
  );
}

// ============================================================
//  REVISIONS BANNER  (due today or overdue, not done)
// ============================================================
function renderRevisionsBanner() {
  const todayStr = toDateStr(new Date());
  const list = document.getElementById("revision-list");
  const badge = document.getElementById("revision-count");

  const due = [];
  allSessions.forEach(s =>
    (s.revisions || []).forEach(r => {
      if (!r.done && r.due_date <= todayStr) due.push({ s, r });
    })
  );

  badge.textContent = due.length;

  if (!due.length) {
    list.innerHTML = `<p class="empty-state">No revisions due today. Keep studying! 🎯</p>`;
    return;
  }

  list.innerHTML = due.map(({ s, r }) => {
    const overdue = r.due_date < todayStr;
    const label = overdue
      ? `${daysBetween(r.due_date, todayStr)}d overdue`
      : `Due today · every ${r.interval_days}d`;
    return `
    <div class="revision-item" data-rid="${r.id}">
      <div>
        <div class="rev-topic">${esc(s.topic)}</div>
        <div class="rev-meta">Studied ${formatDate(s.date)} · ${s.duration ? s.duration + " min" : "—"}</div>
      </div>
      <span class="rev-interval ${overdue ? "rev-overdue" : ""}">${label}</span>
      <button class="btn-icon done"       title="Mark done"        onclick="markDone('${r.id}')">✓</button>
      <button class="btn-icon reschedule" title="Reschedule"       onclick="openReschedule('${r.id}', '${esc(s.topic)}')">↻</button>
      <button class="btn-icon del"        title="Delete revision"  onclick="deleteRevision('${r.id}')">✕</button>
    </div>`;
  }).join("");
}

async function markDone(revId) {
  try {
    await sbPatch("revisions", `id=eq.${revId}`, { done: true });
    // update local state
    allSessions.forEach(s => {
      const r = (s.revisions || []).find(x => x.id === revId);
      if (r) r.done = true;
    });
    renderRevisionsBanner();
    renderNotes(filteredSessions());
  } catch (e) { console.error(e); }
}

async function deleteRevision(revId) {
  if (!confirm("Remove this revision slot?")) return;
  try {
    await sbDelete("revisions", `id=eq.${revId}`);
    allSessions.forEach(s => {
      s.revisions = (s.revisions || []).filter(x => x.id !== revId);
    });
    renderRevisionsBanner();
    renderNotes(filteredSessions());
  } catch (e) { console.error(e); }
}

function openReschedule(revId, topic) {
  rescheduleTarget = { revId };
  document.getElementById("modal-topic-name").textContent = `"${topic}"`;
  const future = new Date(); future.setDate(future.getDate() + 3);
  document.getElementById("modal-date").value = toDateStr(future);
  document.getElementById("modal-overlay").classList.remove("hidden");
}

function wireModal() {
  const overlay = document.getElementById("modal-overlay");
  document.getElementById("modal-cancel").addEventListener("click",
    () => overlay.classList.add("hidden"));
  overlay.addEventListener("click", e => {
    if (e.target === overlay) overlay.classList.add("hidden");
  });
  document.getElementById("modal-confirm").addEventListener("click", async () => {
    if (!rescheduleTarget) return;
    const newDate = document.getElementById("modal-date").value;
    if (!newDate) return;
    try {
      await sbPatch("revisions", `id=eq.${rescheduleTarget.revId}`, { due_date: newDate });
      allSessions.forEach(s => {
        const r = (s.revisions || []).find(x => x.id === rescheduleTarget.revId);
        if (r) r.due_date = newDate;
      });
      renderRevisionsBanner();
      renderNotes(filteredSessions());
    } catch (e) { console.error(e); }
    overlay.classList.add("hidden");
    rescheduleTarget = null;
  });
}

// ============================================================
//  CALENDAR  — heat-map + clickable dates
// ============================================================
function wireCalNav() {
  document.getElementById("cal-prev").addEventListener("click", () => {
    calMonth--; if (calMonth < 0) { calMonth = 11; calYear--; }
    renderCalendar();
  });
  document.getElementById("cal-next").addEventListener("click", () => {
    calMonth++; if (calMonth > 11) { calMonth = 0; calYear++; }
    renderCalendar();
  });
}

function renderCalendar() {
  const MONTHS = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
  document.getElementById("cal-month-label").textContent = `${MONTHS[calMonth]} ${calYear}`;

  // Build count map for this month
  const countMap = {};

  allSessions.forEach(session => {
    (session.revisions || []).forEach(rev => {
      if (!rev.done) {
        countMap[rev.due_date] =
          (countMap[rev.due_date] || 0) + 1;
      }
    });
  });

  const todayStr = toDateStr(new Date());
  const firstDay = new Date(calYear, calMonth, 1).getDay();
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const daysInPrev = new Date(calYear, calMonth, 0).getDate();

  const grid = document.getElementById("cal-grid");
  grid.innerHTML = "";

  // Prev-month padding (not clickable)
  for (let i = firstDay - 1; i >= 0; i--) {
    const el = document.createElement("div");
    el.className = "cal-day other-month";
    el.textContent = daysInPrev - i;
    grid.appendChild(el);
  }

  // Current-month days
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${calYear}-${String(calMonth + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    const count = countMap[dateStr] || 0;

    const el = document.createElement("div");
    let cls = "cal-day";
    if (dateStr === todayStr) cls += " today";
    if (dateStr === calSelectedDate) cls += " selected";
    if (count === 1) cls += " has-study-1";
    else if (count <= 3) cls += " has-study-2";
    else if (count >= 4) cls += " has-study-3";

    el.className = cls;
    el.textContent = d;
    if (count) el.title = `${count} session${count > 1 ? "s" : ""}`;

    el.className = cls;
    el.textContent = d;

    el.style.cursor = "pointer";
    el.addEventListener("click", () => onCalDayClick(dateStr));

    if (count) {
      el.title = `${count} session${count > 1 ? "s" : ""}`;
    } else {
      el.title = "No study sessions";
    }

    grid.appendChild(el);
  }

  // Next-month padding
  const remainder = (firstDay + daysInMonth) % 7;
  if (remainder !== 0) {
    for (let d = 1; d <= 7 - remainder; d++) {
      const el = document.createElement("div");
      el.className = "cal-day other-month";
      el.textContent = d;
      grid.appendChild(el);
    }
  }
}

// Click a calendar date → filter notes to that day (click again to clear)
function onCalDayClick(dateStr) {
  if (calSelectedDate === dateStr) {
    calSelectedDate = null;
  } else {
    calSelectedDate = dateStr;
  }

  renderCalendar();
  renderNotes(filteredSessions());

  let lbl = document.getElementById("cal-filter-label");

  if (!lbl) {
    lbl = document.createElement("div");
    lbl.id = "cal-filter-label";
    lbl.style.cssText =
      "font-size:.72rem;color:var(--accent2);margin-top:8px;text-align:center;";

    document.querySelector(".calendar-card").appendChild(lbl);
  }

  lbl.textContent = calSelectedDate
    ? `Showing entries for ${formatDate(calSelectedDate)}`
    : "";
}



// ============================================================
//  NOTES LIST
// ============================================================
function wireSearch() {
  document.getElementById("search-input").addEventListener("input", () => {
    calSelectedDate = null;      // clear calendar filter on text search
    renderCalendar();
    renderNotes(filteredSessions());
  });
}

function filteredSessions() {
  if (calSelectedDate) {

    return allSessions.filter(session =>
      (session.revisions || []).some(
        rev => rev.due_date === calSelectedDate
      )
    );
  }

  const q = document
    .getElementById("search-input")
    .value
    .trim()
    .toLowerCase();

  if (!q) return allSessions;

  return allSessions.filter(s =>
    s.topic.toLowerCase().includes(q) ||
    (s.notes || "").toLowerCase().includes(q)
  );
}


function renderNotes(sessions) {
  const list = document.getElementById("notes-list");

  if (!sessions.length) {
    list.innerHTML = `
      <p class="empty-state">
        ${calSelectedDate
        ? `No revisions due on ${formatDate(calSelectedDate)}.`
        : "No notes found."
      }
      </p>
    `;
    return;
  }

  let html = "";

  // Selected date header
  if (calSelectedDate) {
    html += `
      <div class="selected-day-header">
        <strong>${sessions.length}</strong>
        session${sessions.length !== 1 ? "s" : ""}
        with revisions due on ${formatDate(calSelectedDate)}
      </div>
    `;
  }

  html += sessions.map(s => {

    const revTags = (s.revisions || [])
      .filter(r => !calSelectedDate || r.due_date === calSelectedDate)
      .map(r => {

        const cls = r.done
          ? "interval-tag done-tag"
          : "interval-tag";

        const icon = r.done ? "✓ " : "";

        return `
          <span class="${cls}">
            ${icon}${r.interval_days}d · ${formatDate(r.due_date)}
          </span>
        `;
      })
      .join("");

    return `
      <div class="note-card">

        <div class="note-top">
          <div>
            <div class="note-topic">
              ${esc(s.topic)}
            </div>

            <div class="note-date">
              Studied ${formatDate(s.date)}
            </div>
          </div>

          <button
            class="note-delete"
            onclick="deleteSession('${s.id}')"
            title="Delete note"
          >
            🗑
          </button>
        </div>

        ${s.notes
        ? `<div class="note-notes">${esc(s.notes)}</div>`
        : ""
      }

        <div class="note-footer">
          ${revTags}

          ${s.duration
        ? `<span class="duration-tag">${s.duration} min</span>`
        : ""
      }
        </div>

      </div>
    `;
  }).join("");

  list.innerHTML = html;
}

async function deleteSession(sessionId) {
  if (!confirm("Delete this note and all its revisions?")) return;
  try {
    // CASCADE on DB handles revisions deletion automatically
    await sbDelete("sessions", `id=eq.${sessionId}`);
    allSessions = allSessions.filter(s => s.id !== sessionId);
    renderAll();
  } catch (e) { console.error(e); }
}

// ============================================================
//  UTILS
// ============================================================
function toDateStr(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function formatDate(str) {
  if (!str) return "—";
  const [y, m, day] = str.split("-");
  const M = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${parseInt(day)} ${M[parseInt(m) - 1]} ${y}`;
}

function daysBetween(pastStr, futureStr) {
  return Math.round((new Date(futureStr) - new Date(pastStr)) / 86400000);
}

function esc(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;")
    .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function showFeedback(el, msg, type) {
  el.textContent = msg;
  el.className = `feedback ${type}`;
  setTimeout(() => { el.textContent = ""; el.className = "feedback"; }, 4000);
}