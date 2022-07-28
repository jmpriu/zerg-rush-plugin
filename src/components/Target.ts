import { IComponent } from "../IComponent";

type Size = { width: number; height: number; }
export class Target implements IComponent {
    domElement: HTMLElement;
    _isAlive: boolean;
    totalLife: number;
    life: number;

    constructor(element: Element) {
        this.domElement = element as HTMLElement;
    }
    public onCreate = () => {
        this._isAlive = true;
        const size = this.getSize();
        this.totalLife = Math.min(size.width * size.height, 15000);
        this.life = this.totalLife;
    }
    
    public getPosition = (): DOMRect => {
        return this.domElement?.getBoundingClientRect();
    }
    public getSize = (): Size => {
        return { width: this.domElement?.offsetWidth || 0, height: this.domElement?.offsetHeight || 0 }
    }
    public getLife = (): number => {
        return this.life;
    }
    public receiveAttack = (damage: number) => {
        this.life = this.life - damage;
        if (this.life <= 0) {
            this._isAlive = false;
        }
    }
    public isAlive = ():boolean => {
        return this._isAlive;
    }
    public draw = () => {
        if (!this._isAlive) {
            return this.domElement.style.opacity = `0`;
        }
        this.domElement.style.opacity = `${Math.round(((this.life / this.totalLife) + Number.EPSILON) * 100) / 100}`;
    }
    public onUpdate = (dt: number) => {
        if (!this.domElement) {
            return;
        }
    }

    public onDestroy = () => {}

    public isPointInsideTarget = (x: number, y: number): boolean => {
        if (!this.domElement) {
            return false;
        }
        const pos = this.getPosition();
        const size = this.getSize()
        return (
            x >= pos.left &&
            y >= pos.top &&
            x <= pos.left + size.width &&
            y <= pos.top + size.height
        );
    }
}