import { App } from "../shared/App";
import { renderToString } from "react-dom/server";

export function render() {
  return `<!DOCTYPE html>
  <html>
    <head><title>SSR Demo</title></head>
    <body>
      <div id="app">${renderToString(App())}</div>
      <script src="/client.js"></script>
    </body>
  </html>`;
}

console.log(render());


