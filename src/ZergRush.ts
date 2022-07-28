import { Zergling } from "./components/Zergling";

export class ZergRush {
    private units: Zergling[] = [];
    constructor(public numberOfUnits: number, targets: Element[]) {
        for (let i = 0; i < numberOfUnits; i++) {
            this.units.push(new Zergling(Math.random() * 150, Math.random() * 150));
        }
    }
    getUnits = (): Zergling[] => {
        return this.units;
    }
}
