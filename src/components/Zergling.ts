import { IComponent } from "./IComponent";
import { Target } from "./Target";

const ZERGLING_SPEED = 400;
const ZERGLING_DPS = 5000;
const ZERGLING_FRAME_MILLISECONDS = 150;

export class Zergling implements IComponent {
    currentTarget: Target | null;
    state: "IDLE" | "MOVING" | "ATTACKING";
    speed: number = ZERGLING_SPEED;
    zergElement: HTMLElement;
    x: number;
    y: number;
    dx: number;
    dy: number;
    frame: number;

    frameMilliseconds = Math.floor(ZERGLING_FRAME_MILLISECONDS * Math.random());

    constructor(x: number = 0, y: number = 0) {
        this.state = "IDLE";
        this.x = x;
        this.y = y;
        this.frame = 0;
        this.currentTarget = null;
    }

    getPosition =(): { x: number, y: number } => {
        return { x: this.x, y: this.y }
    }
    getSize = () : { width: number, height: number} => {
        return { width: 10, height: 10}
    }

    onCreate = () => {
        this.zergElement = this.createZergDomElement();
        document.body.appendChild(this.zergElement);
        document.head.insertAdjacentHTML("beforeend", `<style>
        .zergling {
            position: absolute;
            display: block;
            color: red;
            z-index: 99999;
          }
          .zergling:after {
            font-family: wingdings;
            font-weight: bold;
            font-size: large;
            content: "_";
          }
          
        </style>`)


    }

    hasTarget = (): boolean => {
        return !!this.currentTarget
    }
    setTarget = (target: Target) => {
        this.currentTarget = target;
        this.state = "MOVING";
    }
    onDestroy = () => {
        if (this.zergElement) {
            this.zergElement.remove();
        }
    }

    onUpdate = (dt: number) => {
        this.frameMilliseconds = this.frameMilliseconds - dt;
        if (this.frameMilliseconds < 0) {
            this.frame = (this.frame + 1) % 2;
            this.frameMilliseconds = ZERGLING_FRAME_MILLISECONDS;
        }
        if (!this.currentTarget) {
            return this.state = "IDLE";
        }
        if (this.state === "ATTACKING") {
            this.currentTarget.receiveAttack(ZERGLING_DPS * dt / 1000);
            if (!this.currentTarget.isAlive()) {
                this.state = "IDLE";
                this.currentTarget = null;
            }
            return;
        }
        if (this.state === "MOVING") {
            if (this.hasReachedTarget()) {
                return this.state = "ATTACKING";
            }
            this.calcMovement();
            const increment = ZERGLING_SPEED * dt / 1000;
            this.x += this.dx * increment;
            this.y += this.dy * increment;
            return;
        }
    }

    calcMovement = () => {
        if (!this.currentTarget) {
            return;
        }
        const targetPos = this.currentTarget.getPosition();
        const targetSize = this.currentTarget.getSize();
        const xDiff = targetPos.left + Math.random() * targetSize.width - this.x,
            yDiff = targetPos.top + Math.random() * targetSize.height - this.y,
            angle = Math.atan2(yDiff, xDiff);

        const [v, u] = [Math.cos(angle), Math.sin(angle)];
        const length = Math.sqrt(v*v + u* u);
        this.dx = v / length;
        this.dy = u / length;
    }

    createZergDomElement = (): HTMLDivElement => {
        const zergElement = document.createElement("div");
        zergElement.className = "zergling";
        zergElement.style.top = `${this.x}`;
        zergElement.style.left = `${this.y}`;
        return zergElement;
    }

    hasReachedTarget = (): boolean => {
        if (!this.currentTarget) {
            return false;
        }
        return this.currentTarget.isPointInsideTarget(this.x, this.y);
    }
    draw = () => {
        if (this.frame === 0) {
            this.zergElement.style.width = "10px"
            this.zergElement.style.height = "10px"
            this.zergElement.style.top = `${Math.round(this.y)}px`;
            this.zergElement.style.left = `${Math.round(this.x)}px`;
        } else {
            this.zergElement.style.width = "14px"
            this.zergElement.style.height = "14px"
            this.zergElement.style.top = `${Math.round(this.y - 2)}px`;
            this.zergElement.style.left = `${Math.round(this.x - 2)}px`;
        }

    }
}