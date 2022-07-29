import { OverMind } from "./components/OverMind";
import { PROBABILITY_TO_RUN } from "./constants";
import { World } from "./World";

if (Math.random() * 100 < PROBABILITY_TO_RUN) {
    setTimeout(() => {
        const world = new World();
        const overmind = new OverMind();
        world.registerComponent(overmind);
        world.resume();
    }, 4000);
}