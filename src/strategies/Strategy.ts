import { Target } from "../components/Target";

export abstract class Strategy {
    protected targets: Target[] = [];
    constructor() {
    }
    setTargets = (targets: Target[]) => {
        this.targets = targets;
    }

   abstract getRemainingTargets(): Target[] 
}