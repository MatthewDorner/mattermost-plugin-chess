declare type LocalizeFunc = (id: string, defaultMessage: string) => string;
export declare function setLocalizeFunction(func: LocalizeFunc): void;
export declare function localizeMessage(id: string, defaultMessage: string): string;
export {};
