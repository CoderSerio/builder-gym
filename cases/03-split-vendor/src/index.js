import "./styles.css";
import { renderApp } from "./app";
import { frameworkVersion } from "./framework/react-stub";
import { shuffle } from "./libs/lodash-stub";

const data = shuffle([1, 2, 3, 4, 5]);
const root = document.querySelector("#app");
root.innerHTML = `
  <h1>Split Chunks Demo</h1>
  <p>framework: ${frameworkVersion}</p>
  <p>data: ${data.join(", ")}</p>
`;
renderApp(root);


