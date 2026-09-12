import { i18n, Lang } from "./i18n";
import { maskToken } from "./settings";

const TOKEN_KEY = "shotsync_token";
const LANG_KEY = "shotsync_lang";

export interface BuildScriptOptions {
  demo: boolean;
  demoEn: boolean;
  lang: Lang;
  maskToken: (token: string) => string;
}

export function buildScript(options: BuildScriptOptions): string {
  const { demo, demoEn, lang, maskToken: maskFn } = options;
  // Generate maskToken function source, wrapping as const assignment for compatibility
  const maskTokenSrc = "const maskToken = " + maskToken.toString();
  return `
const DEMO = ${demo};
const DEMO_EN = ${demoEn};
let lang = localStorage.getItem("${LANG_KEY}") || (navigator.language || "").toLowerCase().startsWith("zh") ? "zh" : "en";
if (lang !== "zh" && lang !== "en") lang = "en";
let token = localStorage.getItem("${TOKEN_KEY}") || "";

${maskTokenSrc}

const $ = (s) => document.querySelector(s);
function toast(msg) { const t = $("#toast"); t.textContent = msg; t.classList.add("show"); setTimeout(() => t.classList.remove("show"), 1800); }
let currentRoom = "gallery";
function authHeaders() { return { authorization: "Bearer " + token, "x-room-id": currentRoom }; }

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

async function loadRooms() {
  try {
    const res = await fetch("/api/rooms", { headers: authHeaders() });
    if (!res.ok) return;
    const { rooms } = await res.json();
    const sel = $("#roomSelect");
    const cur = currentRoom;
    sel.innerHTML = "";
    for (const r of rooms) {
      const opt = document.createElement("option");
      opt.value = r; opt.textContent = r;
      if (r === cur) opt.selected = true;
      sel.appendChild(opt);
    }
    sel.onchange = () => {
      currentRoom = sel.value;
      currentRoomId = sel.value;
      localStorage.setItem("shotsync_room", currentRoom);
      initFeed();
    };
    // Restore saved room
    const saved = localStorage.getItem("shotsync_room");
    if (saved && rooms.includes(saved)) {
      currentRoom = saved;
      currentRoomId = saved;
      sel.value = saved;
    }
  } catch {}
}

$("#tokenSave").onclick = async () => {
  token = $("#tokenInput").value.trim();
  if (!token) return;
  localStorage.setItem("${TOKEN_KEY}", token);
  if (await apiOk()) { showApp(); setupUpload(); await loadRooms(); await initFeed(); }
  else { localStorage.removeItem("${TOKEN_KEY}"); showGate(T("gate.invalid")); }
};

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
  $("#showFoldersChk").checked = showFolders;
  $("#settings").classList.remove("hidden");
};
$("#settingsClose").onclick = closeSettings;
$("#showFoldersChk").onchange = () => {
  showFolders = $("#showFoldersChk").checked;
  localStorage.setItem("shotsync_folders", showFolders ? "1" : "0");
  initFeed();
};
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
let currentId = null, currentRoomId = null, currentFolder = "_root", currentKind = "image", currentBlob = null, currentVideoUrl = null;

async function openFull(id, roomId, folder) {
  currentId = id; currentRoomId = roomId || "gallery"; currentFolder = folder || "_root";
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
    let imgUrl = "/i/" + id + "?size=full&room=" + encodeURIComponent(currentRoomId);
    if (currentFolder !== "_root") {
      imgUrl += "&folder=" + encodeURIComponent(currentFolder);
    }
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
  let imgUrl = "/i/" + currentId + "?size=full&room=" + encodeURIComponent(currentRoomId);
  if (currentFolder !== "_root") {
    imgUrl += "&folder=" + encodeURIComponent(currentFolder);
  }
  const blob = currentBlob || await (await fetch(imgUrl, { headers: authHeaders() })).blob();
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
  const folder = itemsById.get(currentId)?.folder || "_root";
  const res = await fetch("/api/img/" + currentId + "?room=" + encodeURIComponent(currentRoomId) + "&folder=" + encodeURIComponent(folder), { method: "DELETE", headers: authHeaders() });
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

// Folder state
let showFolders = localStorage.getItem("shotsync_folders") !== "0";
let currentFolderPath = "_root";
let folderPath = []; // Array of folder names from root to current
let knownFolders = new Set();
let folderCreateCallback = null;

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
  $("#selectBtn").classList.add("hidden"); $("#textBtn").classList.add("hidden"); $("#uploadBtn").classList.add("hidden"); $("#newFolderBtn").classList.add("hidden");
  $("#delSelBtn").classList.remove("hidden"); $("#cancelSelBtn").classList.remove("hidden");
  updateDelBtn();
}
function exitSelect() {
  selectMode = false; selected.clear();
  document.querySelectorAll("#grid .sel").forEach((e) => e.classList.remove("sel"));
  $("#selectBtn").classList.remove("hidden"); $("#textBtn").classList.remove("hidden"); $("#uploadBtn").classList.remove("hidden");
  if (showFolders) $("#newFolderBtn").classList.remove("hidden");
  $("#delSelBtn").classList.add("hidden"); $("#cancelSelBtn").classList.add("hidden");
}
async function deleteSelected() {
  if (!selected.size) { exitSelect(); return; }
  if (!confirm(T("select.confirm", { n: selected.size }))) return;
  const ids = [...selected]; let ok = 0;
  await Promise.all(ids.map(async (id) => {
    try {
      const cell = document.querySelector('#grid [data-id="' + id + '"]');
      const roomId = cell ? cell.dataset.roomId : "gallery";
      const folder = itemsById.get(id)?.folder || "_root";
      const res = await fetch("/api/img/" + id + "?room=" + encodeURIComponent(roomId) + "&folder=" + encodeURIComponent(folder), { method: "DELETE", headers: authHeaders() });
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
  params.set("sort", sortAsc ? "oldest" : "newest");
  if (currentFolderPath !== "_root") {
    params.set("folder", currentFolderPath);
  }
  const res = await fetch("/api/list?" + params.toString(), { headers: authHeaders() });
  if (!res.ok) throw new Error("list failed");
  return res.json();
}

async function loadThumb(img) {
  const id = img.dataset.id, roomId = img.dataset.roomId, folder = img.dataset.folder || "_root";
  let url = "/i/" + id + "?size=thumb&room=" + encodeURIComponent(roomId);
  if (folder !== "_root") url += "&folder=" + encodeURIComponent(folder);
  try {
    const res = await fetch(url, { headers: authHeaders() });
    if (!res.ok) return;
    const blobUrl = URL.createObjectURL(await res.blob());
    img.addEventListener("load", () => URL.revokeObjectURL(blobUrl), { once: true });
    img.src = blobUrl;
  } catch {}
}

async function loadVideoThumb(cell) {
  const id = cell.dataset.id, roomId = cell.dataset.roomId, folder = cell.dataset.folder || "_root";
  let url = "/i/" + id + "?size=thumb&room=" + encodeURIComponent(roomId);
  if (folder !== "_root") url += "&folder=" + encodeURIComponent(folder);
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
  const id = card.dataset.id, roomId = card.dataset.roomId, folder = card.dataset.folder || "_root";
  let url = "/i/" + id + "?room=" + encodeURIComponent(roomId);
  if (folder !== "_root") url += "&folder=" + encodeURIComponent(folder);
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
    const sizeStr = formatSize(item.size);
    meta.textContent = sizeStr ? sizeStr + " • " + formatTime(item.time) : formatTime(item.time);
    meta.style.cssText = "flex-shrink:0";
    cell.appendChild(meta);
    if (isImage || isVideo) {
      const thumb = document.createElement(isImage ? "img" : "div");
      thumb.style.cssText = "width:36px;height:36px;object-fit:cover;border-radius:4px;flex-shrink:0";
      thumb.dataset.id = item.id; thumb.dataset.roomId = item.roomId || ""; thumb.dataset.folder = item.folder || "_root";
      thumb.dataset.kind = isVideo ? "video" : "image";
      if (isVideo) { thumb.className = "videocell"; thumb.style.cssText = "width:36px;height:36px;border-radius:4px;flex-shrink:0;cursor:pointer;position:relative;background:#222;display:flex;align-items:center;justify-content:center"; }
      thumb.onclick = () => { if (selectMode) toggleSelect(thumb); else openFull(item.id, item.roomId, item.folder); };
      cell.insertBefore(thumb, cell.firstChild);
      if (isImage) contentObserver.observe(thumb);
      else if (isVideo) videoThumbs.add(thumb);
    }
  } else {
    if (isVideo) {
      cell = document.createElement("div");
      cell.className = "videocell";
      cell.dataset.id = item.id; cell.dataset.roomId = item.roomId || ""; cell.dataset.folder = item.folder || "_root"; cell.dataset.kind = "video";
      const thumb = document.createElement("img");
      thumb.style.cssText = "width:100%;height:100%;object-fit:cover;position:absolute;top:0;left:0";
      cell.appendChild(thumb);
      videoThumbs.add(cell);
    } else if (isText) {
      const el = document.createElement("div");
      el.dataset.id = item.id; el.dataset.roomId = item.roomId || ""; el.dataset.folder = item.folder || "_root"; el.dataset.kind = "text";
      el.className = "txtcell"; el.textContent = item.snippet || "…";
      if (!item.snippet) contentObserver.observe(el);
      cell = el;
    } else {
      cell = document.createElement("div");
      cell.dataset.id = item.id; cell.dataset.roomId = item.roomId || ""; cell.dataset.folder = item.folder || "_root"; cell.dataset.kind = "doc";
      cell.style.cssText = "width:100%;aspect-ratio:1;border-radius:6px;background:#222;cursor:pointer;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;padding:8px";
      const icon = document.createElement("span");
      icon.textContent = getExtIcon(ct);
      icon.style.cssText = "font-size:24px";
      cell.appendChild(icon);
      const name = document.createElement("span");
      const ext = (item.origName || item.id).split(".").pop()?.toUpperCase() || "";
      name.textContent = ext;
      name.style.cssText = "font-size:10px;color:#aaa;max-width:100%;overflow:hidden;text-overflow:ellipsis";
      cell.appendChild(name);
      const size = document.createElement("span");
      size.textContent = formatSize(item.size);
      size.style.cssText = "font-size:9px;color:#666";
      cell.appendChild(size);
    }
  }
  cell.dataset.id = item.id;
  cell.dataset.roomId = item.roomId || "";
  cell.dataset.folder = item.folder || "_root";
  cell.dataset.kind = isVideo ? "video" : (isText ? "text" : "image");
  cell.onclick = () => { if (selectMode) toggleSelect(cell); else openFull(item.id, item.roomId, item.folder); };
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

function formatSize(bytes) {
  if (!bytes) return "";
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  return (bytes / (1024 * 1024 * 1024)).toFixed(1) + " GB";
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

function appendItems(items, prepend, subfolders) {
  const grid = document.querySelector("#grid");
  for (const it of items) {
    if (knownIds.has(it.id)) continue;
    knownIds.add(it.id);
    itemsById.set(it.id, it);
    const cell = makeCell(it);
    if (prepend) grid.prepend(cell); else grid.append(cell);
  }
  
  if (showFolders && subfolders) {
    for (const folder of subfolders) {
      if (knownFolders.has(folder)) continue;
      knownFolders.add(folder);
      const cell = makeFolderCell(folder);
      if (prepend) grid.prepend(cell); else grid.append(cell);
    }
  }
}

async function loadMore() {
  if (loading || cursor === false) return;
  loading = true;
  try {
    const data = await fetchPage(cursor);
    appendItems(data.items || [], false, data.subfolders || []);
    cursor = data.cursor || false;
  } finally { loading = false; }
}

async function poll() {
  try {
    const data = await fetchPage(null);
    appendItems((data.items || []).filter((i) => !knownIds.has(i.id)).reverse(), true, data.subfolders || []);
  } catch {}
}

// Folder navigation — only shown when inside a subfolder
function updateBreadcrumb() {
  const bc = $("#breadcrumb");
  bc.innerHTML = "";
  
  // At root level: hide breadcrumb entirely
  if (currentFolderPath === "_root") {
    bc.style.display = "none";
    return;
  }
  bc.style.display = "";
  
  const rootLink = document.createElement("a");
  rootLink.href = "#";
  rootLink.textContent = T("header.root") || "全部";
  rootLink.onclick = (e) => { e.preventDefault(); navigateToFolder("_root"); };
  bc.appendChild(rootLink);
  
  for (let i = 0; i < folderPath.length; i++) {
    const sep = document.createElement("span");
    sep.textContent = "/";
    bc.appendChild(sep);
    
    const link = document.createElement("a");
    link.href = "#";
    link.textContent = folderPath[i];
    const idx = i;
    link.onclick = (e) => {
      e.preventDefault();
      navigateToFolder(folderPath.slice(0, idx + 1).join("/"));
    };
    bc.appendChild(link);
  }
  
  const sep = document.createElement("span");
  sep.textContent = "/";
  bc.appendChild(sep);
  
  const current = document.createElement("span");
  current.className = "current";
  current.textContent = folderPath[folderPath.length - 1] || currentFolderPath;
  bc.appendChild(current);
}

async function navigateToFolder(folder) {
  currentFolderPath = folder;
  if (folder === "_root") {
    folderPath = [];
  } else {
    folderPath = folder.split("/");
  }
  updateBreadcrumb();
  await initFeed();
}

function makeFolderCell(name) {
  const cell = document.createElement("div");
  cell.className = "foldercell";
  cell.dataset.folder = name;
  
  const icon = document.createElement("span");
  icon.textContent = "📁";
  cell.appendChild(icon);
  
  const label = document.createElement("span");
  label.textContent = name;
  cell.appendChild(label);
  
  cell.onclick = () => {
    const newFolder = currentFolderPath === "_root" ? name : currentFolderPath + "/" + name;
    navigateToFolder(newFolder);
  };
  
  let pressTimer;
  cell.onpointerdown = () => {
    pressTimer = setTimeout(() => {
      if (confirm(T("folder.deleteConfirm") || "删除文件夹？文件夹必须为空。")) {
        deleteFolder(currentFolderPath === "_root" ? name : currentFolderPath + "/" + name);
      }
    }, 800);
  };
  cell.onpointerup = () => clearTimeout(pressTimer);
  cell.onpointerleave = () => clearTimeout(pressTimer);
  
  return cell;
}

async function deleteFolder(folder) {
  try {
    const res = await fetch("/api/folders?room=" + encodeURIComponent(currentRoom) + "&path=" + encodeURIComponent(folder), { method: "DELETE", headers: authHeaders() });
    if (res.ok) {
      toast(T("folder.deleted") || "已删除文件夹");
      knownFolders.delete(folder);
      await initFeed();
    } else {
      toast(T("folder.deleteFailed") || "删除失败");
    }
  } catch {
    toast(T("folder.deleteFailed") || "删除失败");
  }
}

function showFolderDialog(callback) {
  folderCreateCallback = callback;
  const input = $("#folderNameInput");
  input.value = "";
  $("#folderDialog").classList.remove("hidden");
  input.focus();
}

$("#folderDialogCancel").onclick = () => {
  $("#folderDialog").classList.add("hidden");
  folderCreateCallback = null;
};

$("#folderDialogCreate").onclick = async () => {
  const name = $("#folderNameInput").value.trim();
  if (!name || !/^[a-zA-Z0-9_-]+$/.test(name)) {
    toast("Invalid folder name");
    return;
  }
  
  const newFolder = currentFolderPath === "_root" ? name : currentFolderPath + "/" + name;
  
  try {
    const res = await fetch("/api/folders", {
      method: "POST",
      headers: { ...authHeaders(), "Content-Type": "application/json" },
      body: JSON.stringify({ roomId: currentRoom, path: newFolder })
    });
    
    if (res.ok) {
      toast("Folder created");
      knownFolders.add(newFolder);
      $("#folderDialog").classList.add("hidden");
      if (folderCreateCallback) folderCreateCallback(newFolder);
      folderCreateCallback = null;
      await initFeed();
    } else {
      toast("Failed to create folder");
    }
  } catch {
    toast("Failed to create folder");
  }
};

$("#folderNameInput").onkeydown = (e) => {
  if (e.key === "Enter") $("#folderDialogCreate").click();
  if (e.key === "Escape") $("#folderDialogCancel").click();
};

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

  cursor = null; knownIds = new Set(); itemsById = new Map(); videoThumbs = new Set(); knownFolders = new Set();
  const grid = document.querySelector("#grid");
  grid.className = viewMode === "list" ? "list-view" : viewMode === "small" ? "small-view" : "";
  document.querySelector("#grid").innerHTML = "";
  updateBreadcrumb();
  await loadMore();

  window.onscroll = () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 400) loadMore();
  };
  if (pollTimer) clearInterval(pollTimer);
  pollTimer = setInterval(poll, 20000);

  $("#typeFilter").value = currentFilter;
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
    fd.set("full", file, file.name);
    fd.set("thumb", new Blob(), "empty");
  } else {
    fd.set("full", file, file.name);
    fd.set("thumb", new Blob(), "empty");
  }
  const headers = { ...authHeaders(), "x-source": "pwa" };
  if (currentFolderPath !== "_root") {
    headers["x-folder"] = currentFolderPath;
  }
  const res = await fetch("/api/upload", { method: "POST", headers, body: fd });
  if (!res.ok) throw new Error("upload failed");
  return (await res.json()).id;
}

async function sendText(text) {
  if (!text.trim()) return false;
  const fd = new FormData();
  fd.set("full", new Blob([text], { type: "text/plain" }), "note.txt");
  const headers = { ...authHeaders(), "x-source": "pwa" };
  if (currentFolderPath !== "_root") {
    headers["x-folder"] = currentFolderPath;
  }
  const res = await fetch("/api/upload", { method: "POST", headers, body: fd });
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

  $("#newFolderBtn").onclick = () => showFolderDialog();

  $("#selectBtn").onclick = enterSelect;
  $("#cancelSelBtn").onclick = exitSelect;
  $("#delSelBtn").onclick = deleteSelected;

  const dropZone = $("#dropZone");
  const dropOverlay = $("#dropOverlay");
  $("#dropZoneText").textContent = T("dropzone.hint");
  let dragCounter = 0;

  document.addEventListener("dragenter", (e) => {
    e.preventDefault();
    dragCounter++;
    dropZone.classList.add("active");
    dropOverlay.classList.add("active");
  });

  document.addEventListener("dragleave", (e) => {
    e.preventDefault();
    dragCounter--;
    if (dragCounter === 0) {
      dropZone.classList.remove("active");
      dropOverlay.classList.remove("active");
    }
  });

  document.addEventListener("dragover", (e) => {
    e.preventDefault();
  });

  document.addEventListener("drop", async (e) => {
    e.preventDefault();
    dragCounter = 0;
    dropZone.classList.remove("active");
    dropOverlay.classList.remove("active");

    const files = [...(e.dataTransfer?.files || [])];
    if (!files.length) return;

    toast(T("dropzone.uploading"));
    let ok = 0;
    for (const f of files) { try { await uploadOne(f); ok++; } catch { toast(T("upload.failed")); } }
    toast(ok === files.length ? T("upload.success") : T("upload.partial", { ok, total: files.length }));
    await poll();
  });
}

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/sw.js").catch(() => {});
}

async function enterDemo() {
  showApp();
  ["#uploadBtn", "#textBtn", "#selectBtn", "#settingsBtn", "#shareBtn", "#delBtn", "#langBtn", "#newFolderBtn"].forEach((s) => $(s).classList.add("hidden"));
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
  if (token && await apiOk()) { showApp(); setupUpload(); await loadRooms(); await initFeed(); }
  else { showGate(); }
})();
`;
}
