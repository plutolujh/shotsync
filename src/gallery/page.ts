import { i18n, Lang } from "./i18n";
import { maskToken } from "./settings";
import { buildScript } from "./script";

const CSS = `:root{color-scheme:dark}*{box-sizing:border-box}body{margin:0;background:#111;color:#eee;font:15px/1.4 -apple-system,system-ui,sans-serif}header{position:sticky;top:0;display:flex;align-items:center;gap:8px;padding:10px 14px;background:#181818;border-bottom:1px solid #2a2a2a;flex-wrap:wrap}header h1{font-size:16px;margin:0;flex:1;min-width:60px}button{background:#2b6cff;color:#fff;border:0;border-radius:8px;padding:8px 12px;font-size:14px;cursor:pointer}button:hover{opacity:.9}button:active{opacity:.8}#grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(110px,1fr));gap:6px;padding:6px}#grid img{width:100%;aspect-ratio:1;object-fit:cover;border-radius:6px;background:#222;cursor:pointer}#grid img:hover{opacity:.9}#gate{position:fixed;inset:0;display:flex;flex-direction:column;gap:12px;align-items:center;justify-content:center;background:#111;padding:24px}#gate input{padding:10px;border-radius:8px;border:1px solid #333;background:#1c1c1c;color:#eee;width:min(360px,90vw)}.hidden{display:none!important}#toast{position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:#333;padding:10px 16px;border-radius:20px;opacity:0;transition:opacity .2s;pointer-events:none}#toast.show{opacity:1}#grid .txtcell{width:100%;aspect-ratio:1;border-radius:6px;background:#1c2030;color:#cdd3e0;padding:8px;font-size:12px;line-height:1.35;overflow:hidden;cursor:pointer;white-space:pre-wrap;word-break:break-word;display:flex;align-items:flex-start}#viewerText{flex:1;min-height:0;overflow:auto;margin:0;padding:16px;white-space:pre-wrap;word-break:break-word;color:#eee;font:14px/1.6 ui-monospace,monospace}#compose{position:fixed;inset:0;z-index:11;background:rgba(0,0,0,.92);display:flex;flex-direction:column;gap:10px;padding:12px}#compose textarea{flex:1;min-height:0;resize:none;padding:12px;border-radius:8px;border:1px solid #333;background:#1c1c1c;color:#eee;font-size:15px}#compose .row{display:flex;justify-content:flex-end;gap:10px}#settings{position:fixed;inset:0;z-index:11;background:rgba(0,0,0,.92);display:flex;align-items:center;justify-content:center;padding:16px}#settings .card{width:100%;max-width:420px;background:#181818;border:1px solid #2a2a2a;border-radius:12px;padding:16px;display:flex;flex-direction:column;gap:12px}#settings h2{font-size:16px;margin:0}#settings .kv{display:flex;flex-direction:column;gap:4px;font-size:13px;color:#aaa}#settings code{font:13px/1.4 ui-monospace,Menlo,monospace;color:#eee;word-break:break-all;background:#222;padding:8px;border-radius:8px;user-select:all}#settings .row{display:flex;justify-content:flex-end;gap:10px}#settings a{color:#2b6cff}#langBtn{font-size:13px;padding:6px 10px;background:#333}.view-btn{font-size:13px;padding:6px 8px;background:#444;border:none;color:#fff;border-radius:6px;cursor:pointer}.view-btn.active{background:#2b6cff}.view-btn:hover{opacity:.85}#grid.list-view{display:flex;flex-direction:column;gap:2px;padding:4px}#grid.list-view>*{width:100%;aspect-ratio:unset;border-radius:4px;background:#1c2030;padding:8px 10px;font-size:13px;line-height:1.4;color:#cdd3e0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;display:flex;align-items:center;gap:10px}#grid.list-view>img{display:none!important}#grid.list-view .list-file{flex:1;overflow:hidden;text-overflow:ellipsis}#grid.list-view .list-meta{color:#888;font-size:12px;white-space:nowrap}#grid.small-view{grid-template-columns:repeat(auto-fill,minmax(60px,1fr));gap:4px;padding:4px}#grid.small-view img{aspect-ratio:1;border-radius:4px}#grid.small-view .txtcell{aspect-ratio:1;font-size:10px;padding:4px}#grid .sel{outline:3px solid #2b6cff;outline-offset:-3px;opacity:.8}#viewer{position:fixed;inset:0;background:rgba(0,0,0,.95);display:flex;flex-direction:column;z-index:10}#viewerImg{flex:1;min-height:0;object-fit:contain;width:100%}#viewerPdf{flex:1;min-height:0}#viewerDoc{flex:1;min-height:0}#viewerVideo{flex:1;min-height:0;max-height:100%;object-fit:contain;width:100%}#filterBar{display:flex;gap:4px;align-items:center}#filterBar select{background:#333;color:#eee;border:1px solid #444;border-radius:6px;padding:6px 8px;font-size:13px;cursor:pointer}#filterBar select:focus{outline:none;border-color:#2b6cff}#sortHeader{display:flex;align-items:center;gap:4px;cursor:pointer;padding:6px 8px;background:#333;border:1px solid #444;border-radius:6px;font-size:13px;color:#eee;user-select:none}#sortHeader:hover{background:#444}#sortHeader.asc::after{content:" ▲"}#sortHeader.desc::after{content:" ▼"}#dropZone{position:fixed;inset:0;z-index:100;background:rgba(43,108,255,.15);border:4px dashed #2b6cff;display:none;align-items:center;justify-content:center;pointer-events:none}#dropZone.active{display:flex}#dropZone span{font-size:24px;color:#2b6cff;text-align:center}#dropOverlay{position:fixed;inset:0;z-index:99;background:rgba(0,0,0,.5);display:none}#dropOverlay.active{display:block}#grid .videocell{position:relative;width:100%;aspect-ratio:1;border-radius:6px;background:#222;cursor:pointer;overflow:hidden}#grid .videocell img{width:100%;height:100%;object-fit:cover}#grid .videocell::after{content:"▶";position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font-size:24px;color:#fff;text-shadow:0 1px 4px rgba(0,0,0,.8)}#grid .videocell:hover::after{font-size:28px}#grid.small-view .videocell::after{font-size:16px}#grid.list-view .videocell::after{display:none}#breadcrumb{display:flex;align-items:center;gap:4px;padding:6px 10px;background:#1a1a1a;font-size:13px;overflow-x:auto;white-space:nowrap}#breadcrumb::-webkit-scrollbar{height:4px}#breadcrumb::-webkit-scrollbar-track{background:#1a1a1a}#breadcrumb::-webkit-scrollbar-thumb{background:#444;border-radius:2px}#breadcrumb a{color:#8ab4ff;text-decoration:none;padding:2px 4px;border-radius:4px}#breadcrumb a:hover{background:#2a2a2a}#breadcrumb span{color:#888;padding:0 4px}#breadcrumb .current{color:#eee;font-weight:500}#grid .foldercell{width:100%;aspect-ratio:1;border-radius:6px;background:#1a2530;cursor:pointer;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;border:2px solid transparent}#grid .foldercell:hover{background:#253040;border-color:#3a5070}#grid .foldercell:active{opacity:.8}#grid .foldercell span:first-child{font-size:28px}#grid .foldercell span:last-child{font-size:11px;color:#aaa;max-width:90%;overflow:hidden;text-overflow:ellipsis;padding:0 4px}#grid.list-view .foldercell{aspect-ratio:unset;flex-direction:row;padding:8px 12px;gap:10px;border-radius:4px}#grid.list-view .foldercell span:first-child{font-size:18px}#grid.list-view .foldercell span:last-child{flex:1;font-size:13px}#newFolderBtn{font-size:13px;padding:6px 10px;background:#444}#folderDialog{position:fixed;inset:0;z-index:12;background:rgba(0,0,0,.85);display:flex;align-items:center;justify-content:center;padding:16px}#folderDialog input{padding:10px;border-radius:8px;border:1px solid #444;background:#1c1c1c;color:#eee;font-size:15px;width:280px}`;

function buildHTML(demo: boolean, demoEn: boolean): string {
  const lang: Lang = demo && demoEn ? "en" : "zh";
  const script = buildScript({ demo, demoEn, lang, maskToken });

  return `<!doctype html>
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
    <button id="newFolderBtn" class="hidden" style="background:#555" data-i18n="header.newFolder">${i18n[lang]["header.newFolder"]}</button>
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
  <div id="dropOverlay"></div>
  <div id="dropZone"><span id="dropZoneText"></span></div>

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
      <div class="kv"><label style="display:flex;align-items:center;gap:8px;cursor:pointer"><input type="checkbox" id="showFoldersChk"><span data-i18n="settings.showFolders">${i18n[lang]["settings.showFolders"]}</span></label></div>
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

  <div id="folderDialog" class="hidden">
    <input id="folderNameInput" type="text" placeholder="${i18n[lang]["folder.namePlaceholder"]}" maxlength="64">
    <div class="row" style="margin-top:10px">
      <button id="folderDialogCancel" style="background:#444">${i18n[lang]["folder.cancel"]}</button>
      <button id="folderDialogCreate">${i18n[lang]["folder.createBtn"]}</button>
    </div>
  </div>

  <nav id="breadcrumb"></nav>

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
${script}
</script>
</body>
</html>`;
}

export const galleryHTML = buildHTML(false, false);
export const galleryDemoHTML = buildHTML(true, true);
