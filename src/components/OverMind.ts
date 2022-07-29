import { MIN_NUMBER_OF_CHILDREN, NUMBER_OF_ZERGLINGS } from "../constants";
import { BasicStrategy } from "../strategies/BasicStrategy";
import { Strategy } from "../strategies/Strategy";
import { IComponent } from "./IComponent";
import { Overlord } from "./Overlord";
import { Target } from "./Target";
import { ZergRush } from "./ZergRush";

export class OverMind implements IComponent {
    overlord: Overlord;
    attackStrategy: Strategy;
    targets: Target[];
    rushInstance: ZergRush;

    constructor() {
        this.overlord = new Overlord(MIN_NUMBER_OF_CHILDREN);
    }
    public onCreate = () => {
        const elements = this.overlord.explore();
        if (elements.length > 0) {
            this.targets = elements.map(t => new Target(t));
            this.targets.forEach(t => t.onCreate());
            const attackStrategy = new BasicStrategy();
            attackStrategy.setTargets(this.targets);
            this.rushInstance = new ZergRush(NUMBER_OF_ZERGLINGS, attackStrategy);
            this.rushInstance.onCreate();
        }
    }
    onUpdate(dt: number) {
        this.rushInstance.onUpdate(dt);
        this.targets.forEach(target => target.onUpdate(dt));
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