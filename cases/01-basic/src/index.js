import "./styles.css";
import { greet } from "./lib/greet";

document.querySelector("#app").innerHTML = `<h1>${greet("Build-Gym")}</h1>`;


