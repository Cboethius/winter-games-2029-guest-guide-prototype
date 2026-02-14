function renderFatal(message, details = "") {
  const root = document.getElementById("app");
  if (!root) return;
  root.innerHTML = `
    <div class="wrap">
      <section class="hero" aria-label="Error">
        <h1>Prototype error</h1>
        <p class="hint">${escapeHtml(message)}</p>
        ${details ? `<pre class="callout" style="white-space:pre-wrap;">${escapeHtml(details)}</pre>` : ""}
        <p class="footerNote">
          Tip: open DevTools → Console/Network and check that <code>data.js</code> and <code>app.js</code> load (200 OK).
        </p>
      </section>
    </div>
  `;
}

// Basic safety net so we don't end up with a blank page.
window.addEventListener("error", (e) => {
  renderFatal("A script crashed while loading the prototype.", e?.error?.stack || String(e?.message || e));
});
window.addEventListener("unhandledrejection", (e) => {
  renderFatal("A promise was rejected while loading the prototype.", String(e?.reason || e));
});

// Data loading: prefer data.js, but keep a fallback so the UI always renders.
const fallbackData = {
  SOURCE: { website: "https://switzerland2029.ch/en/" },
  EVENT: {
    name: "Special Olympics World Winter Games 2029",
    dates: { display: "March 10–17, 2029" },
    note: "Prototype guide for guests/athletes: pick your location for a quick overview (schedule, map, activities, emergency).",
    context: ["Competitions are held in the canton of Graubünden."],
  },
  LOCATIONS: [
    { id: "arosa", name: "Arosa", region: "Graubünden", sports: ["Alpine skiing", "Snowboarding"], description: "Mountain resort host area.", map: { embedUrl: "about:blank", openUrl: "https://www.openstreetmap.org/" }, quick: { hotels: ["Hotel (placeholder)"], venues: ["Venue (placeholder)"] }, activities: { food: ["Restaurant (placeholder)"], thingsToDo: ["Activity (placeholder)"], services: ["Service (placeholder)"] } },
    { id: "chur", name: "Chur", region: "Graubünden", sports: ["Figure skating", "Short track", "Floorball"], description: "City hub host area.", map: { embedUrl: "about:blank", openUrl: "https://www.openstreetmap.org/" }, quick: { hotels: ["Hotel (placeholder)"], venues: ["Venue (placeholder)"] }, activities: { food: ["Restaurant (placeholder)"], thingsToDo: ["Activity (placeholder)"], services: ["Service (placeholder)"] } },
    { id: "lenzerheide", name: "Lenzerheide", region: "Graubünden", sports: ["Cross-country skiing", "Snowshoeing", "Dance"], description: "Mountain host area.", map: { embedUrl: "about:blank", openUrl: "https://www.openstreetmap.org/" }, quick: { hotels: ["Hotel (placeholder)"], venues: ["Venue (placeholder)"] }, activities: { food: ["Restaurant (placeholder)"], thingsToDo: ["Activity (placeholder)"], services: ["Service (placeholder)"] } },
  ],
  TABS: [
    { id: "overview", label: "Overview" },
    { id: "schedule", label: "Schedule" },
    { id: "map", label: "Map" },
    { id: "activities", label: "Activities" },
    { id: "emergency", label: "Emergency" },
  ],
  EMERGENCY_CONTACTS: [
    { label: "Emergency (EU)", number: "112", note: "Any emergency (if unsure, call this)." },
    { label: "Police", number: "117", note: "Police assistance." },
    { label: "Ambulance", number: "144", note: "Medical emergency." },
  ],
  SCHEDULE_DAYS: [{ date: "2029-03-10", label: "Sat, Mar 10", items: ["Opening day (placeholder)"] }],
};

const data = window.WS2029_DATA || fallbackData;
const { EMERGENCY_CONTACTS, EVENT, LOCATIONS, SOURCE, SCHEDULE_DAYS, TABS } = data;

const STORAGE_KEY = "ws2029.selectedLocationId";

function $(sel, root = document) {
  return root.querySelector(sel);
}

function escapeHtml(s) {
  const str = String(s);
  return str
    .split("&").join("&amp;")
    .split("<").join("&lt;")
    .split(">").join("&gt;")
    .split('"').join("&quot;")
    .split("'").join("&#039;");
}

function formatLocationName(id) {
  const loc = LOCATIONS.find((l) => l.id === id);
  return loc ? loc.name : "Unknown location";
}

function getStoredLocationId() {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (!v) return null;
    if (LOCATIONS.some((l) => l.id === v)) return v;
    return null;
  } catch {
    return null;
  }
}

function setStoredLocationId(id) {
  try {
    localStorage.setItem(STORAGE_KEY, id);
  } catch {
    // ignore
  }
}

function parseHash() {
  const raw = window.location.hash || "#/";
  const withoutHash = raw.startsWith("#") ? raw.slice(1) : raw;
  const [path, qs = ""] = withoutHash.split("?");
  const params = new URLSearchParams(qs);
  const query = {};
  for (const [k, v] of params.entries()) query[k] = v;
  return { path, query };
}

function navTo(path) {
  window.location.hash = path;
}

function icon(name) {
  // Tiny inline SVG icons, avoiding external dependencies.
  const common = 'width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false"';
  if (name === "pin") {
    return `<svg ${common}><path d="M12 21s7-4.35 7-11a7 7 0 1 0-14 0c0 6.65 7 11 7 11Z" stroke="currentColor" stroke-width="2"/><path d="M12 10.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" stroke="currentColor" stroke-width="2"/></svg>`;
  }
  if (name === "alert") {
    return `<svg ${common}><path d="M12 9v4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M12 17h.01" stroke="currentColor" stroke-width="3" stroke-linecap="round"/><path d="M10.3 4.4 3.1 18a2 2 0 0 0 1.8 3h14.2a2 2 0 0 0 1.8-3L13.7 4.4a2 2 0 0 0-3.4 0Z" stroke="currentColor" stroke-width="2"/></svg>`;
  }
  if (name === "clock") {
    return `<svg ${common}><path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z" stroke="currentColor" stroke-width="2"/><path d="M12 6v6l4 2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  }
  return "";
}

function renderTopbar({ selectedLocationId }) {
  const locationLabel = selectedLocationId ? ` • ${formatLocationName(selectedLocationId)}` : "";
  const subtitle = `${EVENT.dates.display} • Prototype`;

  return `
    <div class="topbar" role="banner" aria-label="Header">
      <div class="brand">
        <div class="brandLogo" aria-hidden="true">
          <img src="./assets/switzerland-2029-logo.svg" alt="" />
        </div>
        <div class="brandText">
          <div class="brandTitle">${escapeHtml(EVENT.name)}${escapeHtml(locationLabel)}</div>
          <div class="brandSubtitle">${escapeHtml(subtitle)}</div>
        </div>
      </div>

      <div class="actions" aria-label="Quick actions">
        <button class="btn btnDanger" type="button" data-action="emergency" aria-label="Emergency">
          ${icon("alert")} Emergency
        </button>
        <button class="btn" type="button" data-action="today" aria-label="Program (schedule)">
          ${icon("clock")} Program
        </button>
        <button class="btn" type="button" data-action="map" aria-label="Map">
          ${icon("pin")} Map
        </button>
      </div>
    </div>
  `;
}

function renderHome({ selectedLocationId, focus }) {
  const selectedHint = selectedLocationId
    ? `Last used: <strong>${escapeHtml(formatLocationName(selectedLocationId))}</strong>.`
    : "Choose your location to get a quick overview.";

  const cards = LOCATIONS.map((loc) => {
    return `
      <article class="card" aria-label="${escapeHtml(loc.name)} card">
        <div class="cardBody">
          <div class="cardTitle">
            <h2>${escapeHtml(loc.name)}</h2>
            <span class="badge">${escapeHtml(loc.region)}</span>
          </div>
          <ul class="list">
            ${loc.sports.map((s) => `<li>${escapeHtml(s)}</li>`).join("")}
          </ul>
          <p class="hint">${escapeHtml(loc.description)}</p>
          <div class="section">
            <button class="btn btnPrimary" type="button" data-pick-location="${escapeHtml(loc.id)}">
              Open ${escapeHtml(loc.name)} guide
            </button>
          </div>
        </div>
      </article>
    `;
  }).join("");

  const focusBlock = (() => {
    if (focus === "emergency") return renderEmergencyPanel({ compact: true });
    if (focus === "schedule")
      return `<div class="card"><div class="cardBody">${renderSchedulePanel({ compact: true })}</div></div>`;
    if (focus === "map")
      return `<div class="card"><div class="cardBody"><div class="callout">Pick a location to view a map for that area.</div></div></div>`;
    return "";
  })();

  return `
    <div class="wrap">
      ${renderTopbar({ selectedLocationId })}

      <section class="hero" aria-label="Welcome">
        <h1>Guest Guide Prototype</h1>
        <p>
          ${escapeHtml(EVENT.note)}
          <br />
          <strong>Dates:</strong> ${escapeHtml(EVENT.dates.display)}.
          <br />
          <span class="muted">${selectedHint}</span>
        </p>
        <ul class="list" aria-label="Key facts">
          ${EVENT.context.map((x) => `<li>${escapeHtml(x)}</li>`).join("")}
        </ul>
        <p class="footerNote">
          Source facts: <a href="${escapeHtml(SOURCE.website)}" target="_blank" rel="noreferrer">${escapeHtml(
            SOURCE.website
          )}</a>
        </p>
      </section>

      <section class="grid" aria-label="Locations">
        ${cards}
      </section>

      ${focusBlock ? `<section class="section" aria-label="Quick info">${focusBlock}</section>` : ""}
    </div>
  `;
}

function renderTabButtons({ selectedTabId }) {
  return `
    <div class="tabs" role="tablist" aria-label="Location sections">
      ${TABS.map((t) => {
        const selected = t.id === selectedTabId;
        return `
          <button
            class="tab"
            type="button"
            role="tab"
            id="tab-${escapeHtml(t.id)}"
            aria-controls="panel-${escapeHtml(t.id)}"
            aria-selected="${selected ? "true" : "false"}"
            tabindex="${selected ? "0" : "-1"}"
            data-tab="${escapeHtml(t.id)}"
          >
            ${escapeHtml(t.label)}
          </button>
        `;
      }).join("")}
    </div>
  `;
}

function renderOverviewPanel(loc) {
  return `
    <div class="twoCol">
      <div class="card">
        <div class="cardBody">
          <h2 style="margin:0 0 6px; letter-spacing:-0.02em;">${escapeHtml(loc.name)} overview</h2>
          <div class="callout">
            <strong>Sports in ${escapeHtml(loc.name)}:</strong> ${loc.sports.map(escapeHtml).join(", ")}.
            <div class="footerNote" style="margin-top:10px;">
              This mapping is taken from the official Switzerland 2029 site.
            </div>
          </div>

          <div class="kpi" aria-label="Quick info">
            <div class="kpiItem">
              <div class="kpiLabel">Region</div>
              <div class="kpiValue">${escapeHtml(loc.region)}</div>
            </div>
            <div class="kpiItem">
              <div class="kpiLabel">Event dates</div>
              <div class="kpiValue">${escapeHtml(EVENT.dates.display)}</div>
            </div>
          </div>

          <div class="section">
            <div class="card" style="box-shadow:none;">
              <div class="cardBody">
                <div class="cardTitle">
                  <h2 style="font-size:16px; margin:0;">Venues (placeholder)</h2>
                  <span class="badge">Prototype</span>
                </div>
                <ul class="list">
                  ${loc.quick.venues.map((v) => `<li>${escapeHtml(v)}</li>`).join("")}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <aside class="card" aria-label="Hotels">
        <div class="cardBody">
          <div class="cardTitle">
            <h2 style="font-size:16px; margin:0;">Hotels (placeholder)</h2>
            <span class="badge">Prototype</span>
          </div>
          <ul class="list">
            ${loc.quick.hotels.map((h) => `<li>${escapeHtml(h)}</li>`).join("")}
          </ul>
          <p class="footerNote">
            In the real version we’d load official partner hotels and accessibility notes per location.
          </p>
        </div>
      </aside>
    </div>
  `;
}

function renderSchedulePanel({ compact }) {
  const days = SCHEDULE_DAYS.map((d) => {
    return `
      <div class="day" data-day="${escapeHtml(d.date)}">
        <div class="dayHeader">
          <strong>${escapeHtml(d.label)}</strong>
          <span>${escapeHtml(d.date)}</span>
        </div>
        <ul>
          ${d.items.map((i) => `<li>${escapeHtml(i)}</li>`).join("")}
        </ul>
      </div>
    `;
  }).join("");

  const heading = compact
    ? `<div class="callout"><strong>Program (prototype)</strong><div class="footerNote">Anchored to ${escapeHtml(
        EVENT.dates.display
      )}. Items are placeholders for the meeting demo.</div></div>`
    : `<div class="callout"><strong>Program timeline</strong><div class="footerNote">Anchored to ${escapeHtml(
        EVENT.dates.display
      )}. Replace placeholders with the official competition schedule later.</div></div>`;

  return `
    ${heading}
    <div class="section">
      <div class="timeline" aria-label="Schedule days">
        ${days}
      </div>
    </div>
  `;
}

function renderMapPanel(loc) {
  return `
    <div class="card">
      <div class="cardBody">
        <div class="cardTitle">
          <h2 style="margin:0; font-size:16px;">Map — ${escapeHtml(loc.name)}</h2>
          <span class="badge">OpenStreetMap</span>
        </div>
        <p class="hint">
          Quick orientation map (prototype). In the real app we’d add accessible routes, venue pins, and shuttle stops.
        </p>
        <div class="mapFrame" aria-label="Map frame">
          <iframe
            title="Map of ${escapeHtml(loc.name)}"
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
            src="${escapeHtml(loc.map.embedUrl)}"
          ></iframe>
        </div>
        <div class="section">
          <a class="btn" href="${escapeHtml(loc.map.openUrl)}" target="_blank" rel="noreferrer">
            Open interactive map
          </a>
        </div>
      </div>
    </div>
  `;
}

function renderActivitiesPanel(loc) {
  const block = (title, items) => `
    <div class="card">
      <div class="cardBody">
        <div class="cardTitle">
          <h2 style="margin:0; font-size:16px;">${escapeHtml(title)}</h2>
          <span class="badge">Placeholder</span>
        </div>
        <ul class="list">
          ${items.map((x) => `<li>${escapeHtml(x)}</li>`).join("")}
        </ul>
      </div>
    </div>
  `;

  return `
    <div class="grid" style="grid-template-columns:1fr; margin-top:0;">
      ${block("Food & drinks", loc.activities.food)}
      ${block("Things to do", loc.activities.thingsToDo)}
      ${block("Services", loc.activities.services)}
    </div>
    <p class="footerNote">
      These lists are demo placeholders. For production we can pull curated local partners, filters, and accessibility tags.
    </p>
  `;
}

function renderEmergencyPanel({ compact }) {
  const rows = EMERGENCY_CONTACTS.map((c) => {
    const num = c.number.replaceAll(" ", "");
    const telHref = num.startsWith("+") || /^\d+$/.test(num) ? `tel:${num}` : null;
    return `
      <div class="kvRow" role="listitem">
        <div>
          <strong>${escapeHtml(c.label)}</strong>
          <div class="footerNote" style="margin:6px 0 0;">${escapeHtml(c.note)}</div>
        </div>
        <div style="text-align:right;">
          ${
            telHref
              ? `<a href="${escapeHtml(telHref)}" aria-label="Call ${escapeHtml(c.label)}">${escapeHtml(
                  c.number
                )}</a>`
              : `<strong>${escapeHtml(c.number)}</strong>`
          }
        </div>
      </div>
    `;
  }).join("");

  const intro = compact
    ? `<div class="callout"><strong>Emergency (quick access)</strong><div class="footerNote">Prototype numbers for Switzerland. Replace the help desk number with the real one.</div></div>`
    : `<div class="callout"><strong>Emergency</strong><div class="footerNote">If you’re unsure who to call, dial <strong>112</strong>.</div></div>`;

  return `
    ${intro}
    <div class="section">
      <div class="kv" role="list" aria-label="Emergency contacts">
        ${rows}
      </div>
      <p class="footerNote">
        This is a prototype. Always follow on-site staff instructions and official event communications.
      </p>
    </div>
  `;
}

function renderLocation({ locationId, tabId }) {
  const loc = LOCATIONS.find((l) => l.id === locationId);
  if (!loc) {
    return `
      <div class="wrap">
        ${renderTopbar({ selectedLocationId: null })}
        <section class="hero">
          <h1>Location not found</h1>
          <p class="hint">Please go back and choose one of the locations.</p>
          <div class="section">
            <button class="btn btnPrimary" type="button" data-action="goHome">Back to location picker</button>
          </div>
        </section>
      </div>
    `;
  }

  const selectedTab = TABS.some((t) => t.id === tabId) ? tabId : "overview";

  const mainPanel = (() => {
    if (selectedTab === "overview") return renderOverviewPanel(loc);
    if (selectedTab === "schedule") return `<div class="card"><div class="cardBody">${renderSchedulePanel({ compact: false })}</div></div>`;
    if (selectedTab === "map") return renderMapPanel(loc);
    if (selectedTab === "activities") return `<div class="card"><div class="cardBody">${renderActivitiesPanel(loc)}</div></div>`;
    if (selectedTab === "emergency") return `<div class="card"><div class="cardBody">${renderEmergencyPanel({ compact: false })}</div></div>`;
    return "";
  })();

  return `
    <div class="wrap">
      ${renderTopbar({ selectedLocationId: locationId })}

      <section class="hero" aria-label="Location header">
        <h1>${escapeHtml(loc.name)}</h1>
        <p>
          ${escapeHtml(loc.description)}
          <br />
          <strong>Sports here:</strong> ${loc.sports.map(escapeHtml).join(", ")}.
        </p>
        <div class="section">
          <button class="btn" type="button" data-action="changeLocation">Change location</button>
          <a class="btn" href="${escapeHtml(SOURCE.website)}" target="_blank" rel="noreferrer">Official site</a>
        </div>
      </section>

      <section class="section" aria-label="Tabs">
        ${renderTabButtons({ selectedTabId: selectedTab })}
      </section>

      <section class="section" aria-label="Content">
        <div
          id="panel-${escapeHtml(selectedTab)}"
          role="tabpanel"
          aria-labelledby="tab-${escapeHtml(selectedTab)}"
        >
          ${mainPanel}
        </div>
      </section>
    </div>
  `;
}

function wireEvents(root) {
  root.addEventListener("click", (e) => {
    const el = e.target instanceof Element ? e.target.closest("[data-action],[data-pick-location],[data-tab]") : null;
    if (!el) return;

    const action = el.getAttribute("data-action");
    const pick = el.getAttribute("data-pick-location");
    const tab = el.getAttribute("data-tab");

    if (pick) {
      setStoredLocationId(pick);
      navTo(`/location/${pick}?tab=overview`);
      return;
    }

    if (tab) {
      const { path, query } = parseHash();
      if (path.startsWith("/location/")) {
        const id = path.split("/")[2] || "";
        navTo(`/location/${id}?tab=${encodeURIComponent(tab)}`);
      }
      return;
    }

    if (action === "goHome" || action === "changeLocation") {
      navTo(`/`);
      return;
    }

    if (action === "emergency" || action === "today" || action === "map") {
      const selectedLocationId = getStoredLocationId();
      if (action === "emergency") {
        if (selectedLocationId) navTo(`/location/${selectedLocationId}?tab=emergency`);
        else navTo(`/?focus=emergency`);
      }
      if (action === "today") {
        if (selectedLocationId) navTo(`/location/${selectedLocationId}?tab=schedule`);
        else navTo(`/?focus=schedule`);
      }
      if (action === "map") {
        if (selectedLocationId) navTo(`/location/${selectedLocationId}?tab=map`);
        else navTo(`/?focus=map`);
      }
    }
  });

  const skipBtn = document.querySelector("[data-skip-to]");
  skipBtn?.addEventListener("click", () => {
    const targetId = skipBtn.getAttribute("data-skip-to");
    if (!targetId) return;
    const target = document.getElementById(targetId);
    target?.scrollIntoView({ block: "start" });
    target?.focus?.({ preventScroll: true });
  });

  root.addEventListener("keydown", (e) => {
    // Simple keyboard support for tabs: left/right to move focus.
    const active = document.activeElement;
    if (!(active instanceof HTMLElement)) return;
    if (!active.matches("[data-tab]")) return;
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;

    const tabs = Array.from(root.querySelectorAll("[data-tab]")).filter((x) => x instanceof HTMLButtonElement);
    const idx = tabs.indexOf(active);
    if (idx < 0) return;

    e.preventDefault();
    const nextIdx = e.key === "ArrowRight" ? (idx + 1) % tabs.length : (idx - 1 + tabs.length) % tabs.length;
    const next = tabs[nextIdx];
    next?.focus();
  });
}

function render() {
  const root = $("#app");
  if (!root) return;

  const selectedLocationId = getStoredLocationId();
  const { path, query } = parseHash();

  // Routes:
  // - /                home
  // - /location/:id    location dashboard
  if (path === "/" || path === "") {
    root.innerHTML = renderHome({ selectedLocationId, focus: query.focus || null });
    return;
  }

  if (path.startsWith("/location/")) {
    const id = path.split("/")[2] || "";
    setStoredLocationId(id);
    root.innerHTML = renderLocation({ locationId: id, tabId: query.tab || "overview" });
    return;
  }

  // Fallback
  root.innerHTML = renderHome({ selectedLocationId, focus: null });
}

function boot() {
  const root = $("#app");
  if (!root) return;
  wireEvents(root);
  window.addEventListener("hashchange", render);

  if (!window.location.hash) {
    window.location.hash = "#/";
  }
  render();
}

boot();

