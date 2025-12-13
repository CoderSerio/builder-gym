import React from "react";
import { hydrateRoot } from "react-dom/client";
import { App } from "../shared/App";

hydrateRoot(document.querySelector("#app") as HTMLElement, <App />);


