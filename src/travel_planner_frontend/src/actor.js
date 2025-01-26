import { canisterId, idlFactory } from "declarations/travel_planner_backend"
import { createReactor } from "@ic-reactor/react"

export const { useActorStore, useAuth, useQueryCall } = createReactor({
  canisterId,
  idlFactory,
  host: "https://localhost:4943",
})