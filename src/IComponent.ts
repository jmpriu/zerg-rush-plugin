export interface IComponent {
    onCreate(): void;
    onUpdate(dt: number): void;
    onDestroy(): void;
}