import { maskToken } from "./settings";
import { i18n, Lang } from "./i18n";

const TOKEN_KEY = "shotsync_token";
const LANG_KEY = "shotsync_lang";

function buildHTML(demo: boolean, demoEn: boolean): string {
  const lang: Lang = demo && demoEn ? "en" : "zh";
  const CSS = `:root{color-scheme:dark}*{box-sizing:border-box}body{margin:0;background:#111;color:#eee;font:15px/1.4 -apple-system,system-ui,sans-serif}header{position:sticky;top:0;display:flex;align-items:center;gap:8px;padding:10px 14px;background:#181818;border-bottom:1px solid #2a2a2a;flex-wrap:wrap}header h1{font-size:16px;margin:0;flex:1;min-width:60px}button{background:#2b6cff;color:#fff;border:0;border-radius:8px;padding:8px 12px;font-size:14px;cursor:pointer}button:hover{opacity:.9}button:active{opacity:.8}#grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(110px,1fr));gap:6px;padding:6px}#grid img{width:100%;aspect-ratio:1;object-fit:cover;border-radius:6px;background:#222;cursor:pointer}#grid img:hover{opacity:.9}#gate{position:fixed;inset:0;display:flex;flex-direction:column;gap:12px;align-items:center;justify-content:center;background:#111;padding:24px}#gate input{padding:10px;border-radius:8px;border:1px solid #333;background:#1c1c1c;color:#eee;width:min(360px,90vw)}.hidden{display:none!important}#toast{position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:#333;padding:10px 16px;border-radius:20px;opacity:0;transition:opacity .2s;pointer-events:none}#toast.show{opacity:1}#grid .txtcell{width:100%;aspect-ratio:1;border-radius:6px;background:#1c2030;color:#cdd3e0;padding:8px;font-size:12px;line-height:1.35;overflow:hidden;cursor:pointer;white-space:pre-wrap;word-break:break-word;display:flex;align-items:flex-start}#viewerText{flex:1;min-height:0;overflow:auto;margin:0;padding:16px;white-space:pre-wrap;word-break:break-word;color:#eee;font:14px/1.6 ui-monospace,monospace}#compose{position:fixed;inset:0;z-index:11;background:rgba(0,0,0,.92);display:flex;flex-direction:column;gap:10px;padding:12px}#compose textarea{flex:1;min-height:0;resize:none;padding:12px;border-radius:8px;border:1px solid #333;background:#1c1c1c;color:#eee;font-size:15px}#compose .row{display:flex;justify-content:flex-end;gap:10px}#settings{position:fixed;inset:0;z-index:11;background:rgba(0,0,0,.92);display:flex;align-items:center;justify-content:center;padding:16px}#settings .card{width:100%;max-width:420px;background:#181818;border:1px solid #2a2a2a;border-radius:12px;padding:16px;display:flex;flex-direction:column;gap:12px}#settings h2{font-size:16px;margin:0}#settings .kv{display:flex;flex-direction:column;gap:4px;font-size:13px;color:#aaa}#settings code{font:13px/1.4 ui-monospace,Menlo,monospace;color:#eee;word-break:break-all;background:#222;padding:8px;border-radius:8px;user-select:all}#settings .row{display:flex;justify-content:flex-end;gap:10px}#settings a{color:#2b6cff}#langBtn{font-size:13px;padding:6px 10px;background:#333}.view-btn{font-size:13px;padding:6px 8px;background:#444;border:none;color:#fff;border-radius:6px;cursor:pointer}.view-btn.active{background:#2b6cff}.view-btn:hover{opacity:.85}#grid.list-view{display:flex;flex-direction:column;gap:2px;padding:4px}#grid.list-view>*{width:100%;aspect-ratio:unset;border-radius:4px;background:#1c2030;padding:8px 10px;font-size:13px;line-height:1.4;color:#cdd3e0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;display:flex;align-items:center;gap:10px}#grid.list-view>img{display:none!important}#grid.list-view .list-file{flex:1;overflow:hidden;text-overflow:ellipsis}#grid.list-view .list-meta{color:#888;font-size:12px;white-space:nowrap}#grid.small-view{grid-template-columns:repeat(auto-fill,minmax(60px,1fr));gap:4px;padding:4px}#grid.small-view img{aspect-ratio:1;border-radius:4px}#grid.small-view .txtcell{aspect-ratio:1;font-size:10px;padding:4px}#grid .sel{outline:3px solid #2b6cff;outline-offset:-3px;opacity:.8}#viewer{position:fixed;inset:0;background:rgba(0,0,0,.95);display:flex;flex-direction:column;z-index:10}#viewerImg{flex:1;min-height:0;object-fit:contain;width:100%}#viewerPdf{flex:1;min-height:0}#viewerDoc{flex:1;min-height:0}#viewerVideo{flex:1;min-height:0;max-height:100%;object-fit:contain;width:100%}#filterBar{display:flex;gap:4px;align-items:center}#filterBar select{background:#333;color:#eee;border:1px solid #444;border-radius:6px;padding:6px 8px;font-size:13px;cursor:pointer}#filterBar select:focus{outline:none;border-color:#2b6cff}#sortHeader{display:flex;align-items:center;gap:4px;cursor:pointer;padding:6px 8px;background:#333;border:1px solid #444;border-radius:6px;font-size:13px;color:#eee;user-select:none}#sortHeader:hover{background:#444}#sortHeader.asc::after{content:" ▲"}#sortHeader.desc::after{content:" ▼"}#grid .videocell{position:relative;width:100%;aspect-ratio:1;border-radius:6px;background:#222;cursor:pointer;overflow:hidden}#grid .videocell img{width:100%;height:100%;object-fit:cover}#grid .videocell::after{content:"▶";position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font-size:24px;color:#fff;text-shadow:0 1px 4px rgba(0,0,0,.8)}#grid .videocell:hover::after{font-size:28px}#grid.small-view .videocell::after{font-size:16px}#grid.list-view .videocell::after{display:none}`;
  return /* html */ `<!doctype html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>shotsync</title>
<link rel="manifest" href="/manifest.webmanifest">
<meta name="version" content="v:AUTO">
<meta name="theme-color" content="#111111">
<style>${CSS}</style>
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='7' fill='%232b6cff'/%3E%3Cpath d='M9 20.5l5-9 4 6 2-3 3 6z' fill='%23fff'/%3E%3Ccircle cx='11.5' cy='11' r='2' fill='%23fff'/%3E%3C/svg%3E">
</head>
<body>
  <div id="gate" class="hidden">
    <div data-i18n="gate.title">${i18n[lang]["gate.title"]}</div>
    <input id="tokenInput" type="password" placeholder="${i18n[lang]["gate.placeholder"]}" autocomplete="off">
    <button id="tokenSave">${i18n[lang]["gate.enter"]}</button>
    <div id="gateErr" style="color:#ff6b6b"></div>
  </div>

  <header class="hidden" id="bar">
    <h1>shotsync</h1>
    <div id="filterBar">
      <select id="typeFilter" title="Filter">
        <option value="all">${i18n[lang]["filter.all"]}</option>
        <option value="image">${i18n[lang]["filter.image"]}</option>
        <option value="video">${i18n[lang]["filter.video"]}</option>
        <option value="text">${i18n[lang]["filter.text"]}</option>
        <option value="doc">${i18n[lang]["filter.doc"]}</option>
      </select>
      <div id="sortHeader" class="desc">${i18n[lang]["sort.time"]}</div>
    </div>
    <input id="fileInput" type="file" accept="image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx,.txt,.html,.css,.js,.json,.xml,.zip" multiple class="hidden">
    <button id="textBtn" style="background:#444" data-i18n="header.text">${i18n[lang]["header.text"]}</button>
    <button id="uploadBtn" data-i18n="header.upload">${i18n[lang]["header.upload"]}</button>
    <button id="selectBtn" style="background:#444" data-i18n="header.select">${i18n[lang]["header.select"]}</button>
    <button id="settingsBtn" style="background:#444" title="Settings" aria-label="Settings">⚙</button>
    <button id="langBtn">EN</button>
    <button id="viewSmall" class="view-btn active" title="${i18n[lang]["view.small"]}">▣</button>
    <button id="viewLarge" class="view-btn" title="${i18n[lang]["view.large"]}">⬛</button>
    <button id="viewList" class="view-btn" title="${i18n[lang]["view.list"]}">☰</button>
    <button id="delSelBtn" class="hidden" style="background:#d23">${i18n[lang]["header.deleteSel"]}</button>
    <button id="cancelSelBtn" class="hidden" style="background:#444" data-i18n="header.cancel">${i18n[lang]["header.cancel"]}</button>
  </header>
  <main id="grid"></main>
  <div id="toast"></div>

  <div id="compose" class="hidden">
    <textarea id="composeText" placeholder="${i18n[lang]["compose.placeholder"]}"></textarea>
    <div class="row">
      <button id="composeSend">${i18n[lang]["compose.send"]}</button>
      <button id="composeCancel" style="background:#444">${i18n[lang]["compose.cancel"]}</button>
    </div>
  </div>

  <div id="settings" class="hidden">
    <div class="card">
      <h2 data-i18n="settings.title">${i18n[lang]["settings.title"]}</h2>
      <div class="kv"><span data-i18n="settings.url">${i18n[lang]["settings.url"]}</span><code id="settingsUrl"></code></div>
      <div class="kv"><span data-i18n="settings.token">${i18n[lang]["settings.token"]}</span><code id="tokenValue"></code></div>
      <div class="kv"><span data-i18n="settings.version">${i18n[lang]["settings.version"]}</span><code id="versionValue">v:AUTO</code></div>
      <div class="kv"><span data-i18n="settings.apiDocs">${i18n[lang]["settings.apiDocs"]}</span><a id="apiFormatsLink" href="/api/formats" target="_blank">${i18n[lang]["settings.apiDocsLink"]}</a></div>
      <div class="row">
        <button id="tokenReveal" style="background:#444">${i18n[lang]["settings.reveal"]}</button>
        <button id="tokenCopy">${i18n[lang]["settings.copy"]}</button>
      </div>
      <div class="row" style="justify-content:space-between;margin-top:6px">
        <button id="logoutBtn" style="background:#d23">${i18n[lang]["settings.logout"]}</button>
        <button id="settingsClose" style="background:#444">${i18n[lang]["settings.close"]}</button>
      </div>
    </div>
  </div>

  <div id="viewer" class="hidden" style="position:fixed;inset:0;background:rgba(0,0,0,.95);display:flex;flex-direction:column;z-index:10">
    <div style="display:flex;justify-content:flex-end;gap:10px;padding:10px">
      <button id="shareBtn" style="background:#0a8a5f">${i18n[lang]["viewer.share"]}</button>
      <button id="saveBtn" style="background:#2b6cff">${i18n[lang]["viewer.save"]}</button>
      <button id="delBtn" style="background:#d23">${i18n[lang]["viewer.delete"]}</button>
      <button id="closeBtn" style="background:#444">${i18n[lang]["viewer.close"]}</button>
    </div>
    <img id="viewerImg" class="hidden" style="flex:1;min-height:0;object-fit:contain;width:100%">
    <pre id="viewerText" class="hidden"></pre>
    <video id="viewerVideo" class="hidden" controls playsinline style="flex:1;min-height:0;max-height:100%;object-fit:contain;width:100%"></video>
    <embed id="viewerPdf" class="hidden" type="application/pdf" style="flex:1;min-height:0;width:100%;border:none">
    <div id="viewerDoc" class="hidden" style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;color:#888;padding:20px;text-align:center">
      <span style="font-size:48px" id="docIcon"></span>
      <span id="docName" style="color:#eee;font-size:16px;word-break:break-all"></span>
      <span style="font-size:13px">${i18n[lang]["viewer.docNoPreview"]}</span>
      <button id="docDownload" style="background:#2b6cff;padding:10px 20px;border-radius:8px;border:none;color:#fff;cursor:pointer;font-size:14px">${i18n[lang]["viewer.download"]}</button>
    </div>
  </div>

<script>
const DEMO = ${demo};
const DEMO_EN = ${demoEn};
let lang = localStorage.getItem("${LANG_KEY}") || (navigator.language || "").toLowerCase().startsWith("zh") ? "zh" : "en";
if (lang !== "zh" && lang !== "en") lang = "en";
let token = localStorage.getItem("${TOKEN_KEY}") || "";

const $ = (s) => document.querySelector(s);
function toast(msg) { const t = $("#toast"); t.textContent = msg; t.classList.add("show"); setTimeout(() => t.classList.remove("show"), 1800); }
function authHeaders() { return { authorization: "Bearer " + token }; }

// i18n
const I18N = { zh: ${JSON.stringify(i18n.zh)}, en: ${JSON.stringify(i18n.en)} };
function T(key, vars) {
  let s = I18N[lang][key] || key;
  if (vars) for (const [k, v] of Object.entries(vars)) s = s.replace("{" + k + "}", String(v));
  return s;
}
function applyI18n() {
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (!key) return;
    if (el.hasAttribute("data-i18n-placeholder")) { (el).placeholder = T(key); }
    else if (el.tagName === "A") { el.textContent = T(key); }
    else if (el.childNodes.length === 0) { el.textContent = T(key); }
  });
  document.querySelectorAll("[data-i18n-title]").forEach((el) => {
    const key = el.getAttribute("data-i18n-title");
    if (key) el.setAttribute("title", T(key));
  });
  const btnMap = {
    "#tokenSave": "gate.enter", "#composeSend": "compose.send", "#composeCancel": "compose.cancel",
    "#tokenReveal": "settings.reveal", "#tokenCopy": "settings.copy", "#logoutBtn": "settings.logout",
    "#settingsClose": "settings.close", "#shareBtn": "viewer.share", "#saveBtn": "viewer.save",
    "#delBtn": "viewer.delete", "#closeBtn": "viewer.close", "#cancelSelBtn": "header.cancel",
  };
  for (const [sel, key] of Object.entries(btnMap)) { const el = document.querySelector(sel); if (el) el.textContent = T(key); }
  updateDelBtn();
  updateLangBtn();
}
function setLang(l) { lang = l; localStorage.setItem("${LANG_KEY}", l); applyI18n(); }
function updateDelBtn() {
  const btn = $("#delSelBtn");
  if (btn) btn.textContent = T("select.deleteCount", { n: selected.size });
}
function updateLangBtn() {
  const btn = $("#langBtn");
  if (btn) btn.textContent = lang === "zh" ? "EN" : "中文";
}

async function apiOk() {
  const res = await fetch("/api/list?limit=1", { headers: authHeaders() });
  return res.ok;
}

function showGate(err) { $("#gate").classList.remove("hidden"); $("#bar").classList.add("hidden"); if (err) $("#gateErr").textContent = err; }
function showApp() { $("#gate").classList.add("hidden"); $("#bar").classList.remove("hidden"); }

$("#tokenSave").onclick = async () => {
  token = $("#tokenInput").value.trim();
  if (!token) return;
  localStorage.setItem("${TOKEN_KEY}", token);
  if (await apiOk()) { showApp(); setupUpload(); await initFeed(); }
  else { localStorage.removeItem("${TOKEN_KEY}"); showGate(T("gate.invalid")); }
};

const maskToken = ${maskToken.toString()};
let tokenShown = false;
function renderToken() {
  $("#tokenValue").textContent = tokenShown ? token : maskToken(token);
  $("#tokenReveal").textContent = tokenShown ? T("settings.reveal") : T("settings.reveal");
}
function closeSettings() { tokenShown = false; $("#settings").classList.add("hidden"); }
$("#settingsBtn").onclick = () => {
  tokenShown = false;
  $("#settingsUrl").textContent = location.origin;
  renderToken();
  const ver = document.querySelector('meta[name="version"]');
  $("#versionValue").textContent = ver ? ver.content : "unknown";
  $("#settings").classList.remove("hidden");
};
$("#settingsClose").onclick = closeSettings;
$("#tokenReveal").onclick = () => { tokenShown = !tokenShown; renderToken(); };
$("#tokenCopy").onclick = async () => {
  try { await navigator.clipboard.writeText(token); toast(T("settings.copied")); }
  catch { prompt("Access token — select and copy:", token); }
};
$("#logoutBtn").onclick = () => {
  if (!confirm(T("settings.logoutConfirm"))) return;
  localStorage.removeItem("${TOKEN_KEY}");
  location.reload();
};
$("#langBtn").onclick = () => setLang(lang === "zh" ? "en" : "zh");
$("#viewSmall").onclick = () => setViewMode("small");
$("#viewLarge").onclick = () => setViewMode("large");
$("#viewList").onclick = () => setViewMode("list");

function setViewMode(mode) {
  viewMode = mode;
  localStorage.setItem("shotsync_view", mode);
  const grid = document.querySelector("#grid");
  grid.className = mode === "list" ? "list-view" : mode === "small" ? "small-view" : "";
  document.querySelectorAll(".view-btn").forEach((b) => b.classList.remove("active"));
  const btnMap = { small: "#viewSmall", large: "#viewLarge", list: "#viewList" };
  const btn = document.querySelector(btnMap[mode]);
  if (btn) btn.classList.add("active");
  // Rebuild all cells in new view mode
  grid.innerHTML = "";
  knownIds.clear();
  appendItems([...itemsById.values()], false);
}

// Full viewer
let currentId = null, currentRoomId = null, currentKind = "image", currentBlob = null, currentVideoUrl = null;

async function openFull(id, roomId) {
  currentId = id; currentRoomId = roomId;
  const v = $("#viewer"), img = $("#viewerImg"), txt = $("#viewerText"), vid = $("#viewerVideo"), pdf = $("#viewerPdf"), doc = $("#viewerDoc");
  img.removeAttribute("src"); img.classList.add("hidden");
  txt.textContent = ""; txt.classList.add("hidden");
  vid.removeAttribute("src"); vid.classList.add("hidden");
  pdf.removeAttribute("src"); pdf.classList.add("hidden");
  doc.classList.add("hidden");
  if (currentVideoUrl) { URL.revokeObjectURL(currentVideoUrl); currentVideoUrl = null; }
  v.classList.remove("hidden");
  const item = itemsById.get(id);
  const origName = item?.origName || id;
  try {
    const imgUrl = "/i/" + id + "?size=full" + (roomId ? "&room=" + encodeURIComponent(roomId) : "");
    const res = await fetch(imgUrl, { headers: authHeaders() });
    if (!res.ok) return;
    const ct = res.headers.get("content-type") || "";
    currentBlob = await res.blob();
    if (ct.indexOf("text/") === 0) {
      currentKind = "text";
      txt.textContent = await currentBlob.text(); txt.classList.remove("hidden");
      $("#saveBtn").textContent = T("viewer.copy");
    } else if (ct.indexOf("video/") === 0) {
      currentKind = "video";
      currentVideoUrl = URL.createObjectURL(currentBlob);
      vid.src = currentVideoUrl; vid.classList.remove("hidden");
      $("#saveBtn").textContent = T("viewer.save");
    } else if (ct.includes("pdf")) {
      currentKind = "pdf";
      const url = URL.createObjectURL(currentBlob);
      pdf.src = url; pdf.classList.remove("hidden");
      $("#saveBtn").textContent = T("viewer.save");
    } else if (ct.includes("word") || ct.includes("document") || ct.includes("sheet") || ct.includes("excel") || ct.includes("zip") || ct.includes("office") || ct === "application/octet-stream") {
      currentKind = "doc";
      const icon = getExtIcon(ct);
      const nameEl = $("#docName"); if (nameEl) nameEl.textContent = origName;
      const iconEl = $("#docIcon"); if (iconEl) iconEl.textContent = icon;
      doc.classList.remove("hidden");
      $("#saveBtn").textContent = T("viewer.download");
    } else {
      currentKind = "image";
      const url = URL.createObjectURL(currentBlob);
      img.addEventListener("load", () => URL.revokeObjectURL(url), { once: true });
      img.src = url; img.classList.remove("hidden");
      $("#saveBtn").textContent = T("viewer.save");
    }
  } catch {}
}

document.querySelector("#closeBtn").onclick = () => document.querySelector("#viewer").classList.add("hidden");

document.querySelector("#shareBtn").onclick = async () => {
  if (!currentId) return;
  try {
    const res = await fetch("/api/share/" + currentId + "?room=" + encodeURIComponent(currentRoomId), { method: "POST", headers: authHeaders() });
    if (!res.ok) { toast(T("viewer.shareFailed")); return; }
    const { url } = await res.json();
    try { await navigator.clipboard.writeText(url); toast(T("viewer.shareCopied")); }
    catch { prompt("Share link (7 days) — select and copy:", url); }
  } catch { toast(T("viewer.shareFailed")); }
};

document.querySelector("#saveBtn").onclick = async () => {
  if (!currentId) return;
  if (currentKind === "text") {
    try { await navigator.clipboard.writeText($("#viewerText").textContent); toast(T("viewer.copy")); }
    catch { toast(T("viewer.copyFailed")); }
    return;
  }
  const blob = currentBlob || await (await fetch("/i/" + currentId + "?size=full&room=" + encodeURIComponent(currentRoomId), { headers: authHeaders() })).blob();
  const item = itemsById.get(currentId);
  const origName = item?.origName || currentId;
  const ext = (blob.type.split("/")[1] || "bin").replace("jpeg", "jpg");
  const name = origName.includes(".") ? origName : currentId + "." + ext;
  const file = new File([blob], name, { type: blob.type });
  try {
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({ files: [file] });
      return;
    }
  } catch (e) {
    // canShare may lie on mobile; fall through to direct download
  }
  // Direct download via blob URL
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = name;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
};

document.querySelector("#docDownload")?.addEventListener("click", () => {
  document.querySelector("#saveBtn")?.click();
});

document.querySelector("#delBtn").onclick = async () => {
  if (!currentId || !confirm(T("viewer.deleteConfirm"))) return;
  const res = await fetch("/api/img/" + currentId + "?room=" + encodeURIComponent(currentRoomId), { method: "DELETE", headers: authHeaders() });
  if (res.ok) {
    const cell = document.querySelector('#grid [data-id="' + currentId + '"]');
    if (cell) cell.remove();
    knownIds.delete(currentId);
    document.querySelector("#viewer").classList.add("hidden");
    toast(T("viewer.deleted"));
  } else { toast(T("viewer.deleteFailed")); }
};

// Gallery feed
let cursor = null, loading = false, knownIds = new Set(), pollTimer = null;
let viewMode = localStorage.getItem("shotsync_view") || "small";
let itemsById = new Map();
let contentObserver;
let videoThumbs = new Set();
let currentFilter = localStorage.getItem("shotsync_filter") || "all";
let sortAsc = localStorage.getItem("shotsync_sort") === "asc";

// Multi-select
let selectMode = false; const selected = new Set();
function toggleSelect(el) {
  const id = el.dataset.id;
  if (selected.has(id)) { selected.delete(id); el.classList.remove("sel"); }
  else { selected.add(id); el.classList.add("sel"); }
  updateDelBtn();
}
function enterSelect() {
  selectMode = true; selected.clear();
  $("#selectBtn").classList.add("hidden"); $("#textBtn").classList.add("hidden"); $("#uploadBtn").classList.add("hidden");
  $("#delSelBtn").classList.remove("hidden"); $("#cancelSelBtn").classList.remove("hidden");
  updateDelBtn();
}
function exitSelect() {
  selectMode = false; selected.clear();
  document.querySelectorAll("#grid .sel").forEach((e) => e.classList.remove("sel"));
  $("#selectBtn").classList.remove("hidden"); $("#textBtn").classList.remove("hidden"); $("#uploadBtn").classList.remove("hidden");
  $("#delSelBtn").classList.add("hidden"); $("#cancelSelBtn").classList.add("hidden");
}
async function deleteSelected() {
  if (!selected.size) { exitSelect(); return; }
  if (!confirm(T("select.confirm", { n: selected.size }))) return;
  const ids = [...selected]; let ok = 0;
  await Promise.all(ids.map(async (id) => {
    try {
      const cell = document.querySelector('#grid [data-id="' + id + '"]');
      const roomId = cell ? cell.dataset.roomId : "";
      const res = await fetch("/api/img/" + id + "?room=" + encodeURIComponent(roomId), { method: "DELETE", headers: authHeaders() });
      if (res.ok) { ok++; if (cell) cell.remove(); knownIds.delete(id); }
    } catch {}
  }));
  exitSelect();
  toast(T("viewer.deleted") + " " + ok);
}

async function fetchPage(c) {
  const params = new URLSearchParams();
  if (c) params.set("cursor", c);
  params.set("limit", "40");
  params.set("type", currentFilter);
  // For time-based sorting: newest=oldest order (asc=false means newest first from R2)
  // Click toggles asc/desc. asc=true means oldest first, asc=false means newest first
  params.set("sort", sortAsc ? "oldest" : "newest");
  const res = await fetch("/api/list?" + params.toString(), { headers: authHeaders() });
  if (!res.ok) throw new Error("list failed");
  return res.json();
}

async function loadThumb(img) {
  const id = img.dataset.id, roomId = img.dataset.roomId;
  const url = "/i/" + id + "?size=thumb" + (roomId ? "&room=" + encodeURIComponent(roomId) : "");
  try {
    const res = await fetch(url, { headers: authHeaders() });
    if (!res.ok) return;
    const blobUrl = URL.createObjectURL(await res.blob());
    img.addEventListener("load", () => URL.revokeObjectURL(blobUrl), { once: true });
    img.src = blobUrl;
  } catch {}
}

async function loadVideoThumb(cell) {
  const id = cell.dataset.id, roomId = cell.dataset.roomId;
  // Try to get thumbnail from video at 1 second mark
  const url = "/i/" + id + "?size=thumb" + (roomId ? "&room=" + encodeURIComponent(roomId) : "");
  try {
    const res = await fetch(url, { headers: authHeaders() });
    if (!res.ok) return;
    const blobUrl = URL.createObjectURL(await res.blob());
    const img = cell.querySelector("img");
    if (img) {
      img.addEventListener("load", () => URL.revokeObjectURL(blobUrl), { once: true });
      img.src = blobUrl;
    }
  } catch {}
  videoThumbs.delete(cell);
}

async function loadTextSnippet(card) {
  const roomId = card.dataset.roomId;
  const url = "/i/" + card.dataset.id + (roomId ? "?room=" + encodeURIComponent(roomId) : "");
  try {
    const res = await fetch(url, { headers: authHeaders() });
    if (!res.ok) return;
    card.textContent = (await res.text()).slice(0, 140);
  } catch {}
}

function makeCell(item) {
  const ct = item.contentType || "";
  const isText = ct.indexOf("text/") === 0;
  const isImage = ct.startsWith("image/");
  const isVideo = ct.startsWith("video/");
  const isList = viewMode === "list";

  let cell;
  if (isList) {
    cell = document.createElement("div");
    cell.style.cssText = "display:flex;align-items:center;gap:10px;flex:1;overflow:hidden;cursor:pointer";
    if (!isImage && !isVideo) {
      const icon = document.createElement("span");
      icon.textContent = getExtIcon(ct);
      icon.style.cssText = "font-size:16px;flex-shrink:0";
      cell.appendChild(icon);
    }
    const label = document.createElement("span");
    label.className = "list-file";
    label.textContent = item.origName || (isText ? (item.snippet || "…").slice(0, 40) : item.id);
    label.style.cssText = "flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap";
    cell.appendChild(label);
    const meta = document.createElement("span");
    meta.className = "list-meta";
    meta.textContent = formatTime(item.time);
    meta.style.cssText = "flex-shrink:0";
    cell.appendChild(meta);
    // For images/videos, show thumb inline
    if (isImage || isVideo) {
      const thumb = document.createElement(isImage ? "img" : "div");
      thumb.style.cssText = "width:36px;height:36px;object-fit:cover;border-radius:4px;flex-shrink:0";
      thumb.dataset.id = item.id; thumb.dataset.roomId = item.roomId || "";
      thumb.dataset.kind = isVideo ? "video" : "image";
      if (isVideo) { thumb.className = "videocell"; thumb.style.cssText = "width:36px;height:36px;border-radius:4px;flex-shrink:0;cursor:pointer;position:relative;background:#222;display:flex;align-items:center;justify-content:center"; }
      thumb.onclick = () => { if (selectMode) toggleSelect(thumb); else openFull(item.id, item.roomId); };
      cell.insertBefore(thumb, cell.firstChild);
      if (isImage) contentObserver.observe(thumb);
      else if (isVideo) videoThumbs.add(thumb);
    }
  } else {
    if (isVideo) {
      cell = document.createElement("div");
      cell.className = "videocell";
      cell.dataset.id = item.id; cell.dataset.roomId = item.roomId || ""; cell.dataset.kind = "video";
      const thumb = document.createElement("img");
      thumb.style.cssText = "width:100%;height:100%;object-fit:cover;position:absolute;top:0;left:0";
      cell.appendChild(thumb);
      videoThumbs.add(cell);
    } else {
      const el = document.createElement(isText ? "div" : "img");
      el.dataset.id = item.id; el.dataset.roomId = item.roomId || "";
      el.dataset.kind = isText ? "text" : "image";
      if (isText) { el.className = "txtcell"; el.textContent = item.snippet || "…"; }
      if (!(isText && item.snippet)) contentObserver.observe(el);
      cell = el;
    }
  }
  cell.dataset.id = item.id; cell.dataset.roomId = item.roomId || ""; cell.dataset.kind = isVideo ? "video" : (isText ? "text" : "image");
  cell.onclick = () => { if (selectMode) toggleSelect(cell); else openFull(item.id, item.roomId); };
  return cell;
}

function formatTime(ts) {
  const d = new Date(ts);
  const now = new Date();
  const isToday = d.toDateString() === now.toDateString();
  const mm = String(d.getMonth()+1).padStart(2,"0");
  const dd = String(d.getDate()).padStart(2,"0");
  const hh = String(d.getHours()).padStart(2,"0");
  const mi = String(d.getMinutes()).padStart(2,"0");
  return isToday ? hh+":"+mi : mm+"-"+dd+" "+hh+":"+mi;
}

function getExtIcon(contentType) {
  if (contentType.includes("video")) return "🎬";
  if (contentType.includes("pdf")) return "📕";
  if (contentType.includes("word") || contentType.includes("document")) return "📝";
  if (contentType.includes("sheet") || contentType.includes("excel")) return "📊";
  if (contentType.includes("zip") || contentType.includes("archive")) return "📦";
  if (contentType.includes("html") || contentType.includes("css") || contentType.includes("javascript")) return "💻";
  if (contentType.includes("text/") || contentType.includes("json") || contentType.includes("xml")) return "📃";
  return "📁";
}

function appendItems(items, prepend) {
  const grid = document.querySelector("#grid");
  for (const it of items) {
    if (knownIds.has(it.id)) continue;
    knownIds.add(it.id);
    itemsById.set(it.id, it);
    const cell = makeCell(it);
    if (prepend) grid.prepend(cell); else grid.append(cell);
  }
}

async function loadMore() {
  if (loading || cursor === false) return;
  loading = true;
  try {
    const { items, cursor: next } = await fetchPage(cursor);
    appendItems(items, false);
    cursor = next || false;
  } finally { loading = false; }
}

async function poll() {
  try {
    const { items } = await fetchPage(null);
    appendItems(items.filter((i) => !knownIds.has(i.id)).reverse(), true);
  } catch {}
}

async function initFeed() {
  contentObserver = new IntersectionObserver((entries) => {
    for (const e of entries) if (e.isIntersecting) {
      if (e.target.dataset.kind === "text") loadTextSnippet(e.target);
      else if (e.target.dataset.kind === "video") {
        loadVideoThumb(e.target);
        contentObserver.unobserve(e.target);
      } else loadThumb(e.target);
      contentObserver.unobserve(e.target);
    }
  }, { rootMargin: "200px" });

  cursor = null; knownIds = new Set(); itemsById = new Map(); videoThumbs = new Set();
  const grid = document.querySelector("#grid");
  grid.className = viewMode === "list" ? "list-view" : viewMode === "small" ? "small-view" : "";
  document.querySelector("#grid").innerHTML = "";
  await loadMore();

  window.onscroll = () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 400) loadMore();
  };
  if (pollTimer) clearInterval(pollTimer);
  pollTimer = setInterval(poll, 20000);

  // Setup filter/sort
  $("#typeFilter").value = currentFilter;
  // Update sort header appearance
  const sortHeader = $("#sortHeader");
  sortHeader.className = sortAsc ? "asc" : "desc";
  $("#typeFilter").onchange = () => {
    currentFilter = $("#typeFilter").value;
    localStorage.setItem("shotsync_filter", currentFilter);
    initFeed();
  };
  sortHeader.onclick = () => {
    sortAsc = !sortAsc;
    localStorage.setItem("shotsync_sort", sortAsc ? "asc" : "desc");
    sortHeader.className = sortAsc ? "asc" : "desc";
    initFeed();
  };
}

function fitDims(w, h, maxEdge) {
  const longEdge = Math.max(w, h);
  if (longEdge <= maxEdge) return { w, h };
  const s = maxEdge / longEdge;
  return { w: Math.round(w * s), h: Math.round(h * s) };
}

async function encode(bitmap, maxEdge, type, quality) {
  const { w, h } = maxEdge ? fitDims(bitmap.width, bitmap.height, maxEdge) : { w: bitmap.width, h: bitmap.height };
  const canvas = document.createElement("canvas");
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("canvas 2d context unavailable");
  ctx.drawImage(bitmap, 0, 0, w, h);
  return new Promise((resolve) => canvas.toBlob(resolve, type, quality));
}

async function uploadOne(file) {
  const fd = new FormData();
  if (file.type.startsWith("image/") && !file.type.includes("svg")) {
    const bitmap = await createImageBitmap(file);
    let full, thumb;
    try { full = await encode(bitmap, null, "image/jpeg", 0.92); thumb = await encode(bitmap, 480, "image/jpeg", 0.7); }
    finally { bitmap.close(); }
    fd.set("full", full, "u.jpg"); fd.set("thumb", thumb, "t.jpg");
  } else if (file.type.startsWith("video/")) {
    // For videos, upload as-is and generate a thumbnail server-side is complex
    // We upload the video and create a placeholder thumb (black image)
    fd.set("full", file, file.name);
    fd.set("thumb", new Blob(), "empty");
  } else {
    fd.set("full", file, file.name);
    fd.set("thumb", new Blob(), "empty");
  }
  const res = await fetch("/api/upload", { method: "POST", headers: { ...authHeaders(), "x-source": "pwa" }, body: fd });
  if (!res.ok) throw new Error("upload failed");
  return (await res.json()).id;
}

async function sendText(text) {
  if (!text.trim()) return false;
  const fd = new FormData();
  fd.set("full", new Blob([text], { type: "text/plain" }), "note.txt");
  const res = await fetch("/api/upload", { method: "POST", headers: { ...authHeaders(), "x-source": "pwa" }, body: fd });
  if (!res.ok) { toast(T("text.sendFailed")); return false; }
  return true;
}

function setupUpload() {
  const input = $("#fileInput");
  $("#uploadBtn").onclick = () => input.click();
  input.onchange = async () => {
    const files = [...input.files]; input.value = ""; let ok = 0;
    for (const f of files) { try { await uploadOne(f); ok++; } catch { toast(T("upload.failed")); } }
    toast(ok === files.length ? T("upload.success") : T("upload.partial", { ok, total: files.length }));
    await poll();
  };

  const compose = $("#compose"), composeText = $("#composeText");
  $("#textBtn").onclick = () => { composeText.value = ""; compose.classList.remove("hidden"); composeText.focus(); };
  $("#composeCancel").onclick = () => compose.classList.add("hidden");
  $("#composeSend").onclick = async () => {
    if (await sendText(composeText.value)) { compose.classList.add("hidden"); toast(T("text.sent")); await poll(); }
  };

  $("#selectBtn").onclick = enterSelect;
  $("#cancelSelBtn").onclick = exitSelect;
  $("#delSelBtn").onclick = deleteSelected;
}

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/sw.js").catch(() => {});
}

// Read-only demo
async function enterDemo() {
  showApp();
  ["#uploadBtn", "#textBtn", "#selectBtn", "#settingsBtn", "#shareBtn", "#delBtn", "#langBtn"].forEach((s) => $(s).classList.add("hidden"));
  if (DEMO_EN) { lang = "en"; document.documentElement.lang = "en"; }
  applyI18n();
  $("#bar h1").textContent = lang === "zh" ? "shotsync · 只读演示池" : "shotsync · read-only demo";
  const link = document.createElement("a");
  link.href = "https://github.com/plutolujh/shotsync"; link.target = "_blank"; link.rel = "noreferrer";
  link.textContent = lang === "zh" ? "5 分钟部署自己的 →" : "Deploy your own in ~5 min →";
  link.style.cssText = "color:#8ab4ff;font-size:13px;text-decoration:none;white-space:nowrap";
  $("#bar").appendChild(link);
  await initFeed();
}

(async function boot() {
  if (DEMO) { await enterDemo(); return; }
  applyI18n();
  if (token && await apiOk()) { showApp(); setupUpload(); await initFeed(); }
  else { showGate(); }
})();
</script>
</body>
</html>`;
}

export const galleryHTML = buildHTML(false, false);
export const galleryDemoHTML = buildHTML(true, true);
