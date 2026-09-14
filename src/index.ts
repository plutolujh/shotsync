import { Env, err } from "./responses";
import { handleUpload } from "./handlers/upload";
import { handleList } from "./handlers/list";
import { handleImage } from "./handlers/image";
import { handleDelete } from "./handlers/del";
import { handleDeleteRoom } from "./handlers/delroom";
import { handleShareCreate, handleSharedItem, handlePublicItem } from "./handlers/share";
import { handleFormats } from "./handlers/formats";
import { handleFolderList, handleFolderCreate, handleFolderDelete } from "./handlers/folder";
import { handleRooms } from "./handlers/rooms";
import { galleryDemoHTML, galleryHTML } from "./gallery/page";
import { manifestJSON } from "./gallery/manifest";
import { swJS } from "./gallery/sw";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Authorization, Content-Type, x-room-id, x-source, x-filename",
};

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const { pathname } = url;
    const m = request.method;

    // Handle CORS preflight
    if (m === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    if (pathname === "/" && m === "GET") {
      // On the demo deployment, flip the frontend into read-only demo chrome.
      const html = env.DEMO_MODE === "1" ? galleryDemoHTML : galleryHTML;
      return new Response(html, { headers: { "content-type": "text/html; charset=utf-8" } });
    }
    if (pathname === "/manifest.webmanifest" && m === "GET") {
      return new Response(manifestJSON, { headers: { "content-type": "application/manifest+json" } });
    }
    if (pathname === "/sw.js" && m === "GET") {
      return new Response(swJS, { headers: { "content-type": "text/javascript" } });
    }
    if (pathname === "/api/upload") {
      return m === "POST" ? handleUpload(request, env) : err(405, "method not allowed");
    }
    if (pathname === "/api/list") {
      return m === "GET" ? handleList(request, env) : err(405, "method not allowed");
    }
    if (pathname.startsWith("/i/")) {
      const id = decodeURIComponent(pathname.slice("/i/".length));
      return m === "GET" ? handleImage(request, env, id) : err(405, "method not allowed");
    }
    if (pathname.startsWith("/api/img/")) {
      const id = decodeURIComponent(pathname.slice("/api/img/".length));
      return m === "DELETE" ? handleDelete(request, env, id) : err(405, "method not allowed");
    }
    if (pathname.startsWith("/api/room/")) {
      const roomId = decodeURIComponent(pathname.slice("/api/room/".length));
      return m === "DELETE" ? handleDeleteRoom(request, env, roomId) : err(405, "method not allowed");
    }
    if (pathname.startsWith("/api/share/")) {
      const id = decodeURIComponent(pathname.slice("/api/share/".length));
      return m === "POST" ? handleShareCreate(request, env, id) : err(405, "method not allowed");
    }
    if (pathname.startsWith("/share/")) {
      const id = decodeURIComponent(pathname.slice("/share/".length));
      return (m === "GET" || m === "HEAD") ? handleSharedItem(request, env, id) : err(405, "method not allowed");
    }
    if (pathname.startsWith("/pub/")) {
      const id = decodeURIComponent(pathname.slice("/pub/".length));
      return (m === "GET" || m === "HEAD") ? handlePublicItem(request, env, id) : err(405, "method not allowed");
    }
    if (pathname === "/api/formats" && m === "GET") {
      return handleFormats();
    }
    if (pathname === "/api/rooms" && m === "GET") {
      return handleRooms(request, env);
    }
    // Folder routes
    if (pathname === "/api/folders") {
      if (m === "GET") return handleFolderList(request, env);
      if (m === "POST") return handleFolderCreate(request, env);
      if (m === "DELETE") return handleFolderDelete(request, env);
      return err(405, "method not allowed");
    }
    return err(404, "not found");
  },
} satisfies ExportedHandler<Env>;
