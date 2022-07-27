import { Overlord } from "./Overlord";
export class OverMind {
    overlord: Overlord;
    constructor() {
        this.overlord = new Overlord();
    }
    start() {
        const targets = this.overlord.explore();
        console.log(targets);
        targets.forEach(t => (t as HTMLElement).style.border = "1px solid red");
    }
}