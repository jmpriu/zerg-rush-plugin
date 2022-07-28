import { IComponent } from "../IComponent";
import { Overlord } from "../Overlord";
import { Target } from "./Target";
import { Zergling } from "./Zergling";
import { ZergRush } from "../ZergRush";
export class OverMind implements IComponent {
    overlord: Overlord;
    worldTimer: NodeJS.Timer;

    targets: Target[];
    rushInstance: ZergRush;

    lastUpdate = Date.now();

    constructor() {
        this.overlord = new Overlord();
    }
    public onCreate = () => {
        const targets = this.overlord.explore();
        if (targets.length > 0) {
            this.targets = targets.map(t => new Target(t));
            this.targets.forEach(t => t.onCreate());
            this.rushInstance = new ZergRush(10, targets);
            this.rushInstance.getUnits().forEach(z => {
                z.onCreate();
            })
        }
    }
    findNearestTarget = (zergling: Zergling, targets: Target[]): Target => {
        for (let radius = 10; radius < 1000; radius += 50) {
            const randomAngle = Math.floor(Math.random() * 360);
            for (let degree = randomAngle; degree < (360 + randomAngle); degree += 45) {
                const zerglingPosition = zergling.getPosition();
                const zerglingSize = zergling.getSize();
                const x = zerglingPosition.x + zerglingSize.width / 2 + radius * Math.cos(Math.PI / 180 * (degree % 360));
                const y = zerglingPosition.y + zerglingSize.height / 2 + radius * Math.sin(Math.PI / 180 * degree % 360);
                const target = targets.find(t => t.isPointInsideTarget(x, y));
                if (target) {
                    return target;
                }
            }
        }
        return targets[0];
    }
    onUpdate(dt: number) {
        const zerglings = this.rushInstance.getUnits();
        const aliveTargets = this.targets.filter(t => t.isAlive());

        if (!aliveTargets.length) {
            return this.onDestroy();
        }
        zerglings.forEach(z => {
            if (!z.hasTarget()) {
                const target = this.findNearestTarget(z, aliveTargets);
                z.setTarget(target);
            }
        })

        zerglings.forEach(unit => unit.onUpdate(dt));
        aliveTargets.forEach(target => target.onUpdate(dt));

        zerglings.forEach(unit => unit.draw());
        aliveTargets.forEach(target => target.draw());

    }

    onDestroy = () => {
        if (this.worldTimer) {
            clearInterval(this.worldTimer);
        }
        this.rushInstance.getUnits().forEach(z => z.onDestroy());
        this.targets.forEach(t => t.onDestroy())
    }

    start = () => {
        this.worldTimer = setInterval(this.tick, 0)
    }
    tick = () => {
        const now = Date.now();
        const dt = now - this.lastUpdate;
        this.lastUpdate = now;
        this.onUpdate(dt);
    }
}