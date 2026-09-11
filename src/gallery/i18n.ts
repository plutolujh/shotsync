export type Lang = "zh" | "en";

const zh: Record<string, string> = {
  // Gate
  "gate.title": "输入访问 token",
  "gate.placeholder": "Bearer token",
  "gate.enter": "进入相册",
  "gate.invalid": "token 无效",

  // Header
  "header.title": "shotsync",
  "header.text": "✎ 文字",
  "header.upload": "+ 图片",
  "header.select": "选择",
  "header.deleteSel": "删除选中",
  "header.cancel": "取消",

  // Compose
  "compose.placeholder": "粘贴或输入文字，发送到图池…",
  "compose.send": "发送",
  "compose.cancel": "取消",

  // Settings
  "settings.title": "设置",
  "settings.url": "相册地址（其他设备照着输）",
  "settings.token": "访问 token",
  "settings.version": "版本",
  "settings.apiDocs": "API 文档",
  "settings.apiDocsLink": "查看支持的格式和 API",
  "settings.reveal": "显示",
  "settings.copy": "复制",
  "settings.logout": "退出登录",
  "settings.close": "关闭",
  "settings.logoutConfirm": "退出登录？这台设备之后要重新输入 token。",
  "settings.copied": "token 已复制",

  // Viewer
  "viewer.share": "分享",
  "viewer.save": "保存",
  "viewer.delete": "删除",
  "viewer.close": "关闭",
  "viewer.copy": "复制",
  "viewer.deleteConfirm": "删除这条？",
  "viewer.shareFailed": "生成链接失败",
  "viewer.shareCopied": "链接已复制（7天有效）",
  "viewer.saveFailed": "保存失败",
  "viewer.copyFailed": "复制失败，请长按选择",
  "viewer.deleted": "已删除",
  "viewer.deleteFailed": "删除失败",

  // Select mode
  "select.deleteCount": "删除选中 ({n})",
  "select.confirm": "删除选中的 {n} 项？",

  // Upload
  "upload.success": "上传完成",
  "upload.partial": "{ok}/{total} 上传成功",
  "upload.failed": "有图上传失败",
  "text.sendFailed": "文字发送失败",
  "text.sent": "已发送",

  // Demo
  "demo.title": "shotsync · 只读演示池",
  "demo.deploy": "5 分钟部署自己的 →",
  "demo.close": "关闭",

  // View modes
  "view.small": "小图",
  "view.large": "大图",
  "view.list": "列表",
};

const en: Record<string, string> = {
  // Gate
  "gate.title": "Enter access token",
  "gate.placeholder": "Bearer token",
  "gate.enter": "Enter gallery",
  "gate.invalid": "Invalid token",

  // Header
  "header.title": "shotsync",
  "header.text": "✎ Text",
  "header.upload": "+ Photo",
  "header.select": "Select",
  "header.deleteSel": "Delete",
  "header.cancel": "Cancel",

  // Compose
  "compose.placeholder": "Paste or type text to send…",
  "compose.send": "Send",
  "compose.cancel": "Cancel",

  // Settings
  "settings.title": "Settings",
  "settings.url": "Gallery URL (enter on other devices)",
  "settings.token": "Access token",
  "settings.version": "Version",
  "settings.apiDocs": "API Docs",
  "settings.apiDocsLink": "View supported formats and API",
  "settings.reveal": "Show",
  "settings.copy": "Copy",
  "settings.logout": "Log out",
  "settings.close": "Close",
  "settings.logoutConfirm": "Log out? You will need to re-enter the token.",
  "settings.copied": "Token copied",

  // Viewer
  "viewer.share": "Share",
  "viewer.save": "Save",
  "viewer.delete": "Delete",
  "viewer.close": "Close",
  "viewer.copy": "Copy",
  "viewer.deleteConfirm": "Delete this?",
  "viewer.shareFailed": "Failed to generate link",
  "viewer.shareCopied": "Link copied (7 days)",
  "viewer.saveFailed": "Save failed",
  "viewer.copyFailed": "Copy failed — long-press to select",
  "viewer.deleted": "Deleted",
  "viewer.deleteFailed": "Delete failed",

  // Select mode
  "select.deleteCount": "Delete ({n})",
  "select.confirm": "Delete {n} items?",

  // Upload
  "upload.success": "Upload complete",
  "upload.partial": "{ok}/{total} uploaded",
  "upload.failed": "Some uploads failed",
  "text.sendFailed": "Failed to send text",
  "text.sent": "Sent",

  // Demo
  "demo.title": "shotsync · read-only demo",
  "demo.deploy": "Deploy your own in ~5 min →",
  "demo.close": "Close",

  // View modes
  "view.small": "Small",
  "view.large": "Large",
  "view.list": "List",
};

export const i18n = { zh, en };

export function t(key: string, lang: Lang, vars?: Record<string, string | number>): string {
  const map = lang === "zh" ? zh : en;
  let s = map[key] ?? key;
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      s = s.replace(`{${k}}`, String(v));
    }
  }
  return s;
}

export function detectLang(): Lang {
  const stored = localStorage.getItem("shotsync_lang");
  if (stored === "zh" || stored === "en") return stored;
  return (navigator.language || "").toLowerCase().startsWith("zh") ? "zh" : "en";
}
