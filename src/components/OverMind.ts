import { IComponent } from "./IComponent";
import { Overlord } from "./Overlord";
import { Target } from "./Target";
import { ZergRush } from "./ZergRush";
export class OverMind implements IComponent {
    overlord: Overlord;
    targets: Target[];
    rushInstance: ZergRush;

    constructor() {
        this.overlord = new Overlord();
    }
    public onCreate = () => {
        const targets = this.overlord.explore();
        if (targets.length > 0) {
            this.targets = targets.map(t => new Target(t));
            this.targets.forEach(t => t.onCreate());
            this.rushInstance = new ZergRush(10, targets);
            this.rushInstance.onCreate();
        }
    }
    onUpdate(dt: number) {
        const aliveTargets = this.targets.filter(t => t.isAlive());
        if (!aliveTargets.length) {
            return this.onDestroy();
        }
        this.rushInstance.setTargets(aliveTargets);
        this.rushInstance.onUpdate(dt);
        aliveTargets.forEach(target => target.onUpdate(dt));
    }
    draw = () => {
        this.rushInstance.draw();
        this.targets.forEach(target => target.draw());
    }
    onDestroy = () => {
        this.rushInstance.onDestroy();
        this.targets.forEach(t => t.onDestroy())
    }
}