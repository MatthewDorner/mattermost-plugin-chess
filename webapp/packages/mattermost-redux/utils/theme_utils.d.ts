import { Theme } from "../types/preferences";
export declare function makeStyleFromTheme(getStyleFromTheme: (a: any) => any): (a: any) => any;
export declare function getComponents(inColor: string): {
    red: number;
    green: number;
    blue: number;
    alpha: number;
};
export declare function changeOpacity(oldColor: string, opacity: number): string;
export declare const blendColors: (background: string, foreground: string, opacity: number, hex?: boolean) => string;
export declare function setThemeDefaults(theme: Theme): Theme;
