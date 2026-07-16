import http from "node:http";
import prototype from "./index.js";

const port = Number(process.env.PORT || 4173);

const server = http.createServer(async (request, response) => {
  try {
    const headers = new Headers();
    for (const [name, value] of Object.entries(request.headers)) {
      if (Array.isArray(value)) {
        for (const item of value) headers.append(name, item);
      } else if (value !== undefined) {
        headers.set(name, value);
      }
    }

    const origin = `http://${request.headers.host || `localhost:${port}`}`;
    const init = { method: request.method, headers };

    if (request.method !== "GET" && request.method !== "HEAD") {
      const chunks = [];
      for await (const chunk of request) chunks.push(chunk);
      init.body = Buffer.concat(chunks);
    }

    const result = await prototype.fetch(new Request(new URL(request.url, origin), init));
    response.writeHead(result.status, Object.fromEntries(result.headers));

    if (request.method === "HEAD" || !result.body) {
      response.end();
      return;
    }

    response.end(Buffer.from(await result.arrayBuffer()));
  } catch (error) {
    response.writeHead(500, { "content-type": "text/plain; charset=utf-8" });
    response.end(`Local preview error: ${error.message}`);
  }
});

server.listen(port, "127.0.0.1", () => {
  console.log(`Subtera Visual Prototype: http://localhost:${port}`);
});
