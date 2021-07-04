import { DialogElement } from "../types/integrations";
declare type DialogError = {
    id: string;
    defaultMessage: string;
    values?: any;
};
export declare function checkDialogElementForError(elem: DialogElement, value: any): DialogError | undefined | null;
export declare function checkIfErrorsMatchElements(errors?: {
    [x: string]: DialogError;
}, elements?: DialogElement[]): boolean;
export {};
