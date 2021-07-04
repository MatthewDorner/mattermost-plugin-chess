declare type Listener = (...args: any[]) => void;
declare class EventEmitter {
    listeners: Map<string, Listener[]>;
    constructor();
    addListener(label: string, callback: Listener): void;
    on(label: string, callback: Listener): void;
    removeListener(label: string, callback: Listener): boolean;
    off(label: string, callback: Listener): void;
    emit(label: string, ...args: any[]): boolean;
}
declare const _default: EventEmitter;
export default _default;
