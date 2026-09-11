import { maskToken } from "./settings";
import { i18n, Lang } from "./i18n";

const TOKEN_KEY = "shotsync_token";
const LANG_KEY = "shotsync_lang";

// Apply translations to all [data-i18n] elements
function applyI18n(lang: Lang) {
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (!key) return;
    // Placeholder uses data-i18n-placeholder
    if (el.hasAttribute("data-i18n-placeholder")) {
      (el as HTMLInputElement).placeholder = t(key, lang);
    } else if (el.tagName === "A") {
      el.textContent = t(key, lang);
    } else {
      el.childNodes.length === 0 ? (el.textContent = t(key, lang)) : null;
    }
  });
  document.querySelectorAll("[data-i18n-title]").forEach((el) => {
    const key = el.getAttribute("data-i18n-title");
    if (key) el.setAttribute("title", t(key, lang));
  });
  // Button text nodes
  const btnMap: Record<string, string> = {
    "#tokenSave": "gate.enter",
    "#composeSend": "compose.send",
    "#composeCancel": "compose.cancel",
    "#tokenReveal": "settings.reveal",
    "#tokenCopy": "settings.copy",
    "#logoutBtn": "settings.logout",
    "#settingsClose": "settings.close",
    "#shareBtn": "viewer.share",
    "#saveBtn": "viewer.save",
    "#delBtn": "viewer.delete",
    "#closeBtn": "viewer.close",
    "#cancelSelBtn": "header.cancel",
  };
  for (const [sel, key] of Object.entries(btnMap)) {
    const el = document.querySelector(sel);
    if (el) el.textContent = t(key, lang);
  }
  // Select/delete button text (with dynamic count) is updated separately
}

function buildHTML(demo: boolean, demoEn: boolean): string {
  const lang: Lang = demo && demoEn ? "en" : "zh";
  const CSS = `:root{color-scheme:dark}*{box-sizing:border-box}body{margin:0;background:#111;color:#eee;font:15px/1.4 -apple-system,system-ui,sans-serif}header{position:sticky;top:0;display:flex;align-items:center;gap:12px;padding:10px 14px;background:#181818;border-bottom:1px solid #2a2a2a}header h1{font-size:16px;margin:0;flex:1}button{background:#2b6cff;color:#fff;border:0;border-radius:8px;padding:8px 12px;font-size:14px;cursor:pointer}button:hover{opacity:.9}button:active{opacity:.8}#grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(110px,1fr));gap:6px;padding:6px}#grid img{width:100%;aspect-ratio:1;object-fit:cover;border-radius:6px;background:#222;cursor:pointer}#grid img:hover{opacity:.9}#gate{position:fixed;inset:0;display:flex;flex-direction:column;gap:12px;align-items:center;justify-content:center;background:#111;padding:24px}#gate input{padding:10px;border-radius:8px;border:1px solid #333;background:#1c1c1c;color:#eee;width:min(360px,90vw)}.hidden{display:none!important}#toast{position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:#333;padding:10px 16px;border-radius:20px;opacity:0;transition:opacity .2s;pointer-events:none}#toast.show{opacity:1}#grid .txtcell{width:100%;aspect-ratio:1;border-radius:6px;background:#1c2030;color:#cdd3e0;padding:8px;font-size:12px;line-height:1.35;overflow:hidden;cursor:pointer;white-space:pre-wrap;word-break:break-word;display:flex;align-items:flex-start}#viewerText{flex:1;min-height:0;overflow:auto;margin:0;padding:16px;white-space:pre-wrap;word-break:break-word;color:#eee;font:14px/1.6 ui-monospace,monospace}#compose{position:fixed;inset:0;z-index:11;background:rgba(0,0,0,.92);display:flex;flex-direction:column;gap:10px;padding:12px}#compose textarea{flex:1;min-height:0;resize:none;padding:12px;border-radius:8px;border:1px solid #333;background:#1c1c1c;color:#eee;font-size:15px}#compose .row{display:flex;justify-content:flex-end;gap:10px}#settings{position:fixed;inset:0;z-index:11;background:rgba(0,0,0,.92);display:flex;align-items:center;justify-content:center;padding:16px}#settings .card{width:100%;max-width:420px;background:#181818;border:1px solid #2a2a2a;border-radius:12px;padding:16px;display:flex;flex-direction:column;gap:12px}#settings h2{font-size:16px;margin:0}#settings .kv{display:flex;flex-direction:column;gap:4px;font-size:13px;color:#aaa}#settings code{font:13px/1.4 ui-monospace,Menlo,monospace;color:#eee;word-break:break-all;background:#222;padding:8px;border-radius:8px;user-select:all}#settings .row{display:flex;justify-content:flex-end;gap:10px}#settings a{color:#2b6cff}#langBtn{font-size:13px;padding:6px 10px;background:#333}#grid .sel{outline:3px solid #2b6cff;outline-offset:-3px;opacity:.8}#viewer{position:fixed;inset:0;background:rgba(0,0,0,.95);display:flex;flex-direction:column;z-index:10}#viewerImg{flex:1;min-height:0;object-fit:contain;width:100%}`;
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
    <div data-i18n="gate.title">${t("gate.title", lang)}</div>
    <input id="tokenInput" type="password" placeholder="${t("gate.placeholder", lang)}" autocomplete="off">
    <button id="tokenSave">${t("gate.enter", lang)}</button>
    <div id="gateErr" style="color:#ff6b6b"></div>
  </div>

  <header class="hidden" id="bar">
    <h1>shotsync</h1>
    <input id="fileInput" type="file" accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt,.html,.css,.js,.json,.xml,.zip" multiple class="hidden">
    <button id="textBtn" style="background:#444" data-i18n="header.text">${t("header.text", lang)}</button>
    <button id="uploadBtn" data-i18n="header.upload">${t("header.upload", lang)}</button>
    <button id="selectBtn" style="background:#444" data-i18n="header.select">${t("header.select", lang)}</button>
    <button id="settingsBtn" style="background:#444" title="Settings" aria-label="Settings">⚙</button>
    <button id="langBtn">EN</button>
    <button id="delSelBtn" class="hidden" style="background:#d23">${t("header.deleteSel", lang)}</button>
    <button id="cancelSelBtn" class="hidden" style="background:#444" data-i18n="header.cancel">${t("header.cancel", lang)}</button>
  </header>
  <main id="grid"></main>
  <div id="toast"></div>

  <div id="compose" class="hidden">
    <textarea id="composeText" placeholder="${t("compose.placeholder", lang)}"></textarea>
    <div class="row">
      <button id="composeSend">${t("compose.send", lang)}</button>
      <button id="composeCancel" style="background:#444">${t("compose.cancel", lang)}</button>
    </div>
  </div>

  <div id="settings" class="hidden">
    <div class="card">
      <h2 data-i18n="settings.title">${t("settings.title", lang)}</h2>
      <div class="kv"><span data-i18n="settings.url">${t("settings.url", lang)}</span><code id="settingsUrl"></code></div>
      <div class="kv"><span data-i18n="settings.token">${t("settings.token", lang)}</span><code id="tokenValue"></code></div>
      <div class="kv"><span data-i18n="settings.version">${t("settings.version", lang)}</span><code id="versionValue">v:AUTO</code></div>
      <div class="kv"><span data-i18n="settings.apiDocs">${t("settings.apiDocs", lang)}</span><a id="apiFormatsLink" href="/api/formats" target="_blank">${t("settings.apiDocsLink", lang)}</a></div>
      <div class="row">
        <button id="tokenReveal" style="background:#444">${t("settings.reveal", lang)}</button>
        <button id="tokenCopy">${t("settings.copy", lang)}</button>
      </div>
      <div class="row" style="justify-content:space-between;margin-top:6px">
        <button id="logoutBtn" style="background:#d23">${t("settings.logout", lang)}</button>
        <button id="settingsClose" style="background:#444">${t("settings.close", lang)}</button>
      </div>
    </div>
  </div>

  <div id="viewer" class="hidden" style="position:fixed;inset:0;background:rgba(0,0,0,.95);display:flex;flex-direction:column;z-index:10">
    <div style="display:flex;justify-content:flex-end;gap:10px;padding:10px">
      <button id="shareBtn" style="background:#0a8a5f">${t("viewer.share", lang)}</button>
      <button id="saveBtn" style="background:#2b6cff">${t("viewer.save", lang)}</button>
      <button id="delBtn" style="background:#d23">${t("viewer.delete", lang)}</button>
      <button id="closeBtn" style="background:#444">${t("viewer.close", lang)}</button>
    </div>
    <img id="viewerImg" class="hidden" style="flex:1;min-height:0;object-fit:contain;width:100%">
    <pre id="viewerText" class="hidden"></pre>
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

// Full viewer
let currentId = null, currentRoomId = null, currentKind = "image";

async function openFull(id, roomId) {
  currentId = id; currentRoomId = roomId;
  const v = $("#viewer"), img = $("#viewerImg"), txt = $("#viewerText");
  img.removeAttribute("src"); img.classList.add("hidden");
  txt.textContent = ""; txt.classList.add("hidden");
  v.classList.remove("hidden");
  try {
    const imgUrl = "/i/" + id + "?size=full" + (roomId ? "&room=" + encodeURIComponent(roomId) : "");
    const res = await fetch(imgUrl, { headers: authHeaders() });
    if (!res.ok) return;
    const ct = res.headers.get("content-type") || "";
    if (ct.indexOf("text/") === 0) {
      currentKind = "text";
      txt.textContent = await res.text(); txt.classList.remove("hidden");
    } else {
      currentKind = "image";
      const url = URL.createObjectURL(await res.blob());
      img.addEventListener("load", () => URL.revokeObjectURL(url), { once: true });
      img.src = url; img.classList.remove("hidden");
    }
    $("#saveBtn").textContent = currentKind === "text" ? T("viewer.copy") : T("viewer.save");
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
  try {
    const res = await fetch("/i/" + currentId + "?size=full&room=" + encodeURIComponent(currentRoomId), { headers: authHeaders() });
    if (!res.ok) { toast(T("viewer.saveFailed")); return; }
    const blob = await res.blob();
    const ext = (blob.type.split("/")[1] || "jpg").replace("jpeg", "jpg");
    const file = new File([blob], currentId + "." + ext, { type: blob.type || "image/jpeg" });
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({ files: [file] });
    } else {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = file.name;
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    }
  } catch (e) {
    if (e && e.name !== "AbortError") toast(T("viewer.saveFailed"));
  }
};

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
let contentObserver;

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
  const qs = c ? "?cursor=" + encodeURIComponent(c) + "&limit=40" : "?limit=40";
  const res = await fetch("/api/list" + qs, { headers: authHeaders() });
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
  const isText = (item.contentType || "").indexOf("text/") === 0;
  const el = document.createElement(isText ? "div" : "img");
  el.dataset.id = item.id; el.dataset.roomId = item.roomId || "";
  el.dataset.kind = isText ? "text" : "image";
  if (isText) { el.className = "txtcell"; el.textContent = item.snippet || "…"; }
  el.onclick = () => { if (selectMode) toggleSelect(el); else openFull(item.id, item.roomId); };
  if (!(isText && item.snippet)) contentObserver.observe(el);
  return el;
}

function appendItems(items, prepend) {
  const grid = document.querySelector("#grid");
  for (const it of items) {
    if (knownIds.has(it.id)) continue;
    knownIds.add(it.id);
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
      else loadThumb(e.target);
      contentObserver.unobserve(e.target);
    }
  }, { rootMargin: "200px" });

  cursor = null; knownIds = new Set();
  document.querySelector("#grid").innerHTML = "";
  await loadMore();

  window.onscroll = () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 400) loadMore();
  };
  if (pollTimer) clearInterval(pollTimer);
  pollTimer = setInterval(poll, 20000);
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
