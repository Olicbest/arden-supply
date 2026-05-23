import { createReadStream, existsSync } from "node:fs";
import { extname, join, normalize } from "node:path";
import { createServer } from "node:http";

const root = new URL(".", import.meta.url).pathname;
const port = 4177;

const types = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
};

createServer((request, response) => {
  const requestedPath = decodeURIComponent(new URL(request.url, `http://${request.headers.host}`).pathname);
  const cleanPath = normalize(requestedPath === "/" ? "/index.html" : requestedPath).replace(/^(\.\.[/\\])+/, "");
  const filePath = join(root, cleanPath);

  if (!existsSync(filePath)) {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Not found");
    return;
  }

  response.writeHead(200, { "Content-Type": types[extname(filePath)] || "application/octet-stream" });
  createReadStream(filePath).pipe(response);
}).listen(port, () => {
  console.log(`Arden Supply preview running at http://127.0.0.1:${port}`);
});
