const elementHasAtLeastNChildren = (numberOfChildren: number) => (element: Element) => element.childNodes.length >= numberOfChildren
const getTargetParents = (): Element[] => Array.from(document.body.querySelectorAll("*")).filter(elementHasAtLeastNChildren(4));

const doesElementHasChildren = (element: Element, candidates: Element[]): boolean => {
    for (const candidate of candidates) {
        if (candidate !== element) {
            if (element.contains(candidate)) {
                return true;
            }
        }
    }
    return false;
}

const removeTargetWithChildren = (targets: Element[]): Element[] => {
    const result = [];
    for (const element of targets) {
        if (!doesElementHasChildren(element, targets)) {
            result.push(element);
        }
    }
    return result;
}

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

export const getEnemiesOfTheSwarm = (): Element[] => {

    let parentTargets = getTargetParents();
    parentTargets = removeTargetWithChildren(parentTargets);
    const targets: Element[] = [];
    for (const parent of parentTargets) {
        targets.push(...Array.from(parent.childNodes) as Element[]);
    }
    return targets.filter(isInViewport)
};