/// <reference types="node" />
export default class DelayedAction<F extends (...args: any) => any> {
    action: F;
    timer: NodeJS.Timeout | null;
    constructor(action: F);
    fire: () => void;
    fireAfter: (timeout: number) => void;
    cancel: () => void;
}
