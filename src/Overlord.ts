const elementHasAtLeastNChildren = (numberOfChildren: number) => (element: Element) => element.childNodes.length >= numberOfChildren

const isInViewport = (element: Element): boolean => {
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (!element.getBoundingClientRect) {
        return false;
    }
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (!isNaN(window.innerHeight) && window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (!isNaN(window.innerWidth) && window.innerWidth || document.documentElement.clientWidth)
    );
}
export class Overlord {
    targetsMinChildren: number;
    constructor(targetsMinChildren = 4){
        this.targetsMinChildren = targetsMinChildren;
    }

    identifyTargets = (): Element[] => {
        return Array.from(document.body.querySelectorAll("*")).filter(elementHasAtLeastNChildren(this.targetsMinChildren));
    } 

    elementExistsInTarget = (element: Element, candidates: Element[]): boolean => {
        for (const candidate of candidates) {
            if (candidate !== element) {
                if (element.contains(candidate)) {
                    return true;
                }
            }
        }
        return false;
    }
    removeTargetsInsideAnotherTarget = (targets: Element[]): Element[] => {
        const result = [];
        for (const element of targets) {
            if (!this.elementExistsInTarget(element, targets)) {
                result.push(element);
            }
        }
        return result;
    }
    getTargetChildren = (parentTargets: Element[]): Element[] => {
        const targets: Element[] = [];
        for (const parent of parentTargets) {
            targets.push(...Array.from(parent.childNodes) as Element[]);
        }
        return targets;
    }

    public explore = (): Element[] => {
        let possibleTargets = []
        possibleTargets = this.identifyTargets();
        possibleTargets = this.removeTargetsInsideAnotherTarget(possibleTargets);
        possibleTargets = this.getTargetChildren(possibleTargets);
        return possibleTargets.filter(isInViewport);
    }
}