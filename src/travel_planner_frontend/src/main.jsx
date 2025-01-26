import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.scss";
import { canisterId, idlFactory } from "declarations/travel_planner_backend";
import { ActorProvider, AgentProvider } from "@ic-reactor/react";
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AgentProvider withProcessEnv>
      <ActorProvider idlFactory={idlFactory} canisterId={canisterId}>
        <App />
      </ActorProvider>
    </AgentProvider>
  </React.StrictMode>
);
