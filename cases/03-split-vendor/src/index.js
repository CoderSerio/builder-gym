import "./styles.css";
import { renderApp } from "./app";
import React from "react";
import { createRoot } from "react-dom/client";
import shuffle from "lodash/shuffle";

const data = shuffle([1, 2, 3, 4, 5]);
const root = document.querySelector("#app");
root.innerHTML = `<div id="root"></div>`;

createRoot(document.querySelector("#root")).render(
  React.createElement(
    "div",
    { style: { fontFamily: "sans-serif", padding: 24 } },
    React.createElement("h1", null, "Split Chunks Demo"),
    React.createElement("p", null, `react: ${React.version}`),
    React.createElement("p", null, `data: ${data.join(", ")}`)
  )
);

renderApp(root);


