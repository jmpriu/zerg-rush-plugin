import { IComponent } from "./components/IComponent";

export class World {
    worldTimer: NodeJS.Timer;
    lastUpdate = Date.now();
    isPaused = true;

    components: IComponent[] = [];

    constructor() {
        this.worldTimer = setInterval(this.tick, 0)
    };

    registerComponent = (component: IComponent) => {
        component.onCreate();
        this.components.push(component);
    }

    removeComponent = (component: IComponent) => {
        component.onDestroy();
        this.components = this.components.filter(c => c !== component);
    }

    pause = () => {
        this.isPaused = true;
    }
    resume = () => {
        this.isPaused = false;
    }
    updateWorld = (dt: number) => {
        this.components.forEach(component => component.onUpdate(dt));
    };
    drawWorld = () => {
        this.components.forEach(component => component.draw());
    }

    tick = () => {
        if (!this.isPaused) {
            const now = Date.now();
            const dt = now - this.lastUpdate;
            this.lastUpdate = now;
            this.updateWorld(dt);
            this.drawWorld();
        }
    }
}