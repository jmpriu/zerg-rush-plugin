import { Target } from "../components/Target";
import { Strategy } from "./Strategy";

export class BasicStrategy extends Strategy {
    constructor() {
        super();
    }
    getRemainingTargets = (): Target[]  => {
        return this.targets.filter(t => t.isAlive());
    }
}