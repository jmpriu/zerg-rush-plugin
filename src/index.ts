import { OverMind } from "./components/OverMind";
import { World } from "./World";
const world = new World();
const overmind = new OverMind();
world.registerComponent(overmind);
world.resume();