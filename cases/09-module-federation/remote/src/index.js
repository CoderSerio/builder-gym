import React from "react";
import { createRoot } from "react-dom/client";
import { RemoteButton } from "./RemoteButton";

const el = document.getElementById("app");
const root = createRoot(el);
root.render(
  <div style={{ fontFamily: "sans-serif", padding: 24 }}>
    <h2>Remote App</h2>
    <p>这个页面用于独立运行 Remote（同时也会暴露模块给 Host）。</p>
    <RemoteButton />
  </div>
);


