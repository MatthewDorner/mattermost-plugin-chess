import { GenericAction } from "../types/actions";
export default function reducer(state: {
    connected: boolean;
    lastConnectAt: number;
    lastDisconnectAt: number;
} | undefined, action: GenericAction): {
    connected: boolean;
    lastConnectAt: number | undefined;
    lastDisconnectAt: number;
} | {
    connected: boolean;
    lastDisconnectAt: number | undefined;
    lastConnectAt: number;
};
