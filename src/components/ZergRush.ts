import { Target } from "./Target";
import { Zergling } from "./Zergling";
import { IComponent } from "./IComponent";

export class ZergRush implements IComponent{
    private units: Zergling[] = [];
    currentTargets: Target[] | null = [];
    constructor(public numberOfUnits: number, targets: Element[]) {
        for (let i = 0; i < numberOfUnits; i++) {
            this.units.push(new Zergling(Math.random() * 150, Math.random() * 150));
        }
    }
    onCreate(): void {
        this.units.forEach(z => {
            z.onCreate();
        })}
    onUpdate(dt: number): void {
        this.units.forEach(z => {
            if (!z.hasTarget()) {
                const target = this.findNearestTarget(z);
                if (target) {
                    z.setTarget(target);
                }
            }
        })
        this.units.forEach(unit => unit.onUpdate(dt));
    }
    onDestroy(): void {
        this.currentTargets = null;
        this.units.forEach(z => z.onDestroy());
    }
    getUnits = (): Zergling[] => {
        return this.units;
    }
    setTargets = (targets: Target[]) => {
        this.currentTargets = targets; 
    }
    draw = () => {
        this.units.forEach(unit => unit.draw());
    }
    findNearestTarget = (zergling: Zergling): Target | null => {
        for (let radius = 10; radius < 1000; radius += 50) {
            const randomAngle = Math.floor(Math.random() * 360);
            for (let degree = randomAngle; degree < (360 + randomAngle); degree += 45) {
                const zerglingPosition = zergling.getPosition();
                const zerglingSize = zergling.getSize();
                const x = zerglingPosition.x + zerglingSize.width / 2 + radius * Math.cos(Math.PI / 180 * (degree % 360));
                const y = zerglingPosition.y + zerglingSize.height / 2 + radius * Math.sin(Math.PI / 180 * degree % 360);
                const target = this.currentTargets?.find(t => t.isPointInsideTarget(x, y));
                if (target) {
                    return target;
                }
            }
        }
        return this.currentTargets?.[0] ?? null;
    }
}
